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
                        <a href="/gallery" style={s.link}>גלריית רגעים</a>
                        <a href="/thank-you" style={s.link}>קיר תודה</a>
                        <a href="/volunteer" style={s.link}>הצטרפו כמתנדבים</a>
                        <a href="/contact" style={s.link}>צור קשר</a>
                    </nav>
                </div>

                {/* יצירת קשר */}
                <div style={s.col}>
                    <h4 style={s.colTitle}>יצירת קשר</h4>
                    <div style={s.contactLines}>
                        <span>📧 chasdehamelech@gmail.com</span>
                        <span style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '8px' }}>
                            פועלים מתוך אהבה ואמונה
                        </span>
                    </div>
                </div>
            </div>

            <div style={s.bottom}>
                <span>© {year} חסדי המלך. כל הזכויות שמורות.</span>
                <span style={s.credit}>נבנה באהבה ובהתנדבות</span>
            </div>
        </footer>
    );
}

const s = {
    footer: {
        background: '#142844',
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
        color: '#c9a227',
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
    credit: { color: '#c9a227', fontWeight: 600 },
};
