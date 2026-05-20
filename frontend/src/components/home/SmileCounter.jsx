import { useEffect, useState, useRef } from 'react';

// TODO: להחליף במספרים אמיתיים מהמשתמש
const STATS = [
    { icon: '😊', value: 350, label: 'ילדים שמחו', suffix: '+' },
    { icon: '🏥', value: 5, label: 'בתי חולים', suffix: '' },
    { icon: '📚', value: 200, label: 'ספרים חולקו', suffix: '+' },
    { icon: '🎮', value: 500, label: 'משחקים חולקו', suffix: '+' },
];

function AnimatedNumber({ target, suffix = '' }) {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    setStarted(true);
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return;
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [started, target]);

    return (
        <span ref={ref} style={s.number}>
            {count.toLocaleString('he-IL')}{suffix}
        </span>
    );
}

export default function SmileCounter() {
    return (
        <section style={s.section}>
            <div style={s.inner}>
                <h2 style={s.title}>
                    <span style={s.titleIcon}>📊</span>
                    מדד החיוכים
                </h2>
                <p style={s.subtitle}>המספרים שמספרים את הסיפור</p>

                <div style={s.grid}>
                    {STATS.map((stat, i) => (
                        <div key={i} style={s.card}>
                            <span style={s.cardIcon}>{stat.icon}</span>
                            <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                            <span style={s.label}>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const s = {
    section: {
        background: 'var(--bg-light)',
        fontFamily: "'Heebo', sans-serif",
        direction: 'rtl',
        padding: '80px 20px',
        position: 'relative',
    },
    inner: {
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center',
    },
    title: {
        fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
        fontWeight: 800,
        color: 'var(--royal)',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
    },
    titleIcon: { fontSize: '1.4rem' },
    subtitle: {
        color: 'var(--text-muted)',
        fontSize: '1.05rem',
        marginBottom: '40px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '20px',
    },
    card: {
        background: 'var(--bg-card)',
        borderRadius: '20px',
        padding: '32px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid rgba(76,29,149,0.06)',
        transition: 'transform 0.3s, box-shadow 0.3s',
    },
    cardIcon: {
        fontSize: '2.5rem',
        lineHeight: 1,
    },
    number: {
        fontSize: '2.4rem',
        fontWeight: 900,
        color: 'var(--royal)',
        lineHeight: 1,
    },
    label: {
        fontSize: '0.95rem',
        color: 'var(--text-muted)',
        fontWeight: 500,
    },
};
