import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();
    const [show, setShow] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [pathname]);

    useEffect(() => {
        function onScroll() { setShow(window.scrollY > 400); }
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!show) return null;

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="חזור למעלה"
            style={{
                position: 'fixed',
                bottom: 'max(28px, env(safe-area-inset-bottom))',
                left: 'max(20px, env(safe-area-inset-left))',
                zIndex: 1200,
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0f2044, #1a3460)',
                color: '#fbbf24',
                border: '2px solid rgba(251,191,36,0.4)',
                fontSize: '1.4rem',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s',
            }}
        >
            ↑
        </button>
    );
}
