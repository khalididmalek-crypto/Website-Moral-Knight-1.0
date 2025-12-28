/**
 * Contact Form API Endpoint
 * 
 * Handles contact form and report form submissions and sends emails.
 * Includes enhanced logging and strict transporter configuration for Vercel/Gmail.
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

interface FormData {
    formType: 'contact' | 'report';
    name: string;
    email: string;
    organisation?: string;
    message?: string;
    aiSystem?: string;
    description?: string;
    newsletter?: boolean;
    privacyConsent: boolean;
    file?: string | null;
    _website?: string; // Honeypot field
}

interface ApiResponse {
    success: boolean;
    message: string;
    error?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    console.log(`[API] Received ${req.method} request to /api/contact`);

    if (req.method !== 'POST') {
        console.warn(`[API] Method ${req.method} not allowed`);
        return res.status(405).json({
            success: false,
            message: 'Method not allowed',
        });
    }

    try {
        const rawData: FormData = req.body;

        // 1. Honeypot check
        if (rawData._website && rawData._website.trim() !== '') {
            console.warn('[API] Honeypot triggered. Silent rejection.');
            // Return 200 OK to fool the bot
            return res.status(200).json({
                success: true,
                message: 'Bedankt voor uw bericht!',
            });
        }

        // 2. Data Sanitization (Trim and basic cleaning)
        const formData: FormData = {
            ...rawData,
            name: rawData.name?.trim(),
            email: rawData.email?.trim()?.toLowerCase(),
            organisation: rawData.organisation?.trim(),
            message: rawData.message?.trim(),
            aiSystem: rawData.aiSystem?.trim(),
            description: rawData.description?.trim(),
        };

        console.log(`[API] Form Type: ${formData.formType}, From: ${formData.email}`);

        // Basic validation
        if (!formData.name || !formData.email || !formData.privacyConsent) {
            console.warn('[API] Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'Ontbrekende verplichte velden',
                error: 'MISSING_FIELDS',
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            console.warn(`[API] Invalid email: ${formData.email}`);
            return res.status(400).json({
                success: false,
                message: 'Ongeldig e-mailadres',
                error: 'INVALID_EMAIL',
            });
        }

        // Send Email
        console.log('[API] Attempting to send email...');
        const result = await sendEmail(formData);

        if (!result.success) {
            console.error(`[API] Email send failed: ${result.error}`);
            return res.status(500).json({
                success: false,
                message: 'E-mail verzenden mislukt. Probeer het later opnieuw.',
                error: result.error,
            });
        }

        console.log('[API] Email sent successfully');
        return res.status(200).json({
            success: true,
            message: 'Bedankt voor uw bericht!',
            reportId: result.reportId,
        } as any);

    } catch (error) {
        console.error('[API] Global Catch Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Er is een interne serverfout opgetreden.',
            error: error instanceof Error ? error.message : 'INTERNAL_ERROR',
        });
    }
}

async function sendEmail(data: FormData): Promise<{ success: boolean; reportId?: string; error?: string }> {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
        const missing = !user ? 'GMAIL_USER' : 'GMAIL_APP_PASSWORD';
        return { success: false, error: `MISSING_ENV_VAR: ${missing}` };
    }

    // Set up transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: user,
            pass: pass,
        },
    });

    const isReport = data.formType === 'report';

    // Generate unique reportId
    const reportId = `MK-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const dateStr = new Date().toLocaleDateString('nl-NL');
    const subject = isReport
        ? `[MELDING] Kenmerk: ${reportId} - Moral Knight Publieke Ruimte`
        : `[CONTACT] Bericht van ${data.name} - Moral Knight`;

    const getHtml = (isForUser: boolean) => {
        const title = isReport ? 'OFFICIEEL RAPPORT' : 'CONTACT BERICHT';
        const primaryColor = '#194D25';
        const secondaryColor = '#8B1A3D';

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { width: 100%; max-width: 600px; margin: 0 auto; border: 1px solid #eee; }
                .header { background-color: #1a1a1a; padding: 30px 20px; color: #ffffff; }
                .header-table { width: 100%; border-collapse: collapse; }
                .logo-text { font-size: 22px; font-weight: bold; letter-spacing: 3px; color: #ffffff; text-decoration: none; }
                .header-title { font-size: 12px; letter-spacing: 2px; text-align: right; opacity: 0.8; text-transform: uppercase; }
                .badge-section { padding: 20px; border-bottom: 2px solid #f0f0f0; background-color: #ffffff; }
                .badge-id { margin: 0; font-size: 14px; font-weight: bold; color: #333; }
                .badge-id span { color: ${secondaryColor}; }
                .badge-date { margin: 5px 0 0 0; font-size: 12px; color: #777; font-family: monospace; }
                .content { padding: 20px; background-color: #ffffff; }
                .greeting { margin-bottom: 25px; font-size: 15px; border-left: 3px solid ${primaryColor}; padding-left: 15px; }
                .data-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                .data-table tr:nth-child(odd) { background-color: #f9f9f9; }
                .data-table td { padding: 12px 15px; border-bottom: 1px solid #eee; font-size: 14px; }
                .label { font-weight: bold; width: 35%; color: #555; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; }
                .footer { background-color: #f5f5f5; padding: 25px 20px; font-size: 11px; color: #777; line-height: 1.6; text-align: left; border-top: 1px solid #eee; }
                .disclaimer { margin: 0; opacity: 0.8; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <table class="header-table">
                        <tr>
                            <td><span class="logo-text">MORAL KNIGHT</span></td>
                            <td class="header-title">${title}</td>
                        </tr>
                    </table>
                </div>
                
                <div class="badge-section">
                    <p class="badge-id">Kenmerk: <span>${reportId}</span></p>
                    <p class="badge-date">Datum: ${dateStr}</p>
                </div>
                
                <div class="content">
                    ${isForUser ? `
                    <div class="greeting">
                        Uw melding is succesvol geregistreerd onder kenmerk: <strong>${reportId}</strong>
                    </div>
                    ` : ''}
                    
                    <table class="data-table">
                        <tr>
                            <td class="label">Naam</td>
                            <td>${data.name}</td>
                        </tr>
                        <tr>
                            <td class="label">Organisatie</td>
                            <td>${data.organisation || 'Niet opgegeven'}</td>
                        </tr>
                        ${isReport ? `
                        <tr>
                            <td class="label">AI Systeem / Instantie</td>
                            <td>${data.aiSystem || 'Niet opgegeven'}</td>
                        </tr>
                        <tr>
                            <td class="label">Omschrijving</td>
                            <td style="white-space: pre-wrap;">${data.description}</td>
                        </tr>
                        ` : `
                        <tr>
                            <td class="label">Bericht</td>
                            <td style="white-space: pre-wrap;">${data.message}</td>
                        </tr>
                        `}
                        ${data.file ? `
                        <tr>
                            <td class="label">BIJLAGE</td>
                            <td style="color: ${secondaryColor}; font-weight: bold;">Ingesloten</td>
                        </tr>
                        ` : ''}
                    </table>
                </div>
                
                <div class="footer">
                    <p class="disclaimer">
                        Dit rapport is gegenereerd via het Moral Knight Meldpunt en voldoet aan de richtlijnen voor Dataminimalisatie en Responsible AI. 
                        De gegevens zijn beveiligd conform de AVG-wetgeving.
                    </p>
                </div>
            </div>
        </body>
        </html>
        `;
    };

    try {
        console.log(`[SMTP] Sending mail to admin (${user})...`);

        // 1. Send to Admin
        await transporter.sendMail({
            from: `"Moral Knight Website" <${user}>`,
            to: user,
            replyTo: data.email,
            subject: subject,
            html: getHtml(false),
        });

        // 2. Send copy to Melder
        console.log(`[SMTP] Sending confirmation to melder (${data.email})...`);
        await transporter.sendMail({
            from: `"Moral Knight" <${user}>`,
            to: data.email,
            subject: isReport
                ? `Bevestiging Melding: ${reportId} - Moral Knight`
                : `Ontvangstbevestiging contactformulier - Moral Knight`,
            html: getHtml(true),
        });

        return { success: true, reportId };
    } catch (error) {
        console.error('[SMTP] Transport Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'UNKNOWN_SMTP_ERROR'
        };
    }
}
