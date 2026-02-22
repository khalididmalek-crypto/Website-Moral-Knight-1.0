import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import sharp from 'sharp';
import { generateEmailHtml } from '../../utils/emailTemplate';

type ApiResponse = {
    success: boolean;
    message?: string;
    reportId?: string;
    error?: string;
};

// In-memory store for rate limiting (Note: Limited effectiveness on Vercel/Serverless)
const rateLimitMap = new Map<string, { count: number; lastTime: number }>();
const RATE_LIMIT_MAX = 3; 
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

/**
 * Sanitizes input to prevent basic HTML injection
 */
function sanitize(text: string): string {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Strips all metadata (EXIF, GPS, etc.) from an image buffer
 */
async function scrubImageMetadata(buffer: Buffer): Promise<Buffer> {
    try {
        // Sharp strips metadata by default unless .withMetadata() is called
        return await sharp(buffer)
            .rotate() // Auto-rotate based on EXIF but then strip EXIF
            .toBuffer();
    } catch (e) {
        console.error('[SECURITY] Metadata scrubbing failed:', e);
        return buffer; // Fallback to original if processing fails
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const rawData = req.body;
    const isAnonymous = rawData.isAnonymous === true;
    const isReport = rawData.formType === 'report';
    const isWhistleblower = isAnonymous && isReport;

    // Rate Limiting - For whistleblowers we use a dummy IP to prevent tracking
    const realIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const ipStr = isWhistleblower ? '0.0.0.0' : (Array.isArray(realIp) ? realIp[0] : realIp);
    
    const now = Date.now();
    const clientData = rateLimitMap.get(ipStr);

    if (clientData && ipStr !== '0.0.0.0') {
        if (now - clientData.lastTime < RATE_LIMIT_WINDOW_MS) {
            if (clientData.count >= RATE_LIMIT_MAX) {
                return res.status(429).json({
                    success: false,
                    message: 'Te veel meldingen. Probeer het over 15 minuten opnieuw.',
                });
            }
            clientData.count++;
        } else {
            rateLimitMap.set(ipStr, { count: 1, lastTime: now });
        }
    } else if (ipStr !== '0.0.0.0') {
        rateLimitMap.set(ipStr, { count: 1, lastTime: now });
    }

    try {
        // 1. Honeypot check
        if (rawData.botcheck && rawData.botcheck.trim() !== '') {
            return res.status(200).json({ success: true, message: 'Bedankt voor uw bericht!' });
        }

        // 2. Strict Validation & Sanitization
        const needsContactInfo = !isWhistleblower;

        const formData: any = {
            ...rawData,
            name: sanitize(rawData.name?.trim()),
            email: rawData.email?.trim()?.toLowerCase(),
            organisation: sanitize(rawData.organisation?.trim()?.substring(0, 100)),
            aiSystem: sanitize(rawData.aiSystem?.trim()?.substring(0, 100)),
            description: sanitize(rawData.description?.trim()?.substring(0, 5000)),
            message: sanitize(rawData.message?.trim()?.substring(0, 5000)),
        };

        // Data Stripping for Whistleblowers (Early enforcement)
        if (isWhistleblower) {
            formData.name = 'ANONIEM';
            formData.email = 'noreply@moralknight.nl';
        }

        // Validate Privacy Consent
        if (!formData.privacyConsent) {
            return res.status(400).json({ success: false, message: 'U moet akkoord gaan met de privacyverklaring.' });
        }

        // Validate Contact Info if required
        if (needsContactInfo) {
            if (!formData.name || formData.name.length < 2) {
                return res.status(400).json({ success: false, message: 'Ongeldige naam.' });
            }
            if (!formData.email || !EMAIL_REGEX.test(formData.email)) {
                return res.status(400).json({ success: false, message: 'Ongeldig e-mailadres.' });
            }
        }

        // Validate Content
        const content = isReport ? formData.description : formData.message;
        if (!content || content.length < 5) {
            return res.status(400).json({ success: false, message: 'Bericht is te kort.' });
        }

        // Send Email
        const result = await sendEmail(formData, isWhistleblower);

        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: 'E-mail verzenden mislukt. Probeer het later opnieuw.',
                error: process.env.NODE_ENV === 'development' ? result.error : undefined,
            });
        }

        // Security headers to prevent browser caching of this interaction
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        return res.status(200).json({
            success: true,
            message: 'Bedankt!',
            reportId: result.reportId,
        });

    } catch (error) {
        console.error('[API] Global Error:', error);
        return res.status(500).json({ success: false, message: 'Interne serverfout.' });
    }
}

async function sendEmail(data: any, isWhistleblower: boolean): Promise<{ success: boolean; reportId?: string; error?: string }> {
    // Explicit SMTP configuration from environment variables
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPortStr = process.env.SMTP_PORT;

    const adminEmail = 'info@moralknight.nl';

    // Verify all required environment variables are present
    if (!smtpUser || !smtpPass || !smtpHost || !smtpPortStr) {
        return {
            success: false,
            error: 'Configuratiefout: Onvoldoende SMTP instellingen gevonden.'
        };
    }

    const smtpPort = parseInt(smtpPortStr, 10);
    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
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

    const getAttachments = async () => {
        const list: any[] = [];
        if (data.file && data.fileName) {
            try {
                let contentStr = data.file;
                let contentType = 'application/octet-stream';

                if (contentStr.startsWith('data:')) {
                    const base64Marker = ';base64,';
                    const base64Index = contentStr.indexOf(base64Marker);
                    const colonIndex = contentStr.indexOf(':');
                    if (colonIndex !== -1 && base64Index !== -1) {
                        contentType = contentStr.substring(colonIndex + 1, base64Index);
                    }
                    if (base64Index !== -1) {
                        contentStr = contentStr.substring(base64Index + base64Marker.length);
                    }
                }

                let buffer = Buffer.from(contentStr, 'base64');

                // EXTRA SECURITY: If whistleblower sends an image, scrub metadata locally
                if (isWhistleblower && contentType.startsWith('image/')) {
                    buffer = await scrubImageMetadata(buffer);
                }

                list.push({
                    filename: data.fileName,
                    content: buffer,
                    contentType: contentType
                });
            } catch (e) {
                console.error('[SMTP] Attachment error:', e);
            }
        }
        return list;
    };

    try {
        const attachments = await getAttachments();
        
        const adminMailOpts = {
            from: `"Moral Knight" <${adminEmail}>`,
            to: adminEmail,
            replyTo: isWhistleblower ? undefined : data.email,
            subject: subject,
            html: getHtml(false),
            attachments: attachments
        };

        const userMailOpts = {
            from: `"Moral Knight" <${adminEmail}>`,
            to: data.email,
            subject: isReport
                ? `Bevestiging Melding: ${reportId} - Moral Knight`
                : `Ontvangstbevestiging contactformulier - Moral Knight`,
            html: getHtml(true),
            attachments: attachments
        };

        // Send emails
        const sendAdmin = transporter.sendMail(adminMailOpts);
        // Never send automated confirmation email to whistleblowers to prevent leaving trails in their inbox
        const sendUser = isWhistleblower ? Promise.resolve({ skipped: true }) : transporter.sendMail(userMailOpts);

        const [adminResult] = await Promise.allSettled([sendAdmin, sendUser]);

        if (adminResult.status === 'rejected') {
            throw new Error(adminResult.reason instanceof Error ? adminResult.reason.message : 'SMTP_ERROR');
        }

        return { success: true, reportId };
    } catch (error) {
        console.error('[SMTP] Transport Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'SMTP_ERROR'
        };
    }
}


