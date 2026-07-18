import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../hooks/useT';
import { useLang } from '../../contexts/LangContext';
import { translateBatch } from '../../hooks/useTranslate';
import API_BASE from '../../config';

const FALLBACK = [
    { id: 'f1', name: 'אמא ממחלקת ילדים', message: 'הבן שלי היה מאושפז שבועיים. ביום שהגיעו עם המשחק והספר — זו הייתה הפעם הראשונה שהוא חייך מאז שהגענו.', hospital: 'בית חולים שניידר' },
    { id: 'f2', name: 'אבא גאה', message: 'הבת שלי לא מפסיקה לספר על הספר שקיבלה. היא קוראת אותו כל ערב לפני השינה. תודה מעומק הלב.', hospital: 'בית חולים וולפסון' },
    { id: 'f3', name: 'אחות בכירה', message: 'אני עובדת 12 שנה במחלקת ילדים. אתם מהאנשים היחידים שמגיעים בקביעות ובאהבה אמיתית. הילדים מחכים לכם.', hospital: 'בית חולים רמב"ם' },
];

export default function Testimonials() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const t = useT();
    const { lang } = useLang();

    useEffect(() => {
        let active = true;
        fetch(`${API_BASE}/api/thank-you?limit=3`)
            .then(r => r.ok ? r.json() : null)
            .then(async (data) => {
                if (!active) return;
                let list = (data && Array.isArray(data) && data.length > 0)
                    ? data.slice(0, 3)
                    : FALLBACK;
                if (lang !== 'he' && list.length) {
                    try { list = await translateBatch(list, ['message', 'hospital'], lang); } catch (_) {}
                }
                if (active) setItems(list);
            })
            .catch(() => { if (active) setItems(FALLBACK); })
            .finally(() => active && setLoading(false));
        return () => { active = false; };
    }, [lang]);

    const hasItems = items.length > 0;

    return (
        <section style={s.section}>
            <div style={s.inner}>
                <h2 style={s.title}>
                    <span>💬</span>
                    {t('testimonials_title')}
                </h2>
                <p style={s.subtitle}>{t('testimonials_subtitle')}</p>

                {loading && <p style={s.stateMsg}>{t('loading')}</p>}

                {!loading && !hasItems && (
                    <p style={s.stateMsg}>{t('testimonials_empty')}</p>
                )}

                {!loading && hasItems && (
                    <div style={s.grid}>
                        {items.map((item) => (
                            <div key={item.id} style={s.card}>
                                <div style={s.quoteIcon}>&ldquo;</div>
                                <p style={s.text}>{item.message || item.text}</p>
                                <div style={s.footer}>
                                    <div style={s.avatar} aria-hidden="true">
                                        {(item.name || '?').charAt(0)}
                                    </div>
                                    <div>
                                        <strong style={s.name}>{item.name}</strong>
                                        {item.hospital && <span style={s.hospital}>{item.hospital}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

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
        direction: 'inherit',
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
    stateMsg: {
        color: 'var(--text-muted)',
        fontSize: '1rem',
        padding: '24px 0 8px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        textAlign: 'start',
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
