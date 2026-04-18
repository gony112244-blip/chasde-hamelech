import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './components/ToastProvider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// ── דפים placeholder — יוחלפו בשלבים הבאים ──
function HomePage() {
    return (
        <main style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 64px)',
            background: 'linear-gradient(165deg, #1e3a5f 0%, #2d4a6f 50%, #1e3a5f 100%)',
            color: '#fff',
            fontFamily: "'Heebo', sans-serif",
            direction: 'rtl',
            gap: '16px',
            padding: '40px 20px',
            textAlign: 'center',
        }}>
            <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 800, color: '#c9a227' }}>
                חסדי המלך
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)', opacity: 0.85, maxWidth: '500px', lineHeight: 1.6 }}>
                מחזירים את החיוך לגיבורים הקטנים
            </p>
            <div style={{
                marginTop: '20px',
                background: 'rgba(201,162,39,0.15)',
                border: '1px solid rgba(201,162,39,0.4)',
                padding: '10px 24px',
                borderRadius: '10px',
                fontSize: '0.9rem',
                color: '#c9a227',
                fontWeight: 600,
            }}>
                ✅ שלב 2 — עיצוב בסיסי פועל
            </div>
        </main>
    );
}

// placeholder לדפים שייבנו בשלבים הבאים
function PlaceholderPage({ name }) {
    return (
        <main style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: 'calc(100vh - 64px)', background: 'var(--cream)',
            fontFamily: "'Heebo', sans-serif", direction: 'rtl', flexDirection: 'column', gap: '12px'
        }}>
            <h2 style={{ color: 'var(--navy)', fontSize: '1.8rem', fontWeight: 700 }}>{name}</h2>
            <p style={{ color: 'var(--text-muted)' }}>דף זה ייבנה בשלב הבא</p>
        </main>
    );
}

// ── Layout ראשי עם נאב ופוטר ──
function Layout() {
    const location = useLocation();
    // דפי QR לא מציגים נאב ופוטר (שלב 6)
    const isQR = location.pathname.startsWith('/qr');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {!isQR && <Navbar />}
            <Routes>
                <Route path="/"          element={<HomePage />} />
                <Route path="/gallery"   element={<PlaceholderPage name="גלריית רגעים" />} />
                <Route path="/thank-you" element={<PlaceholderPage name="קיר התודה" />} />
                <Route path="/help"      element={<PlaceholderPage name="איך עוזרים" />} />
                <Route path="/volunteer" element={<PlaceholderPage name="הצטרפו כמתנדבים" />} />
                <Route path="/contact"   element={<PlaceholderPage name="צור קשר" />} />
                <Route path="/admin/*"   element={<PlaceholderPage name="ניהול" />} />
                <Route path="/qr/:id"    element={<PlaceholderPage name="QR" />} />
            </Routes>
            {!isQR && <Footer />}
        </div>
    );
}

function App() {
    return (
        <ToastProvider>
            <Router>
                <Layout />
            </Router>
        </ToastProvider>
    );
}

export default App;
