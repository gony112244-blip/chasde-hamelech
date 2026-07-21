import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import API_BASE, { UPLOADS_BASE } from '../../config';
import { useT } from '../../hooks/useT';

const INTERVAL = 5500;
const CROSS_MS  = 900;

function getSrc(item) {
    return item.url || `${UPLOADS_BASE}/${item.filename}`;
}

const KB_CLASSES = ['gp-kb1', 'gp-kb2', 'gp-kb3', 'gp-kb4'];
const KB_DUR = `${INTERVAL + CROSS_MS}ms`;

const CSS = `
    @keyframes gpKb1 { from{transform:scale(1.04) translate(0%,0%)} to{transform:scale(1.14) translate(-3%,-2%)} }
    @keyframes gpKb2 { from{transform:scale(1.05) translate(0%,0%)} to{transform:scale(1.14) translate(3%,-2%)} }
    @keyframes gpKb3 { from{transform:scale(1.16) translate(0%,0%)} to{transform:scale(1.05) translate(0%,2%)} }
    @keyframes gpKb4 { from{transform:scale(1.10) translate(-4%,0%)} to{transform:scale(1.10) translate(4%,0%)} }
    .gp-kb1 .gp-photo { animation: gpKb1 ${KB_DUR} ease-out forwards; }
    .gp-kb2 .gp-photo { animation: gpKb2 ${KB_DUR} ease-out forwards; }
    .gp-kb3 .gp-photo { animation: gpKb3 ${KB_DUR} ease-out forwards; }
    .gp-kb4 .gp-photo { animation: gpKb4 ${KB_DUR} ease-out forwards; }
    .gp-photo { position:absolute; inset:0; width:100%; height:100%; object-fit:contain; display:block; transform-origin:center center; will-change:transform; }
    @keyframes gpProgress { from{width:0%} to{width:100%} }
    .gp-wrap:hover .gp-arrows { opacity:1!important; }
    @media (max-width: 1024px), (pointer: coarse) {
        .gp-arrows { opacity: 1 !important; }
    }
    .gp-wrap { will-change:transform; transform:translateZ(0); }
    /* טאבלט — ביטול backdrop-filter כבד לשיפור גלילה */
    @media (max-width: 1024px) and (pointer: coarse) {
        .gp-music-btn, .gp-counter-el, .gp-arrow-btn { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; background: rgba(0,0,0,0.6) !important; }
    }
`;

export default function GalleryPreview() {
    const [items,   setItems]   = useState([]);
    const [active,  setActive]  = useState(0);
    const [kbKey,   setKbKey]   = useState(0);
    const [progKey, setProgKey] = useState(0);
    const [musicOn, setMusicOn] = useState(false);
    const timerRef = useRef(null);
    const audioRef = useRef(null);
    const t = useT();

    useEffect(() => {
        fetch(`${API_BASE}/api/media?limit=20`)
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                const all    = Array.isArray(data) ? data : (data.items || []);
                const photos = all.filter(m => m.type === 'photo');
                if (photos.length > 0) setItems(photos);
            })
            .catch(() => {});
    }, []);

    function advance(nextIdx) {
        clearTimeout(timerRef.current);
        setActive(nextIdx);
        setKbKey(k => k + 1);
        setProgKey(k => k + 1);
    }

    // Chains setTimeout from current active — never fires mid-transition
    useEffect(() => {
        if (items.length <= 1) return;
        timerRef.current = setTimeout(
            () => advance((active + 1) % items.length),
            INTERVAL
        );
        return () => clearTimeout(timerRef.current);
    }, [active, items.length]); // eslint-disable-line

    useEffect(() => () => {
        clearTimeout(timerRef.current);
        // שחרור הנגן — לא משאירים music.mp3 בזיכרון אחרי עזיבת הדף
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.removeAttribute('src');
            audioRef.current.load();
            audioRef.current = null;
        }
    }, []);

    function toggleMusic() {
        // יצירה רק אחרי אינטראקציה — בלי preload אגרסיבי של קובץ ~9MB
        if (!audioRef.current) {
            const audio = new Audio();
            audio.preload = 'none';
            audio.loop = true;
            audio.volume = 0.2;
            audio.src = '/music.mp3';
            audioRef.current = audio;
        }
        if (musicOn) { audioRef.current.pause(); setMusicOn(false); }
        else { audioRef.current.play().then(() => setMusicOn(true)).catch(() => {}); }
    }

    if (items.length === 0) return null;

    const kbClass = KB_CLASSES[kbKey % KB_CLASSES.length];

    return (
        <section style={s.section}>
            <style>{CSS}</style>
            <div style={s.inner}>
                <h2 style={s.title}><span>📸</span> {t('gallery_preview_title')}</h2>
                <p style={s.subtitle}>{t('gallery_preview_subtitle')}</p>

                <div style={s.slideshowWrap} className="gp-wrap">

                    {/* שקפים ב-DOM; מדיה נטענת רק לפעילה + שכנות */}
                    {items.map((item, i) => {
                        const isActive = i === active;
                        const src = getSrc(item);
                        const n = items.length;
                        // טוענים רק את הפעילה + שכנות — לא את כל הגלריה בבת אחת
                        const shouldLoad = isActive
                            || i === (active + 1) % n
                            || i === (active - 1 + n) % n;
                        return (
                            <div
                                key={i}
                                className={isActive ? kbClass : ''}
                                style={{
                                    position: 'absolute', inset: 0,
                                    opacity: isActive ? 1 : 0,
                                    transition: `opacity ${CROSS_MS}ms ease-out`,
                                    zIndex: isActive ? 2 : 1,
                                    overflow: 'hidden',
                                    background: '#020810',
                                }}
                            >
                                {/* רקע מטושטש — רק כשהשקף נטען */}
                                {shouldLoad && (
                                    <div style={{
                                        position: 'absolute', inset: '-22px',
                                        backgroundImage: `url(${src})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        filter: 'blur(22px) brightness(0.52) saturate(1.1)',
                                    }} />
                                )}
                                {/* תמונה ראשית — key שונה כשנעשית active מריץ מחדש KB */}
                                {shouldLoad && (
                                    <img
                                        key={isActive ? `a${kbKey}` : `s${i}`}
                                        src={src}
                                        alt={item.title || ''}
                                        className="gp-photo"
                                        loading={isActive ? 'eager' : 'lazy'}
                                    />
                                )}
                            </div>
                        );
                    })}

                    <div style={s.vignette} />

                    <div style={s.counter}>{active + 1} / {items.length}</div>

                    <button style={s.musicBtn} className="gp-music-btn" onClick={toggleMusic}
                        aria-label={musicOn ? t('a11y_mute') : t('a11y_play_music')}>
                        {musicOn ? '🔊' : '🔇'}
                    </button>

                    {items.length > 1 && (
                        <div className="gp-arrows" style={s.arrows}>
                            <button style={{ ...s.arrow, ...s.arrowRight }} className="gp-arrow-btn"
                                onClick={() => advance((active - 1 + items.length) % items.length)}
                                aria-label={t('a11y_prev')}>›
                            </button>
                            <button style={{ ...s.arrow, ...s.arrowLeft }} className="gp-arrow-btn"
                                onClick={() => advance((active + 1) % items.length)}
                                aria-label={t('a11y_next')}>‹
                            </button>
                        </div>
                    )}

                    {items.length > 1 && (
                        <div style={s.progressTrack}>
                            <div key={progKey} style={{
                                ...s.progressBar,
                                animation: `gpProgress ${INTERVAL}ms linear forwards`,
                            }} />
                        </div>
                    )}
                </div>

                {items.length > 1 && (
                    <div style={s.dots}>
                        {items.map((_, i) => (
                            <button
                                key={i}
                                style={s.dotBtn}
                                onClick={() => advance(i)}
                                aria-label={`${t('a11y_goto_image')} ${i + 1}`}
                                aria-current={i === active ? 'true' : undefined}
                            >
                                <span style={{ ...s.dotInner, ...(i === active ? s.dotInnerActive : {}) }} />
                            </button>
                        ))}
                    </div>
                )}

                <Link to="/gallery" style={s.galleryBtn}>{t('gallery_preview_btn')}</Link>
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
        /* מניעת עיכוב גלילה בטאבלט */
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
    },
    inner: { maxWidth: '1000px', margin: '0 auto', textAlign: 'center' },
    title: {
        fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, color: '#fbbf24',
        marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
    },
    subtitle: { color: 'rgba(255,255,255,0.6)', fontSize: '1rem', marginBottom: '32px' },
    slideshowWrap: {
        position: 'relative',
        borderRadius: '22px',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.65)',
        aspectRatio: '16/9',
        background: '#020810',
        /* האצת GPU לגלילה חלקה */
        transform: 'translateZ(0)',
        willChange: 'transform',
    },
    vignette: {
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
        zIndex: 10, pointerEvents: 'none',
    },
    counter: {
        position: 'absolute', top: '14px', left: '16px',
        background: 'rgba(0,0,0,0.45)', color: '#fff',
        padding: '4px 12px', borderRadius: '20px',
        fontSize: '0.78rem', fontWeight: 700,
        backdropFilter: 'blur(6px)', zIndex: 11, letterSpacing: '0.5px',
    },
    musicBtn: {
        position: 'absolute', top: '12px', right: '14px',
        background: 'rgba(0,0,0,0.45)', border: 'none', color: '#fff',
        width: '44px', height: '44px', borderRadius: '50%',
        cursor: 'pointer', fontSize: '1.1rem', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(6px)', zIndex: 11,
    },
    arrows: { position: 'absolute', inset: 0, zIndex: 11, pointerEvents: 'none', opacity: 0, transition: 'opacity 0.25s' },
    arrow: {
        position: 'absolute', top: '50%', transform: 'translateY(-50%)',
        background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)',
        color: '#fff', fontSize: '2rem', width: '48px', height: '48px', borderRadius: '50%',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)', transition: 'background 0.2s', pointerEvents: 'all',
    },
    arrowRight: { right: '14px' },
    arrowLeft:  { left:  '14px' },
    progressTrack: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '3px', background: 'rgba(255,255,255,0.15)', zIndex: 11,
    },
    progressBar: {
        height: '100%', width: 0,
        background: 'linear-gradient(90deg, #fbbf24, #f0c040)',
        borderRadius: '0 2px 2px 0',
    },
    dots: {
        display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '16px', flexWrap: 'wrap',
    },
    dotBtn: {
        width: '44px', height: '44px', borderRadius: '50%',
        background: 'transparent', border: 'none', cursor: 'pointer',
        padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    dotInner: {
        width: '8px', height: '8px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.22)', transition: 'background 0.3s, transform 0.3s, width 0.3s',
        display: 'block',
    },
    dotInnerActive: { background: '#fbbf24', transform: 'scale(1.4)' },
    galleryBtn: {
        display: 'inline-block', marginTop: '30px',
        background: 'linear-gradient(135deg, #d4a017, #f0c040)',
        color: '#3b0764', textDecoration: 'none',
        padding: '14px 36px', borderRadius: '14px',
        fontWeight: 700, fontSize: '1rem',
        boxShadow: '0 4px 20px rgba(212,160,23,0.3)',
    },
};
