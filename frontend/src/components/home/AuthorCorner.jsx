import { useState, useEffect } from 'react';

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth <= 640 : false
    );
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 640px)');
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        setIsMobile(mq.matches);
        return () => mq.removeEventListener('change', handler);
    }, []);
    return isMobile;
}

function FounderBlock({ imgSrc, imgAlt, imgPosition, borderColor, name, children }) {
    const isMobile = useIsMobile();
    return (
        <div style={{ ...s.founderRow, flexDirection: isMobile ? 'column' : 'row' }}>
            <div style={s.imageWrap}>
                <div style={{ ...s.imageFrame, borderColor }}>
                    <img src={imgSrc} alt={imgAlt} style={{ ...s.profileImg, objectPosition: imgPosition }} />
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

    return (
        <section style={s.section}>
            <div style={s.inner}>

                {/* ── החברים מהשטח ── */}
                <h2 style={s.mainTitle}>
                    <span>👑</span> החברים מהשטח
                </h2>

                {/* ── דוד — ראשון ── */}
                <FounderBlock
                    imgSrc="/david-shmukha.png"
                    imgAlt="דוד שמוחה"
                    imgPosition="62% top"
                    borderColor="#93c5fd"
                    name="דוד שמוחה"
                >
                    <p style={s.text}>
                        חסדי המלך נולד מתוך אמונה פשוטה: ילד חולה שנמצא בבית חולים
                        לא צריך לחוש לבד. הוא צריך לדעת שיש אנשים שחושבים עליו,
                        אוהבים אותו — גם אם מעולם לא פגשו אותו.
                    </p>
                    <p style={s.text}>
                        מאז שהתחלנו, ביקרנו במאות ילדים בבתי חולים ברחבי הארץ.
                        חילקנו ספרים, משחקים, מתוקים — ובעיקר חיוכים.
                        כל ביקור הוא עולם ומלואו עבור הילד ועבור המשפחה.
                    </p>
                    <div style={{ ...s.quote, borderColor: 'rgba(147,197,253,0.25)', background: 'rgba(147,197,253,0.08)' }}>
                        <span style={{ ...s.quoteIcon, color: '#93c5fd' }}>&ldquo;</span>
                        <p style={{ ...s.quoteText, color: '#93c5fd' }}>ילד אחד שמחייך — שווה הכל</p>
                    </div>
                </FounderBlock>

                <div style={{ ...s.divider, margin: '40px 0' }} />

                {/* ── אביתר — שני ── */}
                <FounderBlock
                    imgSrc="/avitar.png"
                    imgAlt="אביתר"
                    imgPosition="center top"
                    borderColor="#fbbf24"
                    name="אביתר"
                >
                    <p style={s.text}>
                        לפני כ-7 שנים, ביום פורים, חשבתי על כל הילדים המאושפזים שלא יחגגו כמו כולם —
                        וזה ציער אותי מאוד. התארגנתי עם כמה חברים, קנינו ממתקים וצעצועים ויצאנו לשמח אותם.
                    </p>
                    <p style={s.text}>
                        ראיתי כמה זה מנתק אותם מהכאב, כמה זה משמח את ההורים ואפילו את הצוות הרפואי —
                        וקיבלתי על עצמי שכל עוד אוכל, אצא לשמח את הילדים, לא רק בפורים.
                    </p>
                    <div style={s.quote}>
                        <span style={s.quoteIcon}>&ldquo;</span>
                        <p style={s.quoteText}>ברוך ה׳, זכיתי מאז לצאת כמעט כל שבוע — תודה על הזכות</p>
                    </div>
                </FounderBlock>

                {/* ── מפריד ── */}
                <div style={s.divider} />

                {/* ── פינת הסופר ── */}
                <div style={s.block}>
                    <h2 style={s.blockTitle}>
                        <span>✍️</span> פינת הסופר
                    </h2>
                    <div style={{ ...s.founderRow, flexDirection: isMobile ? 'column' : 'row' }}>
                        <div style={s.imageWrap}>
                            <div style={{ ...s.imageFrame, borderColor: '#fbbf24' }}>
                                <div style={s.photoPlaceholder}>
                                    <span style={{ fontSize: '2.5rem' }}>📸</span>
                                    <span style={s.placeholderText}>תמונה בקרוב</span>
                                </div>
                            </div>
                            <p style={s.personName}>גוני שמוחה</p>
                            <p style={s.personRole}>סופר הספר &ldquo;שר הצבא&rdquo;</p>
                        </div>
                        <div style={s.textContent}>
                            <h3 style={s.bookTitle}>הספר &ldquo;שר הצבא&rdquo;</h3>
                            <p style={s.text}>
                                במשך שנים אני רואה את דוד ואביתר — בחורים טובים שיוצאים שבוע אחרי שבוע,
                                מארגנים בעצמם ומחלקים לילדים מאושפזים. הרגיש לי שזה אחד הדברים הטהורים
                                ביותר שאפשר לעשות.
                            </p>
                            <p style={s.text}>
                                עלה בידנו רעיון: שגם אם לא זכיתי להיות בחזית, אני יכול לתרום את ספרי.
                                &ldquo;שר הצבא&rdquo; עוסק בהתמודדות מול קשיים — ידיים קטנות מול קירות חיוורים של
                                בית חולים, ועולם הדמיון שמוציא אותם למקומות גבוהים.
                            </p>
                            <p style={s.text}>
                                לאחר שהבנתי שזה משנה, החלטתי לתרום ספרים כמה שביכולתי.
                                כי לספר יש כוח שלא ניתן לכמת.
                            </p>
                            <div style={s.quote}>
                                <span style={s.quoteIcon}>&ldquo;</span>
                                <p style={s.quoteText}>כשילד חולה מחייך על ספר שכתבתי — זה הנצחון הכי גדול שיש</p>
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
        direction: 'rtl',
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
