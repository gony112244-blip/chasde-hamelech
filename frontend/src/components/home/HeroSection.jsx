import { Link } from 'react-router-dom';
import { useT } from '../../hooks/useT';

function scrollDown() {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
}

export default function HeroSection() {
    const t = useT();
    return (
        <section style={s.hero}>
            <div style={s.orb1} />
            <div style={s.orb2} />
            <div style={s.orb3} />

            <div style={s.content}>
                <div style={s.badge}>{t('hero_badge')}</div>

                <h1 style={s.title}>{t('hero_title')}</h1>

                <p style={s.slogan}>{t('hero_slogan')}</p>

                <p style={s.desc}>{t('hero_desc')}</p>

                <div style={s.ctaRow}>
                    <Link to="/help" style={s.ctaPrimary}>
                        {t('hero_cta_help')}
                    </Link>
                    <Link to="/volunteer" style={s.ctaSecondary}>
                        {t('hero_cta_volunteer')}
                    </Link>
                </div>

                <div
                    style={s.activityBadge}
                    onClick={scrollDown}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollDown(); } }}
                    role="button"
                    tabIndex={0}
                    aria-label="גלול למטה"
                >
                    <span style={s.activityPulse} />
                    <span>{t('hero_activity')}</span>
                    <span style={s.activityArrow}>↓</span>
                </div>
            </div>
        </section>
    );
}

const s = {
    hero: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100dvh - 64px)',
        background: 'linear-gradient(165deg, #0f2044 0%, #1a3460 25%, #071530 65%, #2e0a66 100%)',
        color: '#fff',
        fontFamily: "'Heebo', sans-serif",
        direction: 'inherit',
        padding: '60px 20px 40px',
        textAlign: 'center',
        overflow: 'hidden',
    },
    orb1: {
        position: 'absolute',
        top: '-10%',
        right: '-8%',
        width: '45vw',
        height: '45vw',
        maxWidth: '450px',
        maxHeight: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    orb2: {
        position: 'absolute',
        bottom: '-15%',
        left: '-5%',
        width: '35vw',
        height: '35vw',
        maxWidth: '350px',
        maxHeight: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    orb3: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60vw',
        height: '60vw',
        maxWidth: '600px',
        maxHeight: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 60%)',
        pointerEvents: 'none',
    },
    content: {
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '18px',
        maxWidth: '700px',
        animation: 'fadeInUp 0.8s ease-out',
    },
    badge: {
        background: 'rgba(251,191,36,0.12)',
        border: '1px solid rgba(251,191,36,0.3)',
        padding: '8px 22px',
        borderRadius: '999px',
        fontSize: '0.88rem',
        color: '#fbbf24',
        fontWeight: 600,
        letterSpacing: '0.3px',
    },
    title: {
        fontSize: 'clamp(3rem, 10vw, 5.5rem)',
        fontWeight: 900,
        background: 'linear-gradient(135deg, #fbbf24 0%, #f0c040 40%, #d4a017 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1.1,
        letterSpacing: '1.5px',
        margin: 0,
    },
    slogan: {
        fontSize: 'clamp(1.15rem, 3.5vw, 1.6rem)',
        opacity: 0.92,
        fontWeight: 500,
        lineHeight: 1.5,
        margin: 0,
    },
    desc: {
        fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
        opacity: 0.65,
        lineHeight: 1.8,
        maxWidth: '480px',
        margin: 0,
    },
    ctaRow: {
        display: 'flex',
        gap: '14px',
        marginTop: '12px',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    ctaPrimary: {
        background: 'linear-gradient(135deg, #d4a017, #f0c040)',
        color: '#3b0764',
        textDecoration: 'none',
        padding: '16px 40px',
        borderRadius: '14px',
        fontWeight: 700,
        fontSize: '1.1rem',
        boxShadow: '0 4px 24px rgba(212,160,23,0.35)',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    ctaSecondary: {
        background: 'rgba(255,255,255,0.08)',
        border: '2px solid rgba(255,255,255,0.25)',
        color: '#fff',
        textDecoration: 'none',
        padding: '14px 34px',
        borderRadius: '14px',
        fontWeight: 600,
        fontSize: '1.05rem',
        transition: 'background 0.2s',
    },
    activityBadge: {
        marginTop: '30px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(251,191,36,0.35)',
        borderRadius: '100px',
        padding: '10px 24px',
        fontSize: '0.9rem',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.8)',
        cursor: 'pointer',
        letterSpacing: '0.3px',
        transition: 'background 0.2s',
    },
    activityPulse: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#4ade80',
        boxShadow: '0 0 8px rgba(74,222,128,0.8)',
        flexShrink: 0,
    },
    activityArrow: {
        color: '#fbbf24',
        fontSize: '0.85rem',
        animation: 'float 2.5s ease-in-out infinite',
    },
};
