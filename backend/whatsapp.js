/**
 * whatsapp.js
 * תשתית מוכנה לשליחת התראות לוואטסאפ (אופציונלי).
 *
 * כברירת מחדל — מושבת. כדי להפעיל, מגדירים ב-.env:
 *   WHATSAPP_ENABLED=true
 *   WHATSAPP_PROVIDER=<twilio | meta | callmebot | webhook>
 *   WHATSAPP_TO=<מספר היעד בפורמט בינלאומי, למשל 9725XXXXXXXX>
 * ועוד משתנים לפי הספק הנבחר (ראו .env.example).
 *
 * אם לא מוגדר / מושבת — הפונקציות פשוט לא עושות כלום (no-op),
 * בדיוק כמו שהמייל מתנהג כשהוא לא מוגדר. שום שגיאה לא חוסמת את הבקשה.
 *
 * משתמש ב-fetch המובנה של Node (גרסה 18+) — אין צורך בחבילות נוספות.
 */

const ENABLED = String(process.env.WHATSAPP_ENABLED || '').toLowerCase() === 'true';
const PROVIDER = (process.env.WHATSAPP_PROVIDER || '').toLowerCase();
const TO = (process.env.WHATSAPP_TO || '').replace(/[^\d]/g, ''); // מספרים בלבד

function isConfigured() {
    return ENABLED && PROVIDER && TO;
}

/**
 * בונה הודעת טקסט קריאה מתוך כותרת ורשימת שדות.
 * @param {string} subject
 * @param {Array<[string, any]>} fields - מערך של [תווית, ערך]
 * @returns {string}
 */
function buildMessage(subject, fields = []) {
    const lines = [subject, ''];
    for (const [label, value] of fields) {
        if (value === undefined || value === null || String(value).trim() === '') continue;
        lines.push(`*${label}:* ${String(value).trim()}`);
    }
    lines.push('');
    lines.push('— אתר חסדי המלך');
    return lines.join('\n');
}

// ─── ספקים ────────────────────────────────────────────────

// 1) Twilio WhatsApp API
async function sendViaTwilio(text) {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = (process.env.TWILIO_WHATSAPP_FROM || '').replace(/[^\d]/g, '');
    if (!sid || !token || !from) throw new Error('Twilio env לא הוגדר במלואו');

    const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
    const body = new URLSearchParams({
        From: `whatsapp:+${from}`,
        To: `whatsapp:+${TO}`,
        Body: text,
    });
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
    });
    if (!res.ok) throw new Error(`Twilio ${res.status}: ${await res.text()}`);
}

// 2) Meta WhatsApp Cloud API
async function sendViaMeta(text) {
    const phoneId = process.env.WHATSAPP_PHONE_ID;
    const accessToken = process.env.WHATSAPP_TOKEN;
    if (!phoneId || !accessToken) throw new Error('Meta WhatsApp env לא הוגדר במלואו');

    const url = `https://graph.facebook.com/v21.0/${phoneId}/messages`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: TO,
            type: 'text',
            text: { body: text },
        }),
    });
    if (!res.ok) throw new Error(`Meta ${res.status}: ${await res.text()}`);
}

// 3) CallMeBot — חינמי ופשוט (טוב לעמותה קטנה)
async function sendViaCallMeBot(text) {
    const apiKey = process.env.CALLMEBOT_APIKEY;
    if (!apiKey) throw new Error('CALLMEBOT_APIKEY לא הוגדר');

    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(TO)}`
        + `&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error(`CallMeBot ${res.status}: ${await res.text()}`);
}

// 4) Webhook גנרי (Green API / שירות מותאם) — POST עם JSON
async function sendViaWebhook(text) {
    const hookUrl = process.env.WHATSAPP_WEBHOOK_URL;
    if (!hookUrl) throw new Error('WHATSAPP_WEBHOOK_URL לא הוגדר');

    const headers = { 'Content-Type': 'application/json' };
    if (process.env.WHATSAPP_WEBHOOK_TOKEN) {
        headers.Authorization = `Bearer ${process.env.WHATSAPP_WEBHOOK_TOKEN}`;
    }
    const res = await fetch(hookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ to: TO, message: text }),
    });
    if (!res.ok) throw new Error(`Webhook ${res.status}: ${await res.text()}`);
}

const PROVIDERS = {
    twilio: sendViaTwilio,
    meta: sendViaMeta,
    callmebot: sendViaCallMeBot,
    webhook: sendViaWebhook,
};

/**
 * שולח התראת וואטסאפ. לא חוסם ולא זורק שגיאה — נכשל בשקט ומדווח ללוג בלבד.
 * @param {string} subject
 * @param {Array<[string, any]>} fields
 * @returns {Promise<boolean>} האם נשלח בהצלחה
 */
async function sendWhatsApp(subject, fields = []) {
    if (!isConfigured()) return false;
    const sender = PROVIDERS[PROVIDER];
    if (!sender) {
        console.error(`whatsapp: ספק לא מוכר "${PROVIDER}"`);
        return false;
    }
    try {
        await sender(buildMessage(subject, fields));
        return true;
    } catch (err) {
        console.error('whatsapp failed:', err.message);
        return false;
    }
}

module.exports = { sendWhatsApp, isConfigured };
