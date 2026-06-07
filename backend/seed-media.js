/**
 * seed-media.js
 * מריץ פעם אחת על השרת — מעתיק את כל התמונות והסרטונים הקיימים
 * מ-frontend/public/gallery לתיקיית uploads, ומכניס אותם ל-DB.
 *
 * הרצה: node seed-media.js
 */
require('dotenv').config();
const path = require('path');
const fs   = require('fs');
const pool = require('./db');

const UPLOADS_DIR  = path.join(__dirname, 'uploads');
const GALLERY_DIR  = path.join(__dirname, '..', 'frontend', 'public', 'gallery');
const VIDEOS_DIR   = path.join(GALLERY_DIR, 'videos');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// ==============================
// פוסטים — כל פוסט עם כותרת + תיאור + מדיה משויכת
// ==============================
const POSTS = [
    {
        title: 'חלוקה ראשונה — שניידר',
        body: 'ביקורנו הראשון בבית החולים שניידר. חילקנו ספרים, משחקים וחיוכים לעשרות ילדים.',
        media: [
            { file: 'preparation-cart-bags.png',    title: 'הכנת העגלה לביקור',          type: 'photo', category: 'הכנות' },
            { file: 'volunteer-books-on-cart.png',  title: 'ספרים על העגלה — מוכנים',    type: 'photo', category: 'הכנות' },
            { file: 'videos/visit-1.mp4',           title: 'רגעים מהביקור הראשון',        type: 'video', category: 'ביקורים' },
        ],
        created_at: '2025-03-10',
    },
    {
        title: 'ביקור בווולפסון — פורים',
        body: 'חגגנו פורים עם הילדים בבית החולים וולפסון. תחפושות, שמחה ועוגיות.',
        media: [
            { file: 'volunteer-smiling-books-1.png', title: 'מחלקים ספרים ומחייכים',     type: 'photo', category: 'ביקורים' },
            { file: 'volunteer-lei-toys.png',         title: 'צעצועים ואהבה',             type: 'photo', category: 'ביקורים' },
            { file: 'videos/visit-2.mp4',             title: 'שמחת פורים בוולפסון',       type: 'video', category: 'ביקורים' },
        ],
        created_at: '2025-05-15',
    },
    {
        title: 'אסיפת מתנדבים — ייחד ונצח',
        body: 'כינוס מתנדבים לתכנון הביקורים הקרובים. רוח גבוהה ואנשים מדהימים.',
        media: [
            { file: 'preparation-bags-elevator.png', title: 'ציוד מוכן — עולים לקומה',  type: 'photo', category: 'הכנות' },
            { file: 'videos/visit-3.mp4',             title: 'ממה שמאחורי הקלעים',       type: 'video', category: 'הכנות' },
        ],
        created_at: '2025-07-01',
    },
    {
        title: 'חלוקת ספרי "שר הצבא"',
        body: 'לראשונה חילקנו עותקים של "שר הצבא" — ספר שמחזק ילדים מול מכשולים. הריאקציות מרגשות.',
        media: [
            { file: 'toy-distribution-bag.png',      title: 'שקיות מלאות ספרים',         type: 'photo', category: 'ביקורים' },
            { file: 'volunteer-puppet-mask.png',      title: 'בובה ומסכה — קצת הצגה',    type: 'photo', category: 'ביקורים' },
            { file: 'videos/visit-4.mp4',             title: 'תגובות הילדים לספר',        type: 'video', category: 'ביקורים' },
        ],
        created_at: '2025-09-20',
    },
    {
        title: 'ביקור רמב"ם — שבת',
        body: 'ביקור מיוחד לכבוד שבת. הבאנו עלוני פרשת שבוע, משחקים וחיוכים.',
        media: [
            { file: 'corridor-family.png',            title: 'פגישה עם משפחה במסדרון',    type: 'photo', category: 'ביקורים' },
            { file: 'donuts-cart.png',                title: 'עגלת הסופגניות',             type: 'photo', category: 'ביקורים' },
            { file: 'videos/visit-5.mp4',             title: 'שבת בבית החולים',           type: 'video', category: 'ביקורים' },
        ],
        created_at: '2025-11-08',
    },
    {
        title: 'חנוכה — אורות בחשכה',
        body: 'הדלקנו נרות עם הילדים בכמה מחלקות. כל ילד קיבל חנוכייה וסביבון.',
        media: [
            { file: 'cart-supplies-corridor.png',     title: 'ציוד בדרך לחנוכייה',        type: 'photo', category: 'ביקורים' },
            { file: 'volunteer-toys-bag.png',         title: 'שקיות מתנה לחנוכה',         type: 'photo', category: 'ביקורים' },
            { file: 'videos/visit-6.mp4',             title: 'הדלקת נרות חנוכה',         type: 'video', category: 'ביקורים' },
        ],
        created_at: '2025-12-25',
    },
    {
        title: 'ביקור השבוע — ינואר 2026',
        body: 'השבוע חילקנו לילדים ב-3 מחלקות שונות. 47 ילדים קיבלו חיוך ומתנה.',
        media: [
            { file: 'volunteer-smiling-books-2.png', title: 'מחייכים ומחלקים',           type: 'photo', category: 'ביקורים' },
            { file: 'volunteer-reading-book.png',     title: 'קריאה לילדה קטנה',         type: 'photo', category: 'ביקורים' },
            { file: 'videos/visit-7.mp4',             title: 'רגעים מהשבוע',             type: 'video', category: 'ביקורים' },
            { file: 'videos/visit-8.mp4',             title: 'סיום הביקור',               type: 'video', category: 'ביקורים' },
        ],
        created_at: '2026-01-15',
    },
];

async function run() {
    console.log('🌱 מתחיל seed של מדיה...\n');

    for (const post of POSTS) {
        // 1. בדוק אם פוסט כזה כבר קיים
        const exists = await pool.query(
            'SELECT id FROM gallery_posts WHERE title=$1',
            [post.title]
        );
        let postId;
        if (exists.rows.length > 0) {
            postId = exists.rows[0].id;
            console.log(`📌 פוסט קיים: "${post.title}" (id=${postId})`);
        } else {
            const ins = await pool.query(
                `INSERT INTO gallery_posts (title, body, created_at)
                 VALUES ($1, $2, $3) RETURNING id`,
                [post.title, post.body, post.created_at]
            );
            postId = ins.rows[0].id;
            console.log(`✅ נוצר פוסט: "${post.title}" (id=${postId})`);
        }

        // 2. העתק מדיה ורשום ב-DB
        for (const m of post.media) {
            const srcPath = path.join(GALLERY_DIR, m.file);
            if (!fs.existsSync(srcPath)) {
                console.warn(`  ⚠️  לא נמצא: ${srcPath}`);
                continue;
            }

            const ext = path.extname(m.file);
            const timestamp = new Date(post.created_at).getTime() + Math.floor(Math.random() * 1000000);
            const newFilename = `${timestamp}${ext}`;
            const destPath = path.join(UPLOADS_DIR, newFilename);

            // בדוק אם כבר קיים ב-DB לפי title + post_id
            const mediaExists = await pool.query(
                'SELECT id FROM media WHERE title=$1 AND post_id=$2',
                [m.title, postId]
            );
            if (mediaExists.rows.length > 0) {
                console.log(`  ⏭️  מדיה קיימת: ${m.title}`);
                continue;
            }

            if (!fs.existsSync(destPath)) {
                fs.copyFileSync(srcPath, destPath);
            }

            await pool.query(
                `INSERT INTO media (filename, original_name, title, description, category, type, post_id, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [newFilename, path.basename(m.file), m.title, '', m.category, m.type, postId, post.created_at]
            );
            console.log(`  📸 הוסף: ${m.title} (${m.type})`);
        }
    }

    console.log('\n✅ seed הסתיים בהצלחה!');
    await pool.end();
}

run().catch(err => {
    console.error('❌ שגיאה:', err.message);
    process.exit(1);
});
