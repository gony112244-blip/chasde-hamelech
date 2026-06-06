import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import API_BASE from '../../config';

export default function GalleryPreview() {
    const [items, setItems] = useState([]);
    const [active, setActive] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        fetch(`${API_BASE}/api/media?limit=12`)
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                const photos = (Array.isArray(data) ? data : data.items || [])
                    .filter(m => m.type === 'image' || m.media_type === 'image');
                if (photos.length > 0) setItems(photos);
            })
            .catch(() => {});
    }, []);

    // החלפה אוטומטית כל 3 שניות
    useEffect(() => {
        if (items.length <= 1) return;
        timerRef.current = setInterval(() => {
            setActive(a => (a + 1) % items.length);
        }, 3000);
        return () => clearInterval(timerRef.current);
    }, [items.length]);

    function goTo(idx) {
        setActive(idx);
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setActive(a => (a + 1) % items.length);
        }, 3000);
    }

    if (items.length === 0) return null;

    const current = items[active];
    const src = current.url || `${API_BASE}/uploads/${current.filename}`;

    return (
        <section style={s.section}>
            <div style={s.inner}>
                <h2 style={s.title}>
                    <span>📸</span> גלריית הרגעים
                </h2>
                <p style={s.subtitle}>הצצה לחיוכים שאנחנו מצליחים לייצר</p>

                {/* מסך ראשי */}
                <div style={s.slideshowWrap}>
                    <img
                        src={src}
                        alt={current.caption || current.description || 'תמונה מהגלריה'}
                        style={s.mainImg}
                        key={src}
                    />
                    {(current.caption || current.description) && (
                        <div style={s.caption}>{current.caption || current.description}</div>
                    )}

                    {/* חצים */}
                    {items.length > 1 && (
                        <>
                            <button style={{ ...s.arrow, ...s.arrowRight }}
                                onClick={() => goTo((active - 1 + items.length) % items.length)}
                                aria-label="הקודם">›</button>
                            <button style={{ ...s.arrow, ...s.arrowLeft }}
                                onClick={() => goTo((active + 1) % items.length)}
                                aria-label="הבא">‹</button>
                        </>
                    )}
                </div>

                {/* נקודות */}
                {items.length > 1 && (
                    <div style={s.dots}>
                        {items.map((_, i) => (
                            <button
                                key={i}
                                style={{ ...s.dot, ...(i === active ? s.dotActive : {}) }}
                                onClick={() => goTo(i)}
                                aria-label={`מעבר לתמונה ${i + 1}`}
                            />
                        ))}
                    </div>
                )}

                <Link to="/gallery" style={s.galleryBtn}>
                    🖼️ לגלריה המלאה
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
        direction: 'rtl',
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
        maxHeight: '480px',
        background: '#071530',
    },
    mainImg: {
        width: '100%',
        maxHeight: '480px',
        objectFit: 'cover',
        display: 'block',
        transition: 'opacity 0.4s ease',
    },
    caption: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
        color: '#fff',
        padding: '24px 16px 16px',
        fontSize: '0.92rem',
        textAlign: 'right',
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
    },
    arrowRight: { right: '12px' },
    arrowLeft: { left: '12px' },
    dots: {
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '16px',
    },
    dot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.25)',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        transition: 'background 0.2s, transform 0.2s',
    },
    dotActive: {
        background: '#fbbf24',
        transform: 'scale(1.3)',
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
