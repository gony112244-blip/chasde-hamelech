import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useT } from '../hooks/useT';

export default function Footer() {
    const year = new Date().getFullYear();
    const t = useT();

    return (
        <footer style={s.footer}>
            <div style={s.inner}>
                <div style={s.col}>
                    <Logo size={32} showText={true} />
                    <p style={s.desc}>{t('footer_about')}</p>
                </div>

                <div style={s.col}>
                    <h4 style={s.colTitle}>{t('footer_links')}</h4>
                    <nav style={s.links}>
                        <Link to="/gallery" style={s.link}>{t('nav_gallery')}</Link>
                        <Link to="/thank-you" style={s.link}>{t('nav_thankyou')}</Link>
                        <Link to="/parasha" style={s.link}>{t('nav_parasha')}</Link>
                        <Link to="/volunteer" style={s.link}>{t('nav_volunteer')}</Link>
                        <Link to="/contact" style={s.link}>{t('nav_contact')}</Link>
                    </nav>
                </div>

                <div style={s.col}>
                    <h4 style={s.colTitle}>{t('footer_contact')}</h4>
                    <nav style={s.links}>
                        <Link to="/privacy" style={s.link}>{t('footer_privacy')}</Link>
                        <Link to="/accessibility" style={s.link}>{t('footer_accessibility')}</Link>
                    </nav>
                </div>
            </div>

            <div style={s.bottom}>
                <span>© {year} חסדי המלך. {t('footer_rights')}.</span>
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
