import { useState, useEffect, useRef, useCallback } from 'react';
import API_BASE, { UPLOADS_BASE } from '../config';
import PageMeta from '../components/PageMeta';
import { useT } from '../hooks/useT';
import { useLang } from '../contexts/LangContext';
import { translateBatch } from '../hooks/useTranslate';

const CATEGORIES = [
    { id: 'all',         key: 'gal_cat_all',         icon: '🌟' },
    { id: 'general',     key: 'gal_cat_general',     icon: '📸' },
    { id: 'toys',        key: 'gal_cat_toys',        icon: '🧸' },
    { id: 'books',       key: 'gal_cat_books',       icon: '📚' },
    { id: 'food',        key: 'gal_cat_food',        icon: '🍰' },
    { id: 'preparation', key: 'gal_cat_preparation', icon: '🎁' },
    { id: 'videos',      key: 'gal_cat_videos',      icon: '🎥' },
];

const DATE_LOCALES = { he: 'he-IL', en: 'en-US', fr: 'fr-FR' };

const PAGE_SIZE = 9;

const hoverCSS = `
  .gal-photo:hover { transform: scale(1.02); box-shadow: 0 8px 24px rgba(0,0,0,0.2) !important; }
  .gal-photo:hover .gal-overlay { background: rgba(0,0,0,0.32) !important; }
  .gal-photo:hover .gal-zoom { opacity: 1 !important; }
  .gal-video:hover { transform: scale(1.01); box-shadow: 0 8px 24px rgba(0,0,0,0.2) !important; }
`;

function VideoCard({ item }) {
    const t = useT();
    const ref = useRef(null);
    const [playing, setPlaying] = useState(false);

    function toggle() {
        if (!ref.current) return;
        if (playing) { ref.current.pause(); setPlaying(false); }
        else { ref.current.play(); setPlaying(true); }
    }

    const src = item.filename
        ? `${UPLOADS_BASE}/${item.filename}`
        : item.src;

    return (
        <div className="gal-video" style={s.videoCard}>
            <div style={s.videoWrapper}>
                <video
                    ref={ref}
                    src={src}
                    style={s.videoEl}
                    onEnded={() => setPlaying(false)}
                    playsInline
                    preload="metadata"
                />
                {!playing && (
                    <button style={s.playBtn} onClick={toggle} aria-label={t('gallery_play')}>
                        <span style={s.playIcon}>▶</span>
                    </button>
                )}
                {playing && (
                    <button style={s.pauseBtn} onClick={toggle} aria-label={t('gallery_pause')}>⏸</button>
                )}
            </div>
        </div>
    );
}

function PhotoCard({ item, onClick }) {
    const src = item.filename
        ? `${UPLOADS_BASE}/${item.filename}`
        : item.src;

    return (
        <button className="gal-photo" style={s.photoCard} onClick={() => onClick(item)}>
            <img src={src} alt="" style={s.photoImg} loading="lazy" />
            <div className="gal-overlay" style={s.photoOverlay}>
                <span className="gal-zoom" style={s.photoZoom}>🔍</span>
            </div>
        </button>
    );
}

export default function GalleryPage() {
    const t = useT();
    const { lang } = useLang();
    const [activeCategory, setActiveCategory] = useState('all');
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [lightbox, setLightbox] = useState(null);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(false);
    const sentinelRef = useRef(null);

    // טעינת פוסטים + תרגום אם צריך
    useEffect(() => {
        fetch(`${API_BASE}/api/gallery-posts`)
            .then(r => r.ok ? r.json() : [])
            .then(async data => {
                const list = Array.isArray(data) ? data : [];
                const translated = await translateBatch(list, ['title', 'body'], lang);
                setPosts(translated);
            })
            .catch(() => {});
    }, [lang]);

    const loadItems = useCallback(async (cat, pg, append = false) => {
        if (append) setLoadingMore(true);
        else setLoading(true);
        setError(false);

        try {
            // "videos" אינו קטגוריה אלא סוג מדיה — מסננים לפי type
            let filterParam = '';
            if (cat === 'videos') filterParam = '&type=video';
            else if (cat !== 'all') filterParam = `&category=${cat}`;

            const res = await fetch(`${API_BASE}/api/media?page=${pg}&limit=${PAGE_SIZE}${filterParam}`);
            if (!res.ok) throw new Error('bad response');
            const json = await res.json();
            setTotal(json.total || 0);
            setHasMore(json.hasMore || false);
            if (append) setItems(prev => [...prev, ...(json.items || [])]);
            else setItems(json.items || []);
        } catch {
            setError(true);
            if (!append) setItems([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        setPage(1);
        loadItems(activeCategory, 1, false);
    }, [activeCategory, loadItems]);

    // Infinite scroll — IntersectionObserver על sentinel בתחתית
    useEffect(() => {
        if (!sentinelRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    loadItems(activeCategory, nextPage, true);
                }
            },
            { rootMargin: '200px' }
        );
        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [hasMore, loadingMore, loading, page, activeCategory, loadItems]);

    const photos = items.filter(i => i.type === 'photo');
    const videos = items.filter(i => i.type === 'video');
    const showAll = activeCategory === 'all';
    const locale = DATE_LOCALES[lang] || 'he-IL';

    return (
        <div style={s.page}>
            <PageMeta title="גלריה" description="רגעים מהשטח — תמונות וסרטונים מהביקורים שלנו בבתי החולים, החיוכים והשמחה שאנחנו מביאים." path="/gallery" />
            <style>{hoverCSS}</style>

            {/* Lightbox */}
            {lightbox && (
                <div style={s.overlay} onClick={() => setLightbox(null)} role="dialog" aria-modal="true">
                    <button style={s.closeBtn} onClick={() => setLightbox(null)} aria-label={t('a11y_close')}>✕</button>
                    <img
                        src={lightbox.filename ? `${UPLOADS_BASE}/${lightbox.filename}` : lightbox.src}
                        alt={lightbox.title || ''}
                        style={s.lightboxImg}
                        onClick={e => e.stopPropagation()}
                    />
                    {lightbox.title && <p style={s.lightboxCaption}>{lightbox.title}</p>}
                </div>
            )}

            {/* Hero */}
            <section style={s.hero}>
                <div style={s.heroOrb} />
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h1 style={s.heroTitle}>{t('gallery_title')}</h1>
                    <p style={s.heroSub}>{t('gallery_subtitle')}</p>
                    {total > 0 && (
                        <span style={s.totalBadge}>{total} {t('gallery_items')}</span>
                    )}
                </div>
            </section>

            <section style={s.content}>
                <div style={s.inner}>

                    {/* פוסטים עדכניים */}
                    {posts.length > 0 && (
                        <div style={s.postsSection}>
                            <h2 style={s.postsSectionTitle}>📋 {t('gallery_posts_title')}</h2>
                            <div style={s.postsList}>
                                {posts.map(post => (
                                    <div key={post.id} style={s.postCard}>
                                        <div style={s.postHeader}>
                                            <h3 style={s.postTitle}>{post.title}</h3>
                                            <span style={s.postDate}>{fmtDate(post.created_at, locale)}</span>
                                        </div>
                                        {post.body && <p style={s.postBody}>{post.body}</p>}
                                        {post.media && post.media.length > 0 && (
                                            <div style={s.postMedia}>
                                                {post.media.filter(m => m.type === 'photo').map(m => (
                                                    <button key={m.id} style={s.postThumb}
                                                        onClick={() => setLightbox(m)}>
                                                        <img
                                                            src={`${UPLOADS_BASE}/${m.filename}`}
                                                            alt={m.title || ''}
                                                            style={s.postThumbImg}
                                                            loading="lazy"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Filter לכל המדיה */}
                    <div style={s.filterRow}>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                style={{ ...s.filterBtn, ...(activeCategory === cat.id ? s.filterBtnActive : {}) }}
                                onClick={() => setActiveCategory(cat.id)}
                                aria-pressed={activeCategory === cat.id}
                            >
                                {cat.icon} {t(cat.key)}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div style={s.spinnerWrap}>
                            <div style={s.spinner} />
                            <p style={{ color: '#6478a8', marginTop: '14px' }}>{t('loading')}</p>
                        </div>
                    ) : error ? (
                        <div style={s.empty}>
                            <span style={{ fontSize: '3rem' }}>⚠️</span>
                            <p style={{ color: '#6478a8', fontSize: '1rem' }}>{t('gallery_error')}</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div style={s.empty}>
                            <span style={{ fontSize: '3rem' }}>🖼️</span>
                            <p style={{ color: '#6478a8', fontSize: '1rem' }}>
                                {activeCategory === 'all'
                                    ? t('gallery_empty_all')
                                    : t('gallery_empty_cat')
                                }
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Photos section */}
                            {(showAll ? photos : items.filter(i => i.type === 'photo')).length > 0 && (
                                <div style={s.section}>
                                    {showAll && (
                                        <div style={s.sectionHeader}>
                                            <span style={{ ...s.sectionIcon, background: '#dbeafe' }}>📷</span>
                                            <h2 style={s.sectionTitle}>{t('gallery_photos_title')}</h2>
                                        </div>
                                    )}
                                    <div style={s.photoGrid}>
                                        {(showAll ? photos : items.filter(i => i.type === 'photo')).map(item => (
                                            <PhotoCard key={item.id} item={item} onClick={setLightbox} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Videos section */}
                            {(showAll ? videos : items.filter(i => i.type === 'video')).length > 0 && (
                                <div style={s.section}>
                                    {showAll && (
                                        <div style={s.sectionHeader}>
                                            <span style={{ ...s.sectionIcon, background: '#fce7f3' }}>🎥</span>
                                            <h2 style={s.sectionTitle}>{t('gallery_videos_title')}</h2>
                                        </div>
                                    )}
                                    <div style={s.videoGrid}>
                                        {(showAll ? videos : items.filter(i => i.type === 'video')).map(item => (
                                            <VideoCard key={item.id} item={item} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Sentinel לאינפיניט סקרול */}
                            <div ref={sentinelRef} style={{ height: '1px' }} />
                            {loadingMore && (
                                <div style={s.spinnerWrap}>
                                    <div style={s.spinner} />
                                </div>
                            )}
                        </>
                    )}

                    <div style={s.notice}>
                        <span style={{ fontSize: '1.2rem' }}>🔒</span>
                        <p style={s.noticeText}>{t('gallery_privacy_notice')}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

function fmtDate(iso, locale = 'he-IL') {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const s = {
    page: { fontFamily: "'Heebo', sans-serif", direction: 'inherit' },

    hero: {
        background: 'linear-gradient(165deg, #0f2044 0%, #1a3460 50%, #071530 100%)',
        padding: '60px 20px 50px', textAlign: 'center', position: 'relative', overflow: 'hidden',
    },
    heroOrb: {
        position: 'absolute', top: '-20%', left: '5%', width: '200px', height: '200px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)',
    },
    heroTitle: { color: '#fbbf24', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 800, marginBottom: '12px' },
    heroSub: { color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '16px' },
    totalBadge: {
        background: 'rgba(255,255,255,0.15)', color: '#fff',
        padding: '4px 18px', borderRadius: '999px', fontSize: '0.9rem', display: 'inline-block',
    },

    content: { padding: '40px 20px 60px', background: 'var(--bg-light)' },
    inner: { maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' },

    postsSection: { display: 'flex', flexDirection: 'column', gap: '16px' },
    postsSectionTitle: { color: 'var(--royal)', fontSize: '1.15rem', fontWeight: 800, margin: 0 },
    postsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
    postCard: {
        background: 'var(--bg-card)', borderRadius: '18px', padding: '24px',
        boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(15,32,68,0.06)',
    },
    postHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' },
    postTitle: { color: 'var(--royal)', fontSize: '1.05rem', fontWeight: 700, margin: 0 },
    postDate: { color: 'var(--text-muted)', fontSize: '0.82rem' },
    postBody: { color: 'var(--text-soft)', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 14px' },
    postMedia: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
    postThumb: {
        width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden',
        border: 'none', padding: 0, cursor: 'pointer', background: 'transparent',
        flexShrink: 0,
    },
    postThumbImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },

    filterRow: { display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' },
    filterBtn: {
        padding: '8px 18px', borderRadius: '999px', border: '2px solid rgba(15,32,68,0.2)',
        background: 'var(--bg-card)', color: 'var(--text-soft)', fontSize: '0.88rem', fontWeight: 600,
        cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Heebo', sans-serif",
    },
    filterBtnActive: { background: 'var(--royal)', color: '#fff', borderColor: 'var(--royal)' },

    section: {
        background: 'var(--bg-card)', borderRadius: '20px', padding: '24px',
        boxShadow: 'var(--shadow-md)', border: '1px solid rgba(15,32,68,0.05)',
    },
    sectionHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
    sectionIcon: {
        width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
    },
    sectionTitle: { color: 'var(--royal)', fontSize: '1.1rem', fontWeight: 700, margin: 0 },

    photoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' },
    photoCard: {
        position: 'relative', borderRadius: '16px', overflow: 'hidden',
        border: 'none', padding: 0, cursor: 'pointer', background: 'transparent',
        boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    photoImg: { width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' },
    photoOverlay: {
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s',
    },
    photoZoom: { fontSize: '2rem', opacity: 0, transition: 'opacity 0.2s' },

    videoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' },
    videoCard: {
        borderRadius: '16px', overflow: 'hidden', background: '#0a0a0a',
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)', transition: 'transform 0.2s, box-shadow 0.2s',
    },
    videoWrapper: {
        position: 'relative', aspectRatio: '9/16',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    videoEl: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
    playBtn: {
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)',
        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    playIcon: {
        width: '54px', height: '54px', borderRadius: '50%',
        background: 'rgba(251,191,36,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.4rem', color: '#1a1a1a', paddingRight: '4px',
    },
    pauseBtn: {
        position: 'absolute', bottom: '10px', left: '10px',
        background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff',
        borderRadius: '50%', width: '30px', height: '30px',
        cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
    },

    overlay: {
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 1000,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px',
    },
    closeBtn: {
        position: 'absolute', top: '16px', left: '16px',
        background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
        width: '40px', height: '40px', borderRadius: '50%', fontSize: '1.1rem',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    lightboxImg: { maxWidth: '90vw', maxHeight: '80vh', borderRadius: '12px', objectFit: 'contain' },
    lightboxCaption: { color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', marginTop: '14px', textAlign: 'center', maxWidth: '500px' },

    spinnerWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0' },
    spinner: {
        width: '40px', height: '40px', borderRadius: '50%',
        border: '3px solid #dbeafe', borderTop: '3px solid #0f2044',
        animation: 'spin 0.8s linear infinite',
    },
    empty: { textAlign: 'center', padding: '70px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' },

    notice: {
        display: 'flex', alignItems: 'center', gap: '12px',
        background: 'var(--bg-card)', borderRadius: '14px', padding: '18px 24px',
        boxShadow: 'var(--shadow-sm)',
    },
    noticeText: { color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 },
};
