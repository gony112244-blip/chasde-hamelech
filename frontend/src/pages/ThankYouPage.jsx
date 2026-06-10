import { useState, useEffect, useRef } from 'react';
import API_BASE from '../config';
import PageMeta from '../components/PageMeta';
import { useT } from '../hooks/useT';
import { useLang } from '../contexts/LangContext';
import { translateBatch } from '../hooks/useTranslate';

const FALLBACK_NOTES = [
    { id: 'f1', name: 'אמא ממחלקת ילדים', message: 'הבן שלי היה מאושפז שבועיים. ביום שהגיעו עם המשחק והספר — זו הייתה הפעם הראשונה שהוא חייך מאז שהגענו.', hospital: 'בית חולים שניידר', created_at: '2026-04-15' },
    { id: 'f2', name: 'אבא גאה', message: 'הבת שלי לא מפסיקה לספר על הספר שקיבלה. היא קוראת אותו כל ערב לפני השינה בבית החולים. תודה מעומק הלב.', hospital: 'בית חולים וולפסון', created_at: '2026-03-28' },
    { id: 'f3', name: 'אנונימי', message: 'פשוט תודה. אין מילים. מי שלא היה שם לא יכול להבין מה זה עושה לילד חולה.', hospital: '', created_at: '2026-03-10' },
    { id: 'f4', name: 'סבתא רחל', message: 'הנכד שלי קיבל משחק והוא כל כך שמח. ביקשתי לכתוב תודה בשמו כי הוא עוד קטן. ה׳ יברך אתכם.', hospital: '', created_at: '2026-02-22' },
    { id: 'f5', name: 'אחות בכירה', message: 'אני עובדת 12 שנה במחלקת ילדים. אתם מהאנשים היחידים שמגיעים בקביעות ובאהבה אמיתית. הילדים מחכים לכם.', hospital: 'בית חולים רמב"ם', created_at: '2026-02-05' },
    { id: 'f6', name: 'משפחת כהן', message: 'הילד שלנו היה מאושפז חודשיים. בכל פעם שהגעתם זה היה יום חג. תודה שלא שכחתם אותנו.', hospital: '', created_at: '2026-01-18' },
];

export default function ThankYouPage() {
    const t = useT();
    const { lang } = useLang();
    const [notes, setNotes] = useState(FALLBACK_NOTES);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', message: '', email: '', hospital: '' });
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const writeRef = useRef(null);

    useEffect(() => {
        fetch(`${API_BASE}/api/thank-you`)
            .then(r => r.ok ? r.json() : [])
            .then(async data => {
                const real = Array.isArray(data) ? data : [];
                if (real.length > 0) {
                    const translated = await translateBatch(real, ['message', 'name'], lang);
                    setNotes(translated);
                }
            })
            .catch(() => {});
    }, [lang]);

    // גלילה לטופס אם מגיעים עם #write
    useEffect(() => {
        if (window.location.hash === '#write') {
            setShowForm(true);
            setTimeout(() => writeRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
        }
    }, []);

    function handlePhotoChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.message.trim()) return;
        setSending(true);
        setError('');
        try {
            const fd = new FormData();
            fd.append('name', form.name);
            fd.append('message', form.message);
            fd.append('email', form.email);
            fd.append('hospital', form.hospital);
            if (photo) fd.append('photo', photo);

            const res = await fetch(`${API_BASE}/api/thank-you`, {
                method: 'POST',
                body: fd,
            });
            const data = await res.json();
            if (res.ok) {
                setSubmitted(true);
                setForm({ name: '', message: '', email: '', hospital: '' });
                setPhoto(null);
                setPhotoPreview(null);
                setTimeout(() => { setShowForm(false); setSubmitted(false); }, 4000);
                // רענן הרשימה (רק הודעות ללא תמונה מופיעות מייד)
                if (!photo) {
                    fetch(`${API_BASE}/api/thank-you`)
                        .then(r => r.ok ? r.json() : [])
                        .then(d => {
                            const real = Array.isArray(d) ? d : [];
                            if (real.length > 0) setNotes(real);
                        });
                }
            } else {
                setError(data.error || 'שגיאה בשליחה');
            }
        } catch {
            setError('לא ניתן להתחבר לשרת. נסו שוב.');
        } finally {
            setSending(false);
        }
    }

    return (
        <div style={s.page}>
            <PageMeta title="קיר התודה" description="מילות תודה ממשפחות וילדים שפגשנו. קראו את הרגעים המרגשים או שתפו את הסיפור שלכם." path="/thank-you" />
            <section style={s.header}>
                <div style={s.headerOrb} />
                <div style={s.headerContent}>
                    <h1 style={s.title}>{t('thankyou_title')}</h1>
                    <p style={s.subtitle}>{t('thankyou_subtitle')}</p>
                    <button style={s.addBtn} onClick={() => {
                        setShowForm(true);
                        setTimeout(() => writeRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }}>
                        {t('thankyou_write_btn')}
                    </button>
                </div>
            </section>

            {showForm && (
                <section style={s.formSection} ref={writeRef} id="write">
                    <div style={s.formCard}>
                        {submitted ? (
                            <div style={s.successMsg}>
                                <span style={{ fontSize: '2.5rem' }}>✅</span>
                                <h3 style={{ color: 'var(--royal)', margin: 0 }}>{t('thankyou_success_title')}</h3>
                                <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                                    {photo
                                        ? 'ההודעה עם התמונה נשלחה ותפורסם לאחר אישור המנהל.'
                                        : 'ההודעה פורסמה בקיר התודה! 🎉'}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={s.form}>
                                <h3 style={s.formTitle}>שתפו את ההרגשה 💛</h3>
                                <p style={s.formHint}>
                                    💡 מוזמנים לצלם מכתב בכתב יד ולהעלות תמונה — זה הכי אמיתי!
                                </p>
                                <input
                                    type="text"
                                    placeholder={t('thankyou_form_name')}
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    style={s.input}
                                />
                                <input
                                    type="text"
                                    placeholder={t('thankyou_form_hospital')}
                                    value={form.hospital}
                                    onChange={e => setForm(f => ({ ...f, hospital: e.target.value }))}
                                    style={s.input}
                                />
                                <textarea
                                    placeholder={t('thankyou_form_message')}
                                    value={form.message}
                                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                    style={s.textarea}
                                    rows={4}
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder={t('thankyou_form_email')}
                                    value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    style={s.input}
                                />

                                {/* העלאת תמונה / מכתב */}
                                <div style={s.photoSection}>
                                    <label style={s.photoLabel}>
                                        📷 העלו תמונה או מכתב בכתב יד (אופציונלי)
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={handlePhotoChange}
                                        />
                                    </label>
                                    {photoPreview && (
                                        <div style={s.previewWrap}>
                                            <img src={photoPreview} alt="תצוגה מקדימה" style={s.previewImg} />
                                            <button type="button" style={s.removePhoto}
                                                onClick={() => { setPhoto(null); setPhotoPreview(null); }}>
                                                ✕ הסירו
                                            </button>
                                        </div>
                                    )}
                                    {photo && (
                                        <p style={s.photoNote}>
                                            ⏳ הודעות עם תמונה ממתינות לאישור מנהל לפני הפרסום
                                        </p>
                                    )}
                                </div>

                                {error && <p style={s.errorMsg}>{error}</p>}

                                <div style={s.formActions}>
                                    <button type="submit" style={s.submitBtn} disabled={sending}>
                                        {sending ? 'שולח...' : '📨 שלחו'}
                                    </button>
                                    <button type="button" style={s.cancelBtn}
                                        onClick={() => setShowForm(false)}>
                                        ביטול
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </section>
            )}

            <section style={s.notesSection}>
                {notes.length === 0 ? (
                    <div style={s.emptyState}>
                        <span style={{ fontSize: '3rem' }}>💬</span>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                            היו הראשונים לכתוב! ✍️
                        </p>
                    </div>
                ) : (
                    <div style={s.notesGrid}>
                        {notes.map((note, i) => (
                            <div key={note.id} style={{
                                ...s.noteCard,
                                animationDelay: `${i * 0.08}s`,
                            }}>
                                {note.photo_filename && (
                                    <img
                                        src={`${API_BASE}/uploads/${note.photo_filename}`}
                                        alt="מכתב תודה"
                                        style={s.notePhoto}
                                    />
                                )}
                                <div style={s.noteQuote}>&ldquo;</div>
                                <p style={s.noteText}>{note.message}</p>
                                <div style={s.noteFooter}>
                                    <div style={s.noteAvatar}>
                                        {(note.name || 'א').charAt(0)}
                                    </div>
                                    <div>
                                        <strong style={s.noteName}>{note.name || 'אנונימי'}</strong>
                                        {note.hospital && <span style={s.noteDate}>{note.hospital}</span>}
                                        <span style={s.noteDate}>
                                            {new Date(note.created_at).toLocaleDateString('he-IL')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
        position: 'absolute', top: '-30%', right: '-10%', width: '300px', height: '300px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%)',
    },
    headerContent: { position: 'relative', zIndex: 2 },
    title: { color: '#fbbf24', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 800, marginBottom: '12px' },
    subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '24px' },
    addBtn: {
        background: 'linear-gradient(135deg, #d4a017, #f0c040)', color: '#3b0764',
        border: 'none', padding: '14px 32px', borderRadius: '14px', fontWeight: 700,
        fontSize: '1.05rem', cursor: 'pointer', boxShadow: '0 4px 20px rgba(212,160,23,0.3)',
        fontFamily: "'Heebo', sans-serif",
    },
    formSection: {
        padding: '0 20px', marginTop: '-20px', position: 'relative', zIndex: 3,
        scrollMarginTop: '90px',
    },
    formCard: {
        maxWidth: '550px', margin: '0 auto', background: 'var(--bg-card)',
        borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-lg)',
    },
    form: { display: 'flex', flexDirection: 'column', gap: '14px' },
    formTitle: { color: 'var(--royal)', fontSize: '1.2rem', fontWeight: 700, margin: 0, textAlign: 'center' },
    formHint: { color: 'var(--royal)', fontSize: '0.9rem', background: 'var(--royal-pale)', borderRadius: '10px', padding: '10px 14px', margin: 0 },
    input: {
        width: '100%', padding: '13px 16px', borderRadius: '12px', border: '2px solid var(--royal-pale)',
        fontSize: '1rem', fontFamily: "'Heebo', sans-serif", direction: 'rtl', outline: 'none',
        transition: 'border-color 0.2s', boxSizing: 'border-box',
    },
    textarea: {
        width: '100%', padding: '13px 16px', borderRadius: '12px', border: '2px solid var(--royal-pale)',
        fontSize: '1rem', fontFamily: "'Heebo', sans-serif", direction: 'rtl', outline: 'none',
        resize: 'vertical', minHeight: '100px', transition: 'border-color 0.2s', boxSizing: 'border-box',
    },
    photoSection: { display: 'flex', flexDirection: 'column', gap: '10px' },
    photoLabel: {
        display: 'block', cursor: 'pointer', background: 'var(--royal-pale)', borderRadius: '12px',
        padding: '12px 16px', textAlign: 'center', color: 'var(--royal)', fontWeight: 600, fontSize: '0.92rem',
    },
    previewWrap: { position: 'relative', display: 'inline-block' },
    previewImg: { width: '100%', borderRadius: '10px', maxHeight: '200px', objectFit: 'cover' },
    removePhoto: {
        position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff',
        border: 'none', borderRadius: '8px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.82rem',
        fontFamily: "'Heebo', sans-serif",
    },
    photoNote: { color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 },
    errorMsg: { color: '#dc2626', fontSize: '0.9rem', margin: 0, textAlign: 'center' },
    formActions: { display: 'flex', gap: '12px' },
    submitBtn: {
        flex: 1, background: 'linear-gradient(135deg, #0f2044, #1a3460)', color: '#fff',
        border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '1rem',
        cursor: 'pointer', fontFamily: "'Heebo', sans-serif",
    },
    cancelBtn: {
        background: 'transparent', color: 'var(--text-muted)', border: '2px solid var(--royal-pale)',
        padding: '14px 24px', borderRadius: '12px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
        fontFamily: "'Heebo', sans-serif",
    },
    successMsg: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '20px 0' },
    notesSection: { padding: '48px 20px 80px', background: 'var(--bg-light)' },
    emptyState: { textAlign: 'center', padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
    notesGrid: {
        maxWidth: '1000px', margin: '0 auto', display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px',
    },
    noteCard: {
        background: 'var(--bg-card)', borderRadius: '18px', padding: '28px 24px',
        boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(15,32,68,0.05)',
        position: 'relative', animation: 'fadeInUp 0.5s ease-out both',
        display: 'flex', flexDirection: 'column', gap: '10px',
    },
    notePhoto: { width: '100%', borderRadius: '12px', maxHeight: '180px', objectFit: 'cover' },
    noteQuote: { position: 'absolute', top: '12px', right: '18px', fontSize: '2.5rem', color: 'var(--royal-pale)', fontFamily: 'serif', lineHeight: 1, opacity: 0.5 },
    noteText: { color: 'var(--text-soft)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0, paddingTop: '10px', flex: 1 },
    noteFooter: { display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '12px', borderTop: '1px solid rgba(15,32,68,0.06)', marginTop: 'auto' },
    noteAvatar: {
        width: '38px', height: '38px', borderRadius: '10px',
        background: 'linear-gradient(135deg, var(--royal), var(--royal-light))',
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: '1rem', flexShrink: 0,
    },
    noteName: { display: 'block', color: 'var(--text)', fontSize: '0.9rem' },
    noteDate: { display: 'block', color: 'var(--text-muted)', fontSize: '0.78rem' },
};
