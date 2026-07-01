import { useEffect, useState, useRef } from 'react';
import { useT } from '../../hooks/useT';
import { useLang } from '../../contexts/LangContext';
import API_BASE from '../../config';
import { HospitalIcon } from '../icons/StatIcons';

const LOCALES = { he: 'he-IL', en: 'en-US', fr: 'fr-FR' };

function AnimatedNumber({ target, suffix = '' }) {
    const { lang } = useLang();
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
            {count.toLocaleString(LOCALES[lang] || 'he-IL')}{suffix}
        </span>
    );
}

// ערכי ברירת מחדל — מוצגים אם השרת לא זמין
const DEFAULTS = { children_count: 350, hospitals_count: 5, books_count: 200, games_count: 500 };

export default function SmileCounter() {
    const t = useT();
    const [stats, setStats] = useState(DEFAULTS);

    useEffect(() => {
        fetch(`${API_BASE}/api/stats`)
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data && typeof data === 'object') {
                    setStats(prev => ({
                        children_count: Number(data.children_count) || prev.children_count,
                        hospitals_count: Number(data.hospitals_count) || prev.hospitals_count,
                        books_count: Number(data.books_count) || prev.books_count,
                        games_count: Number(data.games_count) || prev.games_count,
                    }));
                }
            })
            .catch(() => {}); // נשארים עם ברירת המחדל
    }, []);

    const STATS = [
        { icon: '😊', value: stats.children_count, labelKey: 'smile_children', suffix: '+' },
        { icon: 'hospital', value: stats.hospitals_count, labelKey: 'smile_hospitals', suffix: '' },
        { icon: '📚', value: stats.books_count, labelKey: 'smile_books',     suffix: '+' },
        { icon: '🎮', value: stats.games_count, labelKey: 'smile_games',     suffix: '+' },
    ];

    return (
        <section style={s.section}>
            <div style={s.inner}>
                <h2 style={s.title}>
                    <span style={s.titleIcon}>📊</span>
                    {t('smile_title')}
                </h2>

                <div style={s.grid}>
                    {STATS.map((stat, i) => (
                        <div key={i} style={s.card}>
                            <span style={s.cardIcon}>
                                {stat.icon === 'hospital'
                                    ? <HospitalIcon size={40} />
                                    : stat.icon}
                            </span>
                            <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                            <span style={s.label}>{t(stat.labelKey)}</span>
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
        direction: 'inherit',
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
        border: '1px solid rgba(15,32,68,0.06)',
        transition: 'transform 0.3s, box-shadow 0.3s',
    },
    cardIcon: {
        fontSize: '2.5rem',
        lineHeight: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '2.5rem',
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
