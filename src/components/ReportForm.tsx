/**
 * ReportForm Component
 * 
 * Form for reporting AI malpractices (meldpunt).
 */
import React, { useState, useCallback } from 'react';
import { Send } from 'lucide-react';
import { COLORS, FORM_COLORS } from '../constants';
import Link from 'next/link';

interface Props {
    mode?: 'preview' | 'fullscreen';
    onClose?: () => void;
}

interface FormData {
    name: string;
    email: string;
    organisation: string;
    aiSystem: string;
    description: string;
    privacyConsent: boolean;
    _website: string; // Honeypot
}

interface FormErrors {
    name?: string;
    email?: string;
    aiSystem?: string;
    description?: string;
    privacyConsent?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email.trim());
};

export const ReportForm: React.FC<Props> = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        organisation: '',
        aiSystem: '',
        description: '',
        privacyConsent: false,
        _website: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        setErrors((prev) => {
            if (prev[name as keyof FormErrors]) {
                const newErrors = { ...prev };
                delete newErrors[name as keyof FormErrors];
                return newErrors;
            }
            return prev;
        });

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
                if (!(value as string).trim()) return 'Naam is verplicht';
                break;
            case 'email':
                if (!(value as string).trim()) return 'Email is verplicht';
                if (!validateEmail(value as string)) return 'Voer een geldig emailadres in';
                break;
            case 'aiSystem':
                if (!(value as string).trim()) return 'Publieke instantie of AI systeem is verplicht';
                break;
            case 'description':
                if (!(value as string).trim()) return 'Omschrijving is verplicht';
                if ((value as string).trim().length < 10) return 'Omschrijving moet minimaal 10 tekens bevatten';
                break;
            case 'privacyConsent':
                if (!(value as boolean)) return 'U moet akkoord gaan met de privacyverklaring';
                break;
        }
        return undefined;
    };

    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};
        const nameError = validateField('name', formData.name);
        if (nameError) newErrors.name = nameError;
        const emailError = validateField('email', formData.email);
        if (emailError) newErrors.email = emailError;
        const aiError = validateField('aiSystem', formData.aiSystem);
        if (aiError) newErrors.aiSystem = aiError;
        const descError = validateField('description', formData.description);
        if (descError) newErrors.description = descError;
        const privacyError = validateField('privacyConsent', formData.privacyConsent);
        if (privacyError) newErrors.privacyConsent = privacyError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            setTouched({
                name: true,
                email: true,
                aiSystem: true,
                description: true,
                privacyConsent: true,
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            console.log('[ReportForm] Submitting report...');
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, formType: 'report' }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Er is een fout opgetreden bij de server');
            }

            console.log('[ReportForm] Report success:', data);
            setSubmitted(true);
            setIsSubmitting(false);
        } catch (error) {
            console.error('[ReportForm] Submission error:', error);
            setIsSubmitting(false);
            const errorMessage = error instanceof Error ? error.message : 'Er ging iets mis, probeer het later nogmaals';
            setSubmitError(errorMessage);
            alert(`Fout bij verzenden: ${errorMessage}`);
        }
    }, [formData, validateForm]);

    const handleReset = useCallback(() => {
        setSubmitted(false);
        setFormData({
            name: '',
            email: '',
            organisation: '',
            aiSystem: '',
            description: '',
            privacyConsent: false,
            _website: '',
        });
        setErrors({});
        setTouched({});
        setSubmitError(null);
    }, []);

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-12">
                <Send size={29} strokeWidth={1.2} style={{ color: FORM_COLORS.SUCCESS_ICON }} className="mb-8" />
                <div className="inline-block border border-black px-5 py-2.5 mb-8 bg-white">
                    <h2 className="font-mono text-[15px] font-semibold uppercase tracking-[0.2em] m-0" style={{ color: COLORS.PRIMARY_GREEN }}>
                        MELDING ONTVANGEN
                    </h2>
                </div>
                <p className="font-mono text-sm leading-relaxed max-w-md mb-12" style={{ color: FORM_COLORS.TEXT_SECONDARY }}>
                    Bedankt voor uw melding. Wij zullen deze misstand onderzoeken en indien nodig actie ondernemen.
                </p>
                <button
                    onClick={handleReset}
                    className="px-8 py-3 border border-black font-mono text-xs uppercase tracking-[0.2em] bg-white hover:bg-[#F7F7F7] transition-all"
                    style={{ color: COLORS.PRIMARY_GREEN }}
                >
                    NIEUWE MELDING
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8">
            {submitError && (
                <div className="p-4 border-2 font-mono text-sm mb-5" style={{ backgroundColor: FORM_COLORS.ERROR_BG, borderColor: FORM_COLORS.ERROR_BORDER, color: FORM_COLORS.ERROR }}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="font-mono text-xs uppercase tracking-widest" style={{ color: COLORS.PRIMARY_GREEN }}>
                        Naam <span style={{ color: FORM_COLORS.ERROR }}>*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onKeyDown={handleInputKeyDown}
                        onBlur={() => handleBlur('name')}
                        className="w-full p-3 border outline-none font-mono text-sm bg-[#F7F7F7] focus:bg-white transition-all"
                        style={{ borderColor: touched.name && errors.name ? FORM_COLORS.ERROR : FORM_COLORS.INPUT_BORDER }}
                    />
                    {touched.name && errors.name && <span className="text-xs font-mono" style={{ color: FORM_COLORS.ERROR }}>{errors.name}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="font-mono text-xs uppercase tracking-widest" style={{ color: COLORS.PRIMARY_GREEN }}>
                        Email <span style={{ color: FORM_COLORS.ERROR }}>*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onKeyDown={handleInputKeyDown}
                        onBlur={() => handleBlur('email')}
                        className="w-full p-3 border outline-none font-mono text-sm bg-[#F7F7F7] focus:bg-white transition-all"
                        style={{ borderColor: touched.email && errors.email ? FORM_COLORS.ERROR : FORM_COLORS.INPUT_BORDER }}
                    />
                    {touched.email && errors.email && <span className="text-xs font-mono" style={{ color: FORM_COLORS.ERROR }}>{errors.email}</span>}
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="aiSystem" className="font-mono text-xs uppercase tracking-widest" style={{ color: COLORS.PRIMARY_GREEN }}>
                    Publieke instantie / AI Systeem <span style={{ color: FORM_COLORS.ERROR }}>*</span>
                </label>
                <input
                    type="text"
                    id="aiSystem"
                    name="aiSystem"
                    value={formData.aiSystem}
                    onChange={handleChange}
                    onKeyDown={handleInputKeyDown}
                    onBlur={() => handleBlur('aiSystem')}
                    className="w-full p-3 border outline-none font-mono text-sm bg-[#F7F7F7] focus:bg-white transition-all"
                    style={{ borderColor: touched.aiSystem && errors.aiSystem ? FORM_COLORS.ERROR : FORM_COLORS.INPUT_BORDER }}
                    placeholder="Bijv. Gemeente X of Systeem Y"
                />
                {touched.aiSystem && errors.aiSystem && <span className="text-xs font-mono" style={{ color: FORM_COLORS.ERROR }}>{errors.aiSystem}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="description" className="font-mono text-xs uppercase tracking-widest" style={{ color: COLORS.PRIMARY_GREEN }}>
                    Omschrijving van de misstand <span style={{ color: FORM_COLORS.ERROR }}>*</span>
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    onKeyDown={handleInputKeyDown}
                    onBlur={() => handleBlur('description')}
                    rows={5}
                    className="w-full p-3 border outline-none font-mono text-sm bg-[#F7F7F7] focus:bg-white transition-all resize-none"
                    style={{ borderColor: touched.description && errors.description ? FORM_COLORS.ERROR : FORM_COLORS.INPUT_BORDER }}
                    placeholder="Beschrijf hoe de burger is benadeeld..."
                />
                {touched.description && errors.description && <span className="text-xs font-mono" style={{ color: FORM_COLORS.ERROR }}>{errors.description}</span>}
            </div>

            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    id="privacyConsent"
                    name="privacyConsent"
                    checked={formData.privacyConsent}
                    onChange={handleChange}
                    onBlur={() => handleBlur('privacyConsent')}
                    className="mt-1 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="privacyConsent" className="font-mono text-xs text-gray-600 cursor-pointer">
                    Ik geef Moral Knight toestemming om mijn gegevens te verwerken conform de{' '}
                    <Link href="/privacy" className="underline" style={{ color: COLORS.PRIMARY_GREEN }}>
                        privacyverklaring
                    </Link>{' '}
                    en begrijp dat meldingen geanonimiseerd gerapporteerd kunnen worden aan instanties. <span style={{ color: FORM_COLORS.ERROR }}>*</span>
                </label>
            </div>
            {touched.privacyConsent && errors.privacyConsent && <span className="text-xs font-mono -mt-4 ml-7" style={{ color: FORM_COLORS.ERROR }}>{errors.privacyConsent}</span>}

            <div className="flex flex-col gap-4 pt-4">
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || !formData.privacyConsent}
                        className="px-8 py-3 border-2 font-mono text-xs uppercase tracking-widest transition-all disabled:opacity-50"
                        style={{
                            backgroundColor: COLORS.HIGHLIGHT_GREEN,
                            borderColor: COLORS.PRIMARY_GREEN,
                            color: COLORS.PRIMARY_GREEN,
                        }}
                    >
                        {isSubmitting ? 'Verzenden...' : 'Melding Versturen'}
                    </button>
                </div>

                {/* Privacy Footer */}
                <div className="flex justify-center md:justify-end">
                    <Link
                        href="/privacy"
                        className="font-mono text-[9px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                        style={{ color: FORM_COLORS.TEXT_SECONDARY }}
                    >
                        / AVG COMPLIANT DATA PROCESSING — PRIVACY POLICY
                    </Link>
                </div>
            </div>
        </form>
    );
};
