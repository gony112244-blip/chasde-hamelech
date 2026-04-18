import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

const NAV_LINKS = [
    { to: '/',          label: 'בית' },
    { to: '/gallery',   label: 'גלריה' },
    { to: '/thank-you', label: 'קיר תודה' },
    { to: '/help',      label: 'איך עוזרים' },
    { to: '/volunteer', label: 'מתנדבים' },
    { to: '/contact',   label: 'צור קשר' },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // הצללה בגלילה
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // סגירת תפריט בניווט
    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    const isActive = (path) =>
        path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

    return (
        <>
            <nav style={{
                ...s.nav,
                boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.25)' : '0 1px 0 rgba(255,255,255,0.08)'
            }}>
                <div style={s.inner}>
                    {/* לוגו */}
                    <Link to="/" style={s.logoLink}>
                        <Logo size={36} showText={true} />
                    </Link>

                    {/* קישורים — דסקטופ */}
                    <div style={s.desktopLinks}>
                        {NAV_LINKS.map(({ to, label }) => (
                            <Link key={to} to={to} style={{
                                ...s.link,
                                ...(isActive(to) ? s.linkActive : {})
                            }}>
                                {label}
                                {isActive(to) && <span style={s.activeDot} />}
                            </Link>
                        ))}
                    </div>

                    {/* כפתור תרומה — דסקטופ */}
                    <Link to="/help" style={s.donateBtn}>
                        עזרו לנו ✨
                    </Link>

                    {/* המבורגר — מובייל */}
                    <button
                        style={s.burger}
                        onClick={() => setMenuOpen(o => !o)}
                        aria-label="תפריט"
                    >
                        <span style={{ ...s.burgerLine, ...(menuOpen ? s.burgerLine1Open : {}) }} />
                        <span style={{ ...s.burgerLine, ...(menuOpen ? s.burgerLine2Open : {}) }} />
                        <span style={{ ...s.burgerLine, ...(menuOpen ? s.burgerLine3Open : {}) }} />
                    </button>
                </div>

                {/* תפריט מובייל */}
                {menuOpen && (
                    <div style={s.mobileMenu}>
                        {NAV_LINKS.map(({ to, label }) => (
                            <Link key={to} to={to} style={{
                                ...s.mobileLink,
                                ...(isActive(to) ? s.mobileLinkActive : {})
                            }}>
                                {label}
                            </Link>
                        ))}
                        <Link to="/help" style={s.mobileDonateBtn}>
                            ✨ עזרו לנו
                        </Link>
                    </div>
                )}
            </nav>
            {/* spacer כדי שהתוכן לא יתחבא מתחת לנאב */}
            <div style={{ height: '64px' }} />
        </>
    );
}

const s = {
    nav: {
        position: 'fixed',
        top: 0, right: 0, left: 0,
        zIndex: 1000,
        background: '#1e3a5f',
        direction: 'rtl',
        fontFamily: "'Heebo', sans-serif",
        transition: 'box-shadow 0.3s',
    },
    inner: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 20px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
    },
    logoLink: { textDecoration: 'none', flexShrink: 0 },

    desktopLinks: {
        display: 'flex',
        gap: '4px',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        '@media(max-width:768px)': { display: 'none' },
    },
    link: {
        color: 'rgba(255,255,255,0.82)',
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: 500,
        padding: '6px 12px',
        borderRadius: '8px',
        position: 'relative',
        transition: 'color 0.2s, background 0.2s',
    },
    linkActive: {
        color: '#c9a227',
        background: 'rgba(201,162,39,0.12)',
        fontWeight: 700,
    },
    activeDot: {
        position: 'absolute',
        bottom: '-2px',
        right: '50%',
        transform: 'translateX(50%)',
        width: '4px',
        height: '4px',
        background: '#c9a227',
        borderRadius: '50%',
    },
    donateBtn: {
        background: '#c9a227',
        color: '#1e3a5f',
        textDecoration: 'none',
        padding: '8px 18px',
        borderRadius: '10px',
        fontWeight: 700,
        fontSize: '0.9rem',
        flexShrink: 0,
        display: 'none', // יוצג ב-CSS, בינתיים hidden במובייל
    },

    // המבורגר
    burger: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '8px',
    },
    burgerLine: {
        display: 'block',
        width: '24px',
        height: '2px',
        background: '#fff',
        borderRadius: '2px',
        transition: 'transform 0.25s, opacity 0.25s',
    },
    burgerLine1Open: { transform: 'translateY(7px) rotate(45deg)' },
    burgerLine2Open: { opacity: 0 },
    burgerLine3Open: { transform: 'translateY(-7px) rotate(-45deg)' },

    // תפריט מובייל
    mobileMenu: {
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 20px 20px',
        gap: '4px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        background: '#1a3358',
    },
    mobileLink: {
        color: 'rgba(255,255,255,0.85)',
        textDecoration: 'none',
        fontSize: '1.05rem',
        fontWeight: 500,
        padding: '12px 16px',
        borderRadius: '10px',
        transition: 'background 0.2s',
    },
    mobileLinkActive: {
        color: '#c9a227',
        background: 'rgba(201,162,39,0.12)',
        fontWeight: 700,
    },
    mobileDonateBtn: {
        marginTop: '8px',
        background: '#c9a227',
        color: '#1e3a5f',
        textDecoration: 'none',
        padding: '13px 16px',
        borderRadius: '10px',
        fontWeight: 700,
        fontSize: '1rem',
        textAlign: 'center',
    },
};
