import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../config';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (res.ok && data.token) {
                sessionStorage.setItem('adminToken', data.token);
                navigate('/admin/dashboard');
            } else {
                setError('סיסמה שגויה');
            }
        } catch {
            setError('שגיאת חיבור לשרת');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={s.page}>
            <div style={s.card}>
                <div style={s.iconWrap}>
                    <span style={s.icon}>🔐</span>
                </div>
                <h1 style={s.title}>כניסת מנהל</h1>
                <p style={s.subtitle}>חסדי המלך — מערכת ניהול</p>

                <form onSubmit={handleLogin} style={s.form}>
                    <input
                        type="password"
                        placeholder="סיסמה"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={s.input}
                        autoFocus
                        autoComplete="current-password"
                    />
                    {error && <p style={s.error}>{error}</p>}
                    <button type="submit" style={s.btn} disabled={loading}>
                        {loading ? 'מתחבר...' : 'כניסה'}
                    </button>
                </form>

                <button style={s.back} onClick={() => navigate('/')}>← חזרה לאתר</button>
            </div>
        </div>
    );
}

const s = {
    page: {
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #071530 0%, #0f2044 60%, #1a3460 100%)',
        fontFamily: "'Heebo', sans-serif", direction: 'rtl', padding: '20px',
    },
    card: {
        background: '#fff', borderRadius: '24px', padding: '48px 40px',
        width: '100%', maxWidth: '380px', textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
    },
    iconWrap: { marginBottom: '16px' },
    icon: { fontSize: '3rem' },
    title: { color: '#0f2044', fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px' },
    subtitle: { color: '#6478a8', fontSize: '0.9rem', marginBottom: '32px' },
    form: { display: 'flex', flexDirection: 'column', gap: '14px' },
    input: {
        padding: '14px 18px', borderRadius: '12px', border: '2px solid #dbeafe',
        fontSize: '1rem', fontFamily: "'Heebo', sans-serif", textAlign: 'center',
        outline: 'none', transition: 'border 0.2s',
    },
    error: { color: '#ef4444', fontSize: '0.88rem', margin: 0 },
    btn: {
        padding: '14px', background: '#0f2044', color: '#fff',
        border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700,
        cursor: 'pointer', fontFamily: "'Heebo', sans-serif",
        transition: 'background 0.2s',
    },
    back: {
        marginTop: '20px', background: 'none', border: 'none',
        color: '#6478a8', fontSize: '0.88rem', cursor: 'pointer',
        fontFamily: "'Heebo', sans-serif",
    },
};
