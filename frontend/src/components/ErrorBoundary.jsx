import { Component } from 'react';

// תופס שגיאות React ומציג מסך ידידותי במקום קריסה
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={s.container}>
                    <div style={s.card}>
                        <span style={s.icon}>😔</span>
                        <h1 style={s.title}>אופס! משהו השתבש</h1>
                        <p style={s.text}>
                            נתקלנו בבעיה לא צפויה. אנחנו מתנצלים על אי הנוחות.
                        </p>
                        <button
                            style={s.btn}
                            onClick={() => window.location.reload()}
                        >
                            🔄 רענן את הדף
                        </button>
                        <button
                            style={s.btnSecondary}
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                window.location.href = '/';
                            }}
                        >
                            🏠 חזרה לדף הבית
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

const s = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(165deg, #0f2044 0%, #071530 50%, #2e0a66 100%)',
        fontFamily: "'Heebo', sans-serif",
        direction: 'inherit',
        padding: '20px',
    },
    card: {
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '24px',
        padding: '48px 40px',
        maxWidth: '440px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center',
    },
    icon: {
        fontSize: '4rem',
        lineHeight: 1,
    },
    title: {
        color: '#0f2044',
        fontSize: '1.5rem',
        fontWeight: 700,
        margin: 0,
    },
    text: {
        color: '#4a4458',
        fontSize: '1rem',
        lineHeight: 1.6,
        margin: 0,
    },
    btn: {
        marginTop: '8px',
        background: 'linear-gradient(135deg, #0f2044 0%, #1a3460 100%)',
        color: '#fff',
        border: 'none',
        padding: '14px 32px',
        borderRadius: '14px',
        fontSize: '1rem',
        fontWeight: 700,
        cursor: 'pointer',
        width: '100%',
    },
    btnSecondary: {
        background: 'transparent',
        color: '#0f2044',
        border: '2px solid #0f2044',
        padding: '12px 32px',
        borderRadius: '14px',
        fontSize: '0.95rem',
        fontWeight: 600,
        cursor: 'pointer',
        width: '100%',
    },
};
