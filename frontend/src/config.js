// בפיתוח: localhost:3002, בפרודקשן: ריק — Nginx מנתב /api/ לשרת
const API_BASE = import.meta.env.VITE_API_URL || (
    import.meta.env.DEV ? 'http://localhost:3002' : ''
);

export { API_BASE };
export default API_BASE;
