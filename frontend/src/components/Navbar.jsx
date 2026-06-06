import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';

const MOBILE_BREAKPOINT = 768;

const NAV_LINKS = [
    { to: '/',          label: 'בית',        icon: '🏠' },
    { to: '/gallery',   label: 'גלריה',      icon: '📸' },
    { to: '/thank-you', label: 'קיר תודה',   icon: '💬' },
    { to: '/help',      label: 'איך עוזרים', icon: '💝' },
    { to: '/parasha',   label: 'עלון השבוע', icon: '📖' },
    { to: '/volunteer', label: 'מתנדבים',    icon: '🤝' },
    { to: '/contact',   label: 'צור קשר',    icon: '📩' },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth <= MOBILE_BREAKPOINT : false
    );
    const location = useLocation();
    const navigate = useNavigate();
    const tapCount = useRef(0);
    const tapTimer = useRef(null);

    function handleLogoTap(e) {
        tapCount.current += 1;
        clearTimeout(tapTimer.current);
        tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 2000);
        if (tapCount.current >= 5) {
            e.preventDefault();
            tapCount.current = 0;
            navigate('/admin');
        }
    }

    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
        const onMQ = (e) => setIsMobile(e.matches);
        mq.addEventListener('change', onMQ);
        setIsMobile(mq.matches);
        return () => mq.removeEventListener('change', onMQ);
    }, []);

    // סגירת תפריט בניווט
    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    // מניעת גלילה כשתפריט מובייל פתוח
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const isActive = (path) =>
        path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

    return (
        <>
            <nav style={s.nav} role="navigation" aria-label="ניווט ראשי">
                <div style={s.inner}>
                    {/* לוגו */}
                    <Link to="/" style={s.logoLink} aria-label="חסדי המלך — דף הבית" onClick={handleLogoTap}>
                        <Logo size={36} showText={true} />
                    </Link>

                    {/* קישורים — דסקטופ בלבד */}
                    {!isMobile && (
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
                    )}

                    {/* כפתור תרומה — דסקטופ בלבד */}
                    {!isMobile && (
                        <Link to="/help" style={s.donateBtn} aria-label="עזרו לנו — דף תרומה">
                            עזרו לנו ✨
                        </Link>
                    )}

                    {/* המבורגר — מובייל בלבד */}
                    {isMobile && <button
                        style={s.burger}
                        onClick={() => setMenuOpen(o => !o)}
                        aria-label={menuOpen ? "סגור תפריט" : "פתח תפריט"}
                        aria-expanded={menuOpen}
                    >
                        <span style={{ ...s.burgerLine, ...(menuOpen ? s.burgerLine1Open : {}) }} />
                        <span style={{ ...s.burgerLine, ...(menuOpen ? s.burgerLine2Open : {}) }} />
                        <span style={{ ...s.burgerLine, ...(menuOpen ? s.burgerLine3Open : {}) }} />
                    </button>}
                </div>

                {/* תפריט מובייל — רק כשפתוח ורק במובייל */}
                {isMobile && menuOpen && (
                    <div style={s.mobileMenu} role="menu">
                        {NAV_LINKS.map(({ to, label, icon }) => (
                            <Link key={to} to={to} style={{
                                ...s.mobileLink,
                                ...(isActive(to) ? s.mobileLinkActive : {})
                            }} role="menuitem">
                                <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                                {label}
                            </Link>
                        ))}
                        <Link to="/help" style={s.mobileDonateBtn} role="menuitem">
                            ✨ עזרו לנו
                        </Link>
                    </div>
                )}
            </nav>

            {/* Overlay כשתפריט מובייל פתוח */}
            {isMobile && menuOpen && (
                <div
                    style={s.overlay}
                    onClick={() => setMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

        
        </>
    );
}

const s = {
    nav: {
        background: 'linear-gradient(135deg, #0f2044 0%, #1a3460 100%)',
        zIndex: 1000,
        direction: 'rtl',
        fontFamily: "'Heebo', sans-serif",
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
    },
    link: {
        color: 'rgba(255,255,255,0.82)',
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: 500,
        padding: '6px 14px',
        borderRadius: '10px',
        position: 'relative',
        transition: 'color 0.2s, background 0.2s',
    },
    linkActive: {
        color: '#fbbf24',
        background: 'rgba(251, 191, 36, 0.12)',
        fontWeight: 700,
    },
    activeDot: {
        position: 'absolute',
        bottom: '-2px',
        right: '50%',
        transform: 'translateX(50%)',
        width: '5px',
        height: '5px',
        background: '#fbbf24',
        borderRadius: '50%',
    },
    donateBtn: {
        background: 'linear-gradient(135deg, #d4a017 0%, #f0c040 100%)',
        color: '#3b0764',
        textDecoration: 'none',
        padding: '9px 20px',
        borderRadius: '12px',
        fontWeight: 700,
        fontSize: '0.9rem',
        flexShrink: 0,
        display: 'inline-block',
        boxShadow: '0 2px 12px rgba(212, 160, 23, 0.3)',
        transition: 'transform 0.2s, box-shadow 0.2s',
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
        padding: '16px 20px 24px',
        gap: '4px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        background: 'linear-gradient(180deg, #0f2044 0%, #071530 100%)',
        animation: 'fadeIn 0.2s ease-out',
    },
    mobileLink: {
        color: 'rgba(255,255,255,0.85)',
        textDecoration: 'none',
        fontSize: '1.05rem',
        fontWeight: 500,
        padding: '14px 16px',
        borderRadius: '12px',
        transition: 'background 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    mobileLinkActive: {
        color: '#fbbf24',
        background: 'rgba(251, 191, 36, 0.12)',
        fontWeight: 700,
    },
    mobileDonateBtn: {
        marginTop: '12px',
        background: 'linear-gradient(135deg, #d4a017 0%, #f0c040 100%)',
        color: '#3b0764',
        textDecoration: 'none',
        padding: '15px 16px',
        borderRadius: '14px',
        fontWeight: 700,
        fontSize: '1.05rem',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(212, 160, 23, 0.25)',
    },

    // Overlay
    overlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 999,
        backdropFilter: 'blur(2px)',
    },
};
