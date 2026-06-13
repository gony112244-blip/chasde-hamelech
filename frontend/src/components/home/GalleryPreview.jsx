import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API_BASE, { UPLOADS_BASE } from '../../config';
import { useT } from '../../hooks/useT';

const INTERVAL = 4000;
const FADE_MS = 600;

export default function GalleryPreview() {
    const [items, setItems] = useState([]);
    const [active, setActive] = useState(0);
    const [fade, setFade] = useState(true);
    const [musicOn, setMusicOn] = useState(false);
    const timerRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        fetch(`${API_BASE}/api/media?limit=20`)
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                const all = Array.isArray(data) ? data : data.items || [];
                const photos = all.filter(m => m.type === 'photo');
                if (photos.length > 0) setItems(photos);
            })
            .catch(() => {});
    }, []);

    // preload images
    useEffect(() => {
        items.forEach(item => {
            const img = new Image();
            img.src = item.url || `${UPLOADS_BASE}/${item.filename}`;
        });
    }, [items]);

    const goTo = useCallback((idx) => {
        setFade(false);
        setTimeout(() => {
            setActive(idx);
            setFade(true);
        }, FADE_MS / 2);
    }, []);

    const next = useCallback(() => {
        goTo(items.length > 0 ? (active + 1) % items.length : 0);
    }, [active, items.length, goTo]);

    const prev = useCallback(() => {
        goTo(items.length > 0 ? (active - 1 + items.length) % items.length : 0);
    }, [active, items.length, goTo]);

    // auto-advance
    useEffect(() => {
        if (items.length <= 1) return;
        timerRef.current = setInterval(next, INTERVAL);
        return () => clearInterval(timerRef.current);
    }, [items.length, next]);

    function resetTimer() {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(next, INTERVAL);
    }

    function handlePrev() { prev(); resetTimer(); }
    function handleNext() { next(); resetTimer(); }
    function handleDot(i) { goTo(i); resetTimer(); }

    function toggleMusic() {
        if (!audioRef.current) {
            audioRef.current = new Audio('/music.mp3');
            audioRef.current.loop = true;
            audioRef.current.volume = 0.2;
        }
        if (musicOn) {
            audioRef.current.pause();
            setMusicOn(false);
        } else {
            audioRef.current.play()
                .then(() => setMusicOn(true))
                .catch(() => setMusicOn(false));
        }
    }

    const t = useT();

    if (items.length === 0) return null;

    const current = items[active];
    const src = current.url || `${UPLOADS_BASE}/${current.filename}`;
    const altText = current.title || current.caption || t('gallery_preview_title');

    return (
        <section style={s.section}>
            <div style={s.inner}>
                <h2 style={s.title}>
                    <span>📸</span> {t('gallery_preview_title')}
                </h2>
                <p style={s.subtitle}>{t('gallery_preview_subtitle')}</p>

                <div style={s.slideshowWrap}>
                    <img
                        src={src}
                        alt={altText}
                        style={{
                            ...s.mainImg,
                            opacity: fade ? 1 : 0,
                            transition: `opacity ${FADE_MS}ms ease`,
                        }}
                    />

                    {current.title && (
                        <div style={{
                            ...s.caption,
                            opacity: fade ? 1 : 0,
                            transition: `opacity ${FADE_MS}ms ease`,
                        }}>
                            {current.title}
                        </div>
                    )}

                    {/* counter */}
                    <div style={s.counter}>
                        {active + 1} / {items.length}
                    </div>

                    {/* music toggle */}
                    <button style={s.musicBtn} onClick={toggleMusic} aria-label={musicOn ? t('a11y_mute') : t('a11y_play_music')}>
                        {musicOn ? '🔊' : '🔇'}
                    </button>

                    {items.length > 1 && (
                        <>
                            <button style={{ ...s.arrow, ...s.arrowRight }} onClick={handlePrev} aria-label={t('a11y_prev')}>›</button>
                            <button style={{ ...s.arrow, ...s.arrowLeft }} onClick={handleNext} aria-label={t('a11y_next')}>‹</button>
                        </>
                    )}
                </div>

                {items.length > 1 && (
                    <div style={s.dots}>
                        {items.map((_, i) => (
                            <button
                                key={i}
                                style={{ ...s.dot, ...(i === active ? s.dotActive : {}) }}
                                onClick={() => handleDot(i)}
                                aria-label={`${t('a11y_goto_image')} ${i + 1}`}
                            />
                        ))}
                    </div>
                )}

                <Link to="/gallery" style={s.galleryBtn}>
                    {t('gallery_preview_btn')}
                </Link>
            </div>
        </section>
    );
}

const s = {
    section: {
        background: 'linear-gradient(165deg, #0f2044 0%, #071530 100%)',
        padding: '80px 20px',
        fontFamily: "'Heebo', sans-serif",
        direction: 'inherit',
    },
    inner: {
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
    },
    title: {
        fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
        fontWeight: 800,
        color: '#fbbf24',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: '1rem',
        marginBottom: '32px',
    },
    slideshowWrap: {
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        aspectRatio: '16/10',
        background: '#071530',
    },
    mainImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    caption: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
        color: '#fff',
        padding: '32px 16px 16px',
        fontSize: '0.95rem',
        fontWeight: 600,
        textAlign: 'right',
    },
    counter: {
        position: 'absolute',
        top: '12px',
        left: '14px',
        background: 'rgba(0,0,0,0.5)',
        color: '#fff',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 600,
        backdropFilter: 'blur(4px)',
    },
    musicBtn: {
        position: 'absolute',
        top: '12px',
        right: '14px',
        background: 'rgba(0,0,0,0.5)',
        border: 'none',
        color: '#fff',
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '1.1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
    },
    arrow: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'rgba(0,0,0,0.45)',
        border: 'none',
        color: '#fff',
        fontSize: '2rem',
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        backdropFilter: 'blur(4px)',
        transition: 'background 0.2s',
    },
    arrowRight: { right: '12px' },
    arrowLeft: { left: '12px' },
    dots: {
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '16px',
        flexWrap: 'wrap',
    },
    dot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.25)',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        transition: 'background 0.3s, transform 0.3s',
    },
    dotActive: {
        background: '#fbbf24',
        transform: 'scale(1.4)',
    },
    galleryBtn: {
        display: 'inline-block',
        marginTop: '28px',
        background: 'linear-gradient(135deg, #d4a017, #f0c040)',
        color: '#3b0764',
        textDecoration: 'none',
        padding: '14px 36px',
        borderRadius: '14px',
        fontWeight: 700,
        fontSize: '1rem',
        boxShadow: '0 4px 20px rgba(212,160,23,0.3)',
    },
};
