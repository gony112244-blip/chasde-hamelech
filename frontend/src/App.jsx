import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './components/ToastProvider';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import SecretAdminTrigger from './components/SecretAdminTrigger';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { LangProvider } from './contexts/LangContext';
import { useT } from './hooks/useT';

// דפים
import HomePage from './pages/HomePage';
import ThankYouPage from './pages/ThankYouPage';
import VolunteerPage from './pages/VolunteerPage';
import ContactPage from './pages/ContactPage';
import HelpPage from './pages/HelpPage';
import GalleryPage from './pages/GalleryPage';
import QRLandingPage from './pages/QRLandingPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ParashaPage from './pages/ParashaPage';
import PrivacyPage from './pages/PrivacyPage';
import AccessibilityPage from './pages/AccessibilityPage';
import TermsPage from './pages/TermsPage';

function Layout() {
    const location = useLocation();
    const t = useT();
    const isQR = location.pathname.startsWith('/qr');
    const isAdmin = location.pathname.startsWith('/admin');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <SecretAdminTrigger />
            <a href="#main-content" className="skip-to-content">{t('a11y_skip_to_content')}</a>
            {!isQR && !isAdmin && <Navbar />}
            <main id="main-content" style={{ flex: 1 }}>
                <Routes>
                    <Route path="/"                  element={<HomePage />} />
                    <Route path="/gallery"            element={<GalleryPage />} />
                    <Route path="/thank-you"          element={<ThankYouPage />} />
                    <Route path="/help"               element={<HelpPage />} />
                    <Route path="/volunteer"          element={<VolunteerPage />} />
                    <Route path="/contact"            element={<ContactPage />} />
                    <Route path="/admin"              element={<AdminLoginPage />} />
                    <Route path="/admin/dashboard"    element={<AdminDashboardPage />} />
                    <Route path="/parasha"            element={<ParashaPage />} />
                    <Route path="/privacy"            element={<PrivacyPage />} />
                    <Route path="/accessibility"      element={<AccessibilityPage />} />
                    <Route path="/terms"              element={<TermsPage />} />
                    <Route path="/qr"                 element={<QRLandingPage />} />
                    <Route path="/qr/:id"             element={<QRLandingPage />} />
                    <Route path="*"                   element={<NotFoundPage />} />
                </Routes>
            </main>
            {!isQR && !isAdmin && <Footer />}
        </div>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <LangProvider>
                <ToastProvider>
                    <Router>
                        <ScrollToTop />
                        <Layout />
                    </Router>
                </ToastProvider>
            </LangProvider>
        </ErrorBoundary>
    );
}

export default App;
