import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE, { UPLOADS_BASE } from '../config';
import PageMeta from '../components/PageMeta';
import { useT } from '../hooks/useT';
import { useLang } from '../contexts/LangContext';
import { BP_MD } from '../breakpoints';

export default function ParashaPage() {
    const t = useT();
    const { lang } = useLang();
    const DATE_LOCALES = { he: 'he-IL', en: 'en-US', fr: 'fr-FR' };
    const [latest, setLatest] = useState(null);
    const [archive, setArchive] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imgError, setImgError] = useState(false);
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' && window.innerWidth < BP_MD
    );

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < BP_MD);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    async function trackDownload(id) {
        try {
            await fetch(`${API_BASE}/api/newsletters/${id}/download`, { method: 'POST' });
        } catch (_) {}
    }

    useEffect(() => {
        fetch(`${API_BASE}/api/newsletters`)
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                const list = Array.isArray(data) ? data : [];
                if (list.length > 0) {
                    setLatest(list[0]);
                    setArchive(list.slice(1));
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const fileUrl = (item) =>
        item.url || `${UPLOADS_BASE}/${item.filename}`;

    return (
        <div style={s.page}>
            <PageMeta title="דבר תורה" description="דבר תורה ועלון פרשת שבוע לכבוד השבת — לקרוא, להדפיס ולשתף. מתעדכן מדי שבוע." path="/parasha" />
            <section style={s.header}>
                <div style={s.headerOrb} />
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h1 style={s.title}>{t('parasha_title')}</h1>
                    <p style={s.subtitle}>
                        {t('parasha_for_print')}
                        <br />
                        <span style={s.updateNote}>{t('parasha_update')}</span>
                    </p>
                </div>
            </section>

            <section style={s.contentSection}>
                <div style={s.inner}>
                    {loading && <p style={s.msg}>{t('loading')}</p>}

                    {!loading && !latest && (
                        <div style={s.emptyCard}>
                            <span style={{ fontSize: '3rem' }}>📅</span>
                            <h2 style={{ color: 'var(--royal)', margin: 0 }}>{t('parasha_coming_title')}</h2>
                            <p style={{ color: 'var(--text-soft)', margin: 0 }}>
                                {t('parasha_coming_desc')}
                            </p>
                        </div>
                    )}

                    {latest && (
                        <div style={s.latestCard}>
                            <div style={s.latestHeader}>
                                <h2 style={s.latestTitle}>
                                    {latest.title || `פרשת ${latest.parasha_name || 'השבוע'}`}
                                </h2>
                                {latest.week_of && (
                                    <span style={s.weekBadge}>
                                        {new Date(latest.week_of).toLocaleDateString(DATE_LOCALES[lang] || 'he-IL')}
                                    </span>
                                )}
                            </div>

                            {/* הצגת קובץ */}
                            {imgError ? (
                                <a href={fileUrl(latest)} target="_blank" rel="noopener noreferrer"
                                    style={s.fallbackBox} onClick={() => trackDownload(latest.id)}>
                                    <span style={{ fontSize: '2.5rem' }}>📄</span>
                                    <strong style={{ color: 'var(--royal)' }}>{t('parasha_open_pdf')}</strong>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        {t('parasha_open_pdf_hint')}
                                    </span>
                                </a>
                            ) : latest.file_type === 'application/pdf' ? (
                                isMobile ? (
                                    // בנייד תצוגת PDF בתוך iframe לרוב לא עובדת — מציגים כרטיס פתיחה ברור
                                    <a href={fileUrl(latest)} target="_blank" rel="noopener noreferrer"
                                        style={s.fallbackBox} onClick={() => trackDownload(latest.id)}>
                                        <span style={{ fontSize: '2.5rem' }}>📄</span>
                                        <strong style={{ color: 'var(--royal)' }}>{t('parasha_open_pdf')}</strong>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            {t('parasha_open_pdf_hint')}
                                        </span>
                                    </a>
                                ) : (
                                    <iframe
                                        src={`${fileUrl(latest)}#toolbar=0`}
                                        style={s.pdfFrame}
                                        title={t('parasha_title')}
                                        onError={() => setImgError(true)}
                                    />
                                )
                            ) : (
                                <img
                                    src={fileUrl(latest)}
                                    alt={t('parasha_title')}
                                    style={s.previewImg}
                                    loading="lazy"
                                    onError={() => setImgError(true)}
                                />
                            )}

                            <a href={fileUrl(latest)} download style={s.downloadBtn}
                                target="_blank" rel="noopener noreferrer"
                                onClick={() => trackDownload(latest.id)}>
                                {t('parasha_download')}
                            </a>
                            <a href={fileUrl(latest)} target="_blank" rel="noopener noreferrer" style={s.printBtn}
                                onClick={() => trackDownload(latest.id)}>
                                🖨️ {t('parasha_print') || 'פתחו להדפסה'}
                            </a>
                        </div>
                    )}

                    {archive.length > 0 && (
                        <div style={s.archiveSection}>
                            <h3 style={s.archiveTitle}>📚 {t('parasha_archive')}</h3>
                            <div style={s.archiveList}>
                                {archive.map((item) => (
                                    <a
                                        key={item.id}
                                        href={fileUrl(item)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={s.archiveItem}
                                    >
                                        <span style={s.archiveIcon}>📄</span>
                                        <div>
                                            <strong style={s.archiveName}>
                                                {item.title || `פרשת ${item.parasha_name || ''}`}
                                            </strong>
                                            {item.week_of && (
                                                <span style={s.archiveDate}>
                                                    {new Date(item.week_of).toLocaleDateString(DATE_LOCALES[lang] || 'he-IL')}
                                                </span>
                                            )}
                                        </div>
                                        <span style={s.archiveArrow}>←</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={s.ctaRow}>
                        <Link to="/" style={s.backBtn}>{t('notfound_home')}</Link>
                        <Link to="/contact" style={s.contactBtn}>{t('contact_title')}</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

const s = {
    page: { fontFamily: "'Heebo', sans-serif", direction: 'inherit' },
    header: {
        background: 'linear-gradient(165deg, #0f2044 0%, #1a3460 50%, #071530 100%)',
        padding: '60px 20px 50px', textAlign: 'center', position: 'relative', overflow: 'hidden',
    },
    headerOrb: {
        position: 'absolute', top: '-20%', right: '10%', width: '200px', height: '200px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%)',
    },
    title: { color: '#fbbf24', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 800, marginBottom: '12px' },
    subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.7 },
    updateNote: { fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '6px', display: 'block' },

    contentSection: { padding: '40px 20px 60px', background: 'var(--bg-light)' },
    inner: { maxWidth: '780px', margin: '0 auto' },
    msg: { textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' },

    emptyCard: {
        background: 'var(--bg-card)', borderRadius: '24px', padding: '48px 32px',
        textAlign: 'center', boxShadow: 'var(--shadow-md)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
    },

    latestCard: {
        background: 'var(--bg-card)', borderRadius: '24px', padding: '32px',
        boxShadow: 'var(--shadow-md)', marginBottom: '32px',
        display: 'flex', flexDirection: 'column', gap: '20px',
    },
    latestHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' },
    latestTitle: { color: 'var(--royal)', fontSize: '1.3rem', fontWeight: 800, margin: 0 },
    weekBadge: {
        background: 'var(--royal-pale)', color: 'var(--royal)', padding: '4px 14px',
        borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600,
    },
    pdfFrame: {
        width: '100%', height: '80vh', minHeight: '520px', border: 'none', borderRadius: '12px',
        background: '#f8f8f8',
    },
    previewImg: {
        width: '100%', maxWidth: '700px', margin: '0 auto', display: 'block',
        borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        minHeight: '120px', background: '#f1f5fb',
    },
    fallbackBox: {
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        textAlign: 'center', textDecoration: 'none',
        background: 'var(--royal-pale)', borderRadius: '16px',
        padding: '40px 24px', border: '2px dashed rgba(15,32,68,0.2)',
    },
    downloadBtn: {
        background: 'linear-gradient(135deg, #0f2044, #1a3460)', color: '#fff',
        textDecoration: 'none', padding: '16px 32px', borderRadius: '14px', fontWeight: 700,
        fontSize: '1.05rem', textAlign: 'center', display: 'block',
    },
    printBtn: {
        background: 'var(--royal-pale)', color: 'var(--royal)',
        textDecoration: 'none', padding: '14px 32px', borderRadius: '14px', fontWeight: 600,
        fontSize: '1rem', textAlign: 'center', display: 'block',
    },

    archiveSection: { marginBottom: '32px' },
    archiveTitle: { color: 'var(--royal)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' },
    archiveList: { display: 'flex', flexDirection: 'column', gap: '8px' },
    archiveItem: {
        background: 'var(--bg-card)', borderRadius: '14px', padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: '14px',
        textDecoration: 'none', boxShadow: 'var(--shadow-sm)',
        transition: 'transform 0.2s',
    },
    archiveIcon: { fontSize: '1.4rem', flexShrink: 0 },
    archiveName: { display: 'block', color: 'var(--text)', fontSize: '0.95rem' },
    archiveDate: { display: 'block', color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '2px' },
    archiveArrow: { marginRight: 'auto', color: 'var(--text-muted)', fontSize: '1.1rem' },

    ctaRow: { display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' },
    backBtn: {
        background: 'var(--royal-pale)', color: 'var(--royal)', textDecoration: 'none',
        padding: '12px 28px', borderRadius: '12px', fontWeight: 600,
    },
    contactBtn: {
        background: 'linear-gradient(135deg, #0f2044, #1a3460)', color: '#fff',
        textDecoration: 'none', padding: '12px 28px', borderRadius: '12px', fontWeight: 600,
    },
};
