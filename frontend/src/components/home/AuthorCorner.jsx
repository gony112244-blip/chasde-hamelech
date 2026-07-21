import { useState, useEffect } from 'react';
import { useT } from '../../hooks/useT';
import { BP_SM, mq } from '../../breakpoints';

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth <= BP_SM : false
    );
    useEffect(() => {
        const media = window.matchMedia(mq.sm);
        const handler = (e) => setIsMobile(e.matches);
        media.addEventListener('change', handler);
        setIsMobile(media.matches);
        return () => media.removeEventListener('change', handler);
    }, []);
    return isMobile;
}

function FounderBlock({ imgSrc, imgAlt, imgPosition, borderColor, name, children }) {
    const isMobile = useIsMobile();
    return (
        <div style={{ ...s.founderRow, flexDirection: isMobile ? 'column' : 'row' }}>
            <div style={s.imageWrap}>
                <div style={{ ...s.imageFrame, borderColor }}>
                    {imgSrc
                        ? <img src={imgSrc} alt={imgAlt} style={{ ...s.profileImg, objectPosition: imgPosition }} loading="lazy" />
                        : <div style={s.photoPlaceholder}><span style={{ fontSize: '2.5rem' }} aria-hidden="true">🤝</span></div>
                    }
                </div>
                <p style={s.personName}>{name}</p>
            </div>
            <div style={s.textContent}>
                {children}
            </div>
        </div>
    );
}

export default function AuthorCorner() {
    const isMobile = useIsMobile();
    const t = useT();

    return (
        <section style={s.section}>
            <div style={s.inner}>

                {/* ── החברים מהשטח ── */}
                <h2 style={s.mainTitle}>
                    <span>👑</span> {t('author_friends_title')}
                </h2>

                {/* ── דוד — ראשון ── */}
                <FounderBlock
                    imgSrc="/david-shmukha.png"
                    imgAlt="דוד שמוחה"
                    imgPosition="62% top"
                    borderColor="#93c5fd"
                    name="דוד שמוחה"
                >
                    <p style={s.text}>{t('author_david_p1')}</p>
                    <p style={s.text}>{t('author_david_p2')}</p>
                    <div style={{ ...s.quote, borderColor: 'rgba(147,197,253,0.25)', background: 'rgba(147,197,253,0.08)' }}>
                        <span style={{ ...s.quoteIcon, color: '#93c5fd' }}>&ldquo;</span>
                        <p style={{ ...s.quoteText, color: '#93c5fd' }}>{t('author_quote_david')}</p>
                    </div>
                </FounderBlock>

                <div style={{ ...s.divider, margin: '40px 0' }} />

                {/* ── אביתר — שני ── */}
                <FounderBlock
                    imgSrc={null}
                    imgAlt="אביתר"
                    imgPosition="center top"
                    borderColor="#fbbf24"
                    name="אביתר"
                >
                    <p style={s.text}>{t('author_avitar_p1')}</p>
                    <p style={s.text}>{t('author_avitar_p2')}</p>
                    <div style={s.quote}>
                        <span style={s.quoteIcon}>&ldquo;</span>
                        <p style={s.quoteText}>{t('author_quote_avitar')}</p>
                    </div>
                </FounderBlock>

                {/* ── מפריד ── */}
                <div style={s.divider} />

                {/* ── פינת הסופר ── */}
                <div style={s.block}>
                    <h2 style={s.blockTitle}>
                        <span>✍️</span> {t('author_corner_heading')}
                    </h2>
                    <div style={{ ...s.founderRow, flexDirection: isMobile ? 'column' : 'row' }}>
                        <div style={s.imageWrap}>
                            <div style={s.bookCoverFrame}>
                                <img
                                    src="/book-cover.png?v=4"
                                    alt='כריכת הספר "שר הצבא"'
                                    style={s.bookCoverImg}
                                    loading="lazy"
                                />
                            </div>
                            <p style={s.personRole}>{t('author_book_label')}</p>
                        </div>
                        <div style={s.textContent}>
                            <p style={s.text}>{t('author_gony_p1')}</p>
                            <p style={s.text}>{t('author_gony_p2')}</p>
                            <p style={s.text}>{t('author_gony_p3')}</p>
                            <p style={s.text}>{t('author_gony_p4')}</p>
                            <div style={s.quote}>
                                <span style={s.quoteIcon}>&ldquo;</span>
                                <p style={s.quoteText}>{t('author_quote_gony')}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

const s = {
    section: {
        background: 'linear-gradient(165deg, #0f2044 0%, #071530 100%)',
        fontFamily: "'Heebo', sans-serif",
        direction: 'inherit',
        padding: '80px 20px',
        color: '#fff',
    },
    inner: { maxWidth: '1000px', margin: '0 auto' },
    mainTitle: {
        fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
        fontWeight: 800,
        color: '#fbbf24',
        textAlign: 'center',
        marginBottom: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
    },
    founderRow: {
        display: 'flex',
        gap: '36px',
        alignItems: 'center',
        maxWidth: '860px',
        margin: '0 auto',
    },
    block: { padding: '20px 0' },
    blockTitle: {
        fontSize: 'clamp(1.4rem, 3.5vw, 2rem)',
        fontWeight: 800,
        color: '#fbbf24',
        textAlign: 'center',
        marginBottom: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
    },
    divider: {
        border: 'none',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        margin: '52px 0 40px',
    },
    imageWrap: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0,
    },
    imageFrame: {
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        border: '4px solid #fbbf24',
        overflow: 'hidden',
        boxShadow: '0 0 0 6px rgba(251,191,36,0.12)',
    },
    profileImg: { width: '100%', height: '100%', objectFit: 'cover' },
    photoPlaceholder: {
        width: '100%',
        height: '100%',
        background: 'rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
    },
    placeholderText: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' },
    bookCoverFrame: {
        width: '150px',
        height: '210px',
        borderRadius: '24px',
        border: '4px solid #fbbf24',
        overflow: 'hidden',
        boxShadow: '0 0 0 6px rgba(251,191,36,0.12)',
        background: 'rgba(0,0,0,0.2)',
    },
    bookCoverImg: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        objectPosition: 'center',
        display: 'block',
        padding: '8px',
        boxSizing: 'border-box',
    },
    personName: { fontSize: '1.05rem', fontWeight: 700, color: '#fbbf24', margin: 0, textAlign: 'center' },
    personRole: { fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', margin: 0, textAlign: 'center' },
    textContent: { display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 },
    bookTitle: { fontSize: '1.3rem', fontWeight: 700, color: '#fbbf24', margin: 0 },
    text: { fontSize: '0.97rem', lineHeight: 1.8, opacity: 0.85, margin: 0 },
    quote: {
        background: 'rgba(251,191,36,0.1)',
        border: '1px solid rgba(251,191,36,0.2)',
        borderRadius: '16px',
        padding: '18px 24px',
        position: 'relative',
        marginTop: '6px',
        textAlign: 'center',
    },
    quoteIcon: {
        position: 'absolute',
        top: '-8px',
        right: '20px',
        fontSize: '2.5rem',
        color: '#fbbf24',
        lineHeight: 1,
        fontFamily: 'serif',
    },
    quoteText: { fontSize: '1rem', fontWeight: 600, fontStyle: 'italic', color: '#fbbf24', margin: 0 },
};
