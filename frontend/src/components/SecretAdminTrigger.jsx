import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SECRET = 'david';

export default function SecretAdminTrigger() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const buffer = useRef('');
    const timer = useRef(null);

    useEffect(() => {
        if (pathname.startsWith('/admin')) return;

        function onKey(e) {
            const ch = e.key?.toLowerCase();
            if (ch?.length !== 1) return;

            buffer.current += ch;
            if (buffer.current.length > SECRET.length) {
                buffer.current = buffer.current.slice(-SECRET.length);
            }

            clearTimeout(timer.current);
            timer.current = setTimeout(() => { buffer.current = ''; }, 1500);

            if (buffer.current === SECRET) {
                buffer.current = '';
                navigate('/admin');
            }
        }

        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('keydown', onKey);
            clearTimeout(timer.current);
        };
    }, [navigate, pathname]);

    return null;
}
