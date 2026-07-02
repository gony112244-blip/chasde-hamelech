import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import { useToast } from '../components/ToastProvider';
import { PAYMENTS } from '../config';
import { useT } from '../hooks/useT';
import API_BASE from '../config';

const ITEMS_NEEDED = [
    { icon: '🎲', name: 'משחקי קופסה', desc: 'חדש בלבד · לגילאי 4–12' },
    { icon: '🧸', name: 'בובות ודובונים', desc: 'חדש בלבד · תקנות בתי חולים' },
    { icon: '🎨', name: 'ערכות יצירה', desc: 'חדש בלבד · צבעים, חוברות, פלסטלינה' },
    { icon: '🦷', name: 'ערכות שיניים', desc: 'חדש בלבד · מברשת + משחה' },
    { icon: '✏️', name: 'אביזרי כתיבה', desc: 'חדש בלבד · עפרונות, טושים, מחברות' },
    { icon: '🃏', name: 'משחקי קלפים', desc: 'חדש בלבד · קלפים, משחקי מסיבה' },
    { icon: '🧩', name: 'פאזלים', desc: 'חדש בלבד · לגילאי 3–10' },
];

function hasBankDetails(bank) {
    return !!(bank.name && bank.branch && bank.account);
}

function DonationReportForm({ defaultMethod, onClose }) {
    const [form, setForm] = useState({
        donor_name: '', amount: '', method: defaultMethod || 'other',
        email: '', phone: '', note: '',
    });
    const [sending, setSending] = useState(false);
    const [done, setDone] = useState(false);
    const [err, setErr] = useState('');

    useEffect(() => {
        setForm(f => ({ ...f, method: defaultMethod || 'other' }));
    }, [defaultMethod]);

    async function handleSubmit(e) {
        e.preventDefault();
        setSending(true);
        setErr('');
        try {
            const res = await fetch(`${API_BASE}/api/donation-report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'שגיאה');
            setDone(true);
        } catch (ex) {
            setErr(ex.message || 'שגיאה בשליחה, נסו שוב');
        } finally {
            setSending(false);
        }
    }

    if (done) {
        return (
            <div style={sf.success}>
                <span style={{ fontSize: '2.5rem' }}>💛</span>
                <h3 style={sf.successTitle}>תודה על הדיווח!</h3>
                <p style={sf.successText}>
                    קיבלנו את פרטי התרומה. נבדוק ונשלח אליך הודעת תודה בהקדם.
                </p>
                {onClose && (
                    <button type="button" style={sf.closeBtn} onClick={onClose}>סגור</button>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={sf.form}>
            <h3 style={sf.formTitle}>דיווח על תרומה שביצעתי</h3>
            <p style={sf.formDesc}>
                שלחתם תרומה? ספרו לנו — נשלח לכם הודעת תודה ונרשום את הפעולה הטובה שלכם.
            </p>

            <div style={sf.note}>
                Bit, PayBox ו-PayPal באתר זה מיועדים אך ורק לתרומות לפעילות חסדי המלך.
                התשלום מתבצע ישירות בין התורם לחשבון הפעילות — האתר אינו גובה כרטיס אשראי ואינו שומר פרטי תשלום.
            </div>

            <div style={sf.grid}>
                <div style={sf.field}>
                    <label style={sf.label}>שם (אופציונלי)</label>
                    <input style={sf.input} placeholder="השם שלך" value={form.donor_name}
                        onChange={e => setForm(f => ({ ...f, donor_name: e.target.value }))} />
                </div>
                <div style={sf.field}>
                    <label style={sf.label}>סכום ₪ (אופציונלי)</label>
                    <input style={sf.input} type="number" min="1" placeholder="100"
                        value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
                </div>
                <div style={sf.field}>
                    <label style={sf.label}>אמצעי תשלום</label>
                    <select style={sf.input} value={form.method}
                        onChange={e => setForm(f => ({ ...f, method: e.target.value }))}>
                        <option value="bit">Bit</option>
                        <option value="paybox">PayBox</option>
                        <option value="paypal">PayPal</option>
                        <option value="bank">העברה בנקאית</option>
                        <option value="other">אחר</option>
                    </select>
                </div>
                <div style={sf.field}>
                    <label style={sf.label}>מייל לתודה (אופציונלי)</label>
                    <input style={sf.input} type="email" placeholder="your@email.com"
                        value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div style={sf.field}>
                    <label style={sf.label}>טלפון (אופציונלי)</label>
                    <input style={sf.input} type="tel" placeholder="050-0000000"
                        value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div style={{ ...sf.field, gridColumn: '1 / -1' }}>
                    <label style={sf.label}>הערה (אופציונלי)</label>
                    <input style={sf.input} placeholder='למשל: "לזכר פלוני"'
                        value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
                </div>
            </div>

            <p style={sf.privacy}>
                הפרטים ישמשו אך ורק לשליחת הודעת תודה ולרישום פנימי. לא נשתף עם שום צד שלישי.
            </p>

            {err && <p style={sf.errMsg}>{err}</p>}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button type="submit" style={sf.submitBtn} disabled={sending}>
                    {sending ? 'שולח...' : 'שלח דיווח'}
                </button>
                {onClose && (
                    <button type="button" style={sf.cancelBtn} onClick={onClose}>ביטול</button>
                )}
            </div>
        </form>
    );
}

export default function HelpPage() {
    const t = useT();
    const toast = useToast();
    const [showBank, setShowBank] = useState(false);
    const [showReportForm, setShowReportForm] = useState(false);
    const [reportMethod, setReportMethod] = useState('other');
    const itemsRef = useRef(null);
    const location = useLocation();

    const { payboxLink, bitNumber, paypalLink, bank } = PAYMENTS;
    const bankReady = hasBankDetails(bank);

    useEffect(() => {
        if (location.hash === '#donate' && itemsRef.current) {
            setTimeout(() => {
                itemsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [location.hash]);

    function copyBit() {
        if (!bitNumber) return;
        navigator.clipboard.writeText(bitNumber.replace(/-/g, ''))
            .then(() => {
                toast.success(t('help_bit_copied'));
                setReportMethod('bit');
                setTimeout(() => {
                    setShowReportForm(true);
                    setTimeout(() => {
                        document.getElementById('donation-report-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }, 800);
            })
            .catch(() => toast.error(t('help_bit_copy_fail')));
    }

    function openReport(method) {
        setReportMethod(method);
        setShowReportForm(true);
        setTimeout(() => {
            document.getElementById('donation-report-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    return (
        <div style={s.page}>
            <PageMeta title="איך עוזרים" description="תרומה כספית, תרומת משחקים וספרים, או התנדבות — כל דרך לעזור לילדים מאושפזים. הצטרפו אלינו." path="/help" />
            <section style={s.header}>
                <div style={s.headerOrb} />
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h1 style={s.title}>{t('helppage_title')}</h1>
                    <p style={s.subtitle}>
                        כל תרומה — גדולה או קטנה — הופכת ליום טוב יותר
                        <br />עבור ילד שנלחם.
                    </p>
                </div>
            </section>

            <section style={s.donateSection}>
                <div style={s.donateInner}>
                    <div style={s.donateCard}>
                        <span style={{ fontSize: '3rem' }}>💰</span>
                        <h2 style={s.donateTitle}>{t('helppage_donate_title')}</h2>
                        <p style={s.donateText}>
                            כל שקל הופך למשחק, ספר או חיוך ביד ילד מאושפז.
                        </p>

                        {payboxLink && (
                            <a
                                href={payboxLink}
                                style={s.donateBtnPrimary}
                                target="_blank" rel="noopener noreferrer"
                                onClick={() => setReportMethod('paybox')}
                            >
                                {t('help_paybox_btn')}
                            </a>
                        )}

                        <div style={s.payOption}>
                            <span style={s.payOptionIcon}>📱</span>
                            <div style={{ flex: 1, textAlign: 'inherit' }}>
                                <strong style={s.payOptionLabel}>Bit</strong>
                                {bitNumber ? (
                                    <span style={s.payOptionValue}>{bitNumber}</span>
                                ) : (
                                    <span style={s.payOptionPending}>{t('help_payment_pending')}</span>
                                )}
                            </div>
                            {bitNumber && (
                                <button type="button" style={s.copyBtn} onClick={copyBit}>
                                    {t('help_bit_copy')}
                                </button>
                            )}
                        </div>

                        {paypalLink && (
                            <a
                                href={paypalLink}
                                style={s.paypalBtn}
                                target="_blank" rel="noopener noreferrer"
                                onClick={() => setReportMethod('paypal')}
                            >
                                {t('help_paypal_btn')}
                            </a>
                        )}

                        <button
                            style={s.bankToggle}
                            onClick={() => {
                                setShowBank(v => {
                                    const next = !v;
                                    if (next) setReportMethod('bank');
                                    return next;
                                });
                            }}
                        >
                            {showBank ? t('help_bank_hide') : t('help_bank_show')}
                        </button>
                        {showBank && (
                            <div style={s.bankBox}>
                                {bankReady ? (
                                    <>
                                        <p style={s.bankLine}>{t('help_bank_name')}: {bank.name}</p>
                                        <p style={s.bankLine}>{t('help_bank_branch')}: {bank.branch}</p>
                                        <p style={s.bankLine}>{t('help_bank_account')}: {bank.account}</p>
                                        <p style={s.bankLine}>{t('help_bank_holder')}: {bank.holder}</p>
                                    </>
                                ) : (
                                    <p style={s.bankPending}>{t('help_payment_pending')}</p>
                                )}
                            </div>
                        )}

                        <p style={s.donateNote}>
                            100% מהתרומות מגיעות ישירות לילדים
                        </p>
                    </div>

                    {/* בנר "דיווחתי שתרמתי" */}
                    {!showReportForm && (
                        <div style={s.reportBanner}>
                            <span style={{ fontSize: '1.4rem' }}>✅</span>
                            <div style={{ flex: 1 }}>
                                <strong style={s.reportBannerTitle}>סיימתם לשלם?</strong>
                                <span style={s.reportBannerText}> ספרו לנו ונשלח לכם הודעת תודה אישית!</span>
                            </div>
                            <button
                                type="button"
                                style={s.reportBannerBtn}
                                onClick={() => openReport(reportMethod)}
                            >
                                דיווח על תרומה
                            </button>
                        </div>
                    )}

                    {/* טופס דיווח */}
                    {showReportForm && (
                        <div id="donation-report-form" style={s.reportFormWrap}>
                            <DonationReportForm
                                defaultMethod={reportMethod}
                                onClose={() => setShowReportForm(false)}
                            />
                        </div>
                    )}
                </div>
            </section>

            <section style={s.itemsSection} ref={itemsRef} id="donate">
                <div style={s.itemsInner}>
                    <h2 style={s.sectionTitle}>
                        {t('help_items_title')}
                    </h2>
                    <p style={s.sectionSubtitle}>
                        {t('helppage_toys_items')}{' '}
                        <strong>{t('help_items_subtitle')}</strong>
                    </p>

                    <div style={s.itemsGrid}>
                        {ITEMS_NEEDED.map((item, i) => (
                            <div key={i} style={s.itemCard}>
                                <span style={s.itemIcon}>{item.icon}</span>
                                <strong style={s.itemName}>{item.name}</strong>
                                <span style={s.itemDesc}>{item.desc}</span>
                            </div>
                        ))}
                    </div>

                    <div style={s.contactBox}>
                        <p style={s.contactText}>
                            רוצים לתרום ציוד? צרו איתנו קשר ונתאם!
                        </p>
                        <Link to="/contact" style={s.contactBtn}>{t('help_contact_arrange')}</Link>
                    </div>
                </div>
            </section>

            <section style={s.ctaSection}>
                <div style={s.ctaInner}>
                    <h2 style={s.ctaTitle}>כל ילד ראוי לחייך 😊</h2>
                    <p style={s.ctaText}>
                        בין אם בתרומה, בהתנדבות או בשיתוף — אתם עושים הבדל.
                    </p>
                    <div style={s.ctaButtons}>
                        <Link to="/volunteer" style={s.ctaBtnPrimary}>🤝 הצטרפו כמתנדבים</Link>
                        <Link to="/thank-you" style={s.ctaBtnSecondary}>💬 קראו מה אומרים</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

const s = {
    page: { fontFamily: "'Heebo', sans-serif", direction: 'inherit' },
    header: {
        background: 'linear-gradient(165deg, #0f2044 0%, #1a3460 50%, #071530 100%)',
        padding: '60px 20px 50px', textAlign: 'center', position: 'relative', overflow: 'hidden',
    },
    headerOrb: {
        position: 'absolute', top: '-20%', right: '10%', width: '200px', height: '200px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%)',
    },
    title: { color: '#fbbf24', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 800, marginBottom: '12px' },
    subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.7 },

    donateSection: { padding: '0 20px 60px', marginTop: '-20px', position: 'relative', zIndex: 3 },
    donateInner: { maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' },
    donateCard: {
        background: 'var(--bg-card)', borderRadius: '24px', padding: '40px 32px',
        boxShadow: 'var(--shadow-lg)', textAlign: 'center', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '16px',
    },
    donateTitle: { color: 'var(--royal)', fontSize: '1.5rem', fontWeight: 800, margin: 0 },
    donateText: { color: 'var(--text-soft)', fontSize: '1rem', lineHeight: 1.7, margin: 0 },
    donateBtnPrimary: {
        background: 'linear-gradient(135deg, #d4a017, #f0c040)', color: '#3b0764',
        textDecoration: 'none', padding: '16px 48px', borderRadius: '14px', fontWeight: 700,
        fontSize: '1.1rem', boxShadow: '0 4px 20px rgba(212,160,23,0.3)', width: '100%',
        display: 'block', textAlign: 'center', boxSizing: 'border-box',
    },
    payOption: {
        width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
        background: 'var(--royal-pale)', borderRadius: '14px', padding: '14px 20px',
        boxSizing: 'border-box',
    },
    payOptionIcon: { fontSize: '1.6rem', flexShrink: 0 },
    payOptionLabel: { display: 'block', color: 'var(--royal)', fontSize: '0.95rem', fontWeight: 700 },
    payOptionValue: { display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '2px', direction: 'ltr', unicodeBidi: 'embed' },
    payOptionPending: { display: 'block', color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px', fontStyle: 'italic' },
    copyBtn: {
        background: 'var(--royal)', color: '#fff', border: 'none', borderRadius: '10px',
        padding: '10px 16px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
        fontFamily: "'Heebo', sans-serif", flexShrink: 0, minHeight: '44px',
    },
    paypalBtn: {
        background: '#0070ba', color: '#fff', textDecoration: 'none',
        padding: '14px 32px', borderRadius: '14px', fontWeight: 700, fontSize: '1rem',
        width: '100%', display: 'block', textAlign: 'center', boxSizing: 'border-box',
        minHeight: '48px', lineHeight: '20px',
    },
    bankToggle: {
        background: 'none', border: '2px solid var(--royal-pale)', color: 'var(--royal)',
        borderRadius: '12px', padding: '12px 20px', fontWeight: 600, cursor: 'pointer',
        fontSize: '0.92rem', fontFamily: "'Heebo', sans-serif", minHeight: '44px',
    },
    bankBox: {
        width: '100%', background: 'var(--royal-pale)', borderRadius: '14px', padding: '16px 20px',
        textAlign: 'inherit', boxSizing: 'border-box',
    },
    bankLine: { color: 'var(--royal)', fontSize: '0.93rem', margin: '4px 0', fontWeight: 500 },
    bankPending: { color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, fontStyle: 'italic' },
    donateNote: { color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 },

    reportBanner: {
        background: 'var(--bg-card)', borderRadius: '16px', padding: '18px 22px',
        display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
        boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(16,185,129,0.2)',
    },
    reportBannerTitle: { color: '#065f46', fontSize: '0.97rem' },
    reportBannerText: { color: 'var(--text-soft)', fontSize: '0.92rem' },
    reportBannerBtn: {
        background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px',
        padding: '10px 18px', fontWeight: 700, cursor: 'pointer',
        fontFamily: "'Heebo', sans-serif", fontSize: '0.9rem', flexShrink: 0,
    },
    reportFormWrap: {
        background: 'var(--bg-card)', borderRadius: '20px', padding: '0',
        boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
    },

    itemsSection: { padding: '60px 20px', background: 'var(--bg-warm)', scrollMarginTop: '90px' },
    itemsInner: { maxWidth: '900px', margin: '0 auto', textAlign: 'center' },
    sectionTitle: {
        color: 'var(--royal)', fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 800,
        marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
    },
    sectionSubtitle: { color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '32px', lineHeight: 1.7 },
    itemsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '16px', marginBottom: '32px' },
    itemCard: {
        background: 'var(--bg-card)', borderRadius: '16px', padding: '24px 14px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(15,32,68,0.05)',
    },
    itemIcon: { fontSize: '2rem' },
    itemName: { color: 'var(--text)', fontSize: '0.92rem' },
    itemDesc: { color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.4 },
    contactBox: {
        background: 'var(--bg-card)', borderRadius: '16px', padding: '28px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px',
        flexWrap: 'wrap', boxShadow: 'var(--shadow-sm)',
    },
    contactText: { color: 'var(--text-soft)', fontSize: '1rem', margin: 0 },
    contactBtn: {
        background: 'var(--royal-pale)', color: 'var(--royal)', textDecoration: 'none',
        padding: '12px 28px', borderRadius: '12px', fontWeight: 700, minHeight: '44px',
        display: 'inline-flex', alignItems: 'center',
    },

    ctaSection: {
        background: 'linear-gradient(135deg, #0f2044, #1a3460)', padding: '64px 20px', textAlign: 'center',
    },
    ctaInner: { maxWidth: '600px', margin: '0 auto' },
    ctaTitle: { color: '#fbbf24', fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, marginBottom: '12px' },
    ctaText: { color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '28px' },
    ctaButtons: { display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' },
    ctaBtnPrimary: {
        background: 'linear-gradient(135deg, #d4a017, #f0c040)', color: '#3b0764',
        textDecoration: 'none', padding: '14px 32px', borderRadius: '14px', fontWeight: 700,
        minHeight: '44px', display: 'inline-flex', alignItems: 'center',
    },
    ctaBtnSecondary: {
        background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.25)',
        color: '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: '14px', fontWeight: 600,
        minHeight: '44px', display: 'inline-flex', alignItems: 'center',
    },
};

// סגנונות הטופס
const sf = {
    form: {
        padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px',
        fontFamily: "'Heebo', sans-serif",
    },
    formTitle: { color: '#0f2044', fontSize: '1.2rem', fontWeight: 800, margin: 0 },
    formDesc: { color: '#6478a8', fontSize: '0.93rem', margin: 0, lineHeight: 1.6 },
    note: {
        background: '#eff6ff', borderRight: '4px solid #3b82f6', borderRadius: '8px',
        padding: '12px 16px', color: '#1e40af', fontSize: '0.83rem', lineHeight: 1.6,
    },
    grid: {
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px',
    },
    field: { display: 'flex', flexDirection: 'column', gap: '4px' },
    label: { fontSize: '0.82rem', color: '#64748b', fontWeight: 600 },
    input: {
        padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1',
        fontFamily: "'Heebo', sans-serif", fontSize: '0.9rem', outline: 'none',
    },
    privacy: { color: '#9ca3af', fontSize: '0.78rem', margin: 0, lineHeight: 1.5 },
    errMsg: { color: '#ef4444', fontSize: '0.88rem', margin: 0, textAlign: 'center' },
    submitBtn: {
        background: '#0f2044', color: '#fff', border: 'none', borderRadius: '12px',
        padding: '13px 36px', fontWeight: 700, fontSize: '0.97rem', cursor: 'pointer',
        fontFamily: "'Heebo', sans-serif", minHeight: '48px',
    },
    cancelBtn: {
        background: 'none', border: '2px solid #e2e8f0', color: '#64748b', borderRadius: '12px',
        padding: '11px 28px', fontWeight: 600, fontSize: '0.93rem', cursor: 'pointer',
        fontFamily: "'Heebo', sans-serif",
    },
    success: {
        padding: '40px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '12px',
    },
    successTitle: { color: '#065f46', fontSize: '1.3rem', fontWeight: 800, margin: 0 },
    successText: { color: '#374151', fontSize: '0.97rem', lineHeight: 1.6, margin: 0 },
    closeBtn: {
        background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px',
        padding: '10px 28px', fontWeight: 700, cursor: 'pointer',
        fontFamily: "'Heebo', sans-serif", fontSize: '0.93rem', marginTop: '8px',
    },
};
