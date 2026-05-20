import { Link } from 'react-router-dom';

// TODO: להחליף בלינק PayBox אמיתי
const PAYBOX_LINK = '#';

const ITEMS_NEEDED = [
    { icon: '🎲', name: 'משחקי קופסה', desc: 'חדשים, לגילאי 4–12' },
    { icon: '📚', name: 'ספרי ילדים', desc: 'בעברית, חדשים' },
    { icon: '🧸', name: 'בובות ודובונים', desc: 'חדשים בלבד (תקנות בתי חולים)' },
    { icon: '🎨', name: 'ערכות יצירה', desc: 'צבעים, חוברות צביעה, פלסטלינה' },
    { icon: '🧩', name: 'פאזלים', desc: 'לגילאי 3–10' },
    { icon: '🎮', name: 'משחקי כיס', desc: 'משחקי קלפים, מגנטים' },
];

export default function HelpPage() {
    return (
        <div style={s.page}>
            {/* Header */}
            <section style={s.header}>
                <div style={s.headerOrb} />
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h1 style={s.title}>💝 איך עוזרים?</h1>
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
                        <h2 style={s.donateTitle}>תרומה כספית</h2>
                        <p style={s.donateText}>
                            כל שקל הופך למשחק או ספר ביד ילד מאושפז.
                            <br />אנחנו מחויבים לשקיפות מלאה.
                        </p>

                        <div style={s.amountGrid}>
                            {[36, 72, 180, 360].map(amount => (
                                <div key={amount} style={s.amountCard}>
                                    <span style={s.amountNumber}>₪{amount}</span>
                                    <span style={s.amountDesc}>
                                        {amount <= 50 ? 'משחק אחד' :
                                         amount <= 100 ? 'חבילה לילד' :
                                         amount <= 200 ? '3 חבילות' : '5 ילדים שמחים'}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <a href={PAYBOX_LINK} style={s.donateBtn} target="_blank" rel="noopener noreferrer">
                            💳 תרמו דרך PayBox
                        </a>
                        <p style={s.donateNote}>
                            ✅ מאובטח · 🔒 ללא עמלות · 💯 100% מגיע לילדים
                        </p>
                    </div>
                </div>
            </section>

            {/* תרומת משחקים */}
            <section style={s.itemsSection}>
                <div style={s.itemsInner}>
                    <h2 style={s.sectionTitle}>
                        <span>🎁</span> תרומת משחקים וספרים
                    </h2>
                    <p style={s.sectionSubtitle}>
                        יש לכם משחקים חדשים בבית? הילדים ישמחו לקבל אותם!
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
                            רוצים לתרום משחקים? צרו איתנו קשר ונתאם איסוף!
                        </p>
                        <Link to="/contact" style={s.contactBtn}>📩 צרו קשר</Link>
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
        background: 'linear-gradient(165deg, #4c1d95 0%, #5b2caa 50%, #3b0f80 100%)',
        padding: '60px 20px 50px', textAlign: 'center', position: 'relative', overflow: 'hidden',
    },
    headerOrb: {
        position: 'absolute', top: '-20%', right: '10%', width: '200px', height: '200px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%)',
    },
    title: { color: '#fbbf24', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 800, marginBottom: '12px' },
    subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.7 },

    // Donate
    donateSection: { padding: '0 20px 60px', marginTop: '-20px', position: 'relative', zIndex: 3 },
    donateInner: { maxWidth: '600px', margin: '0 auto' },
    donateCard: {
        background: 'var(--bg-card)', borderRadius: '24px', padding: '40px 32px',
        boxShadow: 'var(--shadow-lg)', textAlign: 'center', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '16px',
    },
    donateTitle: { color: 'var(--royal)', fontSize: '1.5rem', fontWeight: 800, margin: 0 },
    donateText: { color: 'var(--text-soft)', fontSize: '1rem', lineHeight: 1.7, margin: 0 },
    amountGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', width: '100%', margin: '8px 0' },
    amountCard: {
        background: 'var(--royal-pale)', borderRadius: '14px', padding: '16px 12px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
        border: '2px solid transparent', cursor: 'pointer', transition: 'border-color 0.2s',
    },
    amountNumber: { color: 'var(--royal)', fontSize: '1.4rem', fontWeight: 800 },
    amountDesc: { color: 'var(--text-muted)', fontSize: '0.82rem' },
    donateBtn: {
        background: 'linear-gradient(135deg, #d4a017, #f0c040)', color: '#3b0764',
        textDecoration: 'none', padding: '16px 48px', borderRadius: '14px', fontWeight: 700,
        fontSize: '1.15rem', boxShadow: '0 4px 20px rgba(212,160,23,0.3)', width: '100%',
        display: 'block', textAlign: 'center',
    },
    donateNote: { color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 },

    // Items
    itemsSection: { padding: '60px 20px', background: 'var(--bg-warm)' },
    itemsInner: { maxWidth: '900px', margin: '0 auto', textAlign: 'center' },
    sectionTitle: {
        color: 'var(--royal)', fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 800,
        marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
    },
    sectionSubtitle: { color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '32px' },
    itemsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' },
    itemCard: {
        background: 'var(--bg-card)', borderRadius: '16px', padding: '24px 16px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(76,29,149,0.05)',
    },
    itemIcon: { fontSize: '2rem' },
    itemName: { color: 'var(--text)', fontSize: '0.95rem' },
    itemDesc: { color: 'var(--text-muted)', fontSize: '0.8rem' },
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

    // CTA
    ctaSection: {
        background: 'linear-gradient(135deg, #4c1d95, #5b2caa)', padding: '64px 20px', textAlign: 'center',
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
