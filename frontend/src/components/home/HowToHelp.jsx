import { Link } from 'react-router-dom';

const WAYS = [
    {
        icon: '💰',
        title: 'תרומה כספית',
        desc: 'כל שקל הופך למשחק או ספר ביד ילד מאושפז',
        action: 'תרמו עכשיו',
        to: '/help',
        highlight: true,
    },
    {
        icon: '🤝',
        title: 'התנדבות',
        desc: 'הצטרפו לצוות המחלקים — גם שעה בחודש עושה הבדל',
        action: 'הצטרפו',
        to: '/volunteer',
    },
    {
        icon: '🎮',
        title: 'תרומת משחקים',
        desc: 'יש לכם משחקים חדשים שלא בשימוש? הילדים ישמחו',
        action: 'צרו קשר',
        to: '/contact',
    },
    {
        icon: '📣',
        title: 'הפיצו',
        desc: 'ספרו לחברים — כל שיתוף מגדיל את מעגל החיוכים',
        action: 'שתפו',
        to: '/help',
    },
];

export default function HowToHelp() {
    return (
        <section style={s.section}>
            <div style={s.inner}>
                <h2 style={s.title}>
                    <span>💝</span>
                    איך אפשר לעזור?
                </h2>
                <p style={s.subtitle}>כל אחד יכול לעשות הבדל — גם אתם</p>

                <div style={s.grid}>
                    {WAYS.map((way, i) => (
                        <div key={i} style={{
                            ...s.card,
                            ...(way.highlight ? s.cardHighlight : {})
                        }}>
                            <span style={s.cardIcon}>{way.icon}</span>
                            <h3 style={{
                                ...s.cardTitle,
                                ...(way.highlight ? { color: '#fbbf24' } : {})
                            }}>{way.title}</h3>
                            <p style={{
                                ...s.cardDesc,
                                ...(way.highlight ? { color: 'rgba(255,255,255,0.8)' } : {})
                            }}>{way.desc}</p>
                            <Link to={way.to} style={{
                                ...s.cardBtn,
                                ...(way.highlight ? s.cardBtnHighlight : {})
                            }}>
                                {way.action} →
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const s = {
    section: {
        background: 'var(--bg-light)',
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
    },
    card: {
        background: 'var(--bg-card)',
        borderRadius: '20px',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid rgba(76,29,149,0.06)',
        transition: 'transform 0.3s, box-shadow 0.3s',
    },
    cardHighlight: {
        background: 'linear-gradient(135deg, #4c1d95, #5b2caa)',
        border: '1px solid rgba(251,191,36,0.2)',
        boxShadow: '0 8px 30px rgba(76,29,149,0.2)',
    },
    cardIcon: { fontSize: '2.2rem' },
    cardTitle: {
        color: 'var(--royal)',
        fontSize: '1.15rem',
        fontWeight: 700,
        margin: 0,
    },
    cardDesc: {
        color: 'var(--text-soft)',
        fontSize: '0.92rem',
        lineHeight: 1.6,
        margin: 0,
        flex: 1,
    },
    cardBtn: {
        marginTop: '8px',
        color: 'var(--royal)',
        textDecoration: 'none',
        fontWeight: 700,
        fontSize: '0.95rem',
        padding: '10px 24px',
        borderRadius: '10px',
        background: 'var(--royal-pale)',
        transition: 'background 0.2s',
    },
    cardBtnHighlight: {
        background: 'linear-gradient(135deg, #d4a017, #f0c040)',
        color: '#3b0764',
    },
};
