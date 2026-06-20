import { Link } from 'react-router-dom';
import { useT } from '../hooks/useT';

// דף QR ייעודי — ללא Navbar/Footer — נפתח מסריקת QR בבית החולים
export default function QRLandingPage() {
    const t = useT();
    return (
        <div style={s.page}>
            {/* רקע */}
            <div style={s.bgOrb1} />
            <div style={s.bgOrb2} />

            <div style={s.content}>
                {/* לוגו קטן */}
                <div style={s.logoRow}>
                    <span style={s.crown}>👑</span>
                    <span style={s.logoText}>חסדי המלך</span>
                </div>

                {/* מסר ראשי — חם, לא "תרמו כסף" */}
                <h1 style={s.title}>
                    {t('qr_title')}
                </h1>

                <p style={s.text}>
                    {t('qr_subtitle')}
                </p>

                <p style={s.textSmall}>
                    {t('qr_desc')}
                </p>

                {/* כפתורים */}
                <div style={s.buttons}>
                    <Link to="/thank-you" style={s.btnPrimary}>
                        {t('qr_btn_feedback')}
                    </Link>
                    <Link to="/help" style={s.btnSecondary}>
                        {t('qr_btn_help')}
                    </Link>
                    <Link to="/" style={s.btnTertiary}>
                        {t('qr_btn_website')}
                    </Link>
                </div>

                {/* חתימה */}
                <div style={s.footer}>
                    <p style={s.footerText}>
                        {t('qr_footer')}
                    </p>
                </div>
            </div>
        </div>
    );
}

const s = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(165deg, #0f2044 0%, #1a3460 30%, #071530 70%, #2e0a66 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Heebo', sans-serif",
        direction: 'inherit',
        padding: '30px 20px',
        position: 'relative',
        overflow: 'hidden',
    },
    bgOrb1: {
        position: 'absolute', top: '-15%', right: '-10%', width: '250px', height: '250px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%)',
    },
    bgOrb2: {
        position: 'absolute', bottom: '-10%', left: '-5%', width: '200px', height: '200px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
    },
    content: {
        position: 'relative', zIndex: 2, maxWidth: '400px', width: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '20px', textAlign: 'center', animation: 'fadeInUp 0.6s ease-out',
    },
    logoRow: { display: 'flex', alignItems: 'center', gap: '8px' },
    crown: { fontSize: '1.8rem' },
    logoText: { color: '#fbbf24', fontSize: '1.3rem', fontWeight: 800 },
    title: {
        color: '#fff', fontSize: 'clamp(1.5rem, 6vw, 2rem)', fontWeight: 800,
        margin: 0, lineHeight: 1.3,
    },
    text: { color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', lineHeight: 1.7, margin: 0 },
    textSmall: { color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 },
    buttons: {
        display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', marginTop: '8px',
    },
    btnPrimary: {
        background: 'linear-gradient(135deg, #d4a017, #f0c040)', color: '#3b0764',
        textDecoration: 'none', padding: '16px', borderRadius: '14px', fontWeight: 700,
        fontSize: '1.05rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(212,160,23,0.3)',
    },
    btnSecondary: {
        background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)',
        color: '#fff', textDecoration: 'none', padding: '14px', borderRadius: '14px',
        fontWeight: 600, fontSize: '1rem', textAlign: 'center',
    },
    btnTertiary: {
        background: 'transparent', color: 'rgba(255,255,255,0.6)',
        textDecoration: 'none', padding: '10px', fontSize: '0.9rem', fontWeight: 500,
    },
    footer: { marginTop: '16px' },
    footerText: { color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', margin: 0 },
};
