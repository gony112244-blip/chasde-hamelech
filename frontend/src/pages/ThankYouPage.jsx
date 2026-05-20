import { useState } from 'react';

// TODO: להחליף ב-API אמיתי כשיהיה DB
const MOCK_NOTES = [
    { id: 1, name: 'אמא ממחלקת ילדים', message: 'תודה רבה על המשחק שהבאתם לבן שלי. זו הפעם הראשונה שהוא חייך מאז שהתאשפז. אתם מלאכים.', date: '2026-04-15', approved: true },
    { id: 2, name: 'אבא גאה', message: 'הבת שלי לא מפסיקה לספר על הספר שקיבלה. היא קוראת אותו כל ערב לפני השינה בבית החולים. תודה מעומק הלב.', date: '2026-03-28', approved: true },
    { id: 3, name: 'אנונימי', message: 'פשוט תודה. אין מילים. מי שלא היה שם לא יכול להבין מה זה עושה לילד חולה.', date: '2026-03-10', approved: true },
    { id: 4, name: 'סבתא רחל', message: 'הנכד שלי קיבל משחק והוא כל כך שמח. ביקשתי לכתוב תודה בשמו כי הוא עוד קטן. שה\' יברך אתכם.', date: '2026-02-22', approved: true },
    { id: 5, name: 'אחות בכירה', message: 'אני עובדת 12 שנה במחלקת ילדים. אתם מהאנשים היחידים שמגיעים בקביעות ובאהבה אמיתית. הילדים מחכים לכם.', date: '2026-02-05', approved: true },
    { id: 6, name: 'משפחת כהן', message: 'הילד שלנו היה מאושפז חודשיים. בכל פעם שהגעתם זה היה יום חג. תודה שלא שכחתם אותנו.', date: '2026-01-18', approved: true },
];

export default function ThankYouPage() {
    const [notes] = useState(MOCK_NOTES);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.message.trim()) return;
        // TODO: שליחה ל-API
        setSubmitted(true);
        setForm({ name: '', message: '' });
        setTimeout(() => {
            setShowForm(false);
            setSubmitted(false);
        }, 3000);
    };

    return (
        <div style={s.page}>
            {/* Header */}
            <section style={s.header}>
                <div style={s.headerOrb} />
                <div style={s.headerContent}>
                    <h1 style={s.title}>💬 קיר התודה</h1>
                    <p style={s.subtitle}>
                        המילים שלכם נותנות לנו כוח להמשיך.
                        <br />כאן אנחנו שומרים את הרגעים הכי יפים.
                    </p>
                    <button
                        style={s.addBtn}
                        onClick={() => setShowForm(true)}
                    >
                        ✏️ כתבו תודה
                    </button>
                </div>
            </section>

            {/* טופס הוספת תודה */}
            {showForm && (
                <section style={s.formSection}>
                    <div style={s.formCard}>
                        {submitted ? (
                            <div style={s.successMsg}>
                                <span style={{ fontSize: '2.5rem' }}>✅</span>
                                <h3 style={{ color: 'var(--royal)', margin: 0 }}>תודה רבה!</h3>
                                <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                                    ההודעה נשלחה ותפורסם לאחר אישור
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={s.form}>
                                <h3 style={s.formTitle}>שתפו את ההרגשה 💛</h3>
                                <input
                                    type="text"
                                    placeholder='שם או כינוי (אופציונלי — למשל "אמא ממחלקת ילדים")'
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    style={s.input}
                                />
                                <textarea
                                    placeholder="כתבו את ההודעה שלכם..."
                                    value={form.message}
                                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                    style={s.textarea}
                                    rows={4}
                                    required
                                />
                                <div style={s.formActions}>
                                    <button type="submit" style={s.submitBtn}>
                                        📨 שלחו
                                    </button>
                                    <button
                                        type="button"
                                        style={s.cancelBtn}
                                        onClick={() => setShowForm(false)}
                                    >
                                        ביטול
                                    </button>
                                </div>
                                <p style={s.formNote}>
                                    💡 ההודעה תעבור אישור לפני הפרסום. ניתן לכתוב בעילום שם.
                                </p>
                            </form>
                        )}
                    </div>
                </section>
            )}

            {/* כרטיסי תודה */}
            <section style={s.notesSection}>
                <div style={s.notesGrid}>
                    {notes.map((note, i) => (
                        <div key={note.id} style={{
                            ...s.noteCard,
                            animationDelay: `${i * 0.1}s`,
                        }}>
                            <div style={s.noteQuote}>&ldquo;</div>
                            <p style={s.noteText}>{note.message}</p>
                            <div style={s.noteFooter}>
                                <div style={s.noteAvatar}>
                                    {(note.name || 'א').charAt(0)}
                                </div>
                                <div>
                                    <strong style={s.noteName}>{note.name || 'אנונימי'}</strong>
                                    <span style={s.noteDate}>
                                        {new Date(note.date).toLocaleDateString('he-IL')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

const s = {
    page: {
        fontFamily: "'Heebo', sans-serif",
        direction: 'rtl',
    },
    // Header
    header: {
        background: 'linear-gradient(165deg, #4c1d95 0%, #5b2caa 50%, #3b0f80 100%)',
        padding: '60px 20px 50px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    headerOrb: {
        position: 'absolute',
        top: '-30%',
        right: '-10%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%)',
    },
    headerContent: {
        position: 'relative',
        zIndex: 2,
    },
    title: {
        color: '#fbbf24',
        fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
        fontWeight: 800,
        marginBottom: '12px',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: '1.05rem',
        lineHeight: 1.7,
        marginBottom: '24px',
    },
    addBtn: {
        background: 'linear-gradient(135deg, #d4a017, #f0c040)',
        color: '#3b0764',
        border: 'none',
        padding: '14px 32px',
        borderRadius: '14px',
        fontWeight: 700,
        fontSize: '1.05rem',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(212,160,23,0.3)',
    },

    // Form
    formSection: {
        padding: '0 20px',
        marginTop: '-20px',
        position: 'relative',
        zIndex: 3,
    },
    formCard: {
        maxWidth: '550px',
        margin: '0 auto',
        background: 'var(--bg-card)',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: 'var(--shadow-lg)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    formTitle: {
        color: 'var(--royal)',
        fontSize: '1.2rem',
        fontWeight: 700,
        margin: 0,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        border: '2px solid var(--royal-pale)',
        fontSize: '1rem',
        fontFamily: "'Heebo', sans-serif",
        direction: 'rtl',
        outline: 'none',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
    },
    textarea: {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        border: '2px solid var(--royal-pale)',
        fontSize: '1rem',
        fontFamily: "'Heebo', sans-serif",
        direction: 'rtl',
        outline: 'none',
        resize: 'vertical',
        minHeight: '100px',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
    },
    formActions: {
        display: 'flex',
        gap: '12px',
    },
    submitBtn: {
        flex: 1,
        background: 'linear-gradient(135deg, #4c1d95, #5b2caa)',
        color: '#fff',
        border: 'none',
        padding: '14px',
        borderRadius: '12px',
        fontWeight: 700,
        fontSize: '1rem',
        cursor: 'pointer',
    },
    cancelBtn: {
        background: 'transparent',
        color: 'var(--text-muted)',
        border: '2px solid var(--royal-pale)',
        padding: '14px 24px',
        borderRadius: '12px',
        fontWeight: 600,
        fontSize: '0.95rem',
        cursor: 'pointer',
    },
    formNote: {
        color: 'var(--text-muted)',
        fontSize: '0.82rem',
        textAlign: 'center',
        margin: 0,
    },
    successMsg: {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        padding: '20px 0',
    },

    // Notes grid
    notesSection: {
        padding: '48px 20px 80px',
        background: 'var(--bg-light)',
    },
    notesGrid: {
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
    },
    noteCard: {
        background: 'var(--bg-card)',
        borderRadius: '18px',
        padding: '28px 24px',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid rgba(76,29,149,0.05)',
        position: 'relative',
        animation: 'fadeInUp 0.5s ease-out both',
    },
    noteQuote: {
        position: 'absolute',
        top: '12px',
        right: '18px',
        fontSize: '2.5rem',
        color: 'var(--royal-pale)',
        fontFamily: 'serif',
        lineHeight: 1,
        opacity: 0.5,
    },
    noteText: {
        color: 'var(--text-soft)',
        fontSize: '0.95rem',
        lineHeight: 1.7,
        margin: '0 0 16px',
        paddingTop: '12px',
    },
    noteFooter: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(76,29,149,0.06)',
    },
    noteAvatar: {
        width: '38px',
        height: '38px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, var(--royal), var(--royal-light))',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: '1rem',
        flexShrink: 0,
    },
    noteName: {
        display: 'block',
        color: 'var(--text)',
        fontSize: '0.9rem',
    },
    noteDate: {
        display: 'block',
        color: 'var(--text-muted)',
        fontSize: '0.78rem',
    },
};
