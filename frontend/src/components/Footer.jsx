import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer style={s.footer}>
            <div style={s.inner}>
                {/* לוגו ותיאור */}
                <div style={s.col}>
                    <Logo size={32} showText={true} />
                    <p style={s.desc}>
                        מחלקים משחקים וספרים לילדים מאושפזים<br />
                        ומחזירים להם את הזכות לחייך ולחלום.
                    </p>
                </div>

                {/* קישורים מהירים */}
                <div style={s.col}>
                    <h4 style={s.colTitle}>ניווט מהיר</h4>
                    <nav style={s.links}>
                        <Link to="/gallery" style={s.link}>גלריית רגעים</Link>
                        <Link to="/thank-you" style={s.link}>קיר תודה</Link>
                        <Link to="/parasha" style={s.link}>עלון השבוע</Link>
                        <Link to="/volunteer" style={s.link}>הצטרפו כמתנדבים</Link>
                        <Link to="/contact" style={s.link}>צור קשר</Link>
                    </nav>
                </div>

                {/* מידע משפטי */}
                <div style={s.col}>
                    <h4 style={s.colTitle}>מידע</h4>
                    <nav style={s.links}>
                        <Link to="/privacy" style={s.link}>מדיניות פרטיות</Link>
                        <Link to="/accessibility" style={s.link}>הצהרת נגישות</Link>
                    </nav>
                    <span style={{ fontSize: '0.82rem', opacity: 0.55, marginTop: '6px' }}>
                        פועלים מתוך אהבה ואמונה
                    </span>
                </div>
            </div>

            <div style={s.bottom}>
                <span>© {year} חסדי המלך. כל הזכויות שמורות.</span>
                <span style={s.credit}>נבנה באהבה ובהתנדבות</span>
            </div>
            <div style={s.authorCredit}>
                ספר הילדים &ldquo;שר הצבא&rdquo; מאת{' '}
                <a href="mailto:gony112233@gmail.com" style={s.authorLink}>גוני שמוחה</a>
                {' '}— מחוברים בנשמה לייעוד הזה
            </div>
        </footer>
    );
}

const s = {
    footer: {
        background: 'linear-gradient(180deg, #1e1145 0%, #130b2e 100%)',
        color: 'rgba(255,255,255,0.75)',
        fontFamily: "'Heebo', sans-serif",
        direction: 'rtl',
        marginTop: 'auto',
        paddingTop: '48px',
    },
    inner: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '36px',
    },
    col: { display: 'flex', flexDirection: 'column', gap: '14px' },
    colTitle: {
        color: '#d4a017',
        fontWeight: 700,
        fontSize: '1rem',
        margin: 0,
        marginBottom: '4px',
    },
    desc: {
        fontSize: '0.9rem',
        lineHeight: 1.7,
        margin: 0,
        opacity: 0.75,
    },
    links: { display: 'flex', flexDirection: 'column', gap: '10px' },
    link: {
        color: 'rgba(255,255,255,0.72)',
        textDecoration: 'none',
        fontSize: '0.92rem',
        transition: 'color 0.2s',
    },
    contactLines: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        fontSize: '0.92rem',
    },
    bottom: {
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '16px 24px',
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.82rem',
        flexWrap: 'wrap',
        gap: '8px',
    },
    credit: { color: '#d4a017', fontWeight: 600 },
    authorCredit: {
        textAlign: 'center',
        fontSize: '0.78rem',
        color: 'rgba(255,255,255,0.28)',
        padding: '10px 20px 16px',
        fontFamily: "'Heebo', sans-serif",
        direction: 'rtl',
    },
    authorLink: {
        color: 'rgba(255,255,255,0.38)',
        textDecoration: 'none',
    },
};
