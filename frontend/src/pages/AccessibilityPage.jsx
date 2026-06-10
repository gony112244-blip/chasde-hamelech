import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';

export default function AccessibilityPage() {
    return (
        <div style={s.page}>
            <PageMeta title="הצהרת נגישות" description="הצהרת הנגישות של אתר חסדי המלך — אנו שואפים לאפשר שימוש לכלל האוכלוסייה." path="/accessibility" />
            <section style={s.header}>
                <h1 style={s.title}>♿ הצהרת נגישות</h1>
                <p style={s.subtitle}>עדכון אחרון: מאי 2026</p>
            </section>

            <section style={s.content}>
                <div style={s.inner}>
                    <p style={s.intro}>
                        חסדי המלך שואפים לאפשר שימוש בשירותים שלנו לכלל האוכלוסייה,
                        כולל אנשים עם מוגבלויות.
                    </p>

                    <Block title="מה כוללת הנגישות באתר?">
                        <ul style={s.list}>
                            <li>תיוגי <code>alt</code> לתמונות</li>
                            <li>ניווט מקלדת לכל הרכיבים האינטראקטיביים</li>
                            <li>כפתור &ldquo;דלג לתוכן&rdquo; בראש כל עמוד</li>
                            <li>ניגודיות צבעים עפ&rdquo;י תקן WCAG 2.1 ברמה AA</li>
                            <li>שפת ממשק בעברית עם תמיכה ב-RTL</li>
                            <li>גופן קריא ובגדלים מותאמים לנגישות</li>
                        </ul>
                    </Block>

                    <Block title="מגבלות ידועות">
                        <p>
                            האתר נבנה בהתנדבות ונמצא בשיפור מתמיד.
                            ייתכן כי חלק מהתכנים הוויזואליים (תמונות, סרטונים) עדיין אינם
                            מלווים בתיאור מלא. אנו עובדים על שיפור זה.
                        </p>
                    </Block>

                    <Block title="פנייה בנושאי נגישות">
                        <p>
                            נתקלתם בקושי נגישותי? נשמח לשמוע ולשפר.
                            ניתן לפנות אלינו דרך{' '}
                            <Link to="/contact" style={s.link}>עמוד יצירת הקשר</Link>.
                        </p>
                    </Block>

                    <Block title="תאימות">
                        <p>
                            אנו שואפים לעמוד בדרישות תקנות הנגישות לאתרי אינטרנט (ישראל 2017)
                            ובהנחיות WCAG 2.1 ברמה AA.
                        </p>
                    </Block>

                    <div style={s.backRow}>
                        <Link to="/" style={s.backBtn}>🏠 חזרה לדף הבית</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

function Block({ title, children }) {
    return (
        <div style={{ marginBottom: '28px' }}>
            <h2 style={{
                color: 'var(--royal)',
                fontSize: '1.1rem',
                fontWeight: 700,
                borderBottom: '2px solid var(--royal-pale)',
                paddingBottom: '8px',
                marginBottom: '12px',
            }}>{title}</h2>
            <div style={{ color: 'var(--text-soft)', lineHeight: 1.8, fontSize: '0.96rem' }}>
                {children}
            </div>
        </div>
    );
}

const s = {
    page: { fontFamily: "'Heebo', sans-serif", direction: 'rtl' },
    header: {
        background: 'linear-gradient(165deg, #0f2044, #071530)',
        padding: '50px 20px 40px', textAlign: 'center',
    },
    title: { color: '#fbbf24', fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, margin: '0 0 8px' },
    subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: 0 },
    content: { padding: '40px 20px 60px', background: 'var(--bg-light)' },
    inner: { maxWidth: '720px', margin: '0 auto' },
    intro: { color: 'var(--text-soft)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '32px' },
    list: { margin: '8px 0', paddingRight: '20px', display: 'flex', flexDirection: 'column', gap: '6px' },
    link: { color: 'var(--royal)', fontWeight: 600 },
    backRow: { textAlign: 'center', marginTop: '40px' },
    backBtn: {
        background: 'var(--royal-pale)', color: 'var(--royal)', textDecoration: 'none',
        padding: '12px 28px', borderRadius: '12px', fontWeight: 600,
    },
};
