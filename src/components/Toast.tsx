/**
 * Toast Notification Component
 * 
 * Displays temporary notification messages for user feedback.
 * Supports success, error, and info variants.
 */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
    message: string;
    type: ToastType;
    duration?: number;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type,
    duration = 4000,
    onClose,
}) => {
    const [isExiting, setIsExiting] = useState(false);

    const handleClose = useCallback(() => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
        }, 300); // Match animation duration
    }, [onClose]);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, handleClose]);


    const typeStyles = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-500',
            text: 'text-green-900',
            icon: <CheckCircle size={20} className="text-green-500" />,
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-500',
            text: 'text-red-900',
            icon: <AlertCircle size={20} className="text-red-500" />,
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-500',
            text: 'text-blue-900',
            icon: <Info size={20} className="text-blue-500" />,
        },
    };

    const style = typeStyles[type];

    return (
        <div
            className={`
        fixed top-4 right-4 px-4 py-3 rounded-sm shadow-lg z-[300]
        ${style.bg} ${style.border} ${style.text}
        border-l-4 font-mono text-sm
        flex items-start gap-3 max-w-md
        ${isExiting ? 'toast-exit' : 'toast-enter'}
      `}
            role="alert"
            aria-live={type === 'error' ? 'assertive' : 'polite'}
        >
            {style.icon}
            <div className="flex-1 pr-2">{message}</div>
            <button
                onClick={handleClose}
                className="flex-shrink-0 p-1 hover:bg-black/5 rounded transition-colors"
                aria-label="Sluiten"
            >
                <X size={16} />
            </button>
        </div>
    );
};

// Toast Manager Hook
export const useToast = () => {
    const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const ToastContainer = useMemo(() => () => (
        <>
            {toasts.map((toast, index) => (
                <div key={toast.id} style={{ top: `${16 + index * 80}px`, position: 'fixed', right: '1rem', zIndex: 1000 }}>
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </>
    ), [toasts, removeToast]);

    return { showToast, ToastContainer };
};
