export default function AuthorCorner() {
    return (
        <section style={s.section}>
            <div style={s.inner}>
                <h2 style={s.title}>
                    <span>✍️</span>
                    פינת הסופר
                </h2>

                <div style={s.layout}>
                    {/* תמונת פרופיל */}
                    <div style={s.imageWrap}>
                        <div style={s.imageFrame}>
                            <img
                                src="/david-shmukha.png"
                                alt="דוד שמוחה — מייסד חסדי המלך"
                                style={s.profileImg}
                            />
                        </div>
                        <p style={s.authorName}>דוד שמוחה</p>
                        <p style={s.authorRole}>מייסד ומנהל חסדי המלך</p>
                    </div>

                    {/* תוכן */}
                    <div style={s.textContent}>
                        <h3 style={s.bookTitle}>הספר &quot;שר הצבא&quot;</h3>
                        <p style={s.text}>
                            כתבתי את הספר הזה כי רציתי לתת לילדים שנלחמים במחלה
                            משהו שמזכיר להם כמה הם חזקים. &quot;שר הצבא&quot; הוא סיפור על גיבור
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
        </section>
    );
}

const s = {
    section: {
        background: 'linear-gradient(165deg, #4c1d95 0%, #3b0f80 100%)',
        fontFamily: "'Heebo', sans-serif",
        direction: 'rtl',
        padding: '80px 20px',
        color: '#fff',
    },
    inner: {
        maxWidth: '900px',
        margin: '0 auto',
    },
    title: {
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
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        border: '4px solid #fbbf24',
        overflow: 'hidden',
        boxShadow: '0 0 0 6px rgba(251,191,36,0.15)',
        flexShrink: 0,
    },
    profileImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center top',
    },
    authorName: {
        fontSize: '1.15rem',
        fontWeight: 700,
        color: '#fbbf24',
        margin: 0,
        textAlign: 'center',
    },
    authorRole: {
        fontSize: '0.88rem',
        color: 'rgba(255,255,255,0.6)',
        margin: 0,
        textAlign: 'center',
    },
    textContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    bookTitle: {
        fontSize: '1.4rem',
        fontWeight: 700,
        color: '#fbbf24',
        margin: 0,
    },
    text: {
        fontSize: '1.05rem',
        lineHeight: 1.8,
        opacity: 0.85,
        margin: 0,
    },
    quote: {
        background: 'rgba(251,191,36,0.1)',
        border: '1px solid rgba(251,191,36,0.2)',
        borderRadius: '16px',
        padding: '20px 28px',
        position: 'relative',
        marginTop: '8px',
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
        fontSize: '1.1rem',
        fontWeight: 600,
        fontStyle: 'italic',
        color: '#fbbf24',
        margin: 0,
    },
};
