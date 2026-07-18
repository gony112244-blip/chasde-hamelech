import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import API_BASE from '../config';

const NAVY = '#0f2044';
const GOLD = '#d4a017';

function hebrewMonth(ym) {
    const [y, m] = ym.split('-');
    return new Date(Number(y), Number(m) - 1, 1)
        .toLocaleDateString('he-IL', { month: 'long', year: 'numeric' });
}

export default function TransparencyPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(API_BASE + '/api/monthly-reports')
            .then(r => r.json())
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const current = data?.current;
    const history = data?.reports || [];
    const pct = current && current.goal > 0
        ? Math.min(100, Math.round((current.distributions / current.goal) * 100))
        : null;

    return (
        <div style={s.page}>
            <PageMeta
                title="שקיפות ופעילות — חסדי המלך"
                description="כל חודש אנחנו מפרסמים דוח פעילות עם מספר החלוקות שביצענו בשטח."
                path="/transparency"
            />

            {/* Header */}
            <section style={s.header}>
                <div style={s.orb} />
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h1 style={s.title}>🔍 שקיפות ופעילות</h1>
                    <p style={s.subtitle}>
                        כאן תוכלו לראות בדיוק כמה חלוקות ביצענו כל חודש.<br />
                        אנחנו מאמינים בפתיחות — מפרסמים דוחות פעילות ומעדכנים על החלוקות בשטח.
                    </p>
                </div>
            </section>

            {/* Current Month Progress */}
            <section style={s.progressSection}>
                <div style={s.progressCard}>
                    {loading ? (
                        <div style={s.spinner}><div style={s.spinnerDot} /></div>
                    ) : current ? (
                        <>
                            <span style={s.monthBadge}>{hebrewMonth(current.month_year)}</span>
                            <p style={{ color: '#6478a8', fontSize: '0.88rem', margin: 0 }}>יעד החודש</p>

                            <div style={s.bigNumbers}>
                                <div style={s.bigNum}>
                                    <span style={s.bigNumVal}>{current.distributions}</span>
                                    <span style={s.bigNumLabel}>חלוקות בוצעו</span>
                                </div>
                                {current.goal > 0 && (
                                    <>
                                        <div style={s.divider} />
                                        <div style={s.bigNum}>
                                            <span style={{ ...s.bigNumVal, color: '#6478a8' }}>{current.goal}</span>
                                            <span style={s.bigNumLabel}>יעד החודש</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {pct !== null && (
                                <div style={{ width: '100%' }}>
                                    <div style={s.barTrack}>
                                        <div style={{ ...s.barFill, width: pct + '%' }} />
                                    </div>
                                    <p style={{ textAlign: 'center', color: '#6478a8', fontSize: '0.82rem', marginTop: '6px' }}>
                                        {pct}% מהיעד הושג
                                    </p>
                                </div>
                            )}

                            {current.description && (
                                <p style={s.desc}>📝 {current.description}</p>
                            )}
                            {current.receipts_url && (
                                <a href={current.receipts_url} target="_blank" rel="noopener noreferrer" style={s.receiptsBtn}>
                                    📎 מסמכי רכש / הוצאות החודש
                                </a>
                            )}
                            {current.receipts_url && (
                                <p style={{ color: '#6478a8', fontSize: '0.78rem', margin: '8px 0 0', textAlign: 'center' }}>
                                    מדובר במסמכי רכש/הוצאות לפעילות — לא באישורי מס לתורמים.
                                </p>
                            )}
                        </>
                    ) : (
                        <div style={s.noData}>
                            <span style={{ fontSize: '3rem' }}>📊</span>
                            <p>דוח החודש הנוכחי יתעדכן בקרוב</p>
                        </div>
                    )}
                </div>
            </section>

            {/* History */}
            {history.length > 1 && (
                <section style={s.histSection}>
                    <div style={s.histInner}>
                        <h2 style={s.histTitle}>📅 היסטוריית פעילות</h2>
                        <p style={s.histSub}>היסטוריית דוחות הפעילות שפורסמו באתר.</p>
                        <div style={s.histList}>
                            {history.map(r => {
                                const p = r.goal > 0
                                    ? Math.min(100, Math.round((r.distributions / r.goal) * 100))
                                    : null;
                                return (
                                    <div key={r.id} style={s.histCard}>
                                        <div style={s.histTop}>
                                            <strong style={s.histMonth}>{hebrewMonth(r.month_year)}</strong>
                                            <span style={s.histCount}>✅ {r.distributions} חלוקות</span>
                                        </div>
                                        {p !== null && (
                                            <div style={s.histBarWrap}>
                                                <div style={s.histBarTrack}>
                                                    <div style={{ height: '100%', borderRadius: '999px', background: NAVY, width: p + '%' }} />
                                                </div>
                                                <span style={s.histPct}>{p}%</span>
                                            </div>
                                        )}
                                        {r.description && (
                                            <p style={s.histDesc}>{r.description}</p>
                                        )}
                                        {r.receipts_url && (
                                            <a href={r.receipts_url} target="_blank" rel="noopener noreferrer" style={s.histReceiptsBtn}>
                                                📎 מסמכי רכש
                                            </a>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Values */}
            <section style={s.values}>
                <div style={s.valuesInner}>
                    {[
                        { icon: '💛', t: 'לתרומה ישירה', d: 'התרומות מיועדות לרכישת ציוד ולחלוקה לילדים. מפרסמים דוחות פעילות.' },
                        { icon: '🧾', t: 'מסמכי רכש', d: 'כשיש קישור — מפרסמים מסמכי רכש/הוצאות (לא אישורי מס לתורמים).' },
                        { icon: '📅', t: 'דיווח חודשי', d: 'כל חודש מתעדכן מספר החלוקות שבוצעו.' },
                    ].map((v, i) => (
                        <div key={i} style={s.valueCard}>
                            <span style={{ fontSize: '2.2rem' }}>{v.icon}</span>
                            <strong style={s.valueTitle}>{v.t}</strong>
                            <p style={s.valueDesc}>{v.d}</p>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: '36px' }}>
                    <Link to="/help" style={s.donateBtn}>💛 לתרומה</Link>
                </div>
            </section>
        </div>
    );
}

const s = {
    page: { fontFamily: "'Heebo', sans-serif", direction: 'inherit' },
    header: {
        background: 'linear-gradient(165deg, #0f2044 0%, #1a3460 50%, #071530 100%)',
        padding: '60px 20px 50px', textAlign: 'center', position: 'relative', overflow: 'hidden',
    },
    orb: {
        position: 'absolute', top: '-20%', left: '10%', width: '220px', height: '220px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)',
    },
    title: { color: GOLD, fontSize: 'clamp(1.8rem,5vw,2.5rem)', fontWeight: 800, marginBottom: '12px' },
    subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.7 },

    progressSection: { padding: '0 20px 60px', marginTop: '-24px', position: 'relative', zIndex: 3 },
    progressCard: {
        maxWidth: '580px', margin: '0 auto',
        background: '#fff', borderRadius: '24px', padding: '40px 36px',
        boxShadow: '0 10px 40px rgba(15,32,68,0.12)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px',
    },
    monthBadge: {
        background: '#dbeafe', color: NAVY, padding: '4px 20px',
        borderRadius: '999px', fontSize: '0.9rem', fontWeight: 700,
    },
    bigNumbers: { display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' },
    bigNum: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
    bigNumVal: { fontSize: '3rem', fontWeight: 900, color: '#059669', lineHeight: 1 },
    bigNumLabel: { color: '#6478a8', fontSize: '0.85rem' },
    divider: { width: '1px', height: '50px', background: '#e5e7eb' },
    barTrack: {
        width: '100%', background: '#f0f4ff', borderRadius: '999px',
        height: '16px', overflow: 'hidden',
    },
    barFill: {
        height: '100%', borderRadius: '999px',
        background: 'linear-gradient(90deg, #0f2044 0%, #1a3460 100%)',
        transition: 'width 0.6s ease',
    },
    desc: { color: '#2d4070', fontSize: '0.95rem', textAlign: 'center', margin: 0, lineHeight: 1.6 },
    receiptsBtn: {
        display: 'inline-block', padding: '10px 24px',
        background: '#dbeafe', color: NAVY, borderRadius: '12px',
        textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem',
    },
    noData: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '12px', color: '#6478a8', padding: '20px 0',
    },
    spinner: { display: 'flex', justifyContent: 'center', padding: '40px 0' },
    spinnerDot: {
        width: '36px', height: '36px', borderRadius: '50%',
        border: '3px solid #dbeafe', borderTop: '3px solid #0f2044',
        animation: 'spin 0.8s linear infinite',
    },

    histSection: { padding: '60px 20px', background: '#f8fafe' },
    histInner: { maxWidth: '680px', margin: '0 auto' },
    histTitle: { color: NAVY, fontSize: 'clamp(1.3rem,4vw,1.7rem)', fontWeight: 800, marginBottom: '8px', textAlign: 'center' },
    histSub: { color: '#6478a8', fontSize: '0.95rem', textAlign: 'center', marginBottom: '28px' },
    histList: { display: 'flex', flexDirection: 'column', gap: '14px' },
    histCard: {
        background: '#fff', borderRadius: '16px', padding: '18px 22px',
        boxShadow: '0 2px 10px rgba(15,32,68,0.06)', borderRight: '4px solid #dbeafe',
        display: 'flex', flexDirection: 'column', gap: '10px',
    },
    histTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' },
    histMonth: { color: NAVY, fontSize: '1.02rem' },
    histCount: { color: '#059669', fontWeight: 700, fontSize: '0.98rem' },
    histBarWrap: { display: 'flex', alignItems: 'center', gap: '10px' },
    histBarTrack: { flex: 1, background: '#e8effc', borderRadius: '999px', height: '8px', overflow: 'hidden' },
    histPct: { color: '#6478a8', fontSize: '0.8rem', minWidth: '36px', textAlign: 'left' },
    histDesc: { color: '#2d4070', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 },
    histReceiptsBtn: {
        display: 'inline-block', padding: '5px 14px',
        background: '#f0f4ff', color: NAVY, borderRadius: '8px',
        textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, alignSelf: 'flex-start',
    },

    values: { padding: '60px 20px', background: 'linear-gradient(135deg, #0f2044, #1a3460)' },
    valuesInner: {
        maxWidth: '800px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px',
    },
    valueCard: {
        background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '26px 18px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
        textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)',
    },
    valueTitle: { color: GOLD, fontSize: '1rem', fontWeight: 700 },
    valueDesc: { color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 },
    donateBtn: {
        display: 'inline-block', padding: '14px 40px',
        background: 'linear-gradient(135deg, #d4a017, #f0c040)', color: '#3b0764',
        borderRadius: '14px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
    },
};
