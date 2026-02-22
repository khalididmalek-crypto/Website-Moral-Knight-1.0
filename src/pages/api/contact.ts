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
            sizeLimit: '15mb', // Increased to handle Base64 overhead of large images
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
                    message: 'Te veel berichten. Probeer het over 15 minuten opnieuw.',
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
            console.log('[API] Bot detected via honeypot');
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

        // Data Stripping for Whistleblowers
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
                return res.status(400).json({ success: false, message: 'Voer een geldige naam in.' });
            }
            if (!formData.email || !EMAIL_REGEX.test(formData.email)) {
                return res.status(400).json({ success: false, message: 'Voer een geldig e-mailadres in.' });
            }
        }

        // Validate Content
        const content = isReport ? formData.description : formData.message;
        if (!content || content.trim().length < 5) {
            return res.status(400).json({ success: false, message: 'Het bericht is te kort.' });
        }

        // Send Email
        const result = await sendEmail(formData, isWhistleblower);

        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: result.error || 'E-mail verzenden mislukt.',
            });
        }

        // Security headers
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        return res.status(200).json({
            success: true,
            message: 'Uw bericht is succesvol verzonden.',
            reportId: result.reportId,
        });

    } catch (error) {
        console.error('[API] Global Error:', error);
        return res.status(500).json({ success: false, message: 'Interne serverfout. Probeer het later opnieuw.' });
    }
}

async function sendEmail(data: any, isWhistleblower: boolean): Promise<{ success: boolean; reportId?: string; error?: string }> {
    const { SMTP_USER, SMTP_PASS, SMTP_HOST, SMTP_PORT, ADMIN_EMAIL } = process.env;
    const adminEmail = ADMIN_EMAIL || 'info@moralknight.nl';

    if (!SMTP_USER || !SMTP_PASS || !SMTP_HOST || !SMTP_PORT) {
        console.error('[SMTP] Missing environment variables');
        return { success: false, error: 'Serverconfiguratiefout (SMTP variabelen ontbreken).' };
    }

    const port = parseInt(SMTP_PORT, 10);
    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: port,
        secure: port === 465, // Use SSL for 465, STARTTLS for others
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
        // Support for older or self-signed certs if necessary
        tls: {
            rejectUnauthorized: false, // Changed from true to allow unverified certificates
            minVersion: 'TLSv1.2'
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

                if (isWhistleblower && contentType.startsWith('image/')) {
                    buffer = await scrubImageMetadata(buffer);
                }

                list.push({
                    filename: data.fileName,
                    content: buffer,
                    contentType: contentType
                });
            } catch (e) {
                console.error('[SMTP] Attachment processing failed:', e);
            }
        }
        return list;
    };

    try {
        const attachments = await getAttachments();

        const adminMailOpts = {
            from: `"Moral Knight Website" <${SMTP_USER}>`, // Recommended to use the authenticated user as sender
            to: adminEmail,
            replyTo: isWhistleblower ? undefined : data.email,
            subject: subject,
            html: getHtml(false),
            attachments: attachments
        };

        // Send to Admin
        await transporter.sendMail(adminMailOpts);

        // Optional User Confirmation (Not for whistleblowers)
        if (!isWhistleblower) {
            const userMailOpts = {
                from: `"Moral Knight" <${SMTP_USER}>`,
                to: data.email,
                subject: isReport
                    ? `Bevestiging Melding: ${reportId}`
                    : `Ontvangstbevestiging contactformulier - Moral Knight`,
                html: getHtml(true),
                attachments: attachments
            };
            await transporter.sendMail(userMailOpts);
        }

        return { success: true, reportId };
    } catch (error: any) {
        console.error('[SMTP] Connection Error:', error);
        let errorMsg = 'SMTP verbinding mislukt.';
        if (error.code === 'EAUTH') errorMsg = 'E-mail authenticatie mislukt (wachtwoord/gebruiker).';
        if (error.code === 'ETIMEDOUT') errorMsg = 'SMTP verbinding time-out.';

        return { success: false, error: errorMsg };
    }
}


