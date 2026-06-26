require('dotenv').config();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const nodemailer = require('nodemailer');
const { PDFDocument } = require('pdf-lib');
const { sendWhatsApp } = require('./whatsapp');
const pool = require('./db');

const app = express();
const IS_PROD = process.env.NODE_ENV === 'production';

// =====================
// CORS — רשימת מקורות מותרים בלבד
// =====================
const ALLOWED_ORIGINS = [
    'https://chasde-hamelech.org.il',
    'https://www.chasde-hamelech.org.il',
    // פיתוח מקומי
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:3000',
];
// אפשר להוסיף מקורות נוספים דרך CORS_EXTRA_ORIGINS (מופרדים בפסיק)
if (process.env.CORS_EXTRA_ORIGINS) {
    ALLOWED_ORIGINS.push(...process.env.CORS_EXTRA_ORIGINS.split(',').map(s => s.trim()).filter(Boolean));
}
app.use(cors({
    origin: (origin, cb) => {
        // בקשות ללא Origin (כלים, אותו מקור, אפליקציות) — מותרות
        if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
        return cb(new Error('Origin לא מורשה'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// =====================
// אבטחה — Helmet
// CSP מופעל בפרודקשן בלבד (במצב הזה הכל אותו מקור דרך Nginx).
// HSTS מופעל תמיד — נכנס לתוקף רק מעל HTTPS, אחרת נעלם.
// =====================
app.use(helmet({
    contentSecurityPolicy: IS_PROD ? undefined : false,
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
    originAgentCluster: false
}));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.set('trust proxy', 1);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: { message: "יותר מדי בקשות, נסה שוב מאוחר יותר." },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// =====================
// קבצים סטטיים — uploads
// =====================
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/api/uploads', express.static(UPLOADS_DIR));

// =====================
// Multer — העלאת קבצים
// =====================
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        // שם קובץ אקראי ולא ניתן לניחוש
        cb(null, `${crypto.randomUUID()}${ext}`);
    }
});

// בדיקה משולבת: גם סיומת וגם סוג MIME חייבים להתאים
function makeFilter(extRe, mimeRe, errMsg) {
    return (req, file, cb) => {
        const okExt = extRe.test(file.originalname);
        const okMime = mimeRe.test(file.mimetype || '');
        if (okExt && okMime) cb(null, true);
        else cb(new Error(errMsg), false);
    };
}

const fileFilter = makeFilter(
    /\.(jpg|jpeg|png|gif|webp|mp4|mov|webm|avi)$/i,
    /^(image\/(jpeg|png|gif|webp)|video\/(mp4|quicktime|webm|x-msvideo))$/i,
    'סוג קובץ לא נתמך'
);
const upload = multer({ storage, fileFilter, limits: { fileSize: 100 * 1024 * 1024 } });

const newsletterFilter = makeFilter(
    /\.(jpg|jpeg|png|gif|webp|pdf)$/i,
    /^(image\/(jpeg|png|gif|webp)|application\/pdf)$/i,
    'ניתן להעלות PDF או תמונות בלבד'
);
const uploadNewsletter = multer({ storage, fileFilter: newsletterFilter, limits: { fileSize: 20 * 1024 * 1024 } });

const photoFilter = makeFilter(
    /\.(jpg|jpeg|png|gif|webp)$/i,
    /^image\/(jpeg|png|gif|webp)$/i,
    'ניתן להעלות תמונות בלבד'
);
const uploadPhoto = multer({ storage, fileFilter: photoFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// טעינת לוגו "חסדי המלך" פעם אחת (לסימן מים על העלונים)
const LOGO_PATH = path.join(__dirname, 'assets', 'logo.png');
let LOGO_BYTES = null;
try { LOGO_BYTES = fs.readFileSync(LOGO_PATH); } catch (_) { /* בלי לוגו — ההמרה עדיין תעבוד */ }

// ממיר תמונה (JPG/PNG) לקובץ PDF בעמוד יחיד, עם סימן מים עדין של הלוגו.
// נחוץ כי קהל היעד גולש באינטרנט מסונן (Netspark) שחותך תמונות אך מעביר PDF.
// מחזיר Buffer של ה-PDF, או null אם הסוג לא נתמך להמרה.
async function imageToPdfBuffer(absImagePath, mimetype) {
    const bytes = fs.readFileSync(absImagePath);
    const pdfDoc = await PDFDocument.create();
    // זיהוי הפורמט לפי חתימת הקובץ (אמין יותר מהסיומת/mimetype)
    const isPng = bytes.length > 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
    const isJpg = bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    let img;
    if (isPng) img = await pdfDoc.embedPng(bytes);
    else if (isJpg) img = await pdfDoc.embedJpg(bytes);
    else return null; // webp/gif וכו' — לא נתמכים להטמעה ישירה

    const page = pdfDoc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });

    // סימן מים: לוגו קטן ושקוף, ממורכז בתחתית העמוד — עדין ולא מכסה תוכן
    if (LOGO_BYTES) {
        try {
            const logo = await pdfDoc.embedPng(LOGO_BYTES);
            const logoW = img.width * 0.14;                 // ~14% מרוחב העמוד
            const logoH = logoW * (logo.height / logo.width);
            const margin = img.height * 0.02;
            page.drawImage(logo, {
                x: (img.width - logoW) / 2,
                y: margin,
                width: logoW,
                height: logoH,
                opacity: 0.5,
            });
        } catch (e) {
            console.error('logo watermark failed:', e.message); // לא קריטי
        }
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}

// =====================
// Nodemailer
// =====================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

// התראה למנהל על פעילות חדשה — לא חוסם את הבקשה אם נכשל
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
async function notifyAdmin(subject, rowsHtml) {
    if (!process.env.EMAIL_USER || !ADMIN_EMAIL) return;
    try {
        await transporter.sendMail({
            from: `"חסדי המלך — מערכת" <${process.env.EMAIL_USER}>`,
            to: ADMIN_EMAIL,
            subject,
            html: `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;color:#1f2937;">
                <h2 style="color:#0f2044;">${subject}</h2>
                <table style="border-collapse:collapse;">${rowsHtml}</table>
                <hr>
                <p style="color:#888;font-size:12px;">הודעה אוטומטית מאתר חסדי המלך</p>
            </div>`,
        });
    } catch (err) {
        console.error('notifyAdmin failed:', err.message);
    }
}
// אימות קלט בסיסי לטפסים ציבוריים
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isValidEmail(email) {
    return EMAIL_RE.test(String(email).trim());
}
// בודק שהשדות לא ארוכים מדי (מניעת התקפות / זבל). limits = { field: maxLen }
function tooLong(body, limits) {
    for (const [field, max] of Object.entries(limits)) {
        if (body[field] && String(body[field]).length > max) return field;
    }
    return null;
}

// מנקה תווי HTML מסוכנים מתוכן שהמשתמש שלח, לפני הכנסה למייל
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
function row(label, value) {
    if (!value) return '';
    return `<tr><td style="padding:4px 12px;font-weight:bold;">${escapeHtml(label)}:</td><td style="padding:4px 12px;">${escapeHtml(value)}</td></tr>`;
}

// התראה מאוחדת לכל הערוצים (מייל + וואטסאפ) — לא חוסמת את הבקשה.
// fields = מערך של [תווית, ערך]. כל ערוץ שלא מוגדר פשוט מדולג.
function notifyChannels(subject, fields = []) {
    const rowsHtml = fields.map(([label, value]) => row(label, value)).join('');
    notifyAdmin(subject, rowsHtml);
    sendWhatsApp(subject, fields);
}

// =====================
// Middleware — מעקב ביקורים
// =====================
async function logVisit(req, res, next) {
    try {
        await pool.query(
            'INSERT INTO page_visits (path) VALUES ($1)',
            [req.path]
        );
    } catch (_) { /* לא לעצור את הבקשה בגלל שגיאת לוג */ }
    next();
}

// =====================
// Admin Auth — טוקן הפעלה אקראי עם תפוגה (לא הסיסמה עצמה)
// =====================
const ADMIN_PASS = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASS || ADMIN_PASS.length < 4) {
    console.error('❌ ADMIN_PASSWORD חסר או קצר מ-4 תווים. הגדירו אותו ב-.env. השרת לא יעלה.');
    process.exit(1);
}

const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 שעות
const sessions = new Map(); // token -> expiry timestamp

function createSession() {
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, Date.now() + SESSION_TTL_MS);
    return token;
}

// ניקוי טוקנים שפגו — פעם בשעה
setInterval(() => {
    const now = Date.now();
    for (const [token, exp] of sessions) if (exp < now) sessions.delete(token);
}, 60 * 60 * 1000).unref();

function adminAuth(req, res, next) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    const exp = sessions.get(token);
    if (!exp || exp < Date.now()) {
        if (exp) sessions.delete(token);
        return res.status(401).json({ error: 'גישה לא מורשית' });
    }
    next();
}

// השוואת סיסמה בזמן קבוע (מונע התקפות תזמון)
function passwordMatches(input) {
    const a = Buffer.from(String(input || ''));
    const b = Buffer.from(ADMIN_PASS);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// הגבלת ניסיונות כניסה — מונע ניחוש סיסמה (brute-force)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'יותר מדי נסיונות כניסה. נסו שוב בעוד 15 דקות.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// =====================
// Routes — Public
// =====================

app.get('/api/health', (req, res) => {
    res.json({ ok: true, project: 'חסדי המלך', timestamp: new Date().toISOString() });
});

// סטטיסטיקות (מדד החיוכים)
app.get('/api/stats', async (req, res) => {
    try {
        const result = await pool.query('SELECT key, value FROM stats');
        const stats = {};
        result.rows.forEach(r => { stats[r.key] = Number(r.value); });
        res.json(stats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// קיר תודה — מאושרות בלבד
app.get('/api/thank-you', async (req, res) => {
    const limit = Math.min(50, parseInt(req.query.limit) || 50);
    try {
        const result = await pool.query(
            `SELECT id, display_name as name, message, hospital, photo_filename, created_at
             FROM thank_you_notes WHERE status='approved'
             ORDER BY created_at DESC LIMIT $1`,
            [limit]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// קיר תודה — הגשה חדשה (multipart: תומך בתמונות אופציונליות)
app.post('/api/thank-you', uploadPhoto.single('photo'), async (req, res) => {
    const { name, message, email, hospital } = req.body;
    if (!message?.trim()) {
        return res.status(400).json({ error: 'הודעה היא שדה חובה' });
    }
    if (tooLong(req.body, { name: 80, email: 150, hospital: 80, message: 2000 })) {
        if (req.file) fs.unlink(path.join(UPLOADS_DIR, req.file.filename), () => {});
        return res.status(400).json({ error: 'אחד השדות ארוך מדי' });
    }
    if (email?.trim() && !isValidEmail(email)) {
        if (req.file) fs.unlink(path.join(UPLOADS_DIR, req.file.filename), () => {});
        return res.status(400).json({ error: 'כתובת מייל לא תקינה' });
    }
    const photoFilename = req.file ? req.file.filename : null;
    // כל הודעה ממתינה לאישור מנהל לפני פרסום בקיר (מניעת ספאם)
    const status = 'pending';
    try {
        await pool.query(
            `INSERT INTO thank_you_notes (display_name, message, email, hospital, photo_filename, status)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [name?.trim() || 'אנונימי', message.trim(),
             email?.trim() || '', hospital?.trim() || '',
             photoFilename || '', status]
        );
        notifyChannels('💌 הודעת תודה חדשה', [
            ['שם', name?.trim() || 'אנונימי'],
            ['בית חולים', hospital?.trim()],
            ['הודעה', message.trim()],
            ['תמונה', photoFilename ? 'כן (ממתינה לאישור)' : 'לא'],
        ]);
        res.status(201).json({
            ok: true,
            message: 'תודה! ההודעה התקבלה ותפורסם בקיר לאחר אישור המנהל.'
        });
    } catch (err) {
        console.error(err);
        if (req.file) fs.unlink(path.join(UPLOADS_DIR, req.file.filename), () => {});
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// צור קשר
app.post('/api/contact', async (req, res) => {
    const { name, phone, email, message } = req.body;
    if (!name?.trim() || !message?.trim()) {
        return res.status(400).json({ error: 'שם והודעה הם שדות חובה' });
    }
    if (tooLong(req.body, { name: 100, phone: 30, email: 150, message: 3000 })) {
        return res.status(400).json({ error: 'אחד השדות ארוך מדי' });
    }
    if (email?.trim() && !isValidEmail(email)) {
        return res.status(400).json({ error: 'כתובת מייל לא תקינה' });
    }
    try {
        await pool.query(
            'INSERT INTO contacts (name, phone, email, message) VALUES ($1, $2, $3, $4)',
            [name.trim(), phone?.trim() || '', email?.trim() || '', message.trim()]
        );
        notifyChannels('📩 פנייה חדשה באתר', [
            ['שם', name.trim()], ['טלפון', phone?.trim()],
            ['מייל', email?.trim()], ['הודעה', message.trim()],
        ]);
    res.status(201).json({ ok: true, message: 'ההודעה נשלחה! נחזור אליכם בהקדם.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// מתנדבים
app.post('/api/volunteer', async (req, res) => {
    const { name, phone, email, city, hasCar, message } = req.body;
    if (!name?.trim() || !phone?.trim() || !city?.trim()) {
        return res.status(400).json({ error: 'שם, טלפון ועיר הם שדות חובה' });
    }
    if (tooLong(req.body, { name: 100, phone: 30, email: 150, city: 60, message: 2000 })) {
        return res.status(400).json({ error: 'אחד השדות ארוך מדי' });
    }
    if (email?.trim() && !isValidEmail(email)) {
        return res.status(400).json({ error: 'כתובת מייל לא תקינה' });
    }
    try {
        await pool.query(
            'INSERT INTO volunteers (name, phone, email, city, has_car, notes) VALUES ($1, $2, $3, $4, $5, $6)',
            [name.trim(), phone.trim(), email?.trim() || '', city.trim(), !!hasCar, message?.trim() || '']
        );
        notifyChannels('🤝 מתנדב חדש נרשם', [
            ['שם', name.trim()], ['טלפון', phone.trim()],
            ['מייל', email?.trim()], ['עיר', city.trim()],
            ['רכב', hasCar ? 'כן' : 'לא'], ['הערה', message?.trim()],
        ]);
    res.status(201).json({ ok: true, message: 'ברוכים הבאים למשפחת חסדי המלך! ניצור קשר בהקדם.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// מדיה — ציבורי עם pagination
app.get('/api/media', logVisit, async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 5);
    const offset = (page - 1) * limit;
    const category = req.query.category || '';
    // type=photo|video — סינון לפי סוג מדיה (ה-tab "סרטונים" משתמש בזה)
    const type = ['photo', 'video'].includes(req.query.type) ? req.query.type : '';

    try {
        // בניית תנאי WHERE דינמי לפי הפרמטרים שהתקבלו
        const conds = [];
        const params = [];
        if (category) { params.push(category); conds.push(`category=$${params.length}`); }
        if (type) { params.push(type); conds.push(`type=$${params.length}`); }
        const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';

        const listParams = [...params, limit, offset];
        const query = `SELECT * FROM media ${where} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        const result = await pool.query(query, listParams);

        const countResult = await pool.query(`SELECT COUNT(*) FROM media ${where}`, params);
        const total = parseInt(countResult.rows[0].count);

        res.json({
            items: result.rows,
            total,
            page,
            limit,
            hasMore: offset + result.rows.length < total
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// =====================
// Routes — Admin
// =====================

app.post('/api/admin/login', loginLimiter, (req, res) => {
    const { password } = req.body;
    if (passwordMatches(password)) {
        res.json({ ok: true, token: createSession() });
    } else {
        res.status(401).json({ error: 'סיסמה שגויה' });
    }
});

// פניות
app.get('/api/admin/contacts', adminAuth, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// השב לפנייה במייל
app.post('/api/admin/contacts/:id/reply', adminAuth, async (req, res) => {
    const { id } = req.params;
    const { reply_text } = req.body;
    if (!reply_text?.trim()) {
        return res.status(400).json({ error: 'תוכן התשובה הוא חובה' });
    }
    try {
        const contact = await pool.query('SELECT * FROM contacts WHERE id=$1', [id]);
        if (!contact.rows.length) return res.status(404).json({ error: 'לא נמצא' });
        const c = contact.rows[0];

        if (c.email) {
            await transporter.sendMail({
                from: `"חסדי המלך" <${process.env.EMAIL_USER}>`,
                to: c.email,
                subject: 'תגובה מחסדי המלך',
                html: `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:16px;">
                    <p>שלום ${escapeHtml(c.name)},</p>
                    <p>${escapeHtml(reply_text.trim()).replace(/\n/g, '<br>')}</p>
                    <hr>
                    <p style="color:#666;font-size:12px;">חסדי המלך — מביאים שמחה לילדים 💙</p>
                </div>`
            });
        }

        await pool.query(
            'UPDATE contacts SET replied=true, reply_text=$1 WHERE id=$2',
            [reply_text.trim(), id]
        );
        res.json({ ok: true, emailSent: !!c.email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת בשליחת המייל' });
    }
});

// מתנדבים
app.get('/api/admin/volunteers', adminAuth, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM volunteers ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// תודות — כולל ממתינות
app.get('/api/admin/thank-you', adminAuth, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM thank_you_notes ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// אישור/דחייה תודה
app.put('/api/admin/thank-you/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'approved' | 'rejected'
    if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ error: 'סטטוס לא חוקי' });
    }
    try {
        const result = await pool.query(
            'UPDATE thank_you_notes SET status=$1 WHERE id=$2 RETURNING *',
            [status, id]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'לא נמצא' });
        res.json({ ok: true, note: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// סטטיסטיקות
app.put('/api/admin/stats', adminAuth, async (req, res) => {
    const fields = ['children_count', 'hospitals_count', 'books_count', 'games_count'];
    try {
        for (const key of fields) {
            if (req.body[key] !== undefined) {
                const value = parseInt(req.body[key], 10);
                if (!Number.isFinite(value) || value < 0) continue; // התעלם מערכים לא תקינים
                await pool.query(
                    'INSERT INTO stats (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value=$2',
                    [key, value]
                );
            }
        }
        const result = await pool.query('SELECT key, value FROM stats');
        const stats = {};
        result.rows.forEach(r => { stats[r.key] = Number(r.value); });
        res.json({ ok: true, stats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// סטטיסטיקות — ביקורים לפי יום (30 ימים אחרונים)
app.get('/api/admin/stats/visits', adminAuth, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT DATE(visited_at) AS day, COUNT(*) AS count
            FROM page_visits
            WHERE visited_at >= NOW() - INTERVAL '30 days'
            GROUP BY day
            ORDER BY day DESC
        `);
        const total = await pool.query('SELECT COUNT(*) FROM page_visits');
        res.json({ daily: result.rows, total: parseInt(total.rows[0].count) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// תרומות — הוספה (Admin בלבד; אין רישום תרומות ציבורי כדי למנוע זיהום נתונים)
app.post('/api/donations', adminAuth, async (req, res) => {
    const { donor_name, amount, method, note } = req.body;
    const amt = parseFloat(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
        return res.status(400).json({ error: 'סכום תרומה חייב להיות מספר חיובי' });
    }
    try {
        await pool.query(
            'INSERT INTO donations (donor_name, amount, method, note) VALUES ($1, $2, $3, $4)',
            [donor_name?.trim() || 'אנונימי', amt, method || 'other', note?.trim() || '']
        );
        res.status(201).json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// תרומות — רשימה (Admin)
app.get('/api/admin/donations', adminAuth, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM donations ORDER BY created_at DESC');
        const total = await pool.query('SELECT COALESCE(SUM(amount),0) AS total FROM donations');
        res.json({ donations: result.rows, total: parseFloat(total.rows[0].total) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// מתנדבים — עדכון הערות (Admin)
app.put('/api/admin/volunteers/:id/notes', adminAuth, async (req, res) => {
    const { notes } = req.body;
    try {
        const result = await pool.query(
            'UPDATE volunteers SET notes=$1 WHERE id=$2 RETURNING *',
            [notes?.trim() || '', req.params.id]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'לא נמצא' });
        res.json({ ok: true, volunteer: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// מדיה — העלאה (Admin)
app.post('/api/admin/media', adminAuth, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'לא נשלח קובץ' });
    const { title, description, category } = req.body;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const type = ['.mp4', '.mov', '.webm', '.avi'].includes(ext) ? 'video' : 'photo';
    try {
        const result = await pool.query(
            'INSERT INTO media (filename, original_name, title, description, category, type) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
            [req.file.filename, req.file.originalname, title?.trim() || '', description?.trim() || '', category || 'general', type]
        );
        res.status(201).json({ ok: true, media: result.rows[0] });
    } catch (err) {
        console.error(err);
        fs.unlink(path.join(UPLOADS_DIR, req.file.filename), () => {});
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// מדיה — רשימת כל המדיה (Admin, ללא pagination)
app.get('/api/admin/media', adminAuth, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM media ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// מדיה — מחיקה (Admin)
app.delete('/api/admin/media/:id', adminAuth, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM media WHERE id=$1 RETURNING filename', [req.params.id]);
        if (!result.rows.length) return res.status(404).json({ error: 'לא נמצא' });
        const filepath = path.join(UPLOADS_DIR, result.rows[0].filename);
        fs.unlink(filepath, () => {});
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// תרומה ידנית (Admin)
app.post('/api/admin/donations', adminAuth, async (req, res) => {
    const { donor_name, amount, method, note } = req.body;
    const amt = parseFloat(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
        return res.status(400).json({ error: 'סכום תרומה חייב להיות מספר חיובי' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO donations (donor_name, amount, method, note) VALUES ($1,$2,$3,$4) RETURNING *',
            [donor_name?.trim() || 'אנונימי', amt, method || 'other', note?.trim() || '']
        );
        res.status(201).json({ ok: true, donation: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// =====================
// Gallery Posts — Public
// =====================

app.get('/api/gallery-posts', async (req, res) => {
    try {
        const posts = await pool.query(
            'SELECT * FROM gallery_posts ORDER BY created_at DESC'
        );
        // לכל פוסט, הוסף את המדיה שמשויכת אליו
        const postsWithMedia = await Promise.all(posts.rows.map(async (post) => {
            const media = await pool.query(
                'SELECT * FROM media WHERE post_id=$1 ORDER BY created_at ASC',
                [post.id]
            );
            return { ...post, media: media.rows };
        }));
        res.json(postsWithMedia);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// =====================
// Gallery Posts — Admin
// =====================

app.post('/api/admin/gallery-posts', adminAuth, async (req, res) => {
    const { title, body } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'כותרת הכרחית' });
    try {
        const result = await pool.query(
            'INSERT INTO gallery_posts (title, body) VALUES ($1, $2) RETURNING *',
            [title.trim(), body?.trim() || '']
        );
        await pool.query(
            'INSERT INTO activity_log (action, details) VALUES ($1, $2)',
            ['new_post', `פוסט חדש: ${title.trim()}`]
        );
        res.status(201).json({ ok: true, post: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

app.put('/api/admin/gallery-posts/:id', adminAuth, async (req, res) => {
    const { title, body } = req.body;
    try {
        const result = await pool.query(
            'UPDATE gallery_posts SET title=$1, body=$2 WHERE id=$3 RETURNING *',
            [title?.trim() || '', body?.trim() || '', req.params.id]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'לא נמצא' });
        res.json({ ok: true, post: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

app.delete('/api/admin/gallery-posts/:id', adminAuth, async (req, res) => {
    try {
        // ניתוק מדיה מהפוסט
        await pool.query('UPDATE media SET post_id=NULL WHERE post_id=$1', [req.params.id]);
        await pool.query('DELETE FROM gallery_posts WHERE id=$1', [req.params.id]);
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// העלאת מדיה לפוסט
app.post('/api/admin/gallery-posts/:id/media', adminAuth, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'לא נשלח קובץ' });
    const { title, description, category } = req.body;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const type = ['.mp4', '.mov', '.webm', '.avi'].includes(ext) ? 'video' : 'photo';
    try {
        const result = await pool.query(
            'INSERT INTO media (filename, original_name, title, description, category, type, post_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [req.file.filename, req.file.originalname, title?.trim() || '',
             description?.trim() || '', category || 'general', type, req.params.id]
        );
        res.status(201).json({ ok: true, media: result.rows[0] });
    } catch (err) {
        console.error(err);
        fs.unlink(path.join(UPLOADS_DIR, req.file.filename), () => {});
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// =====================
// Newsletters
// =====================

app.get('/api/newsletters', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM newsletters ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

app.post('/api/admin/newsletters', adminAuth, uploadNewsletter.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'לא נשלח קובץ' });
    const { title, parasha_name, week_of } = req.body;

    // המרת תמונה ל-PDF אוטומטית (בגלל אינטרנט מסונן שחותך תמונות)
    let filename = req.file.filename;
    let fileType = req.file.mimetype;
    if (fileType && fileType.startsWith('image/')) {
        try {
            const absPath = path.join(UPLOADS_DIR, req.file.filename);
            const pdfBuffer = await imageToPdfBuffer(absPath, fileType);
            if (pdfBuffer) {
                const pdfName = `${path.parse(req.file.filename).name}.pdf`;
                fs.writeFileSync(path.join(UPLOADS_DIR, pdfName), pdfBuffer);
                fs.unlink(absPath, () => {}); // מחיקת התמונה המקורית
                filename = pdfName;
                fileType = 'application/pdf';
            }
        } catch (e) {
            console.error('newsletter image→pdf failed:', e.message); // נשמר כתמונה במקרה כשל
        }
    }

    try {
        const result = await pool.query(
            `INSERT INTO newsletters (title, parasha_name, filename, original_name, file_type, week_of)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [title?.trim() || '', parasha_name?.trim() || '',
             filename, req.file.originalname, fileType,
             week_of || null]
        );
        await pool.query(
            'INSERT INTO activity_log (action, details) VALUES ($1, $2)',
            ['new_newsletter', `עלון חדש: ${title || parasha_name || ''}`]
        );
        res.status(201).json({ ok: true, newsletter: result.rows[0] });
    } catch (err) {
        console.error(err);
        fs.unlink(path.join(UPLOADS_DIR, filename), () => {});
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

app.delete('/api/admin/newsletters/:id', adminAuth, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM newsletters WHERE id=$1 RETURNING filename', [req.params.id]);
        if (!result.rows.length) return res.status(404).json({ error: 'לא נמצא' });
        fs.unlink(path.join(UPLOADS_DIR, result.rows[0].filename), () => {});
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// =====================
// Shopping List — Admin
// =====================

app.get('/api/admin/shopping-list', adminAuth, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM shopping_list ORDER BY done, created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

app.post('/api/admin/shopping-list', adminAuth, async (req, res) => {
    const { name, quantity } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'שם פריט הוא חובה' });
    try {
        const result = await pool.query(
            'INSERT INTO shopping_list (name, quantity) VALUES ($1, $2) RETURNING *',
            [name.trim(), quantity?.trim() || '']
        );
        res.status(201).json({ ok: true, item: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

app.put('/api/admin/shopping-list/:id', adminAuth, async (req, res) => {
    const { name, quantity, done } = req.body;
    try {
        const result = await pool.query(
            'UPDATE shopping_list SET name=$1, quantity=$2, done=$3 WHERE id=$4 RETURNING *',
            [name?.trim(), quantity?.trim() || '', !!done, req.params.id]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'לא נמצא' });
        res.json({ ok: true, item: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

app.delete('/api/admin/shopping-list/:id', adminAuth, async (req, res) => {
    try {
        await pool.query('DELETE FROM shopping_list WHERE id=$1', [req.params.id]);
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// =====================
// Activity Log — Admin
// =====================

app.get('/api/admin/activity-log', adminAuth, async (req, res) => {
    const limit = Math.min(100, parseInt(req.query.limit) || 50);
    try {
        const result = await pool.query(
            'SELECT * FROM activity_log ORDER BY created_at DESC LIMIT $1',
            [limit]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

app.post('/api/admin/activity-log', adminAuth, async (req, res) => {
    const { action, details } = req.body;
    if (!action?.trim()) return res.status(400).json({ error: 'action הוא חובה' });
    try {
        const result = await pool.query(
            'INSERT INTO activity_log (action, details) VALUES ($1, $2) RETURNING *',
            [action.trim(), details?.trim() || '']
        );
        res.status(201).json({ ok: true, entry: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// מחיקת פנייה (Admin)
app.delete('/api/admin/contacts/:id', adminAuth, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM contacts WHERE id=$1 RETURNING id', [req.params.id]);
        if (!result.rows.length) return res.status(404).json({ error: 'לא נמצא' });
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// מחיקת מתנדב (Admin)
app.delete('/api/admin/volunteers/:id', adminAuth, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM volunteers WHERE id=$1 RETURNING id', [req.params.id]);
        if (!result.rows.length) return res.status(404).json({ error: 'לא נמצא' });
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// מחיקת תרומה (Admin)
app.delete('/api/admin/donations/:id', adminAuth, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM donations WHERE id=$1 RETURNING id', [req.params.id]);
        if (!result.rows.length) return res.status(404).json({ error: 'לא נמצא' });
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// מחיקת תודה (Admin)
app.delete('/api/admin/thank-you/:id', adminAuth, async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM thank_you_notes WHERE id=$1 RETURNING photo_filename',
            [req.params.id]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'לא נמצא' });
        const photo = result.rows[0].photo_filename;
        if (photo) fs.unlink(path.join(UPLOADS_DIR, photo), () => {});
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// =====================
// מעקב הורדות עלון פרשה
// =====================
app.post('/api/newsletters/:id/download', async (req, res) => {
    try {
        await pool.query(
            'UPDATE newsletters SET downloads = COALESCE(downloads,0) + 1 WHERE id=$1',
            [req.params.id]
        );
        res.json({ ok: true });
    } catch {
        res.json({ ok: false });
    }
});

// =====================
// תרגום אוטומטי — DeepL + מטמון DB
// =====================

// הגבלת קצב לתרגום — מונע ניצול מכסת DeepL
const translateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    message: { translated: '' },
    standardHeaders: true,
    legacyHeaders: false,
});

// POST /api/translate  { text, lang }
app.post('/api/translate', translateLimiter, async (req, res) => {
    const { text, lang } = req.body;
    if (!text || !lang || lang === 'he') return res.json({ translated: text });
    // רק שפות נתמכות, וטקסט בגודל סביר
    if (!['en', 'fr'].includes(lang)) return res.json({ translated: text });
    if (typeof text !== 'string' || text.length > 5000) return res.json({ translated: text });

    try {
        // בדוק מטמון
        const cached = await pool.query(
            'SELECT translated_text FROM translations WHERE source_text=$1 AND lang=$2',
            [text, lang]
        );
        if (cached.rows.length > 0) {
            return res.json({ translated: cached.rows[0].translated_text, cached: true });
        }

        // שלח ל-DeepL (Free tier)
        const DEEPL_KEY = process.env.DEEPL_API_KEY;
        if (!DEEPL_KEY) {
            return res.json({ translated: text, note: 'no deepl key' });
        }

        const targetLang = lang === 'fr' ? 'FR' : 'EN';
        const response = await fetch('https://api-free.deepl.com/v2/translate', {
            method: 'POST',
            headers: {
                'Authorization': `DeepL-Auth-Key ${DEEPL_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                text,
                source_lang: 'HE',
                target_lang: targetLang,
            }),
        });

        if (!response.ok) {
            return res.json({ translated: text, error: 'deepl error' });
        }

        const data = await response.json();
        const translated = data.translations?.[0]?.text || text;

        // שמור במטמון
        await pool.query(
            `INSERT INTO translations (source_text, lang, translated_text)
             VALUES ($1, $2, $3)
             ON CONFLICT (source_text, lang) DO UPDATE SET translated_text=$3`,
            [text, lang, translated]
        ).catch(() => {}); // לא קריטי

        res.json({ translated });
    } catch (err) {
        console.error('translate error:', err.message);
        res.json({ translated: text });
    }
});

// =====================
// טיפול שגיאות גלובלי — מחזיר JSON תקין (כולל שגיאות העלאה ו-CORS)
// =====================
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        const msg = err.code === 'LIMIT_FILE_SIZE' ? 'הקובץ גדול מדי' : 'שגיאה בהעלאת הקובץ';
        return res.status(400).json({ error: msg });
    }
    if (err && /Origin/.test(err.message || '')) {
        return res.status(403).json({ error: 'מקור לא מורשה' });
    }
    if (err && err.message) {
        // שגיאות מסנני הקבצים שלנו (סוג קובץ לא נתמך וכו')
        if (/קובץ|PDF|תמונ/.test(err.message)) {
            return res.status(400).json({ error: err.message });
        }
    }
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'שגיאת שרת' });
});

// =====================
// הפעלת השרת
// =====================
const PORT = process.env.PORT || 3002;

// בדיקת חיבור ל-DB בעלייה — מתריע בלוג אם אין חיבור
pool.query('SELECT 1')
    .then(() => console.log('✅ חיבור לבסיס הנתונים תקין'))
    .catch((err) => console.error('⚠️  אזהרה: אין חיבור לבסיס הנתונים —', err.message));

app.listen(PORT, () => {
    console.log(`✅ שרת חסדי המלך פועל על פורט ${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/api/health`);
});
