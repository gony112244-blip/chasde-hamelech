import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';

export default function TermsPage() {
    return (
        <div style={s.page}>
            <PageMeta
                title="תקנון האתר"
                description="תקנון השימוש באתר חסדי המלך — זכויות, חובות ומדיניות התוכן."
                path="/terms"
            />
            <section style={s.header}>
                <h1 style={s.title}>📋 תקנון האתר</h1>
                <p style={s.subtitle}>עדכון אחרון: יוני 2026</p>
            </section>

            <section style={s.content}>
                <div style={s.inner}>

                    <Sec title="1. כללי">
                        <p>
                            אתר זה מופעל על-ידי יוזמת <strong>חסדי המלך</strong> — קבוצת התנדבות
                            הפועלת לשמחת ילדים מאושפזים בבתי חולים ברחבי ישראל.
                            השימוש באתר מהווה הסכמה לתנאים המפורטים להלן.
                        </p>
                    </Sec>

                    <Sec title="2. מהות הפעילות">
                        <p>
                            חסדי המלך היא יוזמה התנדבותית בלתי פורמלית.
                            אנו אוספים ומחלקים משחקים, ספרים ומתנות לילדים מאושפזים.
                            הפעילות מתבצעת ללא מטרות רווח וללא תשלום לפעילים.
                        </p>
                        <p>
                            <strong>יש לציין:</strong> חסדי המלך אינה עמותה רשומה בישראל נכון למועד
                            עדכון תקנון זה, ואינה מוכרת לצרכי מס. תרומות כספיות שיתקבלו בעתיד
                            ישמשו אך ורק לרכישת ציוד לחלוקה.
                        </p>
                    </Sec>

                    <Sec title="3. שימוש בתוכן האתר">
                        <ul style={s.list}>
                            <li>התמונות, הסרטונים והטקסטים באתר הם רכוש חסדי המלך או הועלו ברשות.</li>
                            <li>אין להעתיק, לפרסם מחדש או להשתמש מסחרית בתכנים ללא אישור מפורש.</li>
                            <li>שיתוף תכנים לטובת קידום הפעילות מותר ומעודד — בציון המקור.</li>
                        </ul>
                    </Sec>

                    <Sec title="4. תכנים שמועלים על-ידי משתמשים">
                        <ul style={s.list}>
                            <li>
                                הגשת הודעת תודה, תמונה או פנייה לאתר מהווה הסכמה לפרסומה
                                (לאחר אישור המנהל).
                            </li>
                            <li>
                                תכנים המכילים פרטים מזהים של קטינים יועלו רק לאחר אישור מפורש
                                ובהתאם לחוק הגנת הפרטיות ולחוק זכויות הילד.
                            </li>
                            <li>
                                אנו שומרים לעצמנו את הזכות לסרב לפרסם תוכן שאינו הולם את ערכי הארגון.
                            </li>
                        </ul>
                    </Sec>

                    <Sec title="5. תמונות וצילומים">
                        <p>
                            כל התמונות והסרטונים המופיעים באתר — ובפרט אלה הכוללים ילדים —
                            פורסמו עם הסכמה מפורשת של ההורים/האפוטרופוסים.
                            אם הנך בהורה המזהה ילד ומבקש להסיר תמונה, פנה אלינו דרך{' '}
                            <Link to="/contact" style={s.link}>עמוד יצירת הקשר</Link>{' '}
                            ונפעל בהקדם.
                        </p>
                    </Sec>

                    <Sec title="6. הגבלת אחריות">
                        <p>
                            האתר וכל המידע בו מסופקים &ldquo;כמות שהם&rdquo; (as-is).
                            חסדי המלך אינה אחראית לנזק כלשהו שעלול להיגרם כתוצאה משימוש
                            באתר, תקלות טכניות, או שיבושים בשירות.
                        </p>
                    </Sec>

                    <Sec title="7. קישורים חיצוניים">
                        <p>
                            האתר עשוי להכיל קישורים לאתרים חיצוניים (PayBox וכד׳).
                            אנו איננו אחראים לתוכן, מדיניות הפרטיות או אמינות אתרים חיצוניים אלה.
                        </p>
                    </Sec>

                    <Sec title="8. שינויים בתקנון">
                        <p>
                            אנו שומרים לעצמנו את הזכות לעדכן תקנון זה בכל עת.
                            המשך השימוש באתר לאחר עדכון מהווה הסכמה לתנאים המעודכנים.
                        </p>
                    </Sec>

                    <Sec title="9. יצירת קשר">
                        <p>
                            לכל שאלה, בקשה או פנייה בנושאי התקנון, ניתן לפנות דרך{' '}
                            <Link to="/contact" style={s.link}>עמוד יצירת הקשר</Link>.
                        </p>
                    </Sec>

                    <div style={s.backRow}>
                        <Link to="/" style={s.backBtn}>🏠 חזרה לדף הבית</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

function Sec({ title, children }) {
    return (
        <div style={{ marginBottom: '32px' }}>
            <h2 style={{
                color: 'var(--royal)',
                fontSize: '1.1rem',
                fontWeight: 700,
                borderBottom: '2px solid var(--royal-pale)',
                paddingBottom: '8px',
                marginBottom: '14px',
            }}>
                {title}
            </h2>
            <div style={{ color: 'var(--text-soft)', lineHeight: 1.8, fontSize: '0.97rem' }}>
                {children}
            </div>
        </div>
    );
}

const s = {
    page: { fontFamily: "'Heebo', sans-serif", direction: 'inherit' },
    header: {
        background: 'linear-gradient(165deg, #0f2044, #071530)',
        padding: '50px 20px 40px', textAlign: 'center',
    },
    title: { color: '#fbbf24', fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, margin: '0 0 8px' },
    subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: 0 },
    content: { padding: '40px 20px 60px', background: 'var(--bg-light)' },
    inner: { maxWidth: '720px', margin: '0 auto' },
    list: { margin: '8px 0', paddingRight: '20px', display: 'flex', flexDirection: 'column', gap: '8px' },
    link: { color: 'var(--royal)', fontWeight: 600 },
    backRow: { textAlign: 'center', marginTop: '40px' },
    backBtn: {
        background: 'var(--royal-pale)', color: 'var(--royal)', textDecoration: 'none',
        padding: '12px 28px', borderRadius: '12px', fontWeight: 600,
    },
};
