// בפיתוח: localhost:3002, בפרודקשן: ריק — Nginx מנתב /api/ לשרת
const API_BASE = import.meta.env.VITE_API_URL || (
    import.meta.env.DEV ? 'http://localhost:3002' : ''
);

// כתובת הבסיס לקבצי uploads — בפרודקשן Nginx מנתב /uploads/ לשרת
const UPLOADS_BASE = import.meta.env.DEV ? 'http://localhost:3002/uploads' : '/uploads';

/** פרטי תשלום — מוגדרים ב-.env (VITE_*) לפני build */
const PAYMENTS = {
    payboxLink: import.meta.env.VITE_PAYBOX_LINK || 'https://payboxapp.page.link/WXV7',
    bitNumber: import.meta.env.VITE_BIT_NUMBER || '',
    paypalLink: import.meta.env.VITE_PAYPAL_LINK || '',
    bank: {
        name: import.meta.env.VITE_BANK_NAME || '',
        branch: import.meta.env.VITE_BANK_BRANCH || '',
        account: import.meta.env.VITE_BANK_ACCOUNT || '',
        holder: import.meta.env.VITE_BANK_HOLDER || 'חסדי המלך',
    },
};

export { API_BASE, UPLOADS_BASE, PAYMENTS };
export default API_BASE;
