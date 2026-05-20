import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './components/ToastProvider';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// דפים
import HomePage from './pages/HomePage';
import ThankYouPage from './pages/ThankYouPage';
import VolunteerPage from './pages/VolunteerPage';
import ContactPage from './pages/ContactPage';
import HelpPage from './pages/HelpPage';
import GalleryPage from './pages/GalleryPage';
import QRLandingPage from './pages/QRLandingPage';
import NotFoundPage from './pages/NotFoundPage';

// placeholder לדפי Admin שייבנו בהמשך
function PlaceholderPage({ name, icon = '🚧' }) {
    return (
        <div style={ph.wrapper}>
            <div style={ph.card}>
                <span style={{ fontSize: '3rem' }}>{icon}</span>
                <h2 style={ph.title}>{name}</h2>
                <p style={ph.text}>דף זה ייבנה בקרוב</p>
            </div>
        </div>
    );
}

function Layout() {
    const location = useLocation();
    const isQR = location.pathname.startsWith('/qr');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <a href="#main-content" className="skip-to-content">דלג לתוכן הראשי</a>
            {!isQR && <Navbar />}
            <main id="main-content" style={{ flex: 1 }}>
                <Routes>
                    <Route path="/"          element={<HomePage />} />
                    <Route path="/gallery"   element={<GalleryPage />} />
                    <Route path="/thank-you" element={<ThankYouPage />} />
                    <Route path="/help"      element={<HelpPage />} />
                    <Route path="/volunteer" element={<VolunteerPage />} />
                    <Route path="/contact"   element={<ContactPage />} />
                    <Route path="/admin/*"   element={<PlaceholderPage name="ניהול" icon="⚙️" />} />
                    <Route path="/qr"        element={<QRLandingPage />} />
                    <Route path="/qr/:id"    element={<QRLandingPage />} />
                    <Route path="*"          element={<NotFoundPage />} />
                </Routes>
            </main>
            {!isQR && <Footer />}
        </div>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <ToastProvider>
                <Router>
                    <ScrollToTop />
                    <Layout />
                </Router>
            </ToastProvider>
        </ErrorBoundary>
    );
}

export default App;

const ph = {
    wrapper: {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)', background: 'var(--bg-light)',
        fontFamily: "'Heebo', sans-serif", direction: 'rtl', padding: '40px 20px',
    },
    card: {
        background: 'var(--bg-card)', borderRadius: '24px', padding: '48px 40px',
        textAlign: 'center', boxShadow: 'var(--shadow-md)', display: 'flex',
        flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '400px',
        width: '100%', animation: 'fadeInUp 0.5s ease-out',
    },
    title: { color: 'var(--royal)', fontSize: '1.6rem', fontWeight: 700 },
    text: { color: 'var(--text-muted)', fontSize: '1rem' },
};
