import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { generateEmailHtml } from '../../utils/emailTemplate';
import { IncomingForm } from 'formidable';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

    try {
        const form = new IncomingForm({
            maxFileSize: 10 * 1024 * 1024,
            keepExtensions: true,
        });

        const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
            form.parse(req, (err, fds, fls) => {
                if (err) reject(err);
                resolve([fds, fls]);
            });
        });

        const getFirst = (val: any) => Array.isArray(val) ? val[0] : val;

        const formData: any = {
            formType: getFirst(fields.formType),
            name: getFirst(fields.name)?.trim(),
            email: getFirst(fields.email)?.trim()?.toLowerCase(),
            organisation: getFirst(fields.organisation)?.trim(),
            message: getFirst(fields.message)?.trim(),
            aiSystem: getFirst(fields.aiSystem)?.trim(),
            description: getFirst(fields.description)?.trim(),
            _website: getFirst(fields._website)?.trim(),
            newsletter: getFirst(fields.newsletter) === 'true',
            privacyConsent: getFirst(fields.privacyConsent) === 'true',
        };

        if (formData._website && formData._website !== '') {
            return res.status(200).json({ success: true, message: 'Bedankt voor uw bericht!' });
        }

        const fileField = getFirst(files.file);
        if (fileField) {
            formData.fileName = fileField.originalFilename || fileField.newFilename;
            formData.filePath = fileField.filepath;
            formData.mimetype = fileField.mimetype;
        }

        if (!formData.name || !formData.email || !formData.privacyConsent) {
            return res.status(400).json({ success: false, message: 'Ontbrekende verplichte velden' });
        }

        const result = await sendEmail(formData);

        if (!result.success) {
            return res.status(500).json({ success: false, message: 'E-mail verzenden mislukt. Probeer het later opnieuw.', error: result.error });
        }

        return res.status(200).json({ success: true, message: 'Bedankt voor uw bericht!', reportId: result.reportId });
    } catch (err: any) {
        console.error('[API] Global Error:', err);
        return res.status(500).json({ success: false, message: 'Er is een interne serverfout opgetreden. Probeer het later opnieuw.' });
    }
}

async function sendEmail(data: any): Promise<{ success: boolean; reportId?: string; error?: string }> {
    const allKeys = Object.keys(process.env);
    const passKey = allKeys.find(k => k.includes('SMTP_PASS') || k.includes('MAIL_SERVER_PASSWORD') || k.includes('PASS'));
    const userKey = allKeys.find(k => k.includes('SMTP_USER') || k.includes('EMAIL_SERVER_USER') || k.includes('USER'));

    const smtpUser = process.env.SMTP_USER || (userKey ? process.env[userKey] : null) || 'info@moralknight.nl';
    const smtpPass = process.env.SMTP_PASS || (passKey ? process.env[passKey] : null);
    const smtpHost = 'web0170.zxcs.nl';
    const smtpPort = 465;
    const adminEmail = 'info@moralknight.nl';

    if (!smtpPass) {
        return { success: false, error: 'Configuratiefout: Wachtwoord ontbreekt.' };
    }

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: true,
        auth: { user: smtpUser, pass: smtpPass },
        tls: { rejectUnauthorized: false }
    } as any);

    const isReport = data.formType === 'report';
    const reportId = `MK-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const dateStr = new Date().toLocaleDateString('nl-NL');

    const subject = isReport 
        ? `[MELDING] Kenmerk: ${reportId} - Moral Knight Publieke Ruimte` 
        : `[CONTACT] Bericht van ${data.name} - Moral Knight`;

    const getHtml = (isForUser: boolean) => generateEmailHtml(data, isForUser, isReport, reportId, dateStr);

    const attachments: any[] = [];
    if (data.filePath && data.fileName) {
        attachments.push({
            filename: data.fileName,
            path: data.filePath,
            contentType: data.mimetype
        });
    }

    try {
        const adminMailOpts = {
            from: `"Moral Knight" <${adminEmail}>`,
            to: adminEmail,
            replyTo: data.email,
            subject: subject,
            html: getHtml(false),
            attachments
        };

        const userMailOpts = {
            from: `"Moral Knight" <${adminEmail}>`,
            to: data.email,
            subject: isReport
                ? `Bevestiging Melding: ${reportId} - Moral Knight`
                : `Ontvangstbevestiging contactformulier - Moral Knight`,
            html: getHtml(true),
            attachments
        };

        const [adminResult, userResult] = await Promise.allSettled([
            transporter.sendMail(adminMailOpts),
            transporter.sendMail(userMailOpts)
        ]);

        if (adminResult.status === 'rejected') {
            console.error('[SMTP] Admin email failed:', adminResult.reason);
            throw adminResult.reason;
        }

        if (userResult.status === 'rejected') {
            console.warn('[SMTP] User confirmation failed:', userResult.reason);
        }

        return { success: true, reportId };
    } catch (e: any) {
        console.error('[SMTP] Transport Error:', e);
        return { success: false, error: e.message };
    }
}
