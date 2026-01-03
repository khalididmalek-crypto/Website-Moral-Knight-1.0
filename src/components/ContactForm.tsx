/**
 * ContactForm Component
 * 
 * Professional, accessible contact form for the Contact tile.
 * Features:
 * - Clean, minimal design consistent with Moral Knight aesthetic
 * - Full name, email, organisation/role, message fields
 * - Newsletter subscription checkbox (optional)
 * - Privacy consent checkbox (required)
 * - Inline validation with clear error messages
 * - Accessible form elements with proper ARIA attributes
 * - Success/error states with user feedback
 */
import React, { useState, useCallback, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { SPACING, COLORS, FORM_COLORS } from '../constants';

interface Props {
  className?: string;
  mode?: 'preview' | 'fullscreen';
  onClose?: () => void;
}

interface FormData {
  name: string;
  email: string;
  organisation: string;
  message: string;
  newsletter: boolean;
  privacyConsent: boolean;
  _website: string; // Honeypot
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  privacyConsent?: string;
}

// Email validation regex (RFC 5322 compliant simplified)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email.trim());
};

export const ContactForm: React.FC<Props> = ({ className = '', mode = 'preview', onClose }) => {
  const isPreview = mode === 'preview';
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    organisation: '',
    message: '',
    newsletter: false,
    privacyConsent: false,
    _website: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Persistence: Restore form data from session storage on mount
  useEffect(() => {
    const savedData = sessionStorage.getItem('contact_form_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to parse saved contact form data', e);
      }
    }
  }, []);

  // Persistence: Save form data to session storage on change
  useEffect(() => {
    // Only save essential data, exclude transient state
    const { _website, ...saveData } = formData;
    sessionStorage.setItem('contact_form_data', JSON.stringify(saveData));
  }, [formData]);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing/interacting
    setErrors((prev) => {
      if (prev[name as keyof FormErrors]) {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      }
      return prev;
    });

    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError(null);
    }
  }, [submitError]);

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, formData[field as keyof FormData]);
  };

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === ' ') {
      e.stopPropagation();
    }
  }, []);

  const validateField = (field: string, value: string | boolean): string | undefined => {
    switch (field) {
      case 'name':
        if (!(value as string).trim()) {
          return 'Naam is verplicht';
        }
        if ((value as string).trim().length < 2) {
          return 'Naam moet minimaal 2 tekens bevatten';
        }
        break;
      case 'email':
        if (!(value as string).trim()) {
          return 'Email is verplicht';
        }
        if (!validateEmail(value as string)) {
          return 'Voer een geldig emailadres in';
        }
        break;
      case 'message':
        if (!(value as string).trim()) {
          return 'Bericht is verplicht';
        }
        if ((value as string).trim().length < 10) {
          return 'Bericht moet minimaal 10 tekens bevatten';
        }
        break;
      case 'privacyConsent':
        if (!(value as boolean)) {
          return 'U moet akkoord gaan met de privacyverklaring';
        }
        break;
    }
    return undefined;
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Validate required fields
    const nameError = validateField('name', formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateField('email', formData.email);
    if (emailError) newErrors.email = emailError;

    const messageError = validateField('message', formData.message);
    if (messageError) newErrors.message = messageError;

    const privacyError = validateField('privacyConsent', formData.privacyConsent);
    if (privacyError) newErrors.privacyConsent = privacyError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Mark all required fields as touched to show errors
      setTouched({
        name: true,
        email: true,
        message: true,
        privacyConsent: true,
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      console.log('[ContactForm] Submitting form...');
      // Call API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, formType: 'contact' }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Er is een fout opgetreden bij de server');
      }

      // Success!
      console.log('[ContactForm] Submission success:', data);
      setIsSubmitting(false);
      setSubmitted(true);
    } catch (error) {
      console.error('[ContactForm] Submission error:', error);
      setIsSubmitting(false);
      const errorMessage = error instanceof Error ? error.message : 'Er ging iets mis, probeer het later nogmaals';
      setSubmitError(errorMessage);
      alert(`Fout: ${errorMessage}`);
    }
  }, [formData, validateForm]);

  const handleReset = useCallback(() => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      organisation: '',
      message: '',
      newsletter: false,
      privacyConsent: false,
      _website: '',
    });
    setErrors({});
    setTouched({});
    setSubmitError(null);
  }, []);

  // Preview mode: show empty state
  if (isPreview) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center ${SPACING.TEXT_PADDING_PREVIEW} text-center ${className}`} />
    );
  }

  // Success state: show confirmation message
  if (submitted) {
    return (
      <div className={`w-full group-hover:bg-transparent overflow-hidden relative ${className} ${isPreview ? `h-full ${SPACING.TEXT_PADDING_PREVIEW}` : `h-auto max-h-[80vh] ${SPACING.TEXT_PADDING_FULLSCREEN} overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']`}`}>
        {/* Close Button - Top Right with Buggy Effect */}
        {onClose && (
          <button
            onClick={(e) => {
              const button = e.currentTarget;

              // Start ruis effect bij klikken
              const buggyInterval = setInterval(() => {
                // Iets intensere bewegingen voor het afsluit-effect
                const randomX = Math.random() * 10 - 5;
                const randomY = Math.random() * 10 - 5;
                const randomRotate = Math.random() * 10 - 5;

                button.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
              }, 50);

              // Na 0.75s daadwerkelijk sluiten
              setTimeout(() => {
                clearInterval(buggyInterval);
                if (onClose) onClose();
              }, 750);
            }}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#194D25] min-w-[44px] min-h-[44px] flex items-center justify-center group/close z-10 cursor-pointer"
            aria-label="Sluit en keer terug naar hoofdpagina"
            style={{
              transition: 'transform 0.05s ease-out',
            }}
          >
            <X
              size={24}
              strokeWidth={1.5}
              className="text-[#194D25] group-hover/close:text-[#8B1A3D] transition-colors duration-200"
              aria-hidden="true"
            />
          </button>
        )}

        <div className={`${isPreview ? '' : 'max-w-3xl mx-auto'} flex flex-col items-center justify-center text-center animate-fade-in-up py-12 md:py-20`}>
          {/* Success Icon - Plane Icon */}
          <div className="mb-8 md:mb-10 flex items-center justify-center">
            <Send
              size={29}
              strokeWidth={1.2}
              style={{ color: FORM_COLORS.SUCCESS_ICON }}
              aria-hidden="true"
            />
          </div>

          {/* Title Section with Frame */}
          <div className="inline-block border border-black px-4 md:px-5 py-2 md:py-2.5 mb-6 md:mb-8" style={{ backgroundColor: 'white' }}>
            <h2
              className="font-mono text-sm md:text-[15px] font-semibold uppercase tracking-[0.2em] m-0"
              style={{ color: COLORS.PRIMARY_GREEN }}
            >
              BEDANKT
            </h2>
          </div>

          {/* Message */}
          <p
            className="font-mono text-xs md:text-sm leading-relaxed max-w-md mb-10 md:mb-12 px-4"
            style={{ color: FORM_COLORS.TEXT_SECONDARY }}
          >
            Uw bericht is ontvangen. We nemen zo spoedig mogelijk<br className="hidden md:block" /> contact met u op.
          </p>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleReset}
            className="px-6 md:px-8 py-2.5 md:py-3 border border-black font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 min-h-[44px]"
            style={{
              backgroundColor: 'white',
              color: COLORS.PRIMARY_GREEN,
              '--tw-outline-color': COLORS.PRIMARY_GREEN
            } as React.CSSProperties & { '--tw-outline-color': string }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F7F7F7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
            aria-label="Nog een bericht versturen"
          >
            NOG EEN BERICHT
          </button>
        </div>
      </div>
    );
  }

  // Form state: show contact form
  // Note: Use exact same structure as TEXT content for consistency
  return (
    <div className={`w-full group-hover:bg-transparent overflow-hidden relative ${className} ${isPreview ? `h-full ${SPACING.TEXT_PADDING_PREVIEW}` : `h-auto ${SPACING.TEXT_PADDING_FULLSCREEN}`}`}>
      {/* Close Button - Top Right with Buggy Effect (only for non-submits in fullscreen) */}
      {!submitted && !isPreview && onClose && (
        <button
          onClick={(e) => {
            const button = e.currentTarget;
            const buggyInterval = setInterval(() => {
              const randomX = Math.random() * 10 - 5;
              const randomY = Math.random() * 10 - 5;
              const randomRotate = Math.random() * 10 - 5;
              button.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
            }, 50);

            setTimeout(() => {
              clearInterval(buggyInterval);
              onClose();
            }, 750);
          }}
          className="absolute top-4 right-4 md:top-6 md:right-6 p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#194D25] min-w-[44px] min-h-[44px] flex items-center justify-center group/close z-50 cursor-pointer"
          aria-label="Sluit en keer terug naar hoofdpagina"
          style={{ transition: 'transform 0.05s ease-out' }}
        >
          <X
            size={24}
            strokeWidth={1.5}
            className="text-[#194D25] group-hover/close:text-[#8B1A3D] transition-colors duration-200"
            aria-hidden="true"
          />
        </button>
      )}

      <div className={`${isPreview ? 'h-full flex flex-col justify-center' : 'max-w-3xl mx-auto'}`}>
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`flex flex-col ${isPreview ? 'gap-2' : `${SPACING.INPUT_GAP} mt-8 md:mt-16`}`}
          noValidate
          aria-label="Contactformulier"
        >
          {/* Submit Error Message */}
          {submitError && (
            <div
              className="p-4 border-2 font-mono text-sm mb-5"
              style={{
                backgroundColor: FORM_COLORS.ERROR_BG,
                borderColor: FORM_COLORS.ERROR_BORDER,
                color: FORM_COLORS.ERROR,
              }}
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
            >
              <span className="sr-only">Fout bij verzenden: </span>
              {submitError}
            </div>
          )}

          {/* Honeypot field - Hidden from users */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <input
              type="text"
              name="_website"
              value={formData._website}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Name and Email Row */}
          <div className={`grid grid-cols-1 md:grid-cols-2 ${SPACING.INPUT_GAP}`}>
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="font-mono text-xs uppercase tracking-widest"
                style={{ color: COLORS.PRIMARY_GREEN }}
              >
                Volledige naam <span style={{ color: FORM_COLORS.ERROR }} aria-label="verplicht veld">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                onKeyDown={handleInputKeyDown}
                aria-invalid={touched.name && !!errors.name}
                aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
                className={`w-full ${SPACING.INPUT_PADDING} border outline-none focus-visible:outline-none font-mono text-sm transition-all duration-300 ${isPreview ? 'min-h-[36px] py-1' : 'min-h-[44px]'} rounded-none hover:border-[#194D25] ${touched.name && errors.name
                  ? 'focus:bg-white'
                  : 'focus:bg-white'
                  }`}
                style={{
                  backgroundColor: touched.name && errors.name ? FORM_COLORS.ERROR_BG : FORM_COLORS.INPUT_BG,
                  borderColor: touched.name && errors.name ? FORM_COLORS.ERROR : FORM_COLORS.INPUT_BORDER,
                  color: FORM_COLORS.TEXT_PRIMARY,
                }}
                onFocus={(e) => {
                  if (!touched.name || !errors.name) {
                    e.currentTarget.style.borderColor = FORM_COLORS.INPUT_FOCUS;
                  }
                }}
                onBlur={(e) => {
                  handleBlur('name');
                  if (!touched.name || !errors.name) {
                    e.currentTarget.style.borderColor = FORM_COLORS.INPUT_BORDER;
                  }
                }}
              />
              {touched.name && errors.name && (
                <span
                  id="name-error"
                  className="text-xs font-mono"
                  style={{ color: FORM_COLORS.ERROR }}
                  role="alert"
                >
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="font-mono text-xs uppercase tracking-widest"
                style={{ color: COLORS.PRIMARY_GREEN }}
              >
                Emailadres <span style={{ color: FORM_COLORS.ERROR }} aria-label="verplicht veld">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                onKeyDown={handleInputKeyDown}
                aria-invalid={touched.email && !!errors.email}
                aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                className={`w-full ${SPACING.INPUT_PADDING} border outline-none focus-visible:outline-none font-mono text-sm transition-all duration-300 ${isPreview ? 'min-h-[36px] py-1' : 'min-h-[44px]'} rounded-none hover:border-[#194D25] ${touched.email && errors.email
                  ? 'focus:bg-white'
                  : 'focus:bg-white'
                  }`}
                style={{
                  backgroundColor: touched.email && errors.email ? FORM_COLORS.ERROR_BG : FORM_COLORS.INPUT_BG,
                  borderColor: touched.email && errors.email ? FORM_COLORS.ERROR : FORM_COLORS.INPUT_BORDER,
                  color: FORM_COLORS.TEXT_PRIMARY,
                }}
                onFocus={(e) => {
                  if (!touched.email || !errors.email) {
                    e.currentTarget.style.borderColor = FORM_COLORS.INPUT_FOCUS;
                  }
                }}
                onBlur={(e) => {
                  handleBlur('email');
                  if (!touched.email || !errors.email) {
                    e.currentTarget.style.borderColor = FORM_COLORS.INPUT_BORDER;
                  }
                }}
              />
              {touched.email && errors.email && (
                <span
                  id="email-error"
                  className="text-xs font-mono"
                  style={{ color: FORM_COLORS.ERROR }}
                  role="alert"
                >
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          {/* Organisation / Role (Optional) */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="organisation"
              className="font-mono text-xs uppercase tracking-widest"
              style={{ color: COLORS.PRIMARY_GREEN }}
            >
              Organisatie / Rol <span className="text-xs font-normal normal-case" style={{ color: FORM_COLORS.PLACEHOLDER }}>(optioneel)</span>
            </label>
            <input
              type="text"
              id="organisation"
              name="organisation"
              value={formData.organisation}
              onChange={handleChange}
              onKeyDown={handleInputKeyDown}
              className={`w-full ${SPACING.INPUT_PADDING} border outline-none focus-visible:outline-none font-mono text-sm transition-all duration-300 ${isPreview ? 'min-h-[36px] py-1' : 'min-h-[44px]'} rounded-none focus:bg-white hover:border-[#194D25]`}
              style={{
                backgroundColor: FORM_COLORS.INPUT_BG,
                borderColor: FORM_COLORS.INPUT_BORDER,
                color: FORM_COLORS.TEXT_PRIMARY,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = FORM_COLORS.INPUT_FOCUS;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = FORM_COLORS.INPUT_BORDER;
              }}
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="message"
              className="font-mono text-xs uppercase tracking-widest"
              style={{ color: COLORS.PRIMARY_GREEN }}
            >
              Bericht <span style={{ color: FORM_COLORS.ERROR }} aria-label="verplicht veld">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              onKeyDown={handleInputKeyDown}
              aria-invalid={touched.message && !!errors.message}
              aria-describedby={touched.message && errors.message ? 'message-error' : undefined}
              rows={isPreview ? 3 : 6}
              className={`w-full ${SPACING.INPUT_PADDING} border outline-none focus-visible:outline-none font-mono text-sm transition-all duration-300 resize-none ${isPreview ? 'min-h-[60px] py-1' : 'min-h-[120px]'} rounded-none hover:border-[#194D25] ${touched.message && errors.message
                ? 'focus:bg-white'
                : 'focus:bg-white'
                }`}
              style={{
                backgroundColor: touched.message && errors.message ? FORM_COLORS.ERROR_BG : FORM_COLORS.INPUT_BG,
                borderColor: touched.message && errors.message ? FORM_COLORS.ERROR : FORM_COLORS.INPUT_BORDER,
                color: FORM_COLORS.TEXT_PRIMARY,
              }}
              onFocus={(e) => {
                if (!touched.message || !errors.message) {
                  e.currentTarget.style.borderColor = FORM_COLORS.INPUT_FOCUS;
                }
              }}
              onBlur={(e) => {
                handleBlur('message');
                if (!touched.message || !errors.message) {
                  e.currentTarget.style.borderColor = FORM_COLORS.INPUT_BORDER;
                }
              }}
            />
            {touched.message && errors.message && (
              <span
                id="message-error"
                className="text-xs font-mono"
                style={{ color: FORM_COLORS.ERROR }}
                role="alert"
              >
                {errors.message}
              </span>
            )}
          </div>

          {/* Newsletter Checkbox (Optional) */}
          <div className="flex items-start gap-3 pt-2">
            <input
              type="checkbox"
              id="newsletter"
              name="newsletter"
              checked={formData.newsletter}
              onChange={handleChange}
              className="mt-1 w-4 h-4 cursor-pointer transition-all duration-200 checkbox-custom"
              style={{
                accentColor: COLORS.HIGHLIGHT_GREEN,
                backgroundColor: formData.newsletter ? COLORS.HIGHLIGHT_GREEN : 'transparent',
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 2px ${FORM_COLORS.INPUT_FOCUS}20`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = '';
              }}
              aria-describedby="newsletter-description"
            />
            <label
              htmlFor="newsletter"
              className={`font-mono cursor-pointer flex-1 ${isPreview ? 'text-[11.7px]' : 'text-xs'}`}
              style={{ color: FORM_COLORS.TEXT_SECONDARY }}
            >
              <span id="newsletter-description">
                Ik wil op de hoogte blijven van Moral Knight updates en nieuws over verantwoorde AI
              </span>
            </label>
          </div>

          {/* Privacy Consent Checkbox (Required) */}
          <div className="flex items-start gap-3 pt-2">
            <input
              type="checkbox"
              id="privacyConsent"
              name="privacyConsent"
              required
              checked={formData.privacyConsent}
              onChange={handleChange}
              aria-invalid={touched.privacyConsent && !!errors.privacyConsent}
              aria-describedby={touched.privacyConsent && errors.privacyConsent ? 'privacy-error' : 'privacy-description'}
              className={`mt-1 w-4 h-4 cursor-pointer transition-all duration-200 ${touched.privacyConsent && errors.privacyConsent ? 'checkbox-custom-error' : 'checkbox-custom'
                }`}
              style={{
                accentColor: COLORS.HIGHLIGHT_GREEN,
                backgroundColor: formData.privacyConsent ? COLORS.HIGHLIGHT_GREEN : 'transparent',
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 2px ${FORM_COLORS.INPUT_FOCUS}20`;
              }}
              onBlur={(e) => {
                handleBlur('privacyConsent');
                e.currentTarget.style.boxShadow = '';
              }}
            />
            <label
              htmlFor="privacyConsent"
              className={`font-mono cursor-pointer flex-1 ${isPreview ? 'text-[11.7px]' : 'text-xs'}`}
              style={{ color: FORM_COLORS.TEXT_SECONDARY }}
            >
              <span id="privacy-description">
                Ik geef Moral Knight toestemming om mijn gegevens te verwerken conform de{' '}
                <button
                  type="button"
                  onClick={() => window.location.href = '/privacy'}
                  className="inline underline bg-transparent border-none p-0 cursor-pointer transition-colors duration-300 hover:text-[#8B1A3D]"
                  style={{ pointerEvents: 'auto', position: 'relative' }}
                >
                  privacyverklaring
                </button> . <span style={{ color: FORM_COLORS.ERROR }} aria-label="verplicht veld">*</span>
              </span>
            </label>
          </div>
          {touched.privacyConsent && errors.privacyConsent && (
            <span
              id="privacy-error"
              className="text-xs font-mono -mt-2 ml-7"
              style={{ color: FORM_COLORS.ERROR }}
              role="alert"
            >
              {errors.privacyConsent}
            </span>
          )}

          {/* Submit Button */}
          <div className={`flex flex-col gap-4 ${isPreview ? 'pt-4' : 'pt-6'}`}>
            <div className={`flex justify-end`}>
              <button
                type="submit"
                disabled={isSubmitting || !formData.privacyConsent}
                className={`group relative px-8 ${isPreview ? 'py-2' : 'py-3'} border-2 font-mono text-xs uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 ${isPreview ? 'min-h-[36px]' : 'min-h-[44px]'} hover:bg-accent-light`}
                style={{
                  backgroundColor: isSubmitting ? FORM_COLORS.INPUT_BG : COLORS.HIGHLIGHT_GREEN,
                  borderColor: COLORS.PRIMARY_GREEN,
                  color: isSubmitting ? FORM_COLORS.TEXT_PRIMARY : COLORS.PRIMARY_GREEN,
                  '--tw-outline-color': COLORS.PRIMARY_GREEN,
                } as React.CSSProperties & { '--tw-outline-color': string }}
                aria-label={isSubmitting ? 'Bericht wordt verzonden...' : 'Verstuur contactformulier'}
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isSubmitting ? 'Verzenden...' : 'Versturen'}
                  {!isSubmitting && (
                    <Send
                      size={14}
                      style={{ color: COLORS.PRIMARY_GREEN }}
                      aria-hidden="true"
                    />
                  )}
                </span>
              </button>
            </div>


          </div>
        </form>
      </div>
    </div>
  );
};
