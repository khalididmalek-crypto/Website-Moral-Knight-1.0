/**
 * Contact Form API Endpoint
 * 
 * Handles contact form submissions and sends emails.
 * Uses a serverless function approach.
 */
import type { NextApiRequest, NextApiResponse } from 'next';

interface ContactFormData {
    name: string;
    email: string;
    organisation: string;
    message: string;
    newsletter: boolean;
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
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed',
        });
    }

    try {
        const formData: ContactFormData = req.body;

        // Validate required fields
        if (!formData.name || !formData.email || !formData.message) {
            return res.status(400).json({
                success: false,
                message: 'Ontbrekende verplichte velden',
                error: 'MISSING_FIELDS',
            });
        }

        // Validate privacy consent
        if (!formData.privacyConsent) {
            return res.status(400).json({
                success: false,
                message: 'Privacy akkoord is verplicht',
                error: 'PRIVACY_NOT_ACCEPTED',
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

        // Here you would integrate with an email service:
        // - SendGrid
        // - Resend
        // - Nodemailer
        // - AWS SES

        // Example with console logging (replace with actual email service)
        console.log('Contact form submission:', formData);

        // Simulate email sending (replace with actual implementation)
        const emailSent = await sendEmail(formData);

        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: 'E-mail verzenden mislukt',
                error: 'EMAIL_SEND_FAILURE',
            });
        }

        // Success response
        return res.status(200).json({
            success: true,
            message: 'Bedankt voor uw bericht! We nemen zo snel mogelijk contact met u op.',
        });

    } catch (error) {
        console.error('Contact form error:', error);
        return res.status(500).json({
            success: false,
            message: 'Er is een fout opgetreden. Probeer het later opnieuw.',
            error: 'INTERNAL_ERROR',
        });
    }
}

/**
 * Send email function (replace with actual email service integration)
 */
async function sendEmail(_data: ContactFormData): Promise<boolean> {
    // TODO: Integrate with email service
    // Example with Resend:
    /*
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
  
    try {
      await resend.emails.send({
        from: 'contact@moralknight.nl',
        to: 'info@moralknight.nl',
        subject: `Contact form: ${data.name}`,
        html: `
          <h2>Nieuw contactformulier bericht</h2>
          <p><strong>Naam:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Organisatie:</strong> ${data.organisation}</p>
          <p><strong>Bericht:</strong></p>
          <p>${data.message}</p>
          <p><strong>Nieuwsbrief:</strong> ${data.newsletter ? 'Ja' : 'Nee'}</p>
        `,
      });
      return true;
    } catch (error) {
      console.error('Email send error:', error);
      return false;
    }
    */

    // For now, just simulate success
    return Promise.resolve(true);
}
