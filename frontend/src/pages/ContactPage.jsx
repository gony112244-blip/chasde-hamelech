import { useState } from 'react';
import PageMeta from '../components/PageMeta';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3002' : '');

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setSubmitted(true);
            } else {
                setError('שגיאה בשליחה. נסו שוב או פנו אלינו ישירות.');
            }
        } catch {
            setError('לא ניתן להתחבר לשרת. נסו שוב מאוחר יותר.');
        } finally {
            setSending(false);
        }
    };

    const updateField = (field, value) => setForm(f => ({ ...f, [field]: value }));

    if (submitted) {
        return (
            <div style={s.page}>
                <section style={s.header}>
                    <h1 style={s.title}>📩 צור קשר</h1>
                </section>
                <div style={s.successWrap}>
                    <div style={s.successCard}>
                        <span style={{ fontSize: '3rem' }}>✅</span>
                        <h2 style={{ color: 'var(--royal)', margin: 0 }}>ההודעה נשלחה!</h2>
                        <p style={{ color: 'var(--text-soft)', lineHeight: 1.7, margin: 0 }}>
                            תודה שפניתם אלינו. נחזור אליכם בהקדם האפשרי.
                        </p>
                        <a href="/" style={s.backBtn}>🏠 חזרה לדף הבית</a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={s.page}>
            <PageMeta title="צור קשר" description="יש לכם שאלה, הצעה או רצון לשתף פעולה? אנחנו כאן. כתבו לנו ונחזור אליכם בהקדם." path="/contact" />
            <section style={s.header}>
                <div style={s.headerOrb} />
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h1 style={s.title}>📩 צור קשר</h1>
                    <p style={s.subtitle}>
                        שאלות, רעיונות, או סתם רוצים לומר שלום?
                        <br />נשמח לשמוע מכם!
                    </p>
                </div>
            </section>

            <section style={s.contentSection}>
                <div style={s.layout}>
                    <form onSubmit={handleSubmit} style={s.formCard}>
                        <h3 style={s.formTitle}>שלחו לנו הודעה</h3>
                        <div style={s.field}>
                            <label style={s.label}>שם *</label>
                            <input style={s.input} required placeholder="השם שלכם"
                                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div style={s.row}>
                            <div style={s.field}>
                                <label style={s.label}>טלפון</label>
                                <input style={s.input} type="tel" placeholder="050-1234567"
                                    value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                            </div>
                            <div style={s.field}>
                                <label style={s.label}>אימייל</label>
                                <input style={s.input} type="email" placeholder="email@example.com"
                                    value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                            </div>
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>הודעה *</label>
                            <textarea style={s.textarea} rows={5} required placeholder="מה תרצו לספר לנו?"
                                value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                        </div>
                        {error && <p style={s.errorMsg}>{error}</p>}
                        <button type="submit" style={s.submitBtn} disabled={sending}>
                            {sending ? 'שולח...' : '📨 שלחו'}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}

const s = {
    page: { fontFamily: "'Heebo', sans-serif", direction: 'rtl' },
    header: {
        background: 'linear-gradient(165deg, #0f2044 0%, #1a3460 50%, #071530 100%)',
        padding: '60px 20px 50px', textAlign: 'center', position: 'relative', overflow: 'hidden',
    },
    headerOrb: {
        position: 'absolute', bottom: '-40%', right: '-5%', width: '250px', height: '250px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)',
    },
    title: { color: '#fbbf24', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 800, marginBottom: '12px' },
    subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.7 },
    contentSection: { padding: '40px 20px 60px', background: 'var(--bg-light)' },
    layout: {
        maxWidth: '600px', margin: '0 auto',
    },
    formCard: {
        background: 'var(--bg-card)', borderRadius: '20px', padding: '32px',
        boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', gap: '18px',
    },
    formTitle: { color: 'var(--royal)', fontSize: '1.2rem', fontWeight: 700, margin: 0 },
    row: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' },
    field: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { color: 'var(--text)', fontSize: '0.92rem', fontWeight: 600 },
    input: {
        width: '100%', padding: '13px 16px', borderRadius: '12px', border: '2px solid var(--royal-pale)',
        fontSize: '1rem', fontFamily: "'Heebo', sans-serif", direction: 'rtl', outline: 'none', boxSizing: 'border-box',
    },
    textarea: {
        width: '100%', padding: '13px 16px', borderRadius: '12px', border: '2px solid var(--royal-pale)',
        fontSize: '1rem', fontFamily: "'Heebo', sans-serif", direction: 'rtl', outline: 'none',
        resize: 'vertical', boxSizing: 'border-box',
    },
    submitBtn: {
        background: 'linear-gradient(135deg, #0f2044, #1a3460)', color: '#fff', border: 'none',
        padding: '16px', borderRadius: '14px', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer',
        opacity: 1, transition: 'opacity 0.2s', fontFamily: "'Heebo', sans-serif",
    },
    errorMsg: { color: '#dc2626', fontSize: '0.9rem', margin: 0, textAlign: 'center' },
    infoCard: {
        background: 'var(--bg-card)', borderRadius: '20px', padding: '32px',
        boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '20px',
    },
    infoTitle: { color: 'var(--royal)', fontSize: '1.15rem', fontWeight: 700, margin: 0 },
    infoItem: { display: 'flex', gap: '14px', alignItems: 'center' },
    infoIcon: { fontSize: '1.5rem', flexShrink: 0 },
    infoLabel: { display: 'block', color: 'var(--text)', fontSize: '0.92rem' },
    infoValue: { display: 'block', color: 'var(--text-muted)', fontSize: '0.88rem' },
    mapPlaceholder: {
        marginTop: '8px', background: 'var(--royal-pale)', borderRadius: '14px', padding: '28px',
        textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
    },
    mapText: { color: 'var(--royal)', fontSize: '0.95rem', fontWeight: 600 },
    successWrap: {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '50vh', padding: '40px 20px', background: 'var(--bg-light)',
    },
    successCard: {
        background: 'var(--bg-card)', borderRadius: '24px', padding: '48px 40px',
        textAlign: 'center', boxShadow: 'var(--shadow-md)', display: 'flex',
        flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '450px',
        animation: 'fadeInUp 0.5s ease-out',
    },
    backBtn: {
        marginTop: '8px', background: 'var(--royal-pale)', color: 'var(--royal)',
        textDecoration: 'none', padding: '12px 28px', borderRadius: '12px', fontWeight: 600,
    },
};
