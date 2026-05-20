require('dotenv').config();
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// CORS
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// אבטחת כותרות HTTP
app.use(helmet({
    contentSecurityPolicy: false,
    hsts: false,
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
    originAgentCluster: false
}));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.set('trust proxy', 1);

// הגבלת קצב בקשות
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

// =========================
// In-Memory Store (עד שיתחבר DB)
// =========================
const store = {
    stats: { children_count: 350, hospitals_count: 5, books_count: 200, games_count: 500 },
    thankYouNotes: [],
    contacts: [],
    volunteers: [],
};

// =========================
// Routes — Public
// =========================

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ ok: true, project: 'חסדי המלך', timestamp: new Date().toISOString() });
});

// סטטיסטיקות (מדד החיוכים)
app.get('/api/stats', (req, res) => {
    res.json(store.stats);
});

// קיר תודה — רשימת הודעות מאושרות
app.get('/api/thank-you', (req, res) => {
    const approved = store.thankYouNotes.filter(n => n.approved);
    res.json(approved);
});

// קיר תודה — הגשת הודעה חדשה
app.post('/api/thank-you', (req, res) => {
    const { name, message } = req.body;
    if (!message || !message.trim()) {
        return res.status(400).json({ error: 'הודעה היא שדה חובה' });
    }
    const note = {
        id: Date.now(),
        display_name: name?.trim() || 'אנונימי',
        message: message.trim(),
        approved: false, // ממתין לאישור Admin
        created_at: new Date().toISOString(),
    };
    store.thankYouNotes.push(note);
    res.status(201).json({ ok: true, message: 'תודה! ההודעה נשלחה ותפורסם לאחר אישור.' });
});

// צור קשר
app.post('/api/contact', (req, res) => {
    const { name, phone, email, message } = req.body;
    if (!name?.trim() || !message?.trim()) {
        return res.status(400).json({ error: 'שם והודעה הם שדות חובה' });
    }
    const contact = {
        id: Date.now(),
        name: name.trim(),
        phone: phone?.trim() || '',
        email: email?.trim() || '',
        message: message.trim(),
        type: 'contact',
        replied: false,
        created_at: new Date().toISOString(),
    };
    store.contacts.push(contact);
    res.status(201).json({ ok: true, message: 'ההודעה נשלחה! נחזור אליכם בהקדם.' });
});

// מתנדבים
app.post('/api/volunteer', (req, res) => {
    const { name, phone, email, city, hasCar, message } = req.body;
    if (!name?.trim() || !phone?.trim() || !city?.trim()) {
        return res.status(400).json({ error: 'שם, טלפון ועיר הם שדות חובה' });
    }
    const volunteer = {
        id: Date.now(),
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || '',
        city: city.trim(),
        has_car: !!hasCar,
        message: message?.trim() || '',
        type: 'volunteer',
        replied: false,
        created_at: new Date().toISOString(),
    };
    store.volunteers.push(volunteer);
    res.status(201).json({ ok: true, message: 'ברוכים הבאים למשפחת חסדי המלך! ניצור קשר בהקדם.' });
});

// =========================
// Routes — Admin (בסיסי, עם סיסמה פשוטה)
// =========================
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'chasde2026';

function adminAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || auth !== `Bearer ${ADMIN_PASS}`) {
        return res.status(401).json({ error: 'גישה לא מורשית' });
    }
    next();
}

// Admin Login
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASS) {
        res.json({ ok: true, token: ADMIN_PASS });
    } else {
        res.status(401).json({ error: 'סיסמה שגויה' });
    }
});

// Admin — רשימת תודות (כולל ממתינות)
app.get('/api/admin/thank-you', adminAuth, (req, res) => {
    res.json(store.thankYouNotes);
});

// Admin — אישור/דחייה תודה
app.put('/api/admin/thank-you/:id', adminAuth, (req, res) => {
    const id = parseInt(req.params.id);
    const { approved } = req.body;
    const note = store.thankYouNotes.find(n => n.id === id);
    if (!note) return res.status(404).json({ error: 'לא נמצא' });
    note.approved = !!approved;
    res.json({ ok: true, note });
});

// Admin — רשימת פניות
app.get('/api/admin/contacts', adminAuth, (req, res) => {
    res.json(store.contacts);
});

// Admin — רשימת מתנדבים
app.get('/api/admin/volunteers', adminAuth, (req, res) => {
    res.json(store.volunteers);
});

// Admin — עדכון סטטיסטיקות
app.put('/api/admin/stats', adminAuth, (req, res) => {
    const { children_count, hospitals_count, books_count, games_count } = req.body;
    if (children_count !== undefined) store.stats.children_count = parseInt(children_count);
    if (hospitals_count !== undefined) store.stats.hospitals_count = parseInt(hospitals_count);
    if (books_count !== undefined) store.stats.books_count = parseInt(books_count);
    if (games_count !== undefined) store.stats.games_count = parseInt(games_count);
    res.json({ ok: true, stats: store.stats });
});

// =========================
// הפעלת השרת
// =========================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ שרת חסדי המלך פועל על פורט ${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/api/health`);
});
