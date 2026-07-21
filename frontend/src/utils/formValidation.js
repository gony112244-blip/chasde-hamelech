/** ולידציה משותפת לטפסים — חייבת להתאים ל־backend/server.js */

export const FIELD_LIMITS = {
    contact: { name: 100, phone: 30, email: 150, message: 3000 },
    volunteer: { name: 100, phone: 30, email: 150, city: 60, message: 2000 },
    thankYou: { name: 80, email: 150, hospital: 80, message: 2000 },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
    return EMAIL_RE.test(String(email || '').trim());
}

/** טלפון ישראלי / בינלאומי בסיסי — 7–15 ספרות אחרי ניקוי */
export function isValidPhone(phone) {
    const digits = String(phone || '').replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) return false;
    if (digits.startsWith('972')) return digits.length >= 11 && digits.length <= 13;
    if (digits.startsWith('0')) return digits.length >= 9 && digits.length <= 10;
    return true;
}

function tooLong(value, max) {
    return String(value || '').length > max;
}

/** מסיר תגי HTML — טקסט בלבד (מניעת XSS בתוכן שנשמר/מוצג) */
export function toPlainText(str) {
    return String(str || '').replace(/<[^>]*>/g, '');
}

/**
 * @returns {string|null} הודעת שגיאה בעברית, או null אם תקין
 */
export function validateContactForm(form) {
    const name = (form.name || '').trim();
    const phone = (form.phone || '').trim();
    const email = (form.email || '').trim();
    const message = (form.message || '').trim();
    const L = FIELD_LIMITS.contact;

    if (!name) return 'נא למלא שם.';
    if (!message) return 'נא למלא הודעה.';
    if (!phone && !email) return 'נא למלא טלפון או מייל כדי שנוכל לחזור אליכם.';
    if (tooLong(name, L.name)) return `השם ארוך מדי (עד ${L.name} תווים).`;
    if (tooLong(phone, L.phone)) return `מספר הטלפון ארוך מדי (עד ${L.phone} תווים).`;
    if (tooLong(email, L.email)) return `כתובת המייל ארוכה מדי (עד ${L.email} תווים).`;
    if (tooLong(message, L.message)) return `ההודעה ארוכה מדי (עד ${L.message} תווים).`;
    if (phone && !isValidPhone(phone)) return 'מספר טלפון לא תקין.';
    if (email && !isValidEmail(email)) return 'כתובת מייל לא תקינה.';
    return null;
}

export function validateVolunteerForm(form) {
    const name = (form.name || '').trim();
    const phone = (form.phone || '').trim();
    const email = (form.email || '').trim();
    const city = (form.city || '').trim();
    const message = (form.message || '').trim();
    const L = FIELD_LIMITS.volunteer;

    if (!name || !phone || !city) return 'שם, טלפון ועיר הם שדות חובה.';
    if (tooLong(name, L.name)) return `השם ארוך מדי (עד ${L.name} תווים).`;
    if (tooLong(phone, L.phone)) return `מספר הטלפון ארוך מדי (עד ${L.phone} תווים).`;
    if (tooLong(email, L.email)) return `כתובת המייל ארוכה מדי (עד ${L.email} תווים).`;
    if (tooLong(city, L.city)) return `שם העיר ארוך מדי (עד ${L.city} תווים).`;
    if (tooLong(message, L.message)) return `ההודעה ארוכה מדי (עד ${L.message} תווים).`;
    if (!isValidPhone(phone)) return 'מספר טלפון לא תקין.';
    if (email && !isValidEmail(email)) return 'כתובת מייל לא תקינה.';
    return null;
}

export function validateThankYouForm(form) {
    const name = (form.name || '').trim();
    const email = (form.email || '').trim();
    const hospital = (form.hospital || '').trim();
    const message = (form.message || '').trim();
    const L = FIELD_LIMITS.thankYou;

    if (!message) return 'נא לכתוב הודעת תודה לפני השליחה.';
    if (tooLong(name, L.name)) return `השם ארוך מדי (עד ${L.name} תווים).`;
    if (tooLong(email, L.email)) return `כתובת המייל ארוכה מדי (עד ${L.email} תווים).`;
    if (tooLong(hospital, L.hospital)) return `שם בית החולים ארוך מדי (עד ${L.hospital} תווים).`;
    if (tooLong(message, L.message)) return `ההודעה ארוכה מדי (עד ${L.message} תווים).`;
    if (email && !isValidEmail(email)) return 'כתובת מייל לא תקינה.';
    return null;
}
