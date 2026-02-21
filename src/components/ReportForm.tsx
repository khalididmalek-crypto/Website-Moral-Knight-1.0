/**
 * ReportForm Component
 * 
 * Form for reporting AI malpractices (meldpunt).
 */
import React, { useState, useCallback, useEffect } from 'react';
import { Send } from 'lucide-react';
import Link from 'next/link';
import { COLORS, FORM_COLORS } from '../constants';

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
    newsletter: boolean;
    file: File | null;
    botcheck: string; // Honeypot
    isAnonymous: boolean;
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

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};
export const ReportForm: React.FC<Props> = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        organisation: '',
        aiSystem: '',
        description: '',
        privacyConsent: false,
        newsletter: false,
        file: null,
        botcheck: '',
        isAnonymous: false,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [reportId, setReportId] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Persistence: Restore form data from session storage on mount
    useEffect(() => {
        const savedData = sessionStorage.getItem('report_form_data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setFormData((prev) => ({ ...prev, ...parsed, file: null }));
            } catch (e) {
                console.error('Failed to parse saved report form data', e);
            }
        }
    }, []);

    // Persistence: Save form data to session storage on change
    useEffect(() => {
        // Only save essential data, exclude transient state and non-serializable file object
        const { botcheck, file, ...saveData } = formData;
        sessionStorage.setItem('report_form_data', JSON.stringify(saveData));
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

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (file && file.size > 3 * 1024 * 1024) {
            alert('Bestand is te groot. Selecteer een bestand van maximaal 3MB.');
            e.target.value = '';
            setFormData((prev) => ({ ...prev, file: null }));
            return;
        }

        setFormData((prev) => ({ ...prev, file }));
    }, []);

    const handleBlur = (field: string) => {
        setTouched({ ...touched, [field]: true });
        validateField(field, formData[field as keyof FormData]);
    };

    const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === ' ') {
            e.stopPropagation();
        }
    }, []);

    const validateField = (field: string, value: any): string | undefined => {
        if (formData.isAnonymous && (field === 'name' || field === 'email')) {
            return undefined;
        }

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
                if ((value as string).trim().length < 2) return 'Omschrijving is te kort';
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

            let fileData = null;
            if (formData.file) {
                try {
                    fileData = await fileToBase64(formData.file);
                } catch (e) {
                    console.error('Error converting file to base64', e);
                    throw new Error('Fout bij het verwerken van het bestand');
                }
            }

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    file: fileData,
                    fileName: formData.file?.name,
                    formType: 'report'
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Er is een fout opgetreden bij de server');
            }

            console.log('[ReportForm] Report success:', data);

            sessionStorage.removeItem('report_form_data');

            if (data.reportId) setReportId(data.reportId);
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
        setReportId(null);
        setFormData({
            name: '',
            email: '',
            organisation: '',
            aiSystem: '',
            description: '',
            privacyConsent: false,
            newsletter: false,
            file: null,
            botcheck: '',
            isAnonymous: false,
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
                <div className="mb-8 p-4 border border-dashed border-gray-300 font-mono text-xs">
                    <p className="mb-2 opacity-60 uppercase">Uw Kenmerk:</p>
                    <p className="text-xl font-bold tracking-widest" style={{ color: '#8B1A3D' }}>{reportId || 'MK-2025-XXXX'}</p>
                </div>
                <p className="font-mono text-sm leading-relaxed max-w-md mb-12" style={{ color: FORM_COLORS.TEXT_SECONDARY }}>
                    Bedankt voor uw melding. {formData.isAnonymous ? 'Omdat u anoniem meldt, slaan wij geen contactgegevens op en ontvangt u géén e-mailbevestiging.' : `Wij hebben een bevestiging gestuurd naar ${formData.email}.`}
                    <br /><br />
                    Sla uw kenmerk goed op, dit is uw enige referentie voor deze melding. Wij zullen deze misstand onafhankelijk onderzoeken.
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
            <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true">
                <input
                    type="text"
                    name="botcheck"
                    value={formData.botcheck}
                    onChange={handleChange}
                    autoComplete="none"
                    tabIndex={-1}
                />
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center justify-between p-3.5 border border-dashed transition-all duration-300 mb-2"
                style={{
                    backgroundColor: formData.isAnonymous ? '#FDF5F7' : '#F7F7F7',
                    borderColor: formData.isAnonymous ? '#8B1A3D' : FORM_COLORS.INPUT_BORDER
                }}>
                <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[10px] md:text-xs font-semibold uppercase tracking-widest transition-colors duration-300" style={{ color: formData.isAnonymous ? '#8B1A3D' : FORM_COLORS.TEXT_SECONDARY }}>
                        Anoniem Melden
                    </span>
                    <span className="font-mono text-[9px] md:text-[10px] opacity-60">
                        Geen persoonsgegevens / Geen e-mailbevestiging
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isAnonymous: !prev.isAnonymous }))}
                    className="w-10 h-5 flex items-center p-[2px] transition-all duration-300"
                    style={{
                        backgroundColor: formData.isAnonymous ? '#8B1A3D' : '#E5E5E5',
                        borderRadius: 0,
                        border: `1px solid ${formData.isAnonymous ? '#8B1A3D' : '#CCC'}`
                    }}
                >
                    <div className={`w-3.5 h-3.5 transition-transform duration-300`}
                        style={{
                            backgroundColor: 'white',
                            transform: formData.isAnonymous ? 'translateX(18px)' : 'translateX(0)',
                            border: `1px solid ${formData.isAnonymous ? '#8B1A3D' : '#CCC'}`
                        }}
                    />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 overflow-hidden" style={{ maxHeight: formData.isAnonymous ? '0' : '200px', opacity: formData.isAnonymous ? 0 : 1, pointerEvents: formData.isAnonymous ? 'none' : 'auto' }}>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="font-mono text-[10px] md:text-xs uppercase tracking-widest" style={{ color: COLORS.PRIMARY_GREEN }}>
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
                        className="w-full p-3 border outline-none font-mono text-[11px] md:text-sm bg-[#F7F7F7] focus:bg-white transition-all"
                        style={{ borderColor: touched.name && errors.name ? FORM_COLORS.ERROR : FORM_COLORS.INPUT_BORDER }}
                    />
                    {touched.name && errors.name && <span className="text-xs font-mono" style={{ color: FORM_COLORS.ERROR }}>{errors.name}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="font-mono text-[10px] md:text-xs uppercase tracking-widest" style={{ color: COLORS.PRIMARY_GREEN }}>
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
                        className="w-full p-3 border outline-none font-mono text-[11px] md:text-sm bg-[#F7F7F7] focus:bg-white transition-all"
                        style={{ borderColor: touched.email && errors.email ? FORM_COLORS.ERROR : FORM_COLORS.INPUT_BORDER }}
                    />
                    {touched.email && errors.email && <span className="text-xs font-mono" style={{ color: FORM_COLORS.ERROR }}>{errors.email}</span>}
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="aiSystem" className="font-mono text-[10px] md:text-xs uppercase tracking-widest" style={{ color: COLORS.PRIMARY_GREEN }}>
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
                    className="w-full p-3 border outline-none font-mono text-[11px] md:text-sm bg-[#F7F7F7] focus:bg-white transition-all"
                    style={{ borderColor: touched.aiSystem && errors.aiSystem ? FORM_COLORS.ERROR : FORM_COLORS.INPUT_BORDER }}
                    placeholder="Bv. Gemeente X of Systeem Y"
                />
                {touched.aiSystem && errors.aiSystem && <span className="text-xs font-mono" style={{ color: FORM_COLORS.ERROR }}>{errors.aiSystem}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="description" className="font-mono text-[10px] md:text-xs uppercase tracking-widest" style={{ color: COLORS.PRIMARY_GREEN }}>
                    Omschrijving van de misstand <span style={{ color: FORM_COLORS.ERROR }}>*</span>
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    onKeyDown={handleInputKeyDown}
                    onBlur={() => handleBlur('description')}
                    rows={4}
                    className="w-full p-3 border outline-none font-mono text-[11px] md:text-sm bg-[#F7F7F7] focus:bg-white transition-all resize-none"
                    style={{ borderColor: touched.description && errors.description ? FORM_COLORS.ERROR : FORM_COLORS.INPUT_BORDER }}
                    placeholder="Wat is het probleem?"
                />
                {touched.description && errors.description && <span className="text-xs font-mono" style={{ color: FORM_COLORS.ERROR }}>{errors.description}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="file" className="font-mono text-[10px] md:text-xs uppercase tracking-widest" style={{ color: COLORS.PRIMARY_GREEN }}>
                    Documentatie uploaden <span className="text-xs font-normal normal-case" style={{ color: FORM_COLORS.PLACEHOLDER }}>(max 3MB) (optioneel)</span>
                </label>
                <div className="relative">
                    <input
                        type="file"
                        id="file"
                        name="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <label
                        htmlFor="file"
                        className="flex items-center justify-between p-3 border border-dashed cursor-pointer font-mono text-[11px] bg-[#F7F7F7] hover:bg-white transition-all rounded-none"
                        style={{ borderColor: FORM_COLORS.INPUT_BORDER }}
                    >
                        <span className="truncate opacity-70">
                            {formData.file ? formData.file.name : 'Selecteer bestand (.jpg, .png, .pdf)'}
                        </span>
                        <span className="ml-2 flex-shrink-0 uppercase tracking-widest opacity-60 border-l border-gray-300 pl-3">
                            Upload
                        </span>
                    </label>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    id="newsletter"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    className="mt-1.5 w-4 h-4 cursor-pointer transition-all duration-200"
                />
                <label htmlFor="newsletter" className="font-mono text-[12px] md:text-sm text-gray-600 cursor-pointer leading-relaxed flex-1">
                    Ik wil op de hoogte blijven van Moral Knight updates en nieuws.
                </label>
            </div>

            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    id="privacyConsent"
                    name="privacyConsent"
                    checked={formData.privacyConsent}
                    onChange={handleChange}
                    onBlur={() => handleBlur('privacyConsent')}
                    className="mt-1.5 w-4 h-4 cursor-pointer transition-all duration-200"
                />
                <label htmlFor="privacyConsent" className="font-mono text-[12px] md:text-sm text-gray-600 cursor-pointer leading-relaxed flex-1">
                    Ik geef Moral Knight toestemming om mijn gegevens te verwerken conform de <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#8B1A3D] transition-colors duration-300">privacyverklaring</Link> en begrijp dat meldingen geanonimiseerd gerapporteerd kunnen worden aan instanties. <span style={{ color: FORM_COLORS.ERROR }}>*</span>
                </label>
            </div>
            {touched.privacyConsent && errors.privacyConsent && <span className="text-xs font-mono -mt-4 ml-7" style={{ color: FORM_COLORS.ERROR }}>{errors.privacyConsent}</span>}

            <div className="flex flex-col gap-4 pt-4">
                <div className="flex justify-end w-full">
                    <button
                        type="submit"
                        disabled={isSubmitting || !formData.privacyConsent}
                        className={`
                            w-full md:w-auto md:min-w-[240px]
                            px-5 md:px-8
                            py-1 md:py-3
                            min-h-[32px] md:min-h-[48px]
                            border-2 font-mono text-[10px] md:text-xs uppercase tracking-widest
                            flex items-center justify-center
                            rounded-none appearance-none
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-colors duration-300
                        `}
                        style={{
                            backgroundColor: !formData.privacyConsent
                                ? '#E5E7EB'
                                : COLORS.HIGHLIGHT_GREEN,
                            borderColor: !formData.privacyConsent
                                ? '#D1D5DB'
                                : formData.isAnonymous
                                    ? '#8B1A3D'
                                    : COLORS.PRIMARY_GREEN,
                            color: !formData.privacyConsent
                                ? '#9CA3AF'
                                : COLORS.PRIMARY_GREEN,
                        }}
                    >
                        <span className="flex items-center gap-3">
                            {isSubmitting ? 'Verzenden...' : 'Melding Versturen'}
                            <Send
                                size={14}
                                className={isSubmitting ? 'opacity-0 w-0' : 'opacity-100'}
                                style={{ color: 'inherit' }}
                            />
                        </span>
                    </button>
                </div>
            </div>
        </form>
    );
};
