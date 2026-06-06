import { Link } from 'react-router-dom';

async function handleShare() {
    const shareData = {
        title: 'חסדי המלך',
        text: 'מחלקים משחקים וספרים לילדים מאושפזים בבתי חולים ברחבי הארץ — אולי גם אתם יכולים לעזור!',
        url: window.location.origin,
    };
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(window.location.origin);
            alert('הקישור הועתק ללוח!');
        }
    } catch {
        // המשתמש ביטל
    }
}

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
                    {/* תרומה כספית */}
                    <div style={{ ...s.card, ...s.cardHighlight }}>
                        <span style={s.cardIcon}>💰</span>
                        <h3 style={{ ...s.cardTitle, color: '#fbbf24' }}>תרומה כספית</h3>
                        <p style={{ ...s.cardDesc, color: 'rgba(255,255,255,0.8)' }}>
                            כל שקל הופך למשחק או ספר ביד ילד מאושפז
                        </p>
                        <Link to="/help" style={{ ...s.cardBtn, ...s.cardBtnHighlight }}>
                            תרמו עכשיו →
                        </Link>
                    </div>

                    {/* התנדבות */}
                    <div style={s.card}>
                        <span style={s.cardIcon}>🤝</span>
                        <h3 style={s.cardTitle}>התנדבות</h3>
                        <p style={s.cardDesc}>הצטרפו לצוות המחלקים — גם שעה בחודש עושה הבדל</p>
                        <Link to="/volunteer" style={s.cardBtn}>הצטרפו →</Link>
                    </div>

                    {/* תרומת משחקים */}
                    <div style={s.card}>
                        <span style={s.cardIcon}>🎮</span>
                        <h3 style={s.cardTitle}>תרומת משחקים</h3>
                        <p style={s.cardDesc}>יש לכם ציוד חדש? נשמח לכל תרומה — חדש בלבד</p>
                        <Link to="/help#donate" style={s.cardBtn}>לפרטים →</Link>
                    </div>

                    {/* הפיצו */}
                    <div style={s.card}>
                        <span style={s.cardIcon}>📣</span>
                        <h3 style={s.cardTitle}>הפיצו</h3>
                        <p style={s.cardDesc}>ספרו לחברים — כל שיתוף מגדיל את מעגל החיוכים</p>
                        <button style={s.cardBtn} onClick={handleShare}>שתפו →</button>
                    </div>
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
        border: '1px solid rgba(15,32,68,0.06)',
        transition: 'transform 0.3s, box-shadow 0.3s',
    },
    cardHighlight: {
        background: 'linear-gradient(135deg, #0f2044, #1a3460)',
        border: '1px solid rgba(251,191,36,0.2)',
        boxShadow: '0 8px 30px rgba(15,32,68,0.2)',
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
        border: 'none',
        cursor: 'pointer',
        fontFamily: "'Heebo', sans-serif",
    },
    cardBtnHighlight: {
        background: 'linear-gradient(135deg, #d4a017, #f0c040)',
        color: '#3b0764',
    },
};
