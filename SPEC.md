# דף אפיון — אתר חסדי המלך

> **גרסה:** 1.0  
> **תאריך עדכון:** יולי 2026  
> **מבוסס על:** ניתוח מקיף של קוד המקור בפועל

---

## תוכן עניינים

1. [מטרת הפרויקט](#1-מטרת-הפרויקט)
2. [טכנולוגיות](#2-טכנולוגיות)
3. [מבנה התיקיות](#3-מבנה-התיקיות)
4. [דפים / מסכים](#4-דפים--מסכים)
5. [רכיבים מרכזיים](#5-רכיבים-מרכזיים)
6. [API — נקודות קצה](#6-api--נקודות-קצה)
7. [מסד נתונים](#7-מסד-נתונים)
8. [הרשאות ומשתמשים](#8-הרשאות-ומשתמשים)
9. [משתני סביבה](#9-משתני-סביבה)
10. [איך להריץ לוקאלית](#10-איך-להריץ-לוקאלית)
11. [מה חסר / TODO](#11-מה-חסר--todo)

---

## 1. מטרת הפרויקט

**חסדי המלך** הוא אתר של יוזמה התנדבותית שמטרתה להחזיר את החיוך לילדים מאושפזים בבתי חולים ברחבי ישראל. הפעילות פעילה מאז 2019 ומחלקת מתנות (משחקים, ספרים, צעצועים) לילדים בבתי חולים. (אינה עמותה רשומה.)

### קהל היעד
- **גולשים כלליים** — הורים לילדים מאושפזים, תורמים פוטנציאליים, מתנדבים פוטנציאליים
- **תורמים** — תורמי כסף (Bit / PayBox / PayPal / העברה בנקאית) ותורמי פריטים
- **מתנדבים** — אנשים המעוניינים להצטרף לצוות
- **מנהל אחד** — מנהל המערכת שמטפל בפניות, תרומות, תוכן

### מה מציע האתר
- מידע כללי על פעילות היוזמה
- גלריית תמונות וסרטונים מביקורים
- קיר תודות מהורים ומאושפזים
- טפסי הרשמה (מתנדבים, יצירת קשר, שליחת תודה)
- אפשרויות לתרומה כספית
- עלון פרשת שבוע להורדה
- דף שקיפות עם נתוני פעילות חודשית
- דף נחיתה ייחודי לסריקת QR בבית החולים

---

## 2. טכנולוגיות

### Frontend
| טכנולוגיה | גרסה | תפקיד |
|---|---|---|
| React | ^19.2.4 | ספריית UI |
| React DOM | ^19.2.4 | רינדור |
| React Router DOM | ^7.14.1 | ניתוב בצד לקוח (SPA) |
| Vite | ^8.0.4 | bundler + dev server |
| ESLint | ^9.39.4 | linting |
| Sharp | ^0.35.3 | עיבוד תמונות (לסקריפט OG) |

> אין שימוש בספריות CSS חיצוניות (כגון MUI/Tailwind) — כל הסגנון נכתב כ-Inline Styles ב-JS.

### Backend
| טכנולוגיה | גרסה | תפקיד |
|---|---|---|
| Node.js | 18+ | סביבת ריצה |
| Express | ^5.2.1 | שרת HTTP |
| PostgreSQL | — | בסיס נתונים |
| `pg` | ^8.16.0 | חיבור ל-PostgreSQL |
| Multer | ^2.0.1 | העלאת קבצים |
| Nodemailer | ^7.0.3 | שליחת מיילים (Gmail) |
| pdf-lib | ^1.17.1 | המרת תמונות ל-PDF (לעלוני שבת) |
| Helmet | ^8.1.0 | אבטחת HTTP headers |
| express-rate-limit | ^8.2.1 | הגבלת קצב בקשות |
| cors | ^2.8.5 | Cross-Origin Resource Sharing |
| dotenv | ^17.2.3 | ניהול משתני סביבה |
| nodemon | ^3.1.11 | hot reload לפיתוח |

### שירותים חיצוניים
| שירות | שימוש |
|---|---|
| Gmail (SMTP) | שליחת מיילים אוטומטיים למנהל ולמשתמשים |
| DeepL API (Free) | תרגום אוטומטי לאנגלית/צרפתית (אופציונלי, עם מטמון DB) |
| PayBox | קישור לתרומה |
| Bit | תרומה מספר טלפון |
| PayPal | קישור לתרומה |
| WhatsApp (אחד מ-4 ספקים) | התראות WhatsApp (תשתית מוכנה, מושבת כברירת מחדל) |

### WhatsApp — ספקים נתמכים
- **Twilio** WhatsApp API
- **Meta** WhatsApp Cloud API
- **CallMeBot** (חינמי)
- **Generic Webhook** (Green API / מותאם אישית)

---

## 3. מבנה התיקיות

```
chasde-hamelech/
├── backend/                    # שרת Node.js + Express
│   ├── server.js               # קובץ ראשי — כל הroutes (1,558 שורות)
│   ├── db.js                   # Pool חיבור לPostgreSQL
│   ├── whatsapp.js             # מודול שליחת WhatsApp (תשתית)
│   ├── schema.sql              # סכמת בסיס הנתונים (DDL)
│   ├── package.json
│   ├── .env                    # משתני סביבה (לא ב-git)
│   ├── .env.example            # תבנית משתני סביבה
│   ├── assets/
│   │   └── logo.png            # לוגו לסימן מים על עלונים
│   ├── uploads/                # קבצים שהועלו (תמונות, סרטונים, PDF)
│   ├── migrate-donation-reports.js   # סקריפט מיגרציה
│   └── seed-media.js           # סקריפט זריעת מדיה
│
├── frontend/                   # לקוח React + Vite
│   ├── index.html              # נקודת כניסה HTML
│   ├── vite.config.js          # הגדרות Vite (בסיסיות)
│   ├── package.json
│   ├── .env.example            # תבנית משתני סביבה
│   ├── public/                 # קבצים סטטיים
│   ├── scripts/
│   │   └── generate-og-share.mjs    # סקריפט יצירת תמונת OG
│   └── src/
│       ├── main.jsx            # נקודת כניסה React
│       ├── App.jsx             # מבנה האפליקציה + Router
│       ├── index.css           # CSS גלובלי + CSS variables
│       ├── config.js           # הגדרות API_BASE, UPLOADS_BASE, PAYMENTS
│       ├── breakpoints.js      # קבועי responsive breakpoints
│       ├── pages/              # דפים (15 דפים)
│       ├── components/         # רכיבים משותפים
│       │   ├── home/           # רכיבי דף הבית (7 רכיבים)
│       │   └── icons/          # אייקונים מותאמים
│       ├── contexts/
│       │   └── LangContext.jsx # Context לניהול שפה
│       ├── hooks/
│       │   ├── useT.js         # Hook לתרגום סטטי (i18n)
│       │   ├── useTranslate.js # Hook לתרגום דינמי (DeepL)
│       │   └── useReveal.js    # Hook לאנימציית הופעה
│       └── i18n/
│           ├── he.js           # מילון עברית (~297 מפתחות)
│           ├── en.js           # מילון אנגלית
│           └── fr.js           # מילון צרפתית
│
├── חסדי-המלך-ניתוח-מקצועי.md
├── חסדי-המלך-תוכנית-פיתוח.md
├── לפני-שממשיכים-מה-צריך-לארגן.md
└── מדריך-אתר-חסדי-המלך.md
```

---

## 4. דפים / מסכים

### 4.1 דפי ציבור

#### `/` — דף הבית (`HomePage`)
דף הבית מורכב מ-7 סקציות בסדר הבא:
1. **HeroSection** — רקע כהה עם גרדיאנט, כותרת, סלוגן, תיאור קצר, 2 כפתורי CTA ("אני רוצה לעזור" / "הצטרפו כמתנדבים") ואינדיקטור "פעילים מדי שבוע"
2. **SmileCounter** — 4 מונים מונפשים (ילדים, בתי חולים, ספרים, משחקים) — נתונים נשלפים מהשרת (`GET /api/stats`)
3. **GalleryPreview** — תצוגה מקדימה של הגלריה
4. **Testimonials** — 3 הודעות תודה אחרונות מהמסד (fallback: 3 ציטוטים סטטיים)
5. **AboutSection** — סיפור היוזמה + ציר זמן
6. **AuthorCorner** — פינת הסופר / חברי השטח
7. **HowToHelp** — 4 אפשרויות עזרה (תרומה כספית, תרומת משחקים, התנדבות, הפצה)

#### `/gallery` — גלריה (`GalleryPage`)
- פילטר קטגוריות: הכל / כללי / צעצועים / ספרים / אוכל / הכנות / סרטונים
- טעינה עם Infinite Scroll (Intersection Observer) — 9 פריטים בכל עמוד
- תמיכה בתמונות ובסרטונים (VideoCard / PhotoCard)
- Lightbox לתמונות מוגדל
- תרגום אוטומטי של כותרות ותיאורים בשפות זרות
- פוסטי גלריה (gallery_posts) — תמונות עם כותרת ותיאור

#### `/thank-you` — קיר תודה (`ThankYouPage`)
- הצגת הודעות תודה מאושרות בכרטיסיות
- תמיכה בצילומי פנים (תמונת הגשה)
- טופס הגשת הודעה חדשה (שם, הודעה, אימייל, בית חולים, תמונה אופציונלית)
- הודעות ממתינות לאישור מנהל לפני פרסום
- תרגום אוטומטי של הודעות

#### `/help` — איך עוזרים (`HelpPage`)
- הצגת אמצעי תרומה: Bit, PayBox, PayPal, העברה בנקאית
- רשימת פריטים נדרשים לתרומה (משחקים, בובות, ערכות יצירה וכו')
- **טופס דיווח על תרומה שבוצעה** — מאפשר לתורם לדווח למנהל לאחר ביצוע תשלום

#### `/volunteer` — מתנדבים (`VolunteerPage`)
- טופס הרשמה: שם, טלפון, אימייל, עיר, האם יש רכב, הערות
- שליחה ל-`POST /api/volunteer`
- שליחת מייל ברוכים הבאים לנרשם ומייל התראה למנהל

#### `/contact` — צור קשר (`ContactPage`)
- טופס: שם, טלפון, אימייל, הודעה
- תמיכה ב-query param `?type=tech` — ממלא הודעה מוגדרת מראש לבעיה טכנית (ומפנה לאחראי הטכני)
- שליחה ל-`POST /api/contact`

#### `/parasha` — עלון השבוע (`ParashaPage`)
- הצגת העלון האחרון (PDF) עם iframe
- ארכיון עלונים קודמים
- מעקב הורדות לכל עלון
- **תכונה מיוחדת**: עלון שהועלה כתמונה מומר אוטומטית ל-PDF בשרת (נסייב לגולשי Netspark שחוסמים תמונות)

#### `/transparency` — שקיפות ופעילות (`TransparencyPage`)
- נתוני חלוקות חודשיות (distributions / goal) מהשרת
- פס התקדמות (progress bar) לחודש הנוכחי
- היסטוריית דוחות חודשיים (עד 24 חודשים)
- קישור לקבלות ב-Google Drive

#### `/qr` ו`/qr/:id` — דף QR (`QRLandingPage`)
- דף נחיתה ייחודי ל**סריקת QR בבתי החולים**
- ללא Navbar ו-Footer
- 3 כפתורי ניווט: קיר תודה / איך עוזרים / דף הבית
- עיצוב נקי, כהה עם גרדיאנט

### 4.2 דפים סטטיים / מידע

| נתיב | דף | תוכן |
|---|---|---|
| `/privacy` | `PrivacyPage` | מדיניות פרטיות |
| `/terms` | `TermsPage` | תנאי שימוש |
| `/accessibility` | `AccessibilityPage` | הצהרת נגישות |
| `/*` | `NotFoundPage` | דף 404 |

### 4.3 ממשק מנהל

#### `/admin` — כניסת מנהל (`AdminLoginPage`)
- שדה סיסמה + כפתור כניסה
- שולח `POST /api/admin/login` — מקבל token שנשמר ב-`sessionStorage`
- Rate Limit: 10 ניסיונות ב-15 דקות

#### `/admin/dashboard` — לוח בקרה (`AdminDashboardPage`)
לוח הבקרה מחולק ל-8 טאבים:

| טאב | תוכן |
|---|---|
| **פניות** ✉️ | רשימת פניות, מענה ישיר במייל, מחיקה |
| **מתנדבים** 🙋 | רשימת מתנדבים, הוספה ידנית, עדכון הערות, מחיקה |
| **הודעות תודה** 💌 | אישור/דחייה/מחיקה, תמיכה בתמונות |
| **דיווחי תרומות** 💰 | אישור/דחייה של דיווחי תרומה מהציבור; אישור יוצר רשומת תרומה |
| **סטטיסטיקות** 📊 | עדכון ידני של מונים; גרף ביקורים 30 ימים אחרונים |
| **מדיה וגלריה** 🖼️ | ניהול תמונות וסרטונים, יצירת פוסטים, שיוך מדיה לפוסטים |
| **עלון השבוע** 📖 | העלאת עלון PDF / תמונה (המרה אוטומטית ל-PDF), מחיקה |
| **שקיפות** 🔍 | יצירת/עדכון דוח חודשי (חלוקות, יעד, תיאור, קישור קבלות) |

---

## 5. רכיבים מרכזיים

### רכיבים גלובליים (`src/components/`)

| רכיב | תפקיד |
|---|---|
| `Navbar.jsx` | סרגל ניווט עם תמיכה ב-RTL/LTR, בורגר-מניו מובייל, מתג שפה (עב/EN/FR), נסתר בדפי Admin ו-QR |
| `Footer.jsx` | פוטר עם לינקים לדפים, מדיניות, נגישות |
| `ToastProvider.jsx` | מערכת toast notifications גלובלית |
| `ErrorBoundary.jsx` | תפיסת שגיאות React |
| `ScrollToTop.jsx` | גלילה לראש העמוד בניווט |
| `PageMeta.jsx` | ניהול `<title>` ו-meta tags (OG, description) |
| `Reveal.jsx` | רכיב Wrapper לאנימציית fade-in בגלילה |
| `SecretAdminTrigger.jsx` | הקלדת המילה **"david"** (סתר) בכל מקום מנתבת ל-`/admin` |
| `Logo.jsx` | לוגו היוזמה (כתר + שם) |

### רכיבי דף הבית (`src/components/home/`)

| רכיב | תפקיד |
|---|---|
| `HeroSection.jsx` | Hero ראשי עם CTA |
| `SmileCounter.jsx` | מונים מונפשים (Intersection Observer) — נשלפים מ-API |
| `GalleryPreview.jsx` | תצוגה מקדימה של גלריה |
| `Testimonials.jsx` | הצגת 3 הודעות תודה אחרונות (מה-API, fallback סטטי) |
| `AboutSection.jsx` | סיפור + ציר זמן |
| `AuthorCorner.jsx` | פינת הסופר |
| `HowToHelp.jsx` | 4 אפשרויות תמיכה |

### Hooks מותאמים (`src/hooks/`)

| Hook | תפקיד |
|---|---|
| `useT.js` | מחזיר פונקציית תרגום `t(key)` מהמילון הסטטי לפי שפה נוכחית |
| `useTranslate.js` | תרגום דינמי של טקסט בודד דרך `POST /api/translate` (DeepL) + client-side cache |
| `translateBatch` | תרגום אצווה של מערך אובייקטים (מייצא מ-useTranslate.js) |
| `useReveal.js` | IntersectionObserver לאנימציית הופעה |

### Context (`src/contexts/`)

| Context | תפקיד |
|---|---|
| `LangContext.jsx` | ניהול שפה גלובלית (he/en/fr), נשמר ב-localStorage, מעדכן `dir` ו-`lang` על `<html>` |

---

## 6. API — נקודות קצה

### נתיבים ציבוריים

| Method | Path | תיאור |
|---|---|---|
| GET | `/api/health` | בדיקת תקינות השרת |
| GET | `/api/stats` | סטטיסטיקות (ילדים, בתי חולים, ספרים, משחקים) |
| GET | `/api/thank-you` | הודעות תודה מאושרות (עד 50) |
| POST | `/api/thank-you` | שליחת הודעת תודה חדשה (עם תמונה אופציונלית, multipart) |
| POST | `/api/contact` | שליחת פנייה (שם + הודעה חובה) |
| POST | `/api/volunteer` | הרשמה כמתנדב |
| GET | `/api/media` | מדיה עם pagination (page, limit, category, type) |
| GET | `/api/newsletters` | עלוני שבת (רשימה) |
| POST | `/api/newsletters/:id/download` | מעקב הורדה של עלון |
| GET | `/api/gallery-posts` | פוסטי גלריה עם מדיה משויכת |
| GET | `/api/monthly-reports` | דוחות חודשיים + דוח חודש נוכחי |
| POST | `/api/donation-report` | דיווח תרומה ציבורי |
| POST | `/api/translate` | תרגום טקסט (DeepL + מטמון DB) — שפות: `en`, `fr` בלבד |

### נתיבים מוגנים (Admin) — דורשים `Authorization: Bearer <token>`

| Method | Path | תיאור |
|---|---|---|
| POST | `/api/admin/login` | כניסת מנהל — מחזיר token |
| GET | `/api/admin/contacts` | רשימת פניות |
| POST | `/api/admin/contacts/:id/reply` | מענה לפנייה (מייל) |
| DELETE | `/api/admin/contacts/:id` | מחיקת פנייה |
| GET | `/api/admin/volunteers` | רשימת מתנדבים |
| POST | `/api/admin/volunteers` | הוספת מתנדב ידנית |
| PUT | `/api/admin/volunteers/:id/notes` | עדכון הערות מתנדב |
| DELETE | `/api/admin/volunteers/:id` | מחיקת מתנדב |
| GET | `/api/admin/thank-you` | כל הודעות תודה (כולל ממתינות) |
| PUT | `/api/admin/thank-you/:id` | שינוי סטטוס הודעה (approved/rejected/pending) |
| DELETE | `/api/admin/thank-you/:id` | מחיקת הודעה + קובץ תמונה |
| GET | `/api/admin/donations` | רשימת תרומות + סכום כולל |
| POST | `/api/admin/donations` | הוספת תרומה ידנית |
| DELETE | `/api/admin/donations/:id` | מחיקת תרומה |
| GET | `/api/admin/donation-reports` | דיווחי תרומות ציבוריים |
| PUT | `/api/admin/donation-reports/:id` | אישור/דחייה דיווח תרומה |
| DELETE | `/api/admin/donation-reports/:id` | מחיקת דיווח |
| PUT | `/api/admin/stats` | עדכון סטטיסטיקות ידניות |
| GET | `/api/admin/stats/visits` | נתוני ביקורים (30 ימים) |
| GET | `/api/admin/media` | כל המדיה (ללא pagination) |
| POST | `/api/admin/media` | העלאת קובץ מדיה (עד 100MB) |
| DELETE | `/api/admin/media/:id` | מחיקת מדיה + קובץ |
| GET | `/api/admin/gallery-posts` | (דרך /api/gallery-posts הציבורי) |
| POST | `/api/admin/gallery-posts` | יצירת פוסט גלריה |
| PUT | `/api/admin/gallery-posts/:id` | עדכון פוסט |
| DELETE | `/api/admin/gallery-posts/:id` | מחיקת פוסט |
| POST | `/api/admin/gallery-posts/:id/media` | העלאת מדיה לפוסט ספציפי |
| POST | `/api/admin/newsletters` | העלאת עלון שבת (PDF/תמונה→PDF, עד 20MB) |
| DELETE | `/api/admin/newsletters/:id` | מחיקת עלון |
| GET | `/api/admin/shopping-list` | רשימת קניות |
| POST | `/api/admin/shopping-list` | הוספת פריט |
| PUT | `/api/admin/shopping-list/:id` | עדכון / סימון כבוצע |
| DELETE | `/api/admin/shopping-list/:id` | מחיקת פריט |
| GET | `/api/admin/activity-log` | יומן פעילות (עד 100 רשומות) |
| POST | `/api/admin/activity-log` | הוספת רשומה ליומן |
| GET | `/api/admin/monthly-reports` | (דרך /api/monthly-reports הציבורי) |
| POST | `/api/admin/monthly-reports` | יצירה/עדכון דוח חודשי |
| DELETE | `/api/admin/monthly-reports/:id` | מחיקת דוח |

### Rate Limiting
| Limiter | Window | Max |
|---|---|---|
| כללי | 15 דקות | 500 בקשות |
| כניסת מנהל | 15 דקות | 10 ניסיונות |
| טפסים ציבוריים (contact/volunteer/thank-you/donation-report) | 1 שעה | 10 שליחות |
| תרגום | 1 דקה | 120 בקשות |

---

## 7. מסד נתונים

**מסד הנתונים:** PostgreSQL  
**שם DB:** `chasde_hamelech`

### טבלאות

#### `contacts` — פניות מהאתר
| עמודה | סוג | תיאור |
|---|---|---|
| id | SERIAL PK | מזהה |
| name | TEXT NOT NULL | שם הפונה |
| email | TEXT | אימייל |
| phone | TEXT | טלפון |
| message | TEXT NOT NULL | הודעה |
| replied | BOOLEAN | האם הוגב |
| reply_text | TEXT | תוכן התשובה |
| created_at | TIMESTAMPTZ | תאריך |

#### `volunteers` — מתנדבים
| עמודה | סוג | תיאור |
|---|---|---|
| id | SERIAL PK | מזהה |
| name | TEXT NOT NULL | שם |
| phone | TEXT NOT NULL | טלפון |
| email | TEXT | אימייל |
| city | TEXT NOT NULL | עיר |
| has_car | BOOLEAN | האם יש רכב |
| notes | TEXT | הערות |
| created_at | TIMESTAMPTZ | תאריך |

#### `thank_you_notes` — קיר תודות
| עמודה | סוג | תיאור |
|---|---|---|
| id | SERIAL PK | מזהה |
| display_name | TEXT | שם מוצג (ברירת מחדל: 'אנונימי') |
| message | TEXT NOT NULL | הודעה |
| email | TEXT | אימייל לשליחת אישור |
| hospital | TEXT | שם בית החולים |
| photo_filename | TEXT | שם קובץ תמונה (אופציונלי) |
| status | TEXT | `pending` / `approved` / `rejected` |
| created_at | TIMESTAMPTZ | תאריך |

#### `stats` — סטטיסטיקות ידניות
| key | תיאור | ערך ברירת מחדל |
|---|---|---|
| children_count | מספר ילדים שקיבלו מתנות | 350 |
| hospitals_count | מספר בתי חולים | 5 |
| books_count | ספרים שחולקו | 200 |
| games_count | משחקים שנמסרו | 500 |

#### `media` — תמונות וסרטונים
| עמודה | סוג | תיאור |
|---|---|---|
| id | SERIAL PK | מזהה |
| filename | TEXT | שם קובץ (UUID + סיומת) |
| original_name | TEXT | שם מקורי |
| title | TEXT | כותרת |
| description | TEXT | תיאור |
| category | TEXT | `books / toys / food / preparation / videos / general` |
| type | TEXT | `photo / video` |
| post_id | INTEGER FK | שיוך לפוסט גלריה (nullable) |
| created_at | TIMESTAMPTZ | תאריך |

#### `page_visits` — מעקב ביקורים
| עמודה | סוג | תיאור |
|---|---|---|
| id | SERIAL PK | מזהה |
| path | TEXT | נתיב הדף |
| visited_at | TIMESTAMPTZ | זמן ביקור |

#### `donations` — תרומות מאושרות
| עמודה | סוג | תיאור |
|---|---|---|
| id | SERIAL PK | מזהה |
| donor_name | TEXT | שם התורם |
| amount | NUMERIC(10,2) | סכום |
| method | TEXT | `bit / paybox / cash / bank / other` |
| note | TEXT | הערה |
| created_at | TIMESTAMPTZ | תאריך |

#### `gallery_posts` — פוסטי גלריה
| עמודה | סוג | תיאור |
|---|---|---|
| id | SERIAL PK | מזהה |
| title | TEXT | כותרת הפוסט |
| body | TEXT | תוכן |
| created_at | TIMESTAMPTZ | תאריך |

#### `newsletters` — עלוני שבת
| עמודה | סוג | תיאור |
|---|---|---|
| id | SERIAL PK | מזהה |
| title | TEXT | כותרת |
| parasha_name | TEXT | שם הפרשה |
| filename | TEXT | שם קובץ (UUID) |
| original_name | TEXT | שם מקורי |
| file_type | TEXT | MIME type |
| week_of | DATE | תאריך שבת |
| downloads | INTEGER | מספר הורדות |
| created_at | TIMESTAMPTZ | תאריך |

#### `shopping_list` — רשימת קניות (פנימי לניהול)
| עמודה | סוג | תיאור |
|---|---|---|
| id | SERIAL PK | מזהה |
| name | TEXT | שם פריט |
| quantity | TEXT | כמות |
| done | BOOLEAN | האם בוצע |
| created_at | TIMESTAMPTZ | תאריך |

#### `activity_log` — יומן פעילות
| עמודה | סוג | תיאור |
|---|---|---|
| id | SERIAL PK | מזהה |
| action | TEXT | סוג הפעולה (new_post, new_newsletter וכו') |
| details | TEXT | פרטים |
| created_at | TIMESTAMPTZ | תאריך |

#### `donation_reports` — דיווחי תרומות ציבוריים (ממתינים לאישור)
| עמודה | סוג | תיאור |
|---|---|---|
| id | SERIAL PK | מזהה |
| donor_name | TEXT | שם התורם |
| amount | NUMERIC(10,2) | סכום |
| method | TEXT | `bit / paybox / paypal / bank / other` |
| email | TEXT | אימייל לאישור |
| phone | TEXT | טלפון |
| note | TEXT | הערה |
| status | TEXT | `pending / approved / rejected` |
| created_at | TIMESTAMPTZ | תאריך |

#### `monthly_reports` — דוחות חודשיים (שקיפות)
| עמודה | סוג | תיאור |
|---|---|---|
| id | SERIAL PK | מזהה |
| month_year | TEXT UNIQUE | פורמט: `2026-06` |
| distributions | INTEGER | מספר חלוקות שבוצעו |
| goal | INTEGER | יעד החודש |
| description | TEXT | תיאור חופשי |
| receipts_url | TEXT | קישור לGoogle Drive לקבלות |
| created_at | TIMESTAMPTZ | תאריך |

#### `translations` — מטמון תרגומי DeepL
| עמודה | סוג | תיאור |
|---|---|---|
| id | SERIAL PK | מזהה |
| source_text | TEXT | טקסט מקור |
| lang | CHAR(2) | שפת יעד (`en` / `fr`) |
| translated_text | TEXT | הטקסט המתורגם |
| created_at | TIMESTAMPTZ | תאריך |
| UNIQUE | (source_text, lang) | מניעת כפילויות |

---

## 8. הרשאות ומשתמשים

### רמות גישה

| סוג משתמש | תיאור |
|---|---|
| **גולש ציבורי** | גישה לכל דפי המידע, טפסים ציבוריים, גלריה, עלונים |
| **מנהל (Admin)** | גישה לכל טאבי לוח הבקרה דרך `/admin/dashboard` |

### מנגנון אימות מנהל
- **כניסה:** `POST /api/admin/login` עם סיסמה — מחזיר Token אקראי (32 bytes hex)
- **שמירה:** ב-`sessionStorage` תחת `adminToken`
- **תוקף:** 12 שעות — token פג מהשרת (in-memory Map)
- **שימוש:** header `Authorization: Bearer <token>` בכל בקשת API מוגנת
- **אבטחה נוספת:**
  - השוואת סיסמה בזמן קבוע (מניעת Timing Attack)
  - Rate Limit: 10 ניסיונות ב-15 דקות
  - סיסמה חייבת לפחות 4 תווים (אחרת השרת לא עולה)

### גישה נסתרת לממשק המנהל
שתי דרכים להגיע ל`/admin` ללא לינק גלוי:
1. הקלדת המילה **`david`** בכל מקום באתר (SecretAdminTrigger)
2. לחיצה 5 פעמים מהירה על הלוגו בסרגל הניווט

---

## 9. משתני סביבה

### Backend (`.env` בתיקיית `backend/`)

| משתנה | חובה | ברירת מחדל | תיאור |
|---|---|---|---|
| `PORT` | לא | 3002 | פורט השרת |
| `NODE_ENV` | לא | development | `production` מפעיל CSP |
| `ADMIN_PASSWORD` | **כן** | — | סיסמת מנהל (מינ' 4 תווים) |
| `CORS_EXTRA_ORIGINS` | לא | — | origins נוספים מופרדים בפסיק |
| `DB_USER` | לא | postgres | משתמש PostgreSQL |
| `DB_HOST` | לא | 127.0.0.1 | שרת DB |
| `DB_NAME` | לא | chasde_hamelech | שם DB |
| `DB_PASSWORD` | לא | — | סיסמת DB |
| `DB_PORT` | לא | 5432 | פורט DB |
| `PG_POOL_MAX` | לא | 20 | מקסימום חיבורי Pool |
| `EMAIL_USER` | לא | — | כתובת Gmail לשליחת מיילים |
| `EMAIL_PASS` | לא | — | App Password של Gmail |
| `ADMIN_EMAIL` | לא | = EMAIL_USER | כתובת לקבלת התראות |
| `SITE_URL` | לא | https://chasde-hamelech.org.il | URL הבסיסי לקישורים במיילים |
| `DEEPL_API_KEY` | לא | — | מפתח DeepL לתרגום אוטומטי |
| `WHATSAPP_ENABLED` | לא | false | הפעלת WhatsApp |
| `WHATSAPP_PROVIDER` | לא | — | `twilio / meta / callmebot / webhook` |
| `WHATSAPP_TO` | לא | — | מספר יעד (ספרות בינלאומי) |
| `TWILIO_ACCOUNT_SID` | לא | — | ל-Twilio |
| `TWILIO_AUTH_TOKEN` | לא | — | ל-Twilio |
| `TWILIO_WHATSAPP_FROM` | לא | — | מספר Twilio |
| `WHATSAPP_PHONE_ID` | לא | — | ל-Meta Cloud API |
| `WHATSAPP_TOKEN` | לא | — | ל-Meta Cloud API |
| `CALLMEBOT_APIKEY` | לא | — | ל-CallMeBot |
| `WHATSAPP_WEBHOOK_URL` | לא | — | ל-Webhook גנרי |
| `WHATSAPP_WEBHOOK_TOKEN` | לא | — | ל-Webhook גנרי |

### Frontend (`.env` בתיקיית `frontend/`)

| משתנה | חובה | ברירת מחדל | תיאור |
|---|---|---|---|
| `VITE_API_URL` | לא | ריק (production: Nginx) | URL הבסיסי של ה-API |
| `VITE_PAYBOX_LINK` | לא | https://payboxapp.page.link/WXV7 | לינק לתרומה ב-PayBox |
| `VITE_BIT_NUMBER` | לא | — | מספר Bit לתרומה |
| `VITE_PAYPAL_LINK` | לא | — | לינק PayPal |
| `VITE_BANK_NAME` | לא | — | שם הבנק (להעברה בנקאית) |
| `VITE_BANK_BRANCH` | לא | — | מספר סניף |
| `VITE_BANK_ACCOUNT` | לא | — | מספר חשבון |
| `VITE_BANK_HOLDER` | לא | חסדי המלך | שם בעל החשבון |

---

## 10. איך להריץ לוקאלית

### דרישות מוקדמות
- **Node.js 18+**
- **PostgreSQL** מותקן ופועל
- **npm**

### שלב 1 — הגדרת בסיס הנתונים

```sql
-- ב-psql
CREATE DATABASE chasde_hamelech;
\c chasde_hamelech
\i backend/schema.sql
```

### שלב 2 — Backend

```bash
cd backend
cp .env.example .env
# ערכו את .env עם הסיסמאות האמיתיות
npm install
npm run dev     # עם nodemon (hot reload)
# או:
npm start       # ללא hot reload
```
> השרת יעלה על `http://localhost:3002`

### שלב 3 — Frontend

```bash
cd frontend
cp .env.example .env
# ערכו VITE_* לפי הצורך
npm install
npm run dev
```
> הלקוח יעלה על `http://localhost:5173`

### שלב 4 — גישה לממשק הניהול

1. פתחו `http://localhost:5173/admin`  
   **או:** הקלידו `david` בכל מקום באתר
2. הזינו את ה-`ADMIN_PASSWORD` שהגדרתם ב-.env

### Build לפרודקשן

```bash
cd frontend
npm run build
# קבצים בתיקיית frontend/dist/ — יש להגיש דרך Nginx
```

> **בפרודקשן:** Nginx מגיש את ה-Frontend ומנתב `/api/` לשרת ה-Backend על פורט 3002. כתובת האתר: `https://chasde-hamelech.org.il`

---

## 11. מה חסר / TODO

### פיצ'רים שתשתיתם קיימת אך לא מושלמים
- **WhatsApp** — הקוד מוכן לחלוטין ב-`whatsapp.js` אך מושבת (`WHATSAPP_ENABLED=false`). נדרש הגדרת ספק + מפתחות
- **כפתור WhatsApp** במנהל — קיים בקוד עם `WHATSAPP_ENABLED = false` (הגדרה קשיחה בקוד, לא ב-.env)

### פיצ'רים שחסרים
- **ניהול רשימת קניות** — קיים ב-API לחלוטין (CRUD) אך **אין** טאב בלוח הבקרה של ה-Frontend שחושף אותו
- **אימות מנהל מתקדם** — ה-tokens נשמרים in-memory בשרת (אין persistence בין restarts)
- **פרטי בנק** — שדות הבנק ב-Frontend (שם, סניף, חשבון) חסרים בקובץ `.env` הנוכחי (ב-production)
- **OG Image** — יש סקריפט `generate-og-share.mjs` אך אין תמונת OG ברירת מחדל מוכנה
- **אימות מייל** — Nodemailer משתמש ב-Gmail אך אין בדיקה שהחיבור עובד בעלייה
- **Backup** — אין מנגנון backup אוטומטי לבסיס הנתונים
- **הרשאות מרובות מנהלים** — רק סיסמה אחת, ללא ניהול משתמשים
- **אימות 2FA** — אין
- **Pagination בממשק המנהל** — רשימות הפניות / מתנדבים טוענות הכל ללא pagination
- **חיפוש** — אין חיפוש בתוך רשימות הניהול

### שיפורים טכניים
- `WHATSAPP_ENABLED` מוגדר כ-`false` hardcoded בקוד ה-Frontend (שורה 5 ב-AdminDashboardPage) — לא נשלט ע"י משתנה סביבה
- תרגום DeepL — אם מפתח לא קיים, מוחזר הטקסט המקורי בעברית (לא מוצגת הודעה למשתמש)
- הגנות CSP פעילות רק בפרודקשן — בפיתוח ה-headers פחות מאובטחים

---

*מסמך זה נוצר מניתוח ידני של קוד המקור. לעדכון המסמך יש לקרוא מחדש את קבצי הקוד הרלוונטיים.*
