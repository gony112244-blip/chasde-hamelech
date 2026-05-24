export default function AuthorCorner() {
    return (
        <section style={s.section}>
            <div style={s.inner}>

                {/* ── דבר המייסדים ── */}
                <h2 style={s.mainTitle}>
                    <span>👑</span> דבר המייסדים
                </h2>

                <div style={s.foundersGrid}>

                    {/* ── אביתר ── */}
                    <div style={s.founderCard}>
                        <div style={s.imageWrap}>
                            <div style={{ ...s.imageFrame, borderColor: '#fbbf24' }}>
                                <img
                                    src="/avitar.png"
                                    alt="אביתר — מייסד שותף"
                                    style={{ ...s.profileImg, objectPosition: 'center top' }}
                                />
                            </div>
                            <p style={s.personName}>אביתר</p>
                            <p style={s.personRole}>מייסד שותף</p>
                        </div>
                        <div style={s.textContent}>
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
                                <p style={s.quoteText}>
                                    ברוך ה׳, זכיתי מאז לצאת כמעט כל שבוע — תודה על הזכות
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── מפריד אנכי (דסקטופ) ── */}
                    <div style={s.verticalDivider} />

                    {/* ── דוד ── */}
                    <div style={s.founderCard}>
                        <div style={s.imageWrap}>
                            <div style={{ ...s.imageFrame, borderColor: '#93c5fd' }}>
                                <img
                                    src="/david-shmukha.png"
                                    alt="דוד שמוחה — מייסד שותף"
                                    style={{ ...s.profileImg, objectPosition: '62% top' }}
                                />
                            </div>
                            <p style={s.personName}>דוד שמוחה</p>
                            <p style={s.personRole}>מייסד שותף</p>
                        </div>
                        <div style={s.textContent}>
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
                                <p style={{ ...s.quoteText, color: '#93c5fd' }}>
                                    ילד אחד שמחייך — שווה הכל
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ── מפריד ── */}
                <div style={s.divider} />

                {/* ── פינת הסופר ── */}
                <div style={s.block}>
                    <h2 style={s.blockTitle}>
                        <span>✍️</span> פינת הסופר
                    </h2>
                    <div style={s.layout}>
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
                                כתבתי את הספר הזה כי רציתי לתת לילדים שנלחמים במחלה
                                משהו שמזכיר להם כמה הם חזקים. &ldquo;שר הצבא&rdquo; הוא סיפור על גיבור
                                שלא ויתר — בדיוק כמו הילדים שאנחנו פוגשים.
                            </p>
                            <p style={s.text}>
                                כל ילד שמקבל את הספר, מקבל גם מסר: אתה גיבור.
                                לא צריך שריון, לא צריך חרב — מספיק הלב שלך.
                            </p>
                            <div style={s.quote}>
                                <span style={s.quoteIcon}>&ldquo;</span>
                                <p style={s.quoteText}>
                                    כשילד חולה מחייך — זה הנצחון הכי גדול שיש
                                </p>
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
    inner: {
        maxWidth: '1000px',
        margin: '0 auto',
    },
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
    foundersGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: '32px',
        alignItems: 'start',
    },
    verticalDivider: {
        width: '1px',
        background: 'rgba(255,255,255,0.1)',
        alignSelf: 'stretch',
        minHeight: '200px',
    },
    founderCard: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center',
    },
    block: {
        padding: '20px 0',
    },
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
    layout: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '48px',
        alignItems: 'center',
    },
    imageWrap: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
    },
    imageFrame: {
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        border: '4px solid #fbbf24',
        overflow: 'hidden',
        boxShadow: '0 0 0 6px rgba(251,191,36,0.12)',
        flexShrink: 0,
    },
    profileImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
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
    placeholderText: {
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.4)',
    },
    personName: {
        fontSize: '1.05rem',
        fontWeight: 700,
        color: '#fbbf24',
        margin: 0,
        textAlign: 'center',
    },
    personRole: {
        fontSize: '0.82rem',
        color: 'rgba(255,255,255,0.5)',
        margin: 0,
        textAlign: 'center',
    },
    textContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
    },
    bookTitle: {
        fontSize: '1.3rem',
        fontWeight: 700,
        color: '#fbbf24',
        margin: 0,
    },
    text: {
        fontSize: '0.97rem',
        lineHeight: 1.8,
        opacity: 0.85,
        margin: 0,
        textAlign: 'center',
    },
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
    quoteText: {
        fontSize: '1rem',
        fontWeight: 600,
        fontStyle: 'italic',
        color: '#fbbf24',
        margin: 0,
    },
};
