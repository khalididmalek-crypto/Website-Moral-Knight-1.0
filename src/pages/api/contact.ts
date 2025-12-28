/**
 * Contact Form API Endpoint
 * 
 * Handles contact form and report form submissions and sends emails.
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
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed',
        });
    }

    try {
        const formData: FormData = req.body;

        // Basic validation
        if (!formData.name || !formData.email || !formData.privacyConsent) {
            return res.status(400).json({
                success: false,
                message: 'Ontbrekende verplichte velden',
                error: 'MISSING_FIELDS',
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return res.status(400).json({
                success: false,
                message: 'Ongeldig e-mailadres',
                error: 'INVALID_EMAIL',
            });
        }

        // Send Email
        const emailSent = await sendEmail(formData);

        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: 'E-mail verzenden mislukt',
                error: 'EMAIL_SEND_FAILURE',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Bedankt voor uw bericht!',
        });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Er is een fout opgetreden. Probeer het later opnieuw.',
            error: 'INTERNAL_ERROR',
        });
    }
}

async function sendEmail(data: FormData): Promise<boolean> {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
        console.error('Missing GMAIL_USER or GMAIL_APP_PASSWORD in environment variables');
        return false;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
    });

    const isReport = data.formType === 'report';
    const subject = isReport
        ? `MK Meldpunt: Nieuwe melding van ${data.name}`
        : `MK Contact: Nieuw bericht van ${data.name}`;

    const html = isReport ? `
        <h2>Nieuwe melding via MK Meldpunt</h2>
        <p><strong>Naam:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Organisatie:</strong> ${data.organisation || 'Niet opgegeven'}</p>
        <p><strong>Publieke instantie / AI Systeem:</strong> ${data.aiSystem}</p>
        <p><strong>Omschrijving van de misstand:</strong></p>
        <p style="white-space: pre-wrap;">${data.description}</p>
    ` : `
        <h2>Nieuw bericht via Contactformulier</h2>
        <p><strong>Naam:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Organisatie:</strong> ${data.organisation || 'Niet opgegeven'}</p>
        <p><strong>Bericht:</strong></p>
        <p style="white-space: pre-wrap;">${data.message}</p>
        <p><strong>Nieuwsbrief:</strong> ${data.newsletter ? 'Ja' : 'Nee'}</p>
    `;

    try {
        await transporter.sendMail({
            from: `"Moral Knight Form" <${user}>`,
            to: user, // Sends to yourself
            replyTo: data.email,
            subject: subject,
            html: html,
        });
        return true;
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
}
