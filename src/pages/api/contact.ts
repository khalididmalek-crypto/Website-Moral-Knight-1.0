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
            message: 'Er is een interne serverfout opgetreden. Probeer het later opnieuw.',
        });
    }
}

async function sendEmail(data: FormData): Promise<{ success: boolean; reportId?: string; error?: string }> {
    // Aggressieve fallback: zoek naar alles wat lijkt op SMTP_USER of SMTP_PASS
    const allKeys = Object.keys(process.env);
    const passKey = allKeys.find(k => k.includes('SMTP_PASS') || k.includes('MAIL_SERVER_PASSWORD') || k.includes('PASS'));
    const userKey = allKeys.find(k => k.includes('SMTP_USER') || k.includes('EMAIL_SERVER_USER') || k.includes('USER'));

    const smtpUser = process.env.SMTP_USER || (userKey ? process.env[userKey] : null) || 'info@moralknight.nl';
    const smtpPass = process.env.SMTP_PASS || (passKey ? process.env[passKey] : null);

    const smtpHost = 'web0170.zxcs.nl';
    const smtpPort = 465;
    const adminEmail = 'info@moralknight.nl';

    console.log(`[SMTP] Attempting SSL connection to ${smtpHost}:${smtpPort} as ${smtpUser}`);

    if (!smtpPass) {
        return {
            success: false,
            error: `Configuratiefout: Wachtwoord (SMTP_PASS) ontbreekt in Vercel settings.`
        };
    }

    // Probeer poort 465 met SSL
    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: true,
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
        tls: {
            rejectUnauthorized: false
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
        const primaryColor = '#0A192F'; // Navy Blue
        const secondaryColor = '#E11D48'; // Red Accent
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
                .header { background-color: ${primaryColor}; padding: 25px 30px; color: #ffffff; border-bottom: 4px solid ${secondaryColor}; }
                .header-table { width: 100%; border-collapse: collapse; }
                .logo-text { font-size: 22px; font-weight: 500; letter-spacing: 1px; color: #ffffff; text-decoration: none; }
                .header-slogan { font-size: 11px; letter-spacing: 1px; margin-top: 2px; opacity: 0.9; color: #ffffff; }
                .report-type { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.8; text-align: right; vertical-align: bottom; }
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
                .brand { color: ${primaryColor}; font-weight: 500; }
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="container">
                    <div class="header">
                        <table class="header-table">
                            <tr>
                                <td style="width: 60px; vertical-align: middle;">
                                    <img src="https://www.moralknight.nl/images/mk-shield-logo.png" alt="Moral Knight" width="45" style="display: block;">
                                </td>
                                <td style="vertical-align: middle;">
                                    <div class="logo-text">Moral Knight</div>
                                    <div class="header-slogan">- Auditing public AI</div>
                                </td>
                                <td class="report-type">
                                    ${title}
                                </td>
                            </tr>
                        </table>
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
                            © ${new Date().getFullYear()} <span class="brand">MORAL KNIGHT</span> – Auditing public AI
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
        // 1. Send to Admin (PRIORITY)
        await transporter.sendMail({
            from: `"Moral Knight" <${adminEmail}>`,
            to: adminEmail,
            replyTo: data.email,
            subject: subject,
            html: getHtml(false),
        });

        console.log(`[SMTP] Admin email sent successfully for ${reportId}`);

        // 2. Try to send confirmation to Melder/User (SECONDARY)
        try {
            await transporter.sendMail({
                from: `"Moral Knight" <${adminEmail}>`,
                to: data.email,
                subject: isReport
                    ? `Bevestiging Melding: ${reportId} - Moral Knight`
                    : `Ontvangstbevestiging contactformulier - Moral Knight`,
                html: getHtml(true),
            });
            console.log(`[SMTP] User confirmation sent successfully to ${data.email}`);
        } catch (userMailError) {
            // Log as warning, but don't fail the whole request because the admin already has the data
            console.warn(`[SMTP] Warning: Could not send confirmation to user ${data.email}. Error: ${userMailError instanceof Error ? userMailError.message : 'Unknown'}`);
        }

        return { success: true, reportId };
    } catch (error) {
        console.error('[SMTP] Critical Transport Error (Admin email failed):', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'CRITICAL_SMTP_ERROR'
        };
    }
}
