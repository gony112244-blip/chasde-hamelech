import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import { useT } from '../hooks/useT';

const PAYBOX_LINK = 'https://payboxapp.page.link/WXV7'; // יש לעדכן בקישור אמיתי

const BIT_NUMBER = '050-XXXXXXX'; // יש לעדכן

const BANK_DETAILS = {
    bank: 'הפועלים',
    branch: '000',
    account: '000000',
    name: 'חסדי המלך',
};

const ITEMS_NEEDED = [
    { icon: '🎲', name: 'משחקי קופסה', desc: 'חדש בלבד · לגילאי 4–12' },
    { icon: '🧸', name: 'בובות ודובונים', desc: 'חדש בלבד · תקנות בתי חולים' },
    { icon: '🎨', name: 'ערכות יצירה', desc: 'חדש בלבד · צבעים, חוברות, פלסטלינה' },
    { icon: '🦷', name: 'ערכות שיניים', desc: 'חדש בלבד · מברשת + משחה' },
    { icon: '✏️', name: 'אביזרי כתיבה', desc: 'חדש בלבד · עפרונות, טושים, מחברות' },
    { icon: '🃏', name: 'משחקי קלפים', desc: 'חדש בלבד · קלפים, משחקי מסיבה' },
    { icon: '🧩', name: 'פאזלים', desc: 'חדש בלבד · לגילאי 3–10' },
];

export default function HelpPage() {
    const t = useT();
    const [showBank, setShowBank] = useState(false);
    const itemsRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if (location.hash === '#donate' && itemsRef.current) {
            setTimeout(() => {
                itemsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [location.hash]);

    return (
        <div style={s.page}>
            <PageMeta title="איך עוזרים" description="תרומה כספית, תרומת משחקים וספרים, או התנדבות — כל דרך לעזור לילדים מאושפזים. הצטרפו אלינו." path="/help" />
            {/* Header */}
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

            {/* תרומה כספית */}
            <section style={s.donateSection}>
                <div style={s.donateInner}>
                    <div style={s.donateCard}>
                        <span style={{ fontSize: '3rem' }}>💰</span>
                        <h2 style={s.donateTitle}>{t('helppage_donate_title')}</h2>
                        <p style={s.donateText}>
                            כל שקל הופך למשחק, ספר או חיוך ביד ילד מאושפז.
                        </p>

                        {/* PayBox */}
                        <a href={PAYBOX_LINK} style={s.donateBtnPrimary}
                            target="_blank" rel="noopener noreferrer">
                            {t('help_paybox_btn')}
                        </a>

                        {/* Bit */}
                        <div style={s.payOption}>
                            <span style={s.payOptionIcon}>📱</span>
                            <div>
                                <strong style={s.payOptionLabel}>Bit</strong>
                                <span style={s.payOptionValue}>{BIT_NUMBER}</span>
                            </div>
                        </div>

                        {/* העברה בנקאית */}
                        <button
                            style={s.bankToggle}
                            onClick={() => setShowBank(v => !v)}
                        >
                            {showBank ? t('help_bank_hide') : t('help_bank_show')}
                        </button>
                        {showBank && (
                            <div style={s.bankBox}>
                                <p style={s.bankLine}>בנק: {BANK_DETAILS.bank}</p>
                                <p style={s.bankLine}>סניף: {BANK_DETAILS.branch}</p>
                                <p style={s.bankLine}>חשבון: {BANK_DETAILS.account}</p>
                                <p style={s.bankLine}>על שם: {BANK_DETAILS.name}</p>
                            </div>
                        )}

                        {/* כרטיס אשראי — בקרוב */}
                        <div style={s.creditPlaceholder}>
                            <span>💳</span>
                            <span>{t('help_credit_soon')}</span>
                        </div>

                        <p style={s.donateNote}>
                            100% מהתרומות מגיעות ישירות לילדים
                        </p>
                    </div>
                </div>
            </section>

            {/* תרומת פריטים */}
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

            {/* CTA סופי */}
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
    page: { fontFamily: "'Heebo', sans-serif", direction: 'rtl' },
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
    donateInner: { maxWidth: '560px', margin: '0 auto' },
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
        display: 'block', textAlign: 'center',
    },
    payOption: {
        width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
        background: 'var(--royal-pale)', borderRadius: '14px', padding: '14px 20px', textAlign: 'right',
    },
    payOptionIcon: { fontSize: '1.6rem', flexShrink: 0 },
    payOptionLabel: { display: 'block', color: 'var(--royal)', fontSize: '0.95rem', fontWeight: 700 },
    payOptionValue: { display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '2px' },
    bankToggle: {
        background: 'none', border: '2px solid var(--royal-pale)', color: 'var(--royal)',
        borderRadius: '12px', padding: '10px 20px', fontWeight: 600, cursor: 'pointer',
        fontSize: '0.92rem', fontFamily: "'Heebo', sans-serif",
    },
    bankBox: {
        width: '100%', background: 'var(--royal-pale)', borderRadius: '14px', padding: '16px 20px',
        textAlign: 'right',
    },
    bankLine: { color: 'var(--royal)', fontSize: '0.93rem', margin: '4px 0', fontWeight: 500 },
    creditPlaceholder: {
        display: 'flex', alignItems: 'center', gap: '8px',
        color: 'var(--text-muted)', fontSize: '0.88rem',
        border: '1px dashed rgba(15,32,68,0.2)', borderRadius: '10px', padding: '10px 16px',
    },
    donateNote: { color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 },

    itemsSection: { padding: '60px 20px', background: 'var(--bg-warm)', scrollMarginTop: '90px' },
    itemsInner: { maxWidth: '900px', margin: '0 auto', textAlign: 'center' },
    sectionTitle: {
        color: 'var(--royal)', fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 800,
        marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
    },
    sectionSubtitle: { color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '32px', lineHeight: 1.7 },
    itemsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '32px' },
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
        padding: '12px 28px', borderRadius: '12px', fontWeight: 700,
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
    },
    ctaBtnSecondary: {
        background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.25)',
        color: '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: '14px', fontWeight: 600,
    },
};
