import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { generateEmailHtml } from '../../utils/emailTemplate';

type ApiResponse = {
    success: boolean;
    message?: string;
    reportId?: string;
    error?: string;
};

// In-memory store for rate limiting
const rateLimitMap = new Map<string, { count: number; lastTime: number }>();
const RATE_LIMIT_MAX = 5; // 5 requests
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Next.js body parser is explicitly re-enabled, bypassing formidable limits
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed',
        });
    }

    // Rate Limiting (In-Memory for Lambda container lifetime)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const ipStr = Array.isArray(ip) ? ip[0] : ip;
    const now = Date.now();
    const clientData = rateLimitMap.get(ipStr);

    if (clientData) {
        if (now - clientData.lastTime < RATE_LIMIT_WINDOW_MS) {
            if (clientData.count >= RATE_LIMIT_MAX) {
                console.warn(`[API] Rate limit exceeded for IP: ${ipStr}`);
                return res.status(429).json({
                    success: false,
                    message: 'Te veel meldingen in korte tijd. Probeer het over 15 minuten opnieuw.',
                });
            }
            clientData.count++;
        } else {
            rateLimitMap.set(ipStr, { count: 1, lastTime: now });
        }
    } else {
        rateLimitMap.set(ipStr, { count: 1, lastTime: now });
    }

    try {
        const rawData = req.body;

        // 1. Honeypot check
        if (rawData.botcheck && rawData.botcheck.trim() !== '') {
            console.warn('[API] Honeypot triggered.');
            return res.status(200).json({
                success: true,
                message: 'Bedankt voor uw bericht!',
            });
        }

        // 2. Data Sanitization
        const formData: any = {
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
        });

    } catch (error) {
        console.error('[API] Global Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Er is een interne serverfout opgetreden. Probeer het later opnieuw.',
        });
    }
}

async function sendEmail(data: any): Promise<{ success: boolean; reportId?: string; error?: string }> {
    // Aggressive fallback to prevent misconfiguration
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

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: true, // Use SSL for port 465
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
        tls: {
            rejectUnauthorized: true
        }
    });

    const isReport = data.formType === 'report';
    const reportId = `MK-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const dateStr = new Date().toLocaleDateString('nl-NL');

    const subject = isReport
        ? `[MELDING] Kenmerk: ${reportId} - Moral Knight Publieke Ruimte`
        : `[CONTACT] Bericht van ${data.name} - Moral Knight`;

    const getHtml = (isForUser: boolean) => generateEmailHtml(data, isForUser, isReport, reportId, dateStr);

    const getAttachments = () => {
        const list: any[] = [];
        // Handle Base64 file if present from ReportForm
        if (data.file && data.fileName) {
            try {
                let content = data.file;
                let contentType = 'application/octet-stream';

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
                });
            } catch (e) {
                console.error('[SMTP] Error processing attachment:', e);
            }
        }
        return list;
    };

    try {
        const adminMailOpts = {
            from: `"Moral Knight" <${adminEmail}>`,
            to: adminEmail,
            replyTo: data.email,
            subject: subject,
            html: getHtml(false),
            attachments: getAttachments()
        };

        const userMailOpts = {
            from: `"Moral Knight" <${adminEmail}>`,
            to: data.email,
            subject: isReport
                ? `Bevestiging Melding: ${reportId} - Moral Knight`
                : `Ontvangstbevestiging contactformulier - Moral Knight`,
            html: getHtml(true),
            attachments: getAttachments()
        };

        // Parallelize sending for speed optimization
        const sendAdmin = transporter.sendMail(adminMailOpts);
        const sendUser = isReport ? Promise.resolve({ skipped: true }) : transporter.sendMail(userMailOpts);

        const [adminResult, userResult] = await Promise.allSettled([sendAdmin, sendUser]);

        if (adminResult.status === 'rejected') {
            console.error('[SMTP] Critical Transport Error (Admin email failed):', adminResult.reason);
            throw new Error(adminResult.reason instanceof Error ? adminResult.reason.message : 'CRITICAL_SMTP_ERROR');
        }

        console.log(`[SMTP] Admin email sent successfully for ${reportId}`);

        if (userResult.status === 'rejected') {
            console.warn(`[SMTP] Warning: Could not send confirmation to user ${data.email}. Error: ${userResult.reason}`);
        } else if (isReport) {
            console.log(`[SMTP] User confirmation skipped for report ${reportId} (Privacy by Design)`);
        } else {
            console.log(`[SMTP] User confirmation sent successfully to ${data.email}`);
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
