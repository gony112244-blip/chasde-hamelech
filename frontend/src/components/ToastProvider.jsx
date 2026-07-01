import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

function ToastContainer({ toasts, removeToast }) {
    if (toasts.length === 0) return null;

    return createPortal(
        <div style={s.container} role="status" aria-live="polite">
            {toasts.map((toast) => (
                <div key={toast.id} style={{ ...s.toast, background: bgColors[toast.type] }}>
                    <span style={s.icon}>{icons[toast.type]}</span>
                    <span style={s.message}>{toast.message}</span>
                    <button
                        style={s.close}
                        onClick={() => removeToast(toast.id)}
                        aria-label="סגור הודעה"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>,
        document.body
    );
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, [removeToast]);

    const success = useCallback((msg) => showToast(msg, 'success'), [showToast]);
    const error = useCallback((msg) => showToast(msg, 'error'), [showToast]);
    const info = useCallback((msg) => showToast(msg, 'info'), [showToast]);
    const warning = useCallback((msg) => showToast(msg, 'warning'), [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

const bgColors = {
    success: 'linear-gradient(135deg, #10b981, #059669)',
    error:   'linear-gradient(135deg, #ef4444, #dc2626)',
    warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
    info:    'linear-gradient(135deg, #0f2044, #1a3460)',
};

const icons = {
    success: '✅',
    error:   '❌',
    warning: '⚠️',
    info:    'ℹ️',
};

const s = {
    container: {
        position: 'fixed',
        top: 'max(80px, env(safe-area-inset-top))',
        left: 'max(20px, env(safe-area-inset-left))',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '400px',
    },
    toast: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '15px 20px',
        borderRadius: '14px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        animation: 'slideInLeft 0.3s ease-out',
        direction: 'inherit',
        fontFamily: "'Heebo', sans-serif",
        color: '#fff',
    },
    icon: {
        fontSize: '1.2rem',
        flexShrink: 0,
    },
    message: {
        flex: 1,
        fontWeight: 500,
        fontSize: '0.95rem',
    },
    close: {
        background: 'rgba(255,255,255,0.2)',
        border: 'none',
        color: '#fff',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'background 0.2s',
    },
};

export default ToastProvider;
