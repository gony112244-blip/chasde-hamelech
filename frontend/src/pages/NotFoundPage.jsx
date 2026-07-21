import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import { useT } from '../hooks/useT';

export default function NotFoundPage() {
    const t = useT();
    return (
        <div style={s.container}>
            <PageMeta
                title="הדף לא נמצא"
                description="הדף שחיפשתם לא נמצא באתר חסדי המלך."
                noindex
            />
            <div style={s.content}>
                <div style={s.numberContainer}>
                    <span style={s.number}>4</span>
                    <span style={s.crown}>👑</span>
                    <span style={s.number}>4</span>
                </div>

                <h1 style={s.title}>{t('notfound_subtitle')}</h1>
                <p style={s.text}>{t('notfound_desc')}</p>

                <div style={s.buttons}>
                    <Link to="/" style={s.primaryBtn}>{t('notfound_home')}</Link>
                    <Link to="/contact" style={s.secondaryBtn}>{t('nav_contact')}</Link>
                </div>
            </div>

            {/* אלמנטים דקורטיביים */}
            <div style={s.deco1} />
            <div style={s.deco2} />
        </div>
    );
}

const s = {
    container: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        background: 'linear-gradient(165deg, var(--bg-light) 0%, var(--bg-warm) 50%, var(--royal-pale) 100%)',
        fontFamily: "'Heebo', sans-serif",
        direction: 'inherit',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
    },
    content: {
        textAlign: 'center',
        maxWidth: '500px',
        position: 'relative',
        zIndex: 2,
        animation: 'fadeInUp 0.6s ease-out',
    },
    numberContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '20px',
    },
    number: {
        fontSize: 'clamp(4rem, 12vw, 7rem)',
        fontWeight: 900,
        background: 'linear-gradient(135deg, #0f2044, #2563eb)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1,
    },
    crown: {
        fontSize: 'clamp(3rem, 10vw, 5rem)',
        animation: 'float 3s ease-in-out infinite',
    },
    title: {
        color: '#0f2044',
        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
        fontWeight: 700,
        marginBottom: '12px',
    },
    text: {
        color: '#4a4458',
        fontSize: '1.05rem',
        lineHeight: 1.7,
        marginBottom: '32px',
    },
    buttons: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        alignItems: 'center',
    },
    primaryBtn: {
        background: 'linear-gradient(135deg, #0f2044 0%, #1a3460 100%)',
        color: '#fff',
        textDecoration: 'none',
        padding: '15px 36px',
        borderRadius: '14px',
        fontWeight: 700,
        fontSize: '1.05rem',
        boxShadow: '0 4px 20px rgba(15, 32, 68, 0.25)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        width: '100%',
        maxWidth: '280px',
        textAlign: 'center',
    },
    secondaryBtn: {
        background: 'transparent',
        color: '#0f2044',
        textDecoration: 'none',
        padding: '13px 36px',
        borderRadius: '14px',
        fontWeight: 600,
        fontSize: '1rem',
        border: '2px solid #0f2044',
        width: '100%',
        maxWidth: '280px',
        textAlign: 'center',
    },
    deco1: {
        position: 'absolute',
        top: '-80px',
        right: '-80px',
        width: '260px',
        height: '260px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,160,23,0.1) 0%, transparent 70%)',
    },
    deco2: {
        position: 'absolute',
        bottom: '-120px',
        left: '-60px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(15,32,68,0.08) 0%, transparent 70%)',
    },
};
