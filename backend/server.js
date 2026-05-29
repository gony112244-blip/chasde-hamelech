require('dotenv').config();
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const nodemailer = require('nodemailer');
const pool = require('./db');

const app = express();

// =====================
// CORS
// =====================
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// =====================
// אבטחה
// =====================
app.use(helmet({
    contentSecurityPolicy: false,
    hsts: false,
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

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// =====================
// קבצים סטטיים — uploads
// =====================
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOADS_DIR));

// =====================
// Multer — העלאת קבצים
// =====================
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
        cb(null, unique);
    }
});
const fileFilter = (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|mp4|mov|webm|avi)$/i;
    if (allowed.test(file.originalname)) cb(null, true);
    else cb(new Error('סוג קובץ לא נתמך'), false);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 100 * 1024 * 1024 } });

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
// Admin Auth
// =====================
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'chasde2026';
function adminAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || auth !== `Bearer ${ADMIN_PASS}`) {
        return res.status(401).json({ error: 'גישה לא מורשית' });
    }
    next();
}

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
    try {
        const result = await pool.query(
            "SELECT id, display_name, message, created_at FROM thank_you_notes WHERE status='approved' ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// קיר תודה — הגשה חדשה
app.post('/api/thank-you', async (req, res) => {
    const { name, message } = req.body;
    if (!message?.trim()) {
        return res.status(400).json({ error: 'הודעה היא שדה חובה' });
    }
    try {
        await pool.query(
            'INSERT INTO thank_you_notes (display_name, message) VALUES ($1, $2)',
            [name?.trim() || 'אנונימי', message.trim()]
        );
        res.status(201).json({ ok: true, message: 'תודה! ההודעה נשלחה ותפורסם לאחר אישור.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// צור קשר
app.post('/api/contact', async (req, res) => {
    const { name, phone, email, message } = req.body;
    if (!name?.trim() || !message?.trim()) {
        return res.status(400).json({ error: 'שם והודעה הם שדות חובה' });
    }
    try {
        await pool.query(
            'INSERT INTO contacts (name, phone, email, message) VALUES ($1, $2, $3, $4)',
            [name.trim(), phone?.trim() || '', email?.trim() || '', message.trim()]
        );
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
    try {
        await pool.query(
            'INSERT INTO volunteers (name, phone, email, city, has_car, notes) VALUES ($1, $2, $3, $4, $5, $6)',
            [name.trim(), phone.trim(), email?.trim() || '', city.trim(), !!hasCar, message?.trim() || '']
        );
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

    try {
        let query, params;
        if (category) {
            query = `SELECT * FROM media WHERE category=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`;
            params = [category, limit, offset];
        } else {
            query = `SELECT * FROM media ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
            params = [limit, offset];
        }
        const result = await pool.query(query, params);

        const countQuery = category
            ? `SELECT COUNT(*) FROM media WHERE category=$1`
            : `SELECT COUNT(*) FROM media`;
        const countResult = await pool.query(countQuery, category ? [category] : []);
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

app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASS) {
        res.json({ ok: true, token: ADMIN_PASS });
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
                    <p>שלום ${c.name},</p>
                    <p>${reply_text.trim().replace(/\n/g, '<br>')}</p>
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
        res.status(500).json({ error: 'שגיאת שרת: ' + err.message });
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
                await pool.query(
                    'INSERT INTO stats (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value=$2',
                    [key, parseInt(req.body[key])]
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

// תרומות — הוספה
app.post('/api/donations', async (req, res) => {
    const { donor_name, amount, method, note } = req.body;
    if (!amount || isNaN(parseFloat(amount))) {
        return res.status(400).json({ error: 'סכום תרומה הוא חובה' });
    }
    try {
        await pool.query(
            'INSERT INTO donations (donor_name, amount, method, note) VALUES ($1, $2, $3, $4)',
            [donor_name?.trim() || 'אנונימי', parseFloat(amount), method || 'other', note?.trim() || '']
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
    if (!amount || isNaN(parseFloat(amount))) {
        return res.status(400).json({ error: 'סכום תרומה הוא חובה' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO donations (donor_name, amount, method, note) VALUES ($1,$2,$3,$4) RETURNING *',
            [donor_name?.trim() || 'אנונימי', parseFloat(amount), method || 'other', note?.trim() || '']
        );
        res.status(201).json({ ok: true, donation: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת' });
    }
});

// =====================
// הפעלת השרת
// =====================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ שרת חסדי המלך פועל על פורט ${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/api/health`);
});
