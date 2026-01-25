/**
 * Contact Form API Endpoint
 * 
 * Handles contact form and report form submissions and sends emails.
 * Updated to use info@moralknight.nl and branded HTML styling.
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
        return res.status(405).json({
            success: false,
            message: 'Method not allowed',
        });
    }

    try {
        const rawData: FormData = req.body;

        // 1. Honeypot check
        if (rawData._website && rawData._website.trim() !== '') {
            console.warn('[API] Honeypot triggered.');
            return res.status(200).json({
                success: true,
                message: 'Bedankt voor uw bericht!',
            });
        }

        // 2. Data Sanitization
        const formData: FormData = {
            ...rawData,
            name: rawData.name?.trim(),
            email: rawData.email?.trim()?.toLowerCase(),
            organisation: rawData.organisation?.trim(),
            message: rawData.message?.trim(),
            aiSystem: rawData.aiSystem?.trim(),
            description: rawData.description?.trim(),
        };

        // Basic validation
        if (!formData.name || !formData.email || !formData.privacyConsent) {
            return res.status(400).json({
                success: false,
                message: 'Ontbrekende verplichte velden',
            });
        }

        // Send Email
        const result = await sendEmail(formData);

        if (!result.success) {
            console.error(`[API] Email send failed: ${result.error}`);
            return res.status(500).json({
                success: false,
                message: 'E-mail verzenden mislukt. Probeer het later opnieuw.',
                error: result.error,
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Bedankt voor uw bericht!',
            reportId: result.reportId,
        } as any);

    } catch (error) {
        console.error('[API] Global Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Er is een interne serverfout opgetreden.',
        });
    }
}

async function sendEmail(data: FormData): Promise<{ success: boolean; reportId?: string; error?: string }> {
    // Probeer zowel de nieuwe als oude namen voor maximale compatibiliteit
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_SERVER_USER || 'info@moralknight.nl';
    const smtpPass = process.env.SMTP_PASS || process.env.MAIL_SERVER_PASSWORD;
    const smtpHost = process.env.EMAIL_SERVER_HOST || 'web0170.zxcs.nl';
    const smtpPort = parseInt(process.env.EMAIL_SERVER_PORT || '587');
    const adminEmail = 'info@moralknight.nl';

    console.log(`[SMTP] Configuratie check - User: ${smtpUser ? 'OK' : 'MISSING'}, Pass: ${smtpPass ? 'OK' : 'MISSING'}`);

    if (!smtpPass) {
        return {
            success: false,
            error: `Configuratiefout: Wachtwoord (SMTP_PASS) ontbreekt in Vercel settings. Gebruiker was: ${smtpUser}`
        };
    }

    // Probeer poort 587 met STARTTLS (Vimexx standaard)
    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
        tls: {
            rejectUnauthorized: false,
            minVersion: 'TLSv1.2'
        }
    } as any);

    console.log(`[SMTP] Attempting connection as ${smtpUser} to ${smtpHost}:${smtpPort}`);

    const isReport = data.formType === 'report';
    const reportId = `MK-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const dateStr = new Date().toLocaleDateString('nl-NL');

    const subject = isReport
        ? `[MELDING] Kenmerk: ${reportId} - Moral Knight Publieke Ruimte`
        : `[CONTACT] Bericht van ${data.name} - Moral Knight`;

    const getHtml = (isForUser: boolean) => {
        const title = isReport ? 'OFFICIEEL RAPPORT' : 'CONTACT BERICHT';
        const primaryColor = '#194D25'; // Corporate Green
        const secondaryColor = '#8B1A3D'; // Bordeaux Red Accent
        const bgColor = '#F8FAFC';

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: ${bgColor}; }
                .wrapper { padding: 40px 10px; }
                .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; overflow: hidden; }
                .header { background-color: ${primaryColor}; padding: 35px 30px; color: #ffffff; border-bottom: 4px solid ${secondaryColor}; }
                .logo-text { font-size: 20px; font-weight: bold; letter-spacing: 3px; color: #ffffff; text-decoration: none; display: block; }
                .header-title { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-top: 8px; opacity: 0.9; color: #ffffff; }
                .badge-section { padding: 25px 30px; border-bottom: 1px solid #f0f0f0; background-color: #ffffff; }
                .badge-id { margin: 0; font-size: 14px; color: #64748b; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
                .badge-id span { color: ${secondaryColor}; font-weight: bold; }
                .badge-date { margin: 5px 0 0 0; font-size: 11px; color: #94a3b8; font-family: monospace; }
                .content { padding: 30px; background-color: #ffffff; }
                .greeting { margin-bottom: 25px; font-size: 16px; font-weight: 600; color: ${primaryColor}; }
                .data-table { width: 100%; border-collapse: collapse; }
                .data-table td { padding: 15px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; vertical-align: top; }
                .label { font-weight: bold; width: 35%; color: #475569; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; padding-top: 2px; }
                .value { color: #1e293b; line-height: 1.6; }
                .footer { background-color: #ffffff; padding: 30px; font-size: 11px; color: #94a3b8; line-height: 1.8; text-align: left; border-top: 1px solid #f1f5f9; }
                .legal { margin: 0; }
                .brand { color: ${primaryColor}; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="container">
                    <div class="header">
                        <span class="logo-text">MORAL KNIGHT</span>
                        <div class="header-title">${title}</div>
                    </div>
                    
                    <div class="badge-section">
                        <p class="badge-id">KENMERK: <span>${reportId}</span></p>
                        <p class="badge-date">${dateStr}</p>
                    </div>
                    
                    <div class="content">
                        ${isForUser ? `
                        <div class="greeting">
                            Hartelijk dank voor uw bericht aan Moral Knight.
                        </div>
                        <p style="font-size: 14px; color: #475569; margin-bottom: 25px;">
                            Wij hebben uw ${isReport ? 'melding' : 'bericht'} in goede orde ontvangen en zullen deze zo spoedig mogelijk in behandeling nemen.
                        </p>
                        ` : `
                        <div class="greeting">
                            Nieuwe ${isReport ? 'melding' : 'contactaanvraag'} via de website.
                        </div>
                        `}
                        
                        <table class="data-table">
                            <tr>
                                <td class="label">Naam</td>
                                <td class="value">${data.name}</td>
                            </tr>
                            ${data.organisation ? `
                            <tr>
                                <td class="label">Organisatie</td>
                                <td class="value">${data.organisation}</td>
                            </tr>
                            ` : ''}
                            <tr>
                                <td class="label">Email</td>
                                <td class="value">${data.email}</td>
                            </tr>
                            ${isReport ? `
                            <tr>
                                <td class="label">Instantie/Systeem</td>
                                <td class="value">${data.aiSystem || 'Onbekend'}</td>
                            </tr>
                            <tr>
                                <td class="label">Omschrijving</td>
                                <td class="value" style="white-space: pre-wrap;">${data.description}</td>
                            </tr>
                            ` : `
                            <tr>
                                <td class="label">Bericht</td>
                                <td class="value" style="white-space: pre-wrap;">${data.message}</td>
                            </tr>
                            `}
                            ${data.file ? `
                            <tr>
                                <td class="label">Bijlage</td>
                                <td class="value" style="color: ${secondaryColor}; font-weight: bold;">Ingesloten (${data.file})</td>
                            </tr>
                            ` : ''}
                        </table>
                    </div>
                    
                    <div class="footer">
                        <p class="legal">
                            © ${new Date().getFullYear()} <span class="brand">MORAL KNIGHT</span> – Mensgerichte AI in het publieke domein.
                        </p>
                        <p class="legal" style="margin-top: 10px;">
                            Dit is een officieel bericht verzonden via <span class="brand">moralknight.nl</span>.
                            Deze communicatie voldoet aan de richtlijnen voor Dataminimalisatie en Responsible AI.
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;
    };

    try {
        // 1. Send to Admin
        await transporter.sendMail({
            from: `"Moral Knight" <${adminEmail}>`,
            to: adminEmail,
            replyTo: data.email,
            subject: subject,
            html: getHtml(false),
        });

        // 2. Send confirmation to Melder
        await transporter.sendMail({
            from: `"Moral Knight" <${adminEmail}>`,
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
