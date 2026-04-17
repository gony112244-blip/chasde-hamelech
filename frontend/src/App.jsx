import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ToastProvider';

// דף placeholder זמני — יוחלף בשלב 2
function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Heebo', sans-serif",
      direction: 'rtl',
      background: '#1e3a5f',
      color: '#fff',
      gap: '16px'
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>חסדי המלך</h1>
      <p style={{ fontSize: '1.1rem', opacity: 0.85 }}>מחזירים את החיוך לגיבורים הקטנים</p>
      <div style={{
        marginTop: '20px',
        background: 'rgba(255,255,255,0.1)',
        padding: '12px 24px',
        borderRadius: '10px',
        fontSize: '0.9rem',
        opacity: 0.7
      }}>
        ✅ שלב 1 — שלד הפרויקט פועל
      </div>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
