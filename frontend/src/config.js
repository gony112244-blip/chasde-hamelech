// כתובת ה-API — בפיתוח: localhost, בפרודקשן: ריק (אותו שרת)
// העתק מהפנקס ומותאם לחסדי המלך
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export { API_BASE };
export default API_BASE;
