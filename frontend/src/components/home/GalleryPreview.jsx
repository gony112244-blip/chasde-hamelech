import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API_BASE, { UPLOADS_BASE } from '../../config';
import { useT } from '../../hooks/useT';

const INTERVAL = 5500;   // ms between slides
const CROSS_MS  = 1100;  // cross-fade duration

function getSrc(item) {
    return item.url || `${UPLOADS_BASE}/${item.filename}`;
}

function preloadImage(src) {
    return new Promise((resolve) => {
        const img = new window.Image();
        img.onload = async () => {
            try {
                if (img.decode) await img.decode();
                resolve(true);
            } catch {
                resolve(false);
            }
        };
        img.onerror = () => resolve(false);
        img.src = src;
    });
}

// Ken Burns variants — zoom/pan direction changes per slide for variety
const KB = [
    `kbZoomInLeft  ${INTERVAL + CROSS_MS}ms ease-out forwards`,
    `kbZoomInRight ${INTERVAL + CROSS_MS}ms ease-out forwards`,
    `kbZoomOut     ${INTERVAL + CROSS_MS}ms ease-out forwards`,
    `kbPanLeft     ${INTERVAL + CROSS_MS}ms ease-out forwards`,
];

const CSS = `
    @keyframes kbZoomInLeft  { from { transform: scale(1.04) translate( 0%,  0%); } to { transform: scale(1.14) translate(-3%, -2%); } }
    @keyframes kbZoomInRight { from { transform: scale(1.05) translate( 0%,  0%); } to { transform: scale(1.14) translate( 3%, -2%); } }
    @keyframes kbZoomOut     { from { transform: scale(1.16) translate( 0%,  0%); } to { transform: scale(1.05) translate( 0%,  2%); } }
    @keyframes kbPanLeft     { from { transform: scale(1.10) translate(-4%,  0%); } to { transform: scale(1.10) translate( 4%,  0%); } }
    @keyframes progressFill  { from { width: 0%; } to { width: 100%; } }
    .gp-layer { position:absolute; inset:0; overflow:hidden; background:#020810; }
    .gp-backdrop { position:absolute; inset:-18px; width:calc(100% + 36px); height:calc(100% + 36px); object-fit:cover; display:block; filter:blur(18px) brightness(0.62) saturate(1.08); transform-origin:center center; }
    .gp-photo { position:absolute; inset:0; width:100%; height:100%; object-fit:contain; display:block; transform-origin:center center; }
    .gp-fade-in  { animation: gpFadeIn  ${CROSS_MS}ms ease-out forwards; }
    .gp-fade-out { animation: gpFadeOut ${CROSS_MS}ms ease-out forwards; }
    @keyframes gpFadeIn  { from { opacity: 0; } to { opacity: 1; } }
    @keyframes gpFadeOut { from { opacity: 1; } to { opacity: 0; } }
    .gp-wrap:hover .gp-arrows { opacity: 1 !important; }
`;

export default function GalleryPreview() {
    const [items, setItems]         = useState([]);
    const [active, setActive]       = useState(0);
    const [prev,   setPrev]         = useState(null);    // index of outgoing slide
    const [kbKey,  setKbKey]        = useState(0);       // restarts KB animation on each slide
    const [progKey, setProgKey]     = useState(0);       // restarts progress bar
    const [musicOn, setMusicOn]     = useState(false);
    const timerRef  = useRef(null);
    const clearPrevRef = useRef(null);
    const transitioningRef = useRef(false);
    const audioRef  = useRef(null);
    const t = useT();

    useEffect(() => {
        let cancelled = false;
        fetch(`${API_BASE}/api/media?limit=20`)
            .then(r => r.ok ? r.json() : [])
            .then(async data => {
                const all    = Array.isArray(data) ? data : (data.items || []);
                const photos = all.filter(m => m.type === 'photo');
                const checked = await Promise.all(
                    photos.map(async (photo) => {
                        const ok = await preloadImage(getSrc(photo));
                        return ok ? photo : null;
                    })
                );
                const safePhotos = checked.filter(Boolean);
                if (!cancelled && safePhotos.length > 0) setItems(safePhotos);
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, []);

    const commitSlide = useCallback((nextIdx) => {
        clearTimeout(clearPrevRef.current);
        transitioningRef.current = true;
        setActive(cur => {
            setPrev(cur);
            return nextIdx;
        });
        setKbKey(k => k + 1);
        setProgKey(k => k + 1);
        // clear outgoing after cross-fade
        clearPrevRef.current = setTimeout(() => {
            setPrev(null);
            transitioningRef.current = false;
        }, CROSS_MS + 50);
    }, []);

    const goTo = useCallback(async (nextIdx) => {
        if (transitioningRef.current) return;
        if (nextIdx < 0 || nextIdx >= items.length) return;
        if (nextIdx === active) return;
        const loaded = await preloadImage(getSrc(items[nextIdx]));
        if (loaded) commitSlide(nextIdx);
    }, [active, commitSlide, items]);

    const next = useCallback(async () => {
        if (items.length <= 1) return;
        const n = (active + 1) % items.length;
        await goTo(n);
    }, [active, goTo, items.length]);

    const prevSlide = useCallback(async () => {
        if (items.length <= 1) return;
        const n = (active - 1 + items.length) % items.length;
        await goTo(n);
    }, [active, goTo, items.length]);

    useEffect(() => {
        if (items.length <= 1) return;
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(next, INTERVAL);
        return () => clearTimeout(timerRef.current);
    }, [active, items.length, next]);

    useEffect(() => {
        return () => {
            clearTimeout(clearPrevRef.current);
            clearTimeout(timerRef.current);
        };
    }, []);

    function resetTimer() {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(next, INTERVAL);
    }

    function handlePrev() { prevSlide(); resetTimer(); }
    function handleNext() { next();      resetTimer(); }
    function handleDot(i) { if (i !== active) { goTo(i); resetTimer(); } }

    function toggleMusic() {
        if (!audioRef.current) {
            audioRef.current = new Audio('/music.mp3');
            audioRef.current.loop = true;
            audioRef.current.volume = 0.2;
        }
        if (musicOn) { audioRef.current.pause(); setMusicOn(false); }
        else {
            audioRef.current.play()
                .then(() => setMusicOn(true))
                .catch(() => setMusicOn(false));
        }
    }

    if (items.length === 0) return null;

    const cur  = items[active];
    const curSrc  = getSrc(cur);
    const prevItem = prev !== null ? items[prev] : null;
    const prevSrc  = prevItem ? getSrc(prevItem) : null;
    const kbAnim   = KB[kbKey % KB.length];

    return (
        <section style={s.section}>
            <style>{CSS}</style>
            <div style={s.inner}>
                <h2 style={s.title}><span>📸</span> {t('gallery_preview_title')}</h2>
                <p style={s.subtitle}>{t('gallery_preview_subtitle')}</p>

                <div style={s.slideshowWrap} className="gp-wrap">

                    {/* ── outgoing image (fade-out) ── */}
                    {prevSrc && (
                        <div className="gp-layer gp-fade-out" style={{ zIndex: 1 }} aria-hidden="true">
                            <img src={prevSrc} alt="" className="gp-backdrop" />
                            <img src={prevSrc} alt="" className="gp-photo" />
                        </div>
                    )}

                    {/* ── incoming image (Ken Burns + fade-in) ── */}
                    <div
                        key={kbKey}
                        className="gp-layer gp-fade-in"
                        style={{ zIndex: 2, animation: `gpFadeIn ${CROSS_MS}ms ease-out forwards, ${kbAnim}` }}
                    >
                        <img src={curSrc} alt="" className="gp-backdrop" aria-hidden="true" />
                        <img
                            src={curSrc}
                            alt={cur.title || t('gallery_preview_title')}
                            className="gp-photo"
                        />
                    </div>

                    {/* ── vignette overlay ── */}
                    <div style={s.vignette} />

                    {/* ── slide counter ── */}
                    <div style={s.counter}>{active + 1} / {items.length}</div>

                    {/* ── music toggle ── */}
                    <button style={s.musicBtn} onClick={toggleMusic}
                        aria-label={musicOn ? t('a11y_mute') : t('a11y_play_music')}>
                        {musicOn ? '🔊' : '🔇'}
                    </button>

                    {/* ── arrows ── */}
                    {items.length > 1 && (
                        <div className="gp-arrows" style={{ ...s.arrows, opacity: 0, transition: 'opacity 0.25s' }}>
                            <button style={{ ...s.arrow, ...s.arrowRight }} onClick={handlePrev} aria-label={t('a11y_prev')}>›</button>
                            <button style={{ ...s.arrow, ...s.arrowLeft }}  onClick={handleNext} aria-label={t('a11y_next')}>‹</button>
                        </div>
                    )}

                    {/* ── progress bar ── */}
                    {items.length > 1 && (
                        <div style={s.progressTrack}>
                            <div
                                key={progKey}
                                style={{
                                    ...s.progressBar,
                                    animation: `progressFill ${INTERVAL}ms linear forwards`,
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* ── dots ── */}
                {items.length > 1 && (
                    <div style={s.dots}>
                        {items.map((_, i) => (
                            <button
                                key={i}
                                style={{
                                    ...s.dot,
                                    ...(i === active ? s.dotActive : {}),
                                }}
                                onClick={() => handleDot(i)}
                                aria-label={`${t('a11y_goto_image')} ${i + 1}`}
                            />
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
    },
    inner: { maxWidth: '860px', margin: '0 auto', textAlign: 'center' },
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
        aspectRatio: '16/10',
        background: '#020810',
    },

    vignette: {
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
        zIndex: 3, pointerEvents: 'none',
    },

    counter: {
        position: 'absolute', top: '14px', left: '16px',
        background: 'rgba(0,0,0,0.45)', color: '#fff',
        padding: '4px 12px', borderRadius: '20px',
        fontSize: '0.78rem', fontWeight: 700,
        backdropFilter: 'blur(6px)', zIndex: 5,
        letterSpacing: '0.5px',
    },
    musicBtn: {
        position: 'absolute', top: '12px', right: '14px',
        background: 'rgba(0,0,0,0.45)', border: 'none', color: '#fff',
        width: '38px', height: '38px', borderRadius: '50%',
        cursor: 'pointer', fontSize: '1.1rem', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(6px)', zIndex: 5,
    },

    arrows: { position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' },
    arrow: {
        position: 'absolute', top: '50%', transform: 'translateY(-50%)',
        background: 'rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.15)',
        color: '#fff', fontSize: '2rem',
        width: '46px', height: '46px', borderRadius: '50%',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)', transition: 'background 0.2s, transform 0.2s',
        pointerEvents: 'all',
    },
    arrowRight: { right: '14px' },
    arrowLeft:  { left:  '14px' },

    progressTrack: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '3px', background: 'rgba(255,255,255,0.15)', zIndex: 5,
    },
    progressBar: {
        height: '100%', width: 0,
        background: 'linear-gradient(90deg, #fbbf24, #f0c040)',
        borderRadius: '0 2px 2px 0',
    },

    dots: {
        display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px', flexWrap: 'wrap',
    },
    dot: {
        width: '7px', height: '7px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.22)', border: 'none', cursor: 'pointer',
        padding: 0, transition: 'background 0.3s, transform 0.3s, width 0.3s',
    },
    dotActive: { background: '#fbbf24', transform: 'scale(1.5)', width: '20px', borderRadius: '4px' },

    galleryBtn: {
        display: 'inline-block', marginTop: '30px',
        background: 'linear-gradient(135deg, #d4a017, #f0c040)',
        color: '#3b0764', textDecoration: 'none',
        padding: '14px 36px', borderRadius: '14px',
        fontWeight: 700, fontSize: '1rem',
        boxShadow: '0 4px 20px rgba(212,160,23,0.3)',
    },
};
