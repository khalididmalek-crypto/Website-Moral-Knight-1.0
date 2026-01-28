export interface EmailTemplateData {
    name: string;
    email: string;
    organisation?: string;
    message?: string;
    aiSystem?: string;
    description?: string;
    formType: 'contact' | 'report';
    file?: string | null;
}

export const generateEmailHtml = (data: EmailTemplateData, isForUser: boolean, isReport: boolean, reportId: string, dateStr: string) => {
    // Moral Knight Branding Colors
    const colors = {
        primary: '#061424',    // Exact Dark Blue from Logo
        secondary: '#5C6B7F',  // Secondary Text (Blue-Grey)
        highlight: '#E2E8F0',  // Accents/Badges
        background: '#F8FAFC', // Page Background (Very light blue-grey)
        surface: '#FFFFFF',    // Content Surface
        text: '#1e293b',       // Body Text (Slate-800)
        border: '#e2e8f0',     // Borders
        danger: '#8B1A3D',     // Alerts/Errors
        shieldBorder: '#E1BF7A', // Gold/Bronze from Logo Shield
        footerText: '#061424',   // Dark blue from branding
    };

    const title = isForUser
        ? (isReport ? 'BEVESTIGING MELDING' : 'BEDANKT VOOR UW BERICHT')
        : (isReport ? 'NIEUWE MELDING' : 'NIEUW CONTACTVERZOEK');

    const introText = isForUser
        ? `Wij hebben uw gegevens in goede orde ontvangen en nemen zo spoedig mogelijk contact met u op.`
        : `Er is een nieuwe ${isReport ? 'melding' : 'contactaanvraag'} binnengekomen via de website.`;

    // Helper to render rows safely
    const renderRow = (label: string, value: string | undefined | null, isLongText = false) => {
        if (!value) return '';
        return `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; vertical-align: top;" width="35%">
          <span style="font-family: 'Courier New', Courier, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${colors.secondary}; font-weight: 700;">
            ${label}
          </span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; vertical-align: top; color: ${colors.text}; font-size: 14px; line-height: 1.6;">
          ${isLongText ? value.replace(/\n/g, '<br>') : value}
        </td>
      </tr>
    `;
    };

    return `
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        .privacy-link {
            text-decoration: underline;
            text-decoration-color: ${colors.footerText};
            color: ${colors.footerText};
        }
        .privacy-link:hover {
            text-decoration-color: ${colors.shieldBorder} !important;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${colors.background}; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    
    <!-- Main Wrapper -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${colors.background};">
        <tr>
            <td align="center" style="padding: 40px 10px;">
                
                <!-- Container -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: ${colors.surface}; border: 1px solid ${colors.border}; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: ${colors.primary}; padding: 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="left" style="vertical-align: middle;">
                                        <div style="font-family: 'Courier New', Courier, monospace; font-size: 24px; font-weight: 600; color: #FFFFFF; letter-spacing: 0.5px;">
                                            MORAL KNIGHT
                                        </div>
                                        <div style="font-family: 'Courier New', Courier, monospace; font-size: 12px; font-weight: 400; color: #FFFFFF; letter-spacing: 1px; text-transform: uppercase; margin-top: 14px;">
                                            De onafhankelijke waakhond voor publieke AI
                                        </div>
                                    </td>
                                    <td align="right" style="vertical-align: middle; padding-left: 20px;">
                                         <!-- Logo -->
                                        <img src="cid:logo" alt="Moral Knight" width="135" height="auto" style="display: block; border: 0;" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Status Bar / Badge -->
                    <tr>
                        <td style="background-color: #FFFFFF; padding: 20px 30px; border-bottom: 1px solid #F3F4F6;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="left">
                                        <span style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: ${colors.secondary}; background-color: #F3F4F6; padding: 6px 10px; border-radius: 4px; border: 1px solid ${colors.shieldBorder};">
                                            KENMERK: <span style="font-weight: 700; color: ${colors.text};">${reportId}</span>
                                        </span>
                                    </td>
                                    <td align="right">
                                        <span style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: ${colors.shieldBorder}; margin-right: 35px;">
                                            ${dateStr}
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <!-- Title -->
                            <h2 style="margin: 0 0 20px 0; font-family: 'Courier New', Courier, monospace; font-size: 16px; color: ${colors.primary}; font-weight: 700; letter-spacing: -0.5px; text-transform: uppercase;">
                                ${title}
                            </h2>

                            <!-- Intro Text -->
                            <p style="margin: 0 0 30px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: ${colors.text};">
                                ${introText}
                            </p>

                            <!-- Data Table -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                                ${renderRow('Naam', data.name)}
                                ${renderRow('Email', data.email)}
                                ${renderRow('Organisatie', data.organisation)}
                                ${isReport ? renderRow('Systeem', data.aiSystem) : ''}
                                ${isReport
            ? renderRow('Omschrijving', data.description, true)
            : renderRow('Bericht', data.message, true)
        }
                                ${data.file ? renderRow('Bijlage', `Ingesloten: ${data.file}`) : ''}
                            </table>

                            <!-- CTA Button (Admin Only) -->
                            ${!isForUser ? `
                            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px dashed #E5E7EB;">
                                <a href="mailto:${data.email}?subject=Re: ${reportId} - Reactie op uw bericht" style="display: inline-block; background-color: ${colors.primary}; color: #FFFFFF; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid ${colors.shieldBorder};">
                                    BEANTWOORDEN
                                </a>
                            </div>
                            ` : ''}
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F8FAFC; padding: 30px; border-top: 2px solid ${colors.shieldBorder}; text-align: left;">
                            <p style="margin: 0; font-family: 'Courier New', Courier, monospace; font-size: 12px; color: ${colors.footerText}; letter-spacing: 1px; text-transform: uppercase; margin-left: -2px;">
                                / Moral Knight since 2025 - Auditing public AI
                            </p>
                            <p style="margin: 10px 0 0 17px; font-family: 'Courier New', Courier, monospace; font-size: 11px; color: ${colors.footerText}; letter-spacing: 1px; text-transform: uppercase; opacity: 0.8;">
                                Wij verwerken uw gegevens volgens de <a href="https://www.moralknight.nl/privacy" class="privacy-link" style="color: ${colors.footerText}; text-decoration: underline;">privacyverklaring</a>.
                            </p>
                        </td>
                    </tr>

                </table>
                <!-- End Container -->

            </td>
        </tr>
    </table>

            </td>
        </tr>
    </table>
</body>
</html>
  `;
};
