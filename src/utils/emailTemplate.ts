export interface EmailTemplateData {
    name: string;
    email: string;
    organisation?: string;
    message?: string;
    aiSystem?: string;
    description?: string;
    formType: 'contact' | 'report';
    file?: string | null;
    fileName?: string;
    newsletter?: boolean;
    privacyConsent?: boolean;
}

export const generateEmailHtml = (data: EmailTemplateData, isForUser: boolean, isReport: boolean, reportId: string, dateStr: string) => {
    // Moral Knight Branding Colors
    const colors = {
        primary: '#061424',    // Moral Knight Dark Blue (Exactly matching logo background)
        secondary: '#5C6B7F',  // Secondary Text (Blue-Grey)
        highlight: '#E2E8F0',  // Accents/Badges
        background: '#F8FAFC', // Page Background (Very light blue-grey)
        surface: '#FFFFFF',    // Content Surface
        text: '#1e293b',       // Body Text (Slate-800)
        border: '#e2e8f0',     // Borders
        danger: '#8B1A3D',     // Alerts/Errors
        shieldBorder: '#E1BF7A', // Gold/Bronze from Logo Shield
        footerText: '#061424',   // Matching Dark Blue
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
      <tr class="data-row">
        <td class="data-label" style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; vertical-align: top;" width="35%">
          <span style="font-family: 'Courier New', Courier, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${colors.secondary}; font-weight: 700;">
            ${label}
          </span>
        </td>
        <td class="data-value" style="padding: 12px 0 12px 15px; border-bottom: 1px solid #E5E7EB; vertical-align: top; color: ${colors.text}; font-size: 14px; line-height: 1.6;">
          ${isLongText ? value.replace(/\\n/g, '<br>') : value}
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
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light">
    <title>${title}</title>
    <style>
        /* Force light mode in all clients */
        :root { color-scheme: light; }

        /* Gmail dark mode override - lock all key colors */
        @media (prefers-color-scheme: dark) {
            body, table { background-color: #F8FAFC !important; }
            .email-header td { background-color: #061424 !important; color: #FFFFFF !important; }
            .header-title, .header-subtitle { color: #FFFFFF !important; }
            .email-statusbar td { background-color: #FFFFFF !important; }
            .email-content td { background-color: #FFFFFF !important; color: #1e293b !important; }
            .email-footer td { background-color: #F8FAFC !important; color: #061424 !important; }
            h2.main-title { color: #061424 !important; }
            p.intro-text, td.data-value { color: #1e293b !important; }
        }
        .privacy-link {
            text-decoration: underline;
            text-decoration-color: ${colors.footerText};
            color: ${colors.footerText};
        }
        .privacy-link:hover {
            text-decoration-color: ${colors.primary} !important;
        }
        
        /* Mobile Responsive Styles */
        @media only screen and (max-width: 600px) {
            /* Force table width to 100% */
            table[class="email-container"] {
                width: 100% !important;
            }
            
            /* Header layout adjustments */
            td[class="header-cell"] {
                display: table-cell !important;
                width: auto !important;
                padding: 10px 5px !important;
                vertical-align: top !important;
            }
            
            /* Target the logo cell specifically to align right and top */
            td[class="header-cell"][align="right"] {
                text-align: right !important;
                padding-top: 0 !important; /* Remove top padding for logo to push it up */
            }
            
            div[class="header-title"] {
                font-size: 20px !important;
            }
            
            div[class="header-subtitle"] {
                font-size: 10px !important;
                margin-top: 8px !important;
            }
            
            img[class="header-logo"] {
                width: 80px !important;
                margin: 5px 0 0 0 !important;
            }
            
            /* Status bar stacking */
            td[class="status-cell"] {
                display: block !important;
                width: 100% !important;
                text-align: center !important;
                margin: 8px 0 !important;
            }
            
            span[class="status-badge"] {
                margin-right: 0 !important;
            }
            
            span[class="status-date"] {
                margin-right: 0 !important;
                display: block !important;
                margin-top: 10px !important;
            }
            
            /* Main content padding */
            td[class="content-cell"] {
                padding: 25px 20px !important;
            }
            
            /* Title adjustments */
            h2[class="main-title"] {
                font-size: 14px !important;
            }
            
            /* Intro text */
            p[class="intro-text"] {
                font-size: 14px !important;
                line-height: 1.5 !important;
            }
            
            /* Data table stacking */
            tr[class="data-row"] {
                display: block !important;
                margin-bottom: 15px !important;
                border-bottom: 1px solid #E5E7EB !important;
                padding-bottom: 15px !important;
            }
            
            td[class="data-label"] {
                display: block !important;
                width: 100% !important;
                padding: 0 0 5px 0 !important;
                border-bottom: none !important;
            }
            
            td[class="data-value"] {
                display: block !important;
                width: 100% !important;
                padding: 0 0 5px 0 !important;
                border-bottom: none !important;
            }
            
            /* CTA Button */
            a[class="cta-button"] {
                display: block !important;
                width: 100% !important;
                padding: 16px 20px !important;
                font-size: 14px !important;
                text-align: center !important;
                box-sizing: border-box !important;
            }
            
            /* Footer adjustments */
            td[class="footer-cell"] {
                padding: 20px !important;
            }
            
            p[class="footer-text"] {
                font-size: 10px !important;
                margin-left: -2px !important;
            }
            
            p[class="privacy-text"] {
                font-size: 9px !important;
                margin: 8px 0 0 0 !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${colors.background}; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    
    <!-- Main Wrapper -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${colors.background};">
        <tr>
            <td align="center" style="padding: 40px 10px;">
                
                <!-- Container -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; background-color: ${colors.surface}; border: 1px solid ${colors.border}; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    
                    <!-- Header (PNG image - Gmail dark mode safe) -->
                    <tr class="email-header">
                        <td bgcolor="${colors.primary}" style="background-color: ${colors.primary} !important; padding: 0; line-height: 0;" data-ogsc="${colors.primary}" data-ogsb="${colors.primary}">
                            <a href="https://www.moralknight.nl" style="display: block; line-height: 0;">
                                <img
                                    src="https://www.moralknight.nl/images/email-header.png"
                                    alt="Moral Knight - De onafhankelijke waakhond voor publieke AI"
                                    width="600"
                                    style="display: block; width: 100%; max-width: 600px; height: auto; border: 0; outline: 0;"
                                />
                            </a>
                        </td>
                    </tr>


                    <!-- Status Bar / Badge -->
                    <tr class="email-statusbar">
                        <td bgcolor="#FFFFFF" style="background-color: #FFFFFF !important; padding: 20px 30px; border-bottom: 1px solid #F3F4F6;" data-ogsb="#FFFFFF">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="left" class="status-cell">
                                        <span class="status-badge" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: ${colors.secondary}; background-color: #F3F4F6; padding: 6px 10px; border-radius: 4px; border: 1px solid ${colors.shieldBorder};">
                                            KENMERK: <span style="font-weight: 700; color: ${colors.text};">${reportId}</span>
                                        </span>
                                    </td>
                                    <td align="right" class="status-cell">
                                        <span class="status-date" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: ${colors.text}; margin-right: 35px;">
                                            ${dateStr}
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr class="email-content">
                        <td class="content-cell" bgcolor="#FFFFFF" style="background-color: #FFFFFF !important; padding: 40px 30px;" data-ogsb="#FFFFFF">
                            <!-- Title -->
                            <h2 class="main-title" style="margin: 0 0 20px 0; font-family: 'Courier New', Courier, monospace; font-size: 16px; color: ${colors.primary}; font-weight: 700; letter-spacing: -0.5px; text-transform: uppercase;">
                                ${title}
                            </h2>

                            <!-- Intro Text -->
                            <p class="intro-text" style="margin: 0 0 30px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: ${colors.text};">
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
                                ${data.fileName ? renderRow('Bijlage', `Ingesloten: ${data.fileName}`) : ''}
                                ${renderRow('Nieuwsbrief', data.newsletter ? 'Ja, ik wil op de hoogte blijven' : 'Nee')}
                                ${renderRow('Privacy', data.privacyConsent ? 'Akkoord met privacyverklaring' : 'N.v.t.')}
                            </table>

                            <!-- CTA Button (Admin Only) -->
                            ${!isForUser ? `
                            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px dashed #E5E7EB;">
                                <a href="mailto:${data.email}?subject=Re: ${reportId} - Reactie op uw bericht" class="cta-button" style="display: inline-block; background-color: ${colors.primary}; color: #FFFFFF; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid ${colors.shieldBorder};">
                                    BEANTWOORDEN
                                </a>
                            </div>
                            ` : ''}
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr class="email-footer">
                        <td class="footer-cell" bgcolor="#F8FAFC" style="background-color: #F8FAFC !important; padding: 30px; border-top: 2px solid ${colors.primary}; text-align: left;" data-ogsb="#F8FAFC">
                            <p class="footer-text" style="margin: 0; font-family: 'Courier New', Courier, monospace; font-size: 12px; color: ${colors.footerText}; letter-spacing: 1px; text-transform: uppercase; margin-left: -2px;">
                                / Moral Knight since 2025 - Auditing public AI
                            </p>
                            <p class="privacy-text" style="margin: 10px 0 0 0; font-family: 'Courier New', Courier, monospace; font-size: 11px; color: ${colors.footerText}; letter-spacing: 1px; text-transform: uppercase; opacity: 0.8;">
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
