import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../hooks/useT';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3002' : '');

const FALLBACK = [
    {
        id: 'f1',
        name: 'אמא ממחלקת ילדים',
        message: 'הבן שלי היה מאושפז שבועיים. ביום שהגיעו עם המשחק והספר — זו הייתה הפעם הראשונה שהוא חייך מאז שהגענו.',
        hospital: 'בית חולים שניידר',
    },
    {
        id: 'f2',
        name: 'אבא ממחלקה כירורגית',
        message: 'אתם לא מבינים מה עשיתם לנו. ילדה בת 6 שבכתה כל הלילה — פתאום שכחה שהיא בבית חולים בגלל משחק קופסה.',
        hospital: 'בית חולים וולפסון',
    },
    {
        id: 'f3',
        name: 'אחות בכירה',
        message: 'אני כבר 15 שנה במקצוע. מעט מאוד אנשים באים ופשוט מחלקים אהבה בלי לבקש כלום בחזרה. תודה.',
        hospital: 'בית חולים רמב"ם',
    },
];

export default function Testimonials() {
    const [items, setItems] = useState(FALLBACK);
    const t = useT();

    useEffect(() => {
        fetch(`${API_BASE}/api/thank-you?limit=3`)
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data && Array.isArray(data) && data.length > 0) {
                    setItems(data);
                }
            })
            .catch(() => {});
    }, []);

    return (
        <section style={s.section}>
            <div style={s.inner}>
                <h2 style={s.title}>
                    <span>💬</span>
                    {t('testimonials_title')}
                </h2>
                <p style={s.subtitle}>{t('testimonials_subtitle')}</p>

                <div style={s.grid}>
                    {items.slice(0, 3).map((t) => (
                        <div key={t.id} style={s.card}>
                            <div style={s.quoteIcon}>&ldquo;</div>
                            <p style={s.text}>{t.message || t.text}</p>
                            <div style={s.footer}>
                                <div style={s.avatar}>
                                    {(t.name || '?').charAt(0)}
                                </div>
                                <div>
                                    <strong style={s.name}>{t.name}</strong>
                                    {t.hospital && <span style={s.hospital}>{t.hospital}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={s.ctas}>
                    <Link to="/thank-you" style={s.ctaPrimary}>{t('testimonials_more')}</Link>
                    <Link to="/thank-you#write" style={s.ctaSecondary}>{t('testimonials_write')}</Link>
                </div>
            </div>
        </section>
    );
}

const s = {
    section: {
        background: 'var(--bg-warm)',
        fontFamily: "'Heebo', sans-serif",
        direction: 'rtl',
        padding: '80px 20px',
    },
    inner: {
        maxWidth: '1000px',
        margin: '0 auto',
        textAlign: 'center',
    },
    title: {
        fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
        fontWeight: 800,
        color: 'var(--royal)',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
    },
    subtitle: {
        color: 'var(--text-muted)',
        fontSize: '1.05rem',
        marginBottom: '40px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        textAlign: 'right',
    },
    card: {
        background: 'var(--bg-card)',
        borderRadius: '20px',
        padding: '32px 28px',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid rgba(15,32,68,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
    },
    quoteIcon: {
        fontSize: '3rem',
        color: 'var(--royal-pale)',
        fontFamily: 'serif',
        lineHeight: 1,
        position: 'absolute',
        top: '16px',
        right: '20px',
        opacity: 0.6,
    },
    text: {
        color: 'var(--text-soft)',
        fontSize: '0.95rem',
        lineHeight: 1.7,
        margin: 0,
        paddingTop: '16px',
        flex: 1,
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(15,32,68,0.06)',
    },
    avatar: {
        width: '42px',
        height: '42px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, var(--royal), var(--royal-light))',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: '1.1rem',
        flexShrink: 0,
    },
    name: {
        display: 'block',
        color: 'var(--text)',
        fontSize: '0.92rem',
        fontWeight: 700,
    },
    hospital: {
        display: 'block',
        color: 'var(--text-muted)',
        fontSize: '0.82rem',
    },
    ctas: {
        marginTop: '40px',
        display: 'flex',
        gap: '14px',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    ctaPrimary: {
        background: 'linear-gradient(135deg, #0f2044, #1a3460)',
        color: '#fff',
        textDecoration: 'none',
        padding: '12px 30px',
        borderRadius: '12px',
        fontWeight: 700,
        fontSize: '0.95rem',
    },
    ctaSecondary: {
        background: 'var(--royal-pale)',
        color: 'var(--royal)',
        textDecoration: 'none',
        padding: '12px 30px',
        borderRadius: '12px',
        fontWeight: 700,
        fontSize: '0.95rem',
    },
};
