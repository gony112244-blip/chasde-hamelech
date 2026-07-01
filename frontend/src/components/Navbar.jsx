import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useLang } from '../contexts/LangContext';
import { useT } from '../hooks/useT';

import { BP_MD } from '../breakpoints';

const MOBILE_BREAKPOINT = BP_MD;

const NAV_LINKS = [
    { to: '/',          key: 'nav_home',      icon: '🏠' },
    { to: '/gallery',   key: 'nav_gallery',   icon: '📸' },
    { to: '/thank-you', key: 'nav_thankyou',  icon: '💬' },
    { to: '/help',      key: 'nav_help',      icon: '💝' },
    { to: '/parasha',   key: 'nav_parasha',   icon: '📖' },
    { to: '/volunteer', key: 'nav_volunteer', icon: '🤝' },
    { to: '/contact',   key: 'nav_contact',   icon: '📩' },
];

const LANGS = [
    { code: 'he', label: 'עברית', short: 'עב' },
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'fr', label: 'Français', short: 'FR' },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth <= MOBILE_BREAKPOINT : false
    );
    const location = useLocation();
    const navigate = useNavigate();
    const { lang, setLang } = useLang();
    const t = useT();
    const tapCount = useRef(0);
    const tapTimer = useRef(null);
    const lastScroll = useRef(0);
    const langRef = useRef(null);

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

    useEffect(() => {
        function onScroll() {
            const y = window.scrollY;
            setScrolled(y > 10);
            if (y < 80) {
                setHidden(false);
            } else if (y > lastScroll.current + 6) {
                setHidden(true);
            } else if (y < lastScroll.current - 6) {
                setHidden(false);
            }
            lastScroll.current = y;
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    // סגירת dropdown שפה בלחיצה מחוץ
    useEffect(() => {
        function onClickOutside(e) {
            if (langRef.current && !langRef.current.contains(e.target)) {
                setLangOpen(false);
            }
        }
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const isActive = (path) =>
        path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

    const currentLang = LANGS.find(l => l.code === lang) || LANGS[0];

    return (
        <>
            <nav style={{
                ...s.nav,
                transform: hidden && !menuOpen ? 'translateY(-100%)' : 'translateY(0)',
                boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.25)' : 'none',
            }} role="navigation" aria-label="ניווט ראשי">
                <div style={{
                    ...s.inner,
                    ...(lang === 'he' ? { paddingRight: '54px' } : {}),
                }}>
                    {lang === 'he' && (
                        <span style={s.bsdCorner} aria-label='בס"ד'>
                            בס״ד
                        </span>
                    )}
                    {/* לוגו */}
                    <Link to="/" style={s.logoLink} aria-label="חסדי המלך — דף הבית" onClick={handleLogoTap}>
                        <Logo size={36} showText={true} />
                    </Link>

                    {/* קישורים — דסקטופ בלבד */}
                    {!isMobile && (
                        <div style={s.desktopLinks}>
                            {NAV_LINKS.map(({ to, key }) => (
                                <Link key={to} to={to} style={{
                                    ...s.link,
                                    ...(isActive(to) ? s.linkActive : {})
                                }}>
                                    {t(key)}
                                    {isActive(to) && <span style={s.activeDot} />}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* ימין: כפתור תרומה + בורר שפה */}
                    <div style={s.rightGroup}>
                        {/* בורר שפה */}
                        <div ref={langRef} style={s.langWrapper}>
                            <button
                                style={s.langBtn}
                                onClick={() => setLangOpen(o => !o)}
                                aria-label="בחרו שפה"
                                title="Language / שפה"
                            >
                                <span style={{ fontSize: '1rem' }}>🌐</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{currentLang.short}</span>
                                <span style={{ fontSize: '0.55rem', opacity: 0.7 }}>▾</span>
                            </button>
                            {langOpen && (
                                <div style={s.langDropdown}>
                                    {LANGS.map(l => (
                                        <button
                                            key={l.code}
                                            style={{
                                                ...s.langOption,
                                                ...(lang === l.code ? s.langOptionActive : {})
                                            }}
                                            onClick={() => { setLang(l.code); setLangOpen(false); }}
                                        >
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.6, minWidth: '20px' }}>{l.short}</span>
                                            <span>{l.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* כפתור תרומה — דסקטופ בלבד */}
                        {!isMobile && (
                            <Link to="/help" style={s.donateBtn} aria-label={t('nav_donate')}>
                                {t('nav_donate')}
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
                </div>

                {/* תפריט מובייל */}
                {isMobile && menuOpen && (
                    <div style={s.mobileMenu} role="menu">
                        {NAV_LINKS.map(({ to, key, icon }) => (
                            <Link key={to} to={to} style={{
                                ...s.mobileLink,
                                ...(isActive(to) ? s.mobileLinkActive : {})
                            }} role="menuitem">
                                <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                                {t(key)}
                            </Link>
                        ))}
                        <Link to="/help" style={s.mobileDonateBtn} role="menuitem">
                            {t('nav_donate')}
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
        direction: 'inherit',
        fontFamily: "'Heebo', sans-serif",
        position: 'sticky',
        top: 0,
        transition: 'transform 0.35s ease, box-shadow 0.3s ease',
        willChange: 'transform',
    },
    inner: {
        position: 'relative',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 20px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
    },
    bsdCorner: {
        position: 'absolute',
        top: '7px',
        right: '12px',
        color: 'rgba(251, 191, 36, 0.82)',
        fontSize: '0.68rem',
        fontWeight: 600,
        letterSpacing: '0.1em',
        fontFamily: "'Heebo', serif",
        lineHeight: 1,
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 1,
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

    rightGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexShrink: 0,
    },

    langWrapper: {
        position: 'relative',
    },
    langBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.18)',
        color: '#fff',
        borderRadius: '20px',
        padding: '6px 12px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        transition: 'background 0.2s',
        fontFamily: "'Heebo', sans-serif",
        whiteSpace: 'nowrap',
    },
    langDropdown: {
        position: 'absolute',
        top: 'calc(100% + 8px)',
        right: 0,
        background: '#0f2044',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '14px',
        overflow: 'hidden',
        minWidth: '120px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        zIndex: 1100,
    },
    langOption: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
        padding: '11px 16px',
        background: 'none',
        border: 'none',
        color: 'rgba(255,255,255,0.8)',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontFamily: "'Heebo', sans-serif",
        transition: 'background 0.15s',
        textAlign: 'right',
    },
    langOptionActive: {
        background: 'rgba(251, 191, 36, 0.15)',
        color: '#fbbf24',
        fontWeight: 700,
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

    mobileMenu: {
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 20px 24px',
        gap: '4px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        background: 'linear-gradient(180deg, #0f2044 0%, #071530 100%)',
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
        display: 'block',
    },

    overlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 999,
        backdropFilter: 'blur(2px)',
    },
};
