import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';

export default function PrivacyPage() {
    return (
        <div style={s.page}>
            <PageMeta title="מדיניות פרטיות" description="מדיניות הפרטיות של אתר חסדי המלך — איך אנו אוספים ושומרים על המידע שלכם." path="/privacy" />
            <section style={s.header}>
                <h1 style={s.title}>🔒 מדיניות פרטיות</h1>
                <p style={s.subtitle}>עדכון אחרון: יולי 2026</p>
            </section>

            <section style={s.content}>
                <div style={s.inner}>
                    <Section title="כללי">
                        <p>
                            חסדי המלך (&ldquo;אנחנו&rdquo;, &ldquo;האתר&rdquo;) מכבדים את פרטיות המשתמשים.
                            מדיניות זו מסבירה אילו מידע אנו אוספים, כיצד אנו משתמשים בו,
                            ומהן זכויותיכם.
                        </p>
                    </Section>

                    <Section title="מידע שאנו אוספים">
                        <ul style={s.list}>
                            <li>שם ופרטי קשר (טלפון, אימייל) — כאשר מוגשת פנייה דרך טופס יצירת הקשר</li>
                            <li>הודעות ותמונות שנשלחות בטופס &ldquo;קיר תודה&rdquo; (מאושרות לפני פרסום)</li>
                            <li>פרטי מתנדבים שמגישים בקשת התנדבות</li>
                            <li>דיווחי תרומה (שם, סכום, אמצעי תשלום, טלפון/מייל אופציונליים)</li>
                            <li>נתוני גלישה אנונימיים (ספירת ביקורים) לצורך שיפור האתר</li>
                        </ul>
                    </Section>

                    <Section title="שימוש במידע">
                        <p>המידע שנאסף משמש אך ורק לצרכים הבאים:</p>
                        <ul style={s.list}>
                            <li>מענה לפניות ובקשות</li>
                            <li>תיאום פעילות התנדבות</li>
                            <li>הצגת הודעות תודה על האתר (עם אישור בלבד)</li>
                            <li>אישור דיווחי תרומה ושליחת הודעת תודה</li>
                            <li>שיפור חוויית הגלישה</li>
                        </ul>
                        <p>
                            איננו מוכרים מידע אישי. ייתכן שימוש בספקי שירות הכרחיים להפעלת האתר:
                        </p>
                        <ul style={s.list}>
                            <li>שליחת מיילים (Gmail / Nodemailer)</li>
                            <li>תרגום אוטומטי של תוכן (DeepL) — אם מופעל — כולל שמירת תרגומים במטמון</li>
                            <li>התראות WhatsApp למנהל — אם מופעל</li>
                            <li>קישורי Google Drive למסמכי רכש — אם יפורסמו בעתיד באתר</li>
                        </ul>
                        <p>
                            אמצעי תשלום חיצוניים (Bit / PayBox וכו&apos;) פועלים מחוץ לאתר ואינם מעבירים
                            אלינו פרטי כרטיס אשראי. תמונות בקיר התודה נשמרות ומפורסמות רק לאחר אישור מנהל.
                        </p>
                    </Section>

                    <Section title="אבטחת מידע">
                        <p>
                            אנו נוקטים באמצעי אבטחה סבירים להגנה על המידע.
                            האתר פועל עם הצפנת HTTPS.
                        </p>
                    </Section>

                    <Section title="זכויות המשתמש">
                        <p>בהתאם לחוק הגנת הפרטיות, הינכם רשאים:</p>
                        <ul style={s.list}>
                            <li>לדרוש לעיין במידע המוחזק עליכם</li>
                            <li>לדרוש תיקון או מחיקה של המידע</li>
                            <li>לבקש הסרה מרשימות פניות</li>
                        </ul>
                        <p>לכל פנייה בנושא פרטיות, צרו קשר דרך <Link to="/contact" style={s.link}>עמוד יצירת הקשר</Link>.</p>
                    </Section>

                    <Section title="שינויים במדיניות">
                        <p>
                            אנו שומרים לעצמנו את הזכות לעדכן מדיניות זו מעת לעת.
                            שינויים מהותיים יפורסמו באתר.
                        </p>
                    </Section>

                    <div style={s.backRow}>
                        <Link to="/" style={s.backBtn}>🏠 חזרה לדף הבית</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div style={{ marginBottom: '32px' }}>
            <h2 style={{
                color: 'var(--royal)',
                fontSize: '1.15rem',
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
    list: { margin: '8px 0', paddingRight: '20px', display: 'flex', flexDirection: 'column', gap: '6px' },
    link: { color: 'var(--royal)', fontWeight: 600 },
    backRow: { textAlign: 'center', marginTop: '40px' },
    backBtn: {
        background: 'var(--royal-pale)', color: 'var(--royal)', textDecoration: 'none',
        padding: '12px 28px', borderRadius: '12px', fontWeight: 600,
    },
};
