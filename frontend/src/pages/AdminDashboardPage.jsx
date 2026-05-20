import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../config';

const TABS = [
    { id: 'contacts',   label: 'פניות',       icon: '✉️' },
    { id: 'volunteers', label: 'מתנדבים',     icon: '🙋' },
    { id: 'thankyou',   label: 'הודעות תודה', icon: '💌' },
    { id: 'stats',      label: 'סטטיסטיקות',  icon: '📊' },
];

function useAdminFetch(path, token) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}${path}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            setData(json);
        } catch {
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [path, token]);

    useEffect(() => { load(); }, [load]);
    return { data, loading, reload: load };
}

// ─── Tab: פניות ───────────────────────────────────────────
function ContactsTab({ token }) {
    const { data, loading } = useAdminFetch('/api/admin/contacts', token);

    if (loading) return <Spinner />;
    if (!data?.length) return <Empty text="אין פניות עדיין" />;

    return (
        <div style={s.list}>
            {data.map(c => (
                <div key={c.id} style={s.card}>
                    <div style={s.cardTop}>
                        <strong style={s.name}>{c.name}</strong>
                        <span style={s.date}>{fmt(c.created_at)}</span>
                    </div>
                    <div style={s.meta}>
                        {c.phone && <span>📞 {c.phone}</span>}
                        {c.email && <span>📧 {c.email}</span>}
                    </div>
                    <p style={s.msg}>{c.message}</p>
                </div>
            ))}
        </div>
    );
}

// ─── Tab: מתנדבים ─────────────────────────────────────────
function VolunteersTab({ token }) {
    const { data, loading } = useAdminFetch('/api/admin/volunteers', token);

    if (loading) return <Spinner />;
    if (!data?.length) return <Empty text="אין מתנדבים עדיין" />;

    return (
        <div style={s.list}>
            {data.map(v => (
                <div key={v.id} style={s.card}>
                    <div style={s.cardTop}>
                        <strong style={s.name}>{v.name}</strong>
                        <span style={s.date}>{fmt(v.created_at)}</span>
                    </div>
                    <div style={s.meta}>
                        <span>📞 {v.phone}</span>
                        <span>📍 {v.city}</span>
                        {v.has_car && <span style={s.badge}>🚗 יש רכב</span>}
                        {v.email && <span>📧 {v.email}</span>}
                    </div>
                    {v.message && <p style={s.msg}>{v.message}</p>}
                </div>
            ))}
        </div>
    );
}

// ─── Tab: הודעות תודה ─────────────────────────────────────
function ThankYouTab({ token }) {
    const { data, loading, reload } = useAdminFetch('/api/admin/thank-you', token);

    async function approve(id, approved) {
        await fetch(`${API_BASE}/api/admin/thank-you/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ approved }),
        });
        reload();
    }

    if (loading) return <Spinner />;
    if (!data?.length) return <Empty text="אין הודעות עדיין" />;

    const pending = data.filter(n => !n.approved);
    const approved = data.filter(n => n.approved);

    return (
        <div>
            {pending.length > 0 && (
                <>
                    <h3 style={s.groupTitle}>⏳ ממתינות לאישור ({pending.length})</h3>
                    <div style={s.list}>
                        {pending.map(n => (
                            <div key={n.id} style={{ ...s.card, borderRight: '4px solid #f59e0b' }}>
                                <div style={s.cardTop}>
                                    <strong style={s.name}>{n.display_name}</strong>
                                    <span style={s.date}>{fmt(n.created_at)}</span>
                                </div>
                                <p style={s.msg}>{n.message}</p>
                                <div style={s.actions}>
                                    <button style={s.approveBtn} onClick={() => approve(n.id, true)}>✅ אשר פרסום</button>
                                    <button style={s.rejectBtn} onClick={() => approve(n.id, false)}>🗑️ דחה</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
            {approved.length > 0 && (
                <>
                    <h3 style={{ ...s.groupTitle, marginTop: '24px' }}>✅ מאושרות ({approved.length})</h3>
                    <div style={s.list}>
                        {approved.map(n => (
                            <div key={n.id} style={{ ...s.card, borderRight: '4px solid #10b981', opacity: 0.8 }}>
                                <div style={s.cardTop}>
                                    <strong style={s.name}>{n.display_name}</strong>
                                    <span style={s.date}>{fmt(n.created_at)}</span>
                                </div>
                                <p style={s.msg}>{n.message}</p>
                                <button style={s.rejectBtn} onClick={() => approve(n.id, false)}>↩️ בטל אישור</button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Tab: סטטיסטיקות ──────────────────────────────────────
function StatsTab({ token }) {
    const { data, loading, reload } = useAdminFetch('/api/stats', token);
    const [form, setForm] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (data && !form) setForm({ ...data });
    }, [data, form]);

    async function save(e) {
        e.preventDefault();
        setSaving(true);
        try {
            await fetch(`${API_BASE}/api/admin/stats`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
            reload();
        } finally {
            setSaving(false);
        }
    }

    if (loading || !form) return <Spinner />;

    const fields = [
        { key: 'children_count',   label: 'ילדים שקיבלו מתנות', icon: '👦' },
        { key: 'hospitals_count',  label: 'בתי חולים',           icon: '🏥' },
        { key: 'books_count',      label: 'ספרים שחולקו',        icon: '📚' },
        { key: 'games_count',      label: 'משחקים שנמסרו',       icon: '🧸' },
    ];

    return (
        <form onSubmit={save} style={s.statsForm}>
            <p style={s.statsNote}>
                המספרים האלה מוצגים בדף הבית תחת "מדד החיוכים". עדכן אותם לאחר כל חלוקה.
            </p>
            {fields.map(f => (
                <div key={f.key} style={s.statRow}>
                    <label style={s.statLabel}>{f.icon} {f.label}</label>
                    <input
                        type="number"
                        min="0"
                        value={form[f.key] ?? 0}
                        onChange={e => setForm(p => ({ ...p, [f.key]: parseInt(e.target.value) || 0 }))}
                        style={s.statInput}
                    />
                </div>
            ))}
            <button type="submit" style={s.saveBtn} disabled={saving}>
                {saving ? 'שומר...' : saved ? '✅ נשמר!' : 'שמור שינויים'}
            </button>
        </form>
    );
}

// ─── Helpers ──────────────────────────────────────────────
function Spinner() {
    return <div style={s.spinner}><div style={s.spinnerDot} /></div>;
}
function Empty({ text }) {
    return <div style={s.empty}><span style={{ fontSize: '2.5rem' }}>📭</span><p>{text}</p></div>;
}
function fmt(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

// ─── Main ─────────────────────────────────────────────────
export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const [tab, setTab] = useState('contacts');
    const token = sessionStorage.getItem('adminToken');

    useEffect(() => {
        if (!token) navigate('/admin');
    }, [token, navigate]);

    function logout() {
        sessionStorage.removeItem('adminToken');
        navigate('/');
    }

    if (!token) return null;

    return (
        <div style={s.page}>
            {/* Header */}
            <div style={s.header}>
                <div style={s.headerInner}>
                    <div>
                        <h1 style={s.headerTitle}>⚙️ לוח ניהול</h1>
                        <p style={s.headerSub}>חסדי המלך</p>
                    </div>
                    <button style={s.logoutBtn} onClick={logout}>יציאה ←</button>
                </div>
            </div>

            {/* Tabs */}
            <div style={s.tabBar}>
                {TABS.map(t => (
                    <button
                        key={t.id}
                        style={{ ...s.tabBtn, ...(tab === t.id ? s.tabBtnActive : {}) }}
                        onClick={() => setTab(t.id)}
                    >
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div style={s.content}>
                {tab === 'contacts'   && <ContactsTab   token={token} />}
                {tab === 'volunteers' && <VolunteersTab  token={token} />}
                {tab === 'thankyou'   && <ThankYouTab    token={token} />}
                {tab === 'stats'      && <StatsTab       token={token} />}
            </div>
        </div>
    );
}

const s = {
    page: { minHeight: '100vh', background: '#f8fafe', fontFamily: "'Heebo', sans-serif", direction: 'rtl' },

    header: { background: 'linear-gradient(135deg, #071530 0%, #0f2044 100%)', padding: '20px' },
    headerInner: { maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { color: '#fbbf24', fontSize: '1.4rem', fontWeight: 800, margin: 0 },
    headerSub: { color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', margin: 0 },
    logoutBtn: {
        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
        color: '#fff', padding: '8px 18px', borderRadius: '10px', cursor: 'pointer',
        fontFamily: "'Heebo', sans-serif", fontSize: '0.88rem',
    },

    tabBar: {
        background: '#fff', borderBottom: '2px solid #dbeafe',
        display: 'flex', gap: 0, overflowX: 'auto',
    },
    tabBtn: {
        padding: '14px 22px', border: 'none', background: 'none',
        color: '#6478a8', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
        fontFamily: "'Heebo', sans-serif", whiteSpace: 'nowrap',
        borderBottom: '3px solid transparent', transition: 'all 0.2s',
    },
    tabBtnActive: { color: '#0f2044', borderBottom: '3px solid #0f2044' },

    content: { maxWidth: '900px', margin: '0 auto', padding: '28px 20px' },

    list: { display: 'flex', flexDirection: 'column', gap: '14px' },
    card: {
        background: '#fff', borderRadius: '16px', padding: '20px 22px',
        boxShadow: '0 2px 10px rgba(15,32,68,0.07)', borderRight: '4px solid #dbeafe',
    },
    cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
    name: { color: '#0f2044', fontSize: '1rem' },
    date: { color: '#6478a8', fontSize: '0.8rem' },
    meta: { display: 'flex', gap: '16px', flexWrap: 'wrap', color: '#2d4070', fontSize: '0.88rem', marginBottom: '10px' },
    badge: {
        background: '#dbeafe', color: '#0f2044', padding: '2px 10px',
        borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600,
    },
    msg: { color: '#2d4070', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 },
    actions: { display: 'flex', gap: '10px', marginTop: '12px' },
    approveBtn: {
        padding: '8px 18px', background: '#10b981', color: '#fff',
        border: 'none', borderRadius: '10px', cursor: 'pointer',
        fontFamily: "'Heebo', sans-serif", fontWeight: 600, fontSize: '0.88rem',
    },
    rejectBtn: {
        padding: '8px 18px', background: '#fee2e2', color: '#ef4444',
        border: 'none', borderRadius: '10px', cursor: 'pointer',
        fontFamily: "'Heebo', sans-serif", fontWeight: 600, fontSize: '0.88rem',
    },
    groupTitle: { color: '#0f2044', fontSize: '1rem', fontWeight: 700, margin: '0 0 12px' },

    statsForm: { display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '420px' },
    statsNote: { color: '#6478a8', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 },
    statRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' },
    statLabel: { color: '#2d4070', fontSize: '0.95rem', fontWeight: 600 },
    statInput: {
        padding: '10px 14px', borderRadius: '10px', border: '2px solid #dbeafe',
        fontSize: '1rem', fontFamily: "'Heebo', sans-serif", width: '120px', textAlign: 'center',
        outline: 'none',
    },
    saveBtn: {
        padding: '14px', background: '#0f2044', color: '#fff',
        border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700,
        cursor: 'pointer', fontFamily: "'Heebo', sans-serif", marginTop: '8px',
    },

    empty: { textAlign: 'center', color: '#6478a8', padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
    spinner: { display: 'flex', justifyContent: 'center', padding: '60px 0' },
    spinnerDot: {
        width: '36px', height: '36px', borderRadius: '50%',
        border: '3px solid #dbeafe', borderTop: '3px solid #0f2044',
        animation: 'spin 0.8s linear infinite',
    },
};
