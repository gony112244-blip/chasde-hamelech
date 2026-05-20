import { useState } from 'react';

export default function VolunteerPage() {
    const [form, setForm] = useState({
        name: '', phone: '', email: '', city: '', hasCar: false, message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: שליחה ל-API
        setSubmitted(true);
    };

    const updateField = (field, value) => setForm(f => ({ ...f, [field]: value }));

    if (submitted) {
        return (
            <div style={s.page}>
                <section style={s.header}>
                    <h1 style={s.title}>🤝 הצטרפו כמתנדבים</h1>
                </section>
                <div style={s.successWrap}>
                    <div style={s.successCard}>
                        <span style={{ fontSize: '3rem' }}>🎉</span>
                        <h2 style={{ color: 'var(--royal)', margin: 0 }}>ברוכים הבאים למשפחה!</h2>
                        <p style={{ color: 'var(--text-soft)', lineHeight: 1.7, margin: 0 }}>
                            תודה שהצטרפתם! ניצור איתכם קשר בהקדם
                            <br />עם פרטים על הפעילות הקרובה.
                        </p>
                        <a href="/" style={s.backBtn}>🏠 חזרה לדף הבית</a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={s.page}>
            <section style={s.header}>
                <div style={s.headerOrb} />
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h1 style={s.title}>🤝 הצטרפו כמתנדבים</h1>
                    <p style={s.subtitle}>
                        גם שעה אחת בחודש יכולה לשנות את היום של ילד מאושפז.
                        <br />השאירו פרטים ונחזור אליכם!
                    </p>
                </div>
            </section>

            <section style={s.formSection}>
                <form onSubmit={handleSubmit} style={s.formCard}>
                    <div style={s.row}>
                        <div style={s.field}>
                            <label style={s.label}>שם מלא *</label>
                            <input style={s.input} required placeholder="ישראל ישראלי"
                                value={form.name} onChange={e => updateField('name', e.target.value)} />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>טלפון *</label>
                            <input style={s.input} required type="tel" placeholder="050-1234567"
                                value={form.phone} onChange={e => updateField('phone', e.target.value)} />
                        </div>
                    </div>

                    <div style={s.row}>
                        <div style={s.field}>
                            <label style={s.label}>אימייל</label>
                            <input style={s.input} type="email" placeholder="email@example.com"
                                value={form.email} onChange={e => updateField('email', e.target.value)} />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>עיר *</label>
                            <input style={s.input} required placeholder="תל אביב"
                                value={form.city} onChange={e => updateField('city', e.target.value)} />
                        </div>
                    </div>

                    <div style={s.checkboxWrap}>
                        <label style={s.checkboxLabel}>
                            <input type="checkbox" checked={form.hasCar}
                                onChange={e => updateField('hasCar', e.target.checked)}
                                style={s.checkbox} />
                            <span>🚗 יש לי רכב ואני יכול/ה להגיע לבתי חולים</span>
                        </label>
                    </div>

                    <div style={s.field}>
                        <label style={s.label}>הודעה (אופציונלי)</label>
                        <textarea style={s.textarea} rows={3} placeholder="ספרו לנו קצת על עצמכם..."
                            value={form.message} onChange={e => updateField('message', e.target.value)} />
                    </div>

                    <button type="submit" style={s.submitBtn}>📨 שלחו את הפרטים</button>
                    <p style={s.note}>* שדות חובה</p>
                </form>
            </section>
        </div>
    );
}

const s = {
    page: { fontFamily: "'Heebo', sans-serif", direction: 'rtl' },
    header: {
        background: 'linear-gradient(165deg, #4c1d95 0%, #5b2caa 50%, #3b0f80 100%)',
        padding: '60px 20px 50px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    headerOrb: {
        position: 'absolute', top: '-30%', left: '-10%', width: '250px', height: '250px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)',
    },
    title: { color: '#fbbf24', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 800, marginBottom: '12px' },
    subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.7 },
    formSection: { padding: '0 20px 60px', marginTop: '-20px', position: 'relative', zIndex: 3 },
    formCard: {
        maxWidth: '600px', margin: '0 auto', background: 'var(--bg-card)', borderRadius: '20px',
        padding: '36px 32px', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', gap: '20px',
    },
    row: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' },
    field: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { color: 'var(--text)', fontSize: '0.92rem', fontWeight: 600 },
    input: {
        width: '100%', padding: '13px 16px', borderRadius: '12px', border: '2px solid var(--royal-pale)',
        fontSize: '1rem', fontFamily: "'Heebo', sans-serif", direction: 'rtl', outline: 'none',
        transition: 'border-color 0.2s', boxSizing: 'border-box',
    },
    textarea: {
        width: '100%', padding: '13px 16px', borderRadius: '12px', border: '2px solid var(--royal-pale)',
        fontSize: '1rem', fontFamily: "'Heebo', sans-serif", direction: 'rtl', outline: 'none',
        resize: 'vertical', boxSizing: 'border-box',
    },
    checkboxWrap: { padding: '4px 0' },
    checkboxLabel: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'var(--text-soft)', fontSize: '0.95rem' },
    checkbox: { width: '18px', height: '18px', accentColor: '#4c1d95' },
    submitBtn: {
        background: 'linear-gradient(135deg, #4c1d95, #5b2caa)', color: '#fff', border: 'none',
        padding: '16px', borderRadius: '14px', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(76,29,149,0.2)',
    },
    note: { color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center', margin: 0 },
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
