// בפיתוח: localhost:3002, בפרודקשן: ריק — Nginx מנתב /api/ לשרת
const API_BASE = import.meta.env.VITE_API_URL || (
    import.meta.env.DEV ? 'http://localhost:3002' : ''
);

// כתובת הבסיס לקבצי uploads — בפרודקשן Nginx מנתב /uploads/ לשרת
const UPLOADS_BASE = import.meta.env.DEV ? 'http://localhost:3002/uploads' : '/uploads';

export { API_BASE, UPLOADS_BASE };
export default API_BASE;
