import { useState, useRef } from 'react';

const CATEGORIES = [
    {
        id: 'books',
        label: 'ספרים',
        icon: '📚',
        color: '#fef3c7',
        borderColor: '#f59e0b',
        type: 'photos',
        photos: [
            { src: '/gallery/volunteer-smiling-books-1.png', caption: 'מתנדב מחלק ספרים בחיוך' },
            { src: '/gallery/volunteer-smiling-books-2.png', caption: 'ספרים — מתנה לכל ילד' },
            { src: '/gallery/volunteer-reading-book.png', caption: 'המתנדב מעיין בספר לפני החלוקה' },
            { src: '/gallery/volunteer-books-on-cart.png', caption: 'ערמת ספרים מוכנה לחלוקה' },
        ],
    },
    {
        id: 'toys',
        label: 'צעצועים ומשחקים',
        icon: '🧸',
        color: '#dbeafe',
        borderColor: '#3b82f6',
        type: 'photos',
        photos: [
            { src: '/gallery/toy-distribution-bag.png', caption: 'שק צעצועים לילדי בית החולים' },
            { src: '/gallery/volunteer-toys-bag.png', caption: 'מתנדב עם שק צעצועים' },
            { src: '/gallery/volunteer-lei-toys.png', caption: 'אווירה שמחה — עם מחרוזות ומשחקים' },
            { src: '/gallery/volunteer-puppet-mask.png', caption: 'בובת יד — חיוכים בכל מסדרון' },
        ],
    },
    {
        id: 'food',
        label: 'מתוקים ומזון',
        icon: '🍩',
        color: '#dcfce7',
        borderColor: '#22c55e',
        type: 'photos',
        photos: [
            { src: '/gallery/donuts-cart.png', caption: 'ארגזי סופגניות לכל הקומות' },
        ],
    },
    {
        id: 'preparation',
        label: 'מאחורי הקלעים',
        icon: '🛒',
        color: '#dbeafe',
        borderColor: '#2563eb',
        type: 'photos',
        photos: [
            { src: '/gallery/preparation-bags-elevator.png', caption: 'שקיות מוכנות ליד המעלית' },
            { src: '/gallery/preparation-cart-bags.png', caption: 'עגלה עמוסה בחבילות' },
            { src: '/gallery/cart-supplies-corridor.png', caption: 'ציוד בדרך לילדים' },
            { src: '/gallery/corridor-family.png', caption: 'מתנדב מגיע אל המשפחות' },
        ],
    },
    {
        id: 'videos',
        label: 'סרטונים',
        icon: '🎥',
        color: '#fce7f3',
        borderColor: '#ec4899',
        type: 'videos',
        videos: [
            { src: '/gallery/videos/visit-1.mp4', caption: 'ביקור בבית החולים' },
            { src: '/gallery/videos/visit-2.mp4', caption: 'חלוקת מתנות לילדים' },
            { src: '/gallery/videos/visit-3.mp4', caption: 'רגעים מרגשים מהשטח' },
            { src: '/gallery/videos/visit-4.mp4', caption: 'אהבה ונתינה' },
            { src: '/gallery/videos/visit-5.mp4', caption: 'חיוכים במסדרון' },
            { src: '/gallery/videos/visit-6.mp4', caption: 'פעילות עם ילדים' },
            { src: '/gallery/videos/visit-7.mp4', caption: 'מתנדבים בפעולה' },
            { src: '/gallery/videos/visit-8.mp4', caption: 'רגע של שמחה' },
        ],
    },
];

const hoverCSS = `
  .gallery-photo-card:hover { transform: scale(1.02); box-shadow: 0 8px 24px rgba(0,0,0,0.18) !important; }
  .gallery-photo-card:hover .gallery-overlay { background: rgba(0,0,0,0.35) !important; }
  .gallery-photo-card:hover .gallery-zoom { opacity: 1 !important; }
  .gallery-video-card:hover { transform: scale(1.01); box-shadow: 0 8px 24px rgba(0,0,0,0.2) !important; }
`;

function VideoCard({ video }) {
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(false);

    function togglePlay() {
        if (!videoRef.current) return;
        if (playing) {
            videoRef.current.pause();
            setPlaying(false);
        } else {
            videoRef.current.play();
            setPlaying(true);
        }
    }

    return (
        <div className="gallery-video-card" style={s.videoCard}>
            <div style={s.videoWrapper}>
                <video
                    ref={videoRef}
                    src={video.src}
                    style={s.videoEl}
                    onEnded={() => setPlaying(false)}
                    playsInline
                    preload="metadata"
                />
                {!playing && (
                    <button style={s.playBtn} onClick={togglePlay} aria-label="הפעל סרטון">
                        <span style={s.playIcon}>▶</span>
                    </button>
                )}
                {playing && (
                    <button style={s.pauseBtn} onClick={togglePlay} aria-label="השהה">
                        <span style={{ fontSize: '1rem' }}>⏸</span>
                    </button>
                )}
            </div>
            {video.caption && (
                <p style={s.videoCaption}>{video.caption}</p>
            )}
        </div>
    );
}

export default function GalleryPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [lightbox, setLightbox] = useState(null);

    const totalPhotos = CATEGORIES.filter(c => c.type === 'photos').flatMap(c => c.photos).length;
    const totalVideos = CATEGORIES.find(c => c.type === 'videos')?.videos?.length ?? 0;

    const filteredCategories = activeCategory === 'all'
        ? CATEGORIES
        : CATEGORIES.filter(c => c.id === activeCategory);

    return (
        <div style={s.page}>
            <style>{hoverCSS}</style>

            {/* Lightbox for photos */}
            {lightbox && (
                <div style={s.overlay} onClick={() => setLightbox(null)}>
                    <button style={s.closeBtn} onClick={() => setLightbox(null)}>✕</button>
                    <img
                        src={lightbox.src}
                        alt={lightbox.caption}
                        style={s.lightboxImg}
                        onClick={e => e.stopPropagation()}
                    />
                    {lightbox.caption && (
                        <p style={s.lightboxCaption}>{lightbox.caption}</p>
                    )}
                </div>
            )}

            <section style={s.header}>
                <div style={s.headerOrb} />
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h1 style={s.title}>📸 גלריית רגעים</h1>
                    <p style={s.subtitle}>
                        כל תמונה וסרטון מספרים סיפור של חיוך.
                        <br />הנה כמה רגעים מהשטח — ישירות מבתי החולים.
                    </p>
                    <div style={s.statsBadges}>
                        <span style={s.badge}>📷 {totalPhotos} תמונות</span>
                        <span style={s.badge}>🎥 {totalVideos} סרטונים</span>
                    </div>
                </div>
            </section>

            <section style={s.content}>
                <div style={s.inner}>
                    {/* Category Filter */}
                    <div style={s.filterRow}>
                        <button
                            style={{ ...s.filterBtn, ...(activeCategory === 'all' ? s.filterBtnActive : {}) }}
                            onClick={() => setActiveCategory('all')}
                        >
                            🌟 הכל
                        </button>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                style={{ ...s.filterBtn, ...(activeCategory === cat.id ? s.filterBtnActive : {}) }}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.icon} {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Category Sections */}
                    {filteredCategories.map(cat => (
                        <div key={cat.id} style={s.section}>
                            <div style={{ ...s.sectionHeader, borderColor: cat.borderColor }}>
                                <span style={{ ...s.sectionIcon, background: cat.color }}>{cat.icon}</span>
                                <div>
                                    <h2 style={s.sectionTitle}>{cat.label}</h2>
                                    <span style={s.sectionCount}>
                                        {cat.type === 'videos'
                                            ? `${cat.videos.length} סרטונים`
                                            : `${cat.photos.length} תמונות`}
                                    </span>
                                </div>
                            </div>

                            {cat.type === 'videos' ? (
                                <div style={s.videoGrid}>
                                    {cat.videos.map((video, i) => (
                                        <VideoCard key={i} video={video} />
                                    ))}
                                </div>
                            ) : (
                                <div style={s.photoGrid}>
                                    {cat.photos.map((photo, i) => (
                                        <button
                                            key={i}
                                            className="gallery-photo-card"
                                            style={s.photoCard}
                                            onClick={() => setLightbox(photo)}
                                            title={photo.caption}
                                        >
                                            <img
                                                src={photo.src}
                                                alt={photo.caption}
                                                style={s.photoImg}
                                                loading="lazy"
                                            />
                                            <div className="gallery-overlay" style={s.photoOverlay}>
                                                <span className="gallery-zoom" style={s.photoZoom}>🔍</span>
                                            </div>
                                            {photo.caption && (
                                                <p style={s.photoCaption}>{photo.caption}</p>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <div style={s.notice}>
                        <span style={{ fontSize: '1.2rem' }}>🔒</span>
                        <p style={s.noticeText}>
                            כל התמונות והסרטונים מפורסמים באישור ההורים ובהתאם לחוק הגנת הפרטיות.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

const s = {
    page: { fontFamily: "'Heebo', sans-serif", direction: 'rtl' },
    header: {
        background: 'linear-gradient(165deg, #0f2044 0%, #1a3460 50%, #071530 100%)',
        padding: '60px 20px 50px', textAlign: 'center', position: 'relative', overflow: 'hidden',
    },
    headerOrb: {
        position: 'absolute', top: '-20%', left: '5%', width: '200px', height: '200px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)',
    },
    title: { color: '#fbbf24', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 800, marginBottom: '12px' },
    subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '16px' },
    statsBadges: { display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' },
    badge: {
        background: 'rgba(255,255,255,0.15)', color: '#fff',
        padding: '4px 16px', borderRadius: '999px', fontSize: '0.9rem',
    },
    content: { padding: '40px 20px 60px', background: 'var(--bg-light)' },
    inner: { maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '36px' },

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
    sectionHeader: {
        display: 'flex', alignItems: 'center', gap: '14px',
        marginBottom: '20px', paddingBottom: '16px',
        borderBottom: '2px solid #e5e7eb',
    },
    sectionIcon: {
        width: '44px', height: '44px', borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem', flexShrink: 0,
    },
    sectionTitle: { color: 'var(--royal)', fontSize: '1.2rem', fontWeight: 700, margin: '0 0 2px' },
    sectionCount: { color: 'var(--text-muted)', fontSize: '0.82rem' },

    photoGrid: {
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px',
    },
    photoCard: {
        position: 'relative', borderRadius: '14px', overflow: 'hidden',
        border: 'none', padding: 0, cursor: 'pointer', background: 'transparent',
        textAlign: 'right', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    photoImg: { width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' },
    photoOverlay: {
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s',
    },
    photoZoom: { fontSize: '1.8rem', opacity: 0 },
    photoCaption: {
        padding: '8px 12px', fontSize: '0.8rem', color: 'var(--text-soft)',
        background: 'rgba(255,255,255,0.95)', margin: 0, lineHeight: 1.4,
    },

    videoGrid: {
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px',
    },
    videoCard: {
        borderRadius: '14px', overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        background: '#000',
    },
    videoWrapper: {
        position: 'relative', aspectRatio: '9/16', background: '#111',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    videoEl: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
    playBtn: {
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
        border: 'none', cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
    },
    playIcon: {
        width: '56px', height: '56px', borderRadius: '50%',
        background: 'rgba(251,191,36,0.9)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: '1.4rem', color: '#1a1a1a', paddingRight: '4px',
    },
    pauseBtn: {
        position: 'absolute', bottom: '10px', left: '10px',
        background: 'rgba(0,0,0,0.5)', border: 'none',
        color: '#fff', borderRadius: '50%', width: '32px', height: '32px',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    videoCaption: {
        padding: '10px 14px', fontSize: '0.82rem', color: '#fff',
        background: '#1a1a2e', margin: 0, lineHeight: 1.4,
    },

    overlay: {
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
        zIndex: 1000, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '20px',
    },
    closeBtn: {
        position: 'absolute', top: '16px', left: '16px',
        background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
        width: '40px', height: '40px', borderRadius: '50%', fontSize: '1.1rem',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    lightboxImg: {
        maxWidth: '90vw', maxHeight: '80vh', borderRadius: '12px',
        objectFit: 'contain', boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
    },
    lightboxCaption: {
        color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', marginTop: '14px',
        textAlign: 'center', maxWidth: '500px',
    },

    notice: {
        display: 'flex', alignItems: 'center', gap: '12px',
        background: 'var(--bg-card)', borderRadius: '14px', padding: '18px 24px',
        boxShadow: 'var(--shadow-sm)',
    },
    noticeText: { color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 },
};
