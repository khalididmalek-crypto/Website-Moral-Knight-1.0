/**
 * Contact Form API Endpoint
 * 
 * Handles contact form and report form submissions and sends emails.
 * Updated to use info@moralknight.nl and branded HTML styling.
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import path from 'path';
import { generateEmailHtml } from '../../utils/emailTemplate';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '5mb',
        },
    },
};

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
    fileName?: string;
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
        return generateEmailHtml(data, isForUser, isReport, reportId, dateStr);
    };

    // Logo with dark navy background - safe as email attachment
    const logoPath = path.join(process.cwd(), 'public', 'images', 'logo-email.png');

    const getAttachments = () => {
        const list: any[] = [
            {
                filename: 'Moral-Knight-Logo.png',
                path: logoPath,
                contentType: 'image/png',
                contentDisposition: 'attachment',
            }
        ];

        // Handle User Attachment
        if (data.file && data.fileName) {
            try {
                let content = data.file;
                let contentType = undefined;
                if (content.startsWith('data:')) {
                    const base64Marker = ';base64,';
                    const base64Index = content.indexOf(base64Marker);
                    const colonIndex = content.indexOf(':');
                    if (colonIndex !== -1 && base64Index !== -1) {
                        contentType = content.substring(colonIndex + 1, base64Index);
                    }
                    if (base64Index !== -1) {
                        content = content.substring(base64Index + base64Marker.length);
                    }
                }
                list.push({
                    filename: data.fileName,
                    content: content,
                    encoding: 'base64',
                    contentType: contentType
                } as any);
            } catch (e) {
                console.error('[SMTP] Error processing attachment:', e);
            }
        }
        return list;
    };

    try {
        // 1. Send to Admin (PRIORITY)
        await transporter.sendMail({
            from: `"Moral Knight" <${adminEmail}>`,
            to: adminEmail,
            replyTo: data.email,
            subject: subject,
            html: getHtml(false),
            attachments: getAttachments()
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
                attachments: getAttachments()
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
