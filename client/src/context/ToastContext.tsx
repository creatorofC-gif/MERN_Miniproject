import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastMessage[];
  toast: {
    success: (message: string, title?: string, duration?: number) => void;
    info: (message: string, title?: string, duration?: number) => void;
    warning: (message: string, title?: string, duration?: number) => void;
    error: (message: string, title?: string, duration?: number) => void;
    dismiss: (id: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string, title?: string, duration = 4000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newToast: ToastMessage = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  const toastMethods = {
    success: (msg: string, title?: string, duration?: number) => addToast('success', msg, title, duration),
    info: (msg: string, title?: string, duration?: number) => addToast('info', msg, title, duration),
    warning: (msg: string, title?: string, duration?: number) => addToast('warning', msg, title, duration),
    error: (msg: string, title?: string, duration?: number) => addToast('error', msg, title, duration),
    dismiss,
  };

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-[#0057BE] shrink-0" />;
    }
  };

  const getToastBorder = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-l-[#10B981] border-gray-200';
      case 'error':
        return 'border-l-4 border-l-[#EF4444] border-gray-200';
      case 'warning':
        return 'border-l-4 border-l-[#F59E0B] border-gray-200';
      case 'info':
      default:
        return 'border-l-4 border-l-[#0057BE] border-gray-200';
    }
  };

  return (
    <ToastContext.Provider value={{ toasts, toast: toastMethods }}>
      {children}

      {/* Floating Toasts Viewport */}
      <div
        aria-live="polite"
        className="fixed top-5 right-5 z-[99999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={`pointer-events-auto bg-white rounded-xl shadow-lg border p-3.5 transition-all duration-300 transform translate-y-0 opacity-100 flex items-start gap-3 backdrop-blur-md ${getToastBorder(
              t.type
            )} animate-in fade-in slide-in-from-top-3`}
          >
            <div className="pt-0.5">{getToastIcon(t.type)}</div>
            <div className="flex-1 min-w-0">
              {t.title && (
                <h4 className="text-xs font-bold text-[#151C2F] leading-tight mb-0.5 tracking-tight">
                  {t.title}
                </h4>
              )}
              <p className="text-xs font-medium text-[#475467] leading-relaxed break-words">
                {t.message}
              </p>
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-[#98A2B3] hover:text-[#151C2F] p-0.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
