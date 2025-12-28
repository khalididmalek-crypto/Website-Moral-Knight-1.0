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
        });

    } catch (error) {
        console.error('[API] Global Catch Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Er is een interne serverfout opgetreden.',
            error: error instanceof Error ? error.message : 'INTERNAL_ERROR',
        });
    }
}

async function sendEmail(data: FormData): Promise<{ success: boolean; error?: string }> {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
        const missing = !user ? 'GMAIL_USER' : 'GMAIL_APP_PASSWORD';
        return { success: false, error: `MISSING_ENV_VAR: ${missing}` };
    }

    // Set up transporter with strict configuration for Gmail
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use SSL
        auth: {
            user: user,
            pass: pass,
        },
    });

    const isReport = data.formType === 'report';
    const subject = isReport
        ? `MK Meldpunt: Nieuwe melding van ${data.name}`
        : `MK Contact: Nieuw bericht van ${data.name}`;

    const html = isReport ? `
        <div style="font-family: monospace; padding: 20px; border: 1px solid #000;">
            <h2 style="color: #194D25; border-bottom: 1px solid #000; padding-bottom: 10px;">Nieuwe melding via MK Meldpunt</h2>
            <p><strong>Naam:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Organisatie:</strong> ${data.organisation || 'Niet opgegeven'}</p>
            <p><strong>Publieke instantie / AI Systeem:</strong> ${data.aiSystem}</p>
            <p><strong>Omschrijving van de misstand:</strong></p>
            <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #194D25; white-space: pre-wrap;">${data.description}</div>
        </div>
    ` : `
        <div style="font-family: monospace; padding: 20px; border: 1px solid #000;">
            <h2 style="color: #194D25; border-bottom: 1px solid #000; padding-bottom: 10px;">Nieuw bericht via Contactformulier</h2>
            <p><strong>Naam:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Organisatie:</strong> ${data.organisation || 'Niet opgegeven'}</p>
            <p><strong>Bericht:</strong></p>
            <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #194D25; white-space: pre-wrap;">${data.message}</div>
            <p><strong>Nieuwsbrief:</strong> ${data.newsletter ? 'Ja' : 'Nee'}</p>
        </div>
    `;

    try {
        console.log(`[SMTP] Sending mail to ${user}...`);
        await transporter.sendMail({
            from: `"Moral Knight Website" <${user}>`,
            to: user,
            replyTo: data.email,
            subject: subject,
            html: html,
        });
        return { success: true };
    } catch (error) {
        console.error('[SMTP] Transport Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'UNKNOWN_SMTP_ERROR'
        };
    }
}
