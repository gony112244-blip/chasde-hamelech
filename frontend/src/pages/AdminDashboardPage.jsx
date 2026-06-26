import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE, { UPLOADS_BASE } from '../config';

const TABS = [
    { id: 'contacts',    label: 'פניות',        icon: '✉️' },
    { id: 'volunteers',  label: 'מתנדבים',      icon: '🙋' },
    { id: 'thankyou',    label: 'הודעות תודה',  icon: '💌' },
    { id: 'stats',       label: 'סטטיסטיקות',   icon: '📊' },
    { id: 'media',       label: 'מדיה וגלריה',   icon: '🖼️' },
    { id: 'newsletter',  label: 'עלון השבוע',    icon: '📖' },
];

function useAdminFetch(path, token) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}${path}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.status === 401) {
                sessionStorage.removeItem('adminToken');
                navigate('/admin');
                return;
            }
            const json = await res.json();
            setData(json);
        } catch {
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [path, token, navigate]);

    useEffect(() => { load(); }, [load]);
    return { data, loading, reload: load };
}

// ─── Tab: פניות ────────────────────────────────────────────
function ContactsTab({ token }) {
    const { data, loading, reload } = useAdminFetch('/api/admin/contacts', token);
    const [replyOpen, setReplyOpen] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const [msg, setMsg] = useState('');

    async function deleteContact(id) {
        if (!window.confirm('למחוק את הפנייה?')) return;
        try {
            const res = await fetch(`${API_BASE}/api/admin/contacts/${id}`, {
                method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error();
            reload();
        } catch {
            alert('שגיאה במחיקת הפנייה');
        }
    }

    async function sendReply(id) {
        if (!replyText.trim()) return;
        setSending(true);
        setMsg('');
        try {
            const res = await fetch(`${API_BASE}/api/admin/contacts/${id}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ reply_text: replyText }),
            });
            const json = await res.json();
            if (res.ok) {
                setMsg(json.emailSent ? '✅ תשובה נשלחה במייל!' : '✅ נשמר (אין כתובת מייל)');
                setReplyOpen(null);
                setReplyText('');
                reload();
            } else {
                setMsg('❌ ' + (json.error || 'שגיאה'));
            }
        } catch {
            setMsg('❌ שגיאת רשת');
        } finally {
            setSending(false);
        }
    }

    if (loading) return <Spinner />;
    if (!data?.length) return <Empty text="אין פניות עדיין" />;

    return (
        <div style={s.list}>
            {msg && <div style={s.flashMsg}>{msg}</div>}
            {data.map(c => (
                <div key={c.id} style={{ ...s.card, borderRight: c.replied ? '4px solid #10b981' : '4px solid #dbeafe' }}>
                    <div style={s.cardTop}>
                        <strong style={s.name}>{c.name}</strong>
                        <span style={s.date}>{fmt(c.created_at)}</span>
                    </div>
                    <div style={s.meta}>
                        {c.phone && <span>📞 {c.phone}</span>}
                        {c.email && <span>📧 {c.email}</span>}
                        {c.replied && <span style={s.repliedBadge}>✅ הושב</span>}
                    </div>
                    <p style={s.msg}>{c.message}</p>
                    {c.reply_text && (
                        <div style={s.replyPreview}>
                            <strong>תשובתי:</strong> {c.reply_text}
                        </div>
                    )}
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {!c.replied && (
                            <>
                                {replyOpen === c.id ? (
                                    <div style={{ ...s.replyBox, width: '100%' }}>
                                        <textarea
                                            style={s.replyTextarea}
                                            placeholder="כתוב תשובה..."
                                            value={replyText}
                                            onChange={e => setReplyText(e.target.value)}
                                            rows={4}
                                        />
                                        <div style={s.actions}>
                                            <button style={s.approveBtn} disabled={sending} onClick={() => sendReply(c.id)}>
                                                {sending ? 'שולח...' : c.email ? '📨 שלח במייל' : '💾 שמור תשובה'}
                                            </button>
                                            <button style={s.rejectBtn} onClick={() => { setReplyOpen(null); setReplyText(''); }}>ביטול</button>
                                        </div>
                                    </div>
                                ) : (
                                    <button style={s.replyBtn} onClick={() => setReplyOpen(c.id)}>✏️ השב</button>
                                )}
                            </>
                        )}
                        {c.phone && (
                            <a
                                href={`https://wa.me/972${c.phone.replace(/^0/, '').replace(/[-\s]/g, '')}`}
                                target="_blank" rel="noopener noreferrer"
                                style={s.waBtn}
                            >
                                💬 WhatsApp
                            </a>
                        )}
                        <button style={s.rejectBtn} onClick={() => deleteContact(c.id)}>🗑️ מחק</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Tab: מתנדבים ──────────────────────────────────────────
function VolunteersTab({ token }) {
    const { data, loading, reload } = useAdminFetch('/api/admin/volunteers', token);
    const [editNotes, setEditNotes] = useState(null);
    const [noteText, setNoteText] = useState('');
    const [savingNote, setSavingNote] = useState(false);

    async function deleteVolunteer(id) {
        if (!window.confirm('למחוק את המתנדב?')) return;
        try {
            const res = await fetch(`${API_BASE}/api/admin/volunteers/${id}`, {
                method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error();
            reload();
        } catch {
            alert('שגיאה במחיקת המתנדב');
        }
    }

    async function saveNote(id) {
        setSavingNote(true);
        try {
            await fetch(`${API_BASE}/api/admin/volunteers/${id}/notes`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ notes: noteText }),
            });
            setEditNotes(null);
            reload();
        } finally {
            setSavingNote(false);
        }
    }

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
                    {/* הערות */}
                    {editNotes === v.id ? (
                        <div style={s.replyBox}>
                            <textarea style={s.replyTextarea} rows={3}
                                value={noteText} onChange={e => setNoteText(e.target.value)}
                                placeholder="הערה לגבי המתנדב..." />
                            <div style={s.actions}>
                                <button style={s.approveBtn} disabled={savingNote} onClick={() => saveNote(v.id)}>
                                    {savingNote ? 'שומר...' : '💾 שמור'}
                                </button>
                                <button style={s.rejectBtn} onClick={() => setEditNotes(null)}>ביטול</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {v.notes && <p style={s.msg}>📝 {v.notes}</p>}
                            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                                <button style={s.replyBtn} onClick={() => { setEditNotes(v.id); setNoteText(v.notes || ''); }}>
                                    📝 {v.notes ? 'ערוך הערה' : 'הוסף הערה'}
                                </button>
                                <a href={`https://wa.me/972${v.phone.replace(/^0/, '').replace(/[-\s]/g, '')}`}
                                    target="_blank" rel="noopener noreferrer" style={s.waBtn}>
                                    💬 WhatsApp
                                </a>
                                <button style={s.rejectBtn} onClick={() => deleteVolunteer(v.id)}>🗑️ מחק</button>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

// ─── Tab: הודעות תודה ──────────────────────────────────────
function ThankYouTab({ token }) {
    const { data, loading, reload } = useAdminFetch('/api/admin/thank-you', token);

    async function setStatus(id, status) {
        await fetch(`${API_BASE}/api/admin/thank-you/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ status }),
        });
        reload();
    }

    async function deleteNote(id) {
        if (!window.confirm('למחוק את ההודעה?')) return;
        try {
            const res = await fetch(`${API_BASE}/api/admin/thank-you/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error();
            reload();
        } catch {
            alert('שגיאה במחיקת ההודעה');
        }
    }

    if (loading) return <Spinner />;
    if (!data?.length) return <Empty text="אין הודעות עדיין" />;

    const pending  = data.filter(n => n.status === 'pending');
    const approved = data.filter(n => n.status === 'approved');
    const rejected = data.filter(n => n.status === 'rejected');

    return (
        <div>
            {pending.length > 0 && (
                <>
                    <h3 style={s.groupTitle}>⏳ ממתינות לאישור ({pending.length})</h3>
                    <div style={s.list}>
                        {pending.map(n => (
                            <div key={n.id} style={{ ...s.card, borderRight: '4px solid #f59e0b' }}>
                                {n.photo_filename && (
                                    <img src={`${UPLOADS_BASE}/${n.photo_filename}`}
                                        alt="מכתב תודה" style={s.notePhoto} />
                                )}
                                <div style={s.cardTop}>
                                    <strong style={s.name}>{n.display_name}</strong>
                                    <span style={s.date}>{fmt(n.created_at)}</span>
                                </div>
                                <p style={s.msg}>{n.message}</p>
                                <div style={s.actions}>
                                    <button style={s.approveBtn} onClick={() => setStatus(n.id, 'approved')}>✅ אשר פרסום</button>
                                    <button style={s.rejectBtn} onClick={() => setStatus(n.id, 'rejected')}>❌ דחה</button>
                                    <button style={s.rejectBtn} onClick={() => deleteNote(n.id)}>🗑️ מחק</button>
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
                            <div key={n.id} style={{ ...s.card, borderRight: '4px solid #10b981' }}>
                                {n.photo_filename && (
                                    <img src={`${UPLOADS_BASE}/${n.photo_filename}`}
                                        alt="תמונה" style={s.notePhoto} />
                                )}
                                <div style={s.cardTop}>
                                    <strong style={s.name}>{n.display_name}</strong>
                                    <span style={s.date}>{fmt(n.created_at)}</span>
                                </div>
                                {n.hospital && <div style={s.meta}><span>🏥 {n.hospital}</span></div>}
                                <p style={s.msg}>{n.message}</p>
                                <div style={s.actions}>
                                    <button style={s.rejectBtn} onClick={() => setStatus(n.id, 'rejected')}>↩️ בטל אישור</button>
                                    <button style={s.rejectBtn} onClick={() => deleteNote(n.id)}>🗑️ מחק</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
            {rejected.length > 0 && (
                <>
                    <h3 style={{ ...s.groupTitle, marginTop: '24px', color: '#ef4444' }}>❌ נדחו ({rejected.length})</h3>
                    <div style={s.list}>
                        {rejected.map(n => (
                            <div key={n.id} style={{ ...s.card, borderRight: '4px solid #fca5a5', opacity: 0.7 }}>
                                <div style={s.cardTop}>
                                    <strong style={s.name}>{n.display_name}</strong>
                                    <span style={s.date}>{fmt(n.created_at)}</span>
                                </div>
                                <p style={s.msg}>{n.message}</p>
                                <button style={s.approveBtn} onClick={() => setStatus(n.id, 'approved')}>↩️ שחזר</button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Tab: סטטיסטיקות ───────────────────────────────────────
function StatsTab({ token }) {
    const { data: statsData, loading: statsLoading, reload: reloadStats } = useAdminFetch('/api/stats', token);
    const { data: visitsData, loading: visitsLoading } = useAdminFetch('/api/admin/stats/visits', token);
    const { data: donationsData, loading: donationsLoading, reload: reloadDonations } = useAdminFetch('/api/admin/donations', token);
    const { data: shoppingData, loading: shoppingLoading, reload: reloadShopping } = useAdminFetch('/api/admin/shopping-list', token);
    const { data: activityData, loading: activityLoading } = useAdminFetch('/api/admin/activity-log', token);

    const [form, setForm] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [donForm, setDonForm] = useState({ donor_name: '', amount: '', method: 'bit', note: '' });
    const [addingDon, setAddingDon] = useState(false);
    const [donMsg, setDonMsg] = useState('');
    const [shopForm, setShopForm] = useState({ name: '', quantity: '' });
    const [addingShop, setAddingShop] = useState(false);

    useEffect(() => {
        if (statsData && !form) setForm({ ...statsData });
    }, [statsData, form]);

    async function saveStats(e) {
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
            reloadStats();
        } finally {
            setSaving(false);
        }
    }

    async function addDonation(e) {
        e.preventDefault();
        if (!donForm.amount) return;
        setAddingDon(true);
        setDonMsg('');
        try {
            const res = await fetch(`${API_BASE}/api/admin/donations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(donForm),
            });
            if (res.ok) {
                setDonMsg('✅ תרומה נוספה');
                setDonForm({ donor_name: '', amount: '', method: 'bit', note: '' });
                reloadDonations();
                setTimeout(() => setDonMsg(''), 2500);
            }
        } finally {
            setAddingDon(false);
        }
    }

    async function addShopItem(e) {
        e.preventDefault();
        if (!shopForm.name.trim()) return;
        setAddingShop(true);
        try {
            await fetch(`${API_BASE}/api/admin/shopping-list`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(shopForm),
            });
            setShopForm({ name: '', quantity: '' });
            reloadShopping();
        } finally {
            setAddingShop(false);
        }
    }

    async function toggleShopDone(item) {
        await fetch(`${API_BASE}/api/admin/shopping-list/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ ...item, done: !item.done }),
        });
        reloadShopping();
    }

    async function deleteShopItem(id) {
        try {
            const res = await fetch(`${API_BASE}/api/admin/shopping-list/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error();
            reloadShopping();
        } catch {
            alert('שגיאה במחיקת פריט הקניות');
        }
    }

    if (statsLoading || !form) return <Spinner />;

    const statFields = [
        { key: 'children_count',  label: 'ילדים שקיבלו מתנות', icon: '👦' },
        { key: 'hospitals_count', label: 'בתי חולים',            icon: '🏥' },
        { key: 'books_count',     label: 'ספרים שחולקו',         icon: '📚' },
        { key: 'games_count',     label: 'משחקים שנמסרו',        icon: '🧸' },
    ];

    const methodLabel = { bit: 'Bit', paybox: 'Paybox', cash: 'מזומן', bank: 'העברה', other: 'אחר' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>

            {/* מדד החיוכים */}
            <section>
                <h3 style={s.sectionTitle}>🌟 מדד החיוכים (דף הבית)</h3>
                <form onSubmit={saveStats} style={s.statsForm}>
                    {statFields.map(f => (
                        <div key={f.key} style={s.statRow}>
                            <label style={s.statLabel}>{f.icon} {f.label}</label>
                            <input
                                type="number" min="0"
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
            </section>

            {/* ביקורים */}
            <section>
                <h3 style={s.sectionTitle}>👁️ ביקורים באתר</h3>
                {visitsLoading ? <Spinner /> : (
                    <div style={s.visitsWrap}>
                        <div style={s.visitsStat}>
                            <span style={s.visitsBig}>{visitsData?.total?.toLocaleString() || 0}</span>
                            <span style={s.visitsLabel}>סך ביקורים</span>
                        </div>
                        {visitsData?.daily?.length > 0 && (
                            <div style={s.dailyList}>
                                <p style={{ color: '#6478a8', fontSize: '0.85rem', margin: '0 0 8px' }}>30 ימים אחרונים:</p>
                                {visitsData.daily.slice(0, 10).map(d => (
                                    <div key={d.day} style={s.dailyRow}>
                                        <span style={s.dailyDate}>{fmtDate(d.day)}</span>
                                        <div style={s.dailyBar}>
                                            <div style={{
                                                ...s.dailyBarFill,
                                                width: `${Math.min(100, (d.count / Math.max(...visitsData.daily.map(x => x.count))) * 100)}%`
                                            }} />
                                        </div>
                                        <span style={s.dailyCount}>{d.count}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* תרומות */}
            <section>
                <h3 style={s.sectionTitle}>💰 תרומות</h3>
                {!donationsLoading && donationsData && (
                    <div style={s.donTotal}>סה"כ: <strong>₪{donationsData.total?.toLocaleString('he-IL', { minimumFractionDigits: 0 })}</strong></div>
                )}

                {/* הוספת תרומה */}
                <form onSubmit={addDonation} style={s.donForm}>
                    <h4 style={{ margin: '0 0 12px', color: '#0f2044', fontSize: '0.95rem' }}>+ הוסף תרומה ידנית</h4>
                    <div style={s.donRow}>
                        <input style={s.donInput} placeholder="שם התורם (אופציונלי)" value={donForm.donor_name}
                            onChange={e => setDonForm(p => ({ ...p, donor_name: e.target.value }))} />
                        <input style={{ ...s.donInput, width: '100px' }} type="number" min="1" placeholder="₪ סכום" value={donForm.amount}
                            onChange={e => setDonForm(p => ({ ...p, amount: e.target.value }))} required />
                        <select style={s.donInput} value={donForm.method} onChange={e => setDonForm(p => ({ ...p, method: e.target.value }))}>
                            <option value="bit">Bit</option>
                            <option value="paybox">Paybox</option>
                            <option value="cash">מזומן</option>
                            <option value="bank">העברה בנקאית</option>
                            <option value="other">אחר</option>
                        </select>
                    </div>
                    <input style={{ ...s.donInput, width: '100%', boxSizing: 'border-box' }} placeholder="הערה (אופציונלי)"
                        value={donForm.note} onChange={e => setDonForm(p => ({ ...p, note: e.target.value }))} />
                    <button type="submit" style={{ ...s.saveBtn, marginTop: '4px' }} disabled={addingDon}>
                        {addingDon ? 'מוסיף...' : '+ הוסף'}
                    </button>
                    {donMsg && <div style={s.flashMsg}>{donMsg}</div>}
                </form>

                {/* רשימת תרומות */}
                {donationsLoading ? <Spinner /> : (
                    <div style={{ ...s.list, marginTop: '20px' }}>
                        {donationsData?.donations?.length === 0 && <Empty text="אין תרומות עדיין" />}
                        {donationsData?.donations?.map(d => (
                            <div key={d.id} style={{ ...s.card, borderRight: '4px solid #d1fae5' }}>
                                <div style={s.cardTop}>
                                    <span style={{ color: '#059669', fontWeight: 700, fontSize: '1.1rem' }}>
                                        ₪{parseFloat(d.amount).toLocaleString('he-IL')}
                                    </span>
                                    <span style={s.date}>{fmt(d.created_at)}</span>
                                </div>
                                <div style={s.meta}>
                                    <span>👤 {d.donor_name}</span>
                                    <span style={s.badge}>{methodLabel[d.method] || d.method}</span>
                                    {d.note && <span>{d.note}</span>}
                                </div>
                                <button style={{ ...s.rejectBtn, marginTop: '8px' }} onClick={async () => {
                                    if (!window.confirm('למחוק תרומה זו?')) return;
                                    try {
                                        const res = await fetch(`${API_BASE}/api/admin/donations/${d.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                                        if (!res.ok) throw new Error();
                                        reloadDonations();
                                    } catch {
                                        alert('שגיאה במחיקת התרומה');
                                    }
                                }}>🗑️ מחק</button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* רשימת קניות */}
            <section>
                <h3 style={s.sectionTitle}>🛒 רשימת קניות</h3>
                <form onSubmit={addShopItem} style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <input style={{ ...s.donInput, flex: 2 }} placeholder="שם פריט"
                        value={shopForm.name} onChange={e => setShopForm(p => ({ ...p, name: e.target.value }))} required />
                    <input style={{ ...s.donInput, flex: 1 }} placeholder="כמות"
                        value={shopForm.quantity} onChange={e => setShopForm(p => ({ ...p, quantity: e.target.value }))} />
                    <button type="submit" style={s.saveBtn} disabled={addingShop}>+ הוסף</button>
                </form>
                {shoppingLoading ? <Spinner /> : (
                    <div style={s.list}>
                        {(!shoppingData || shoppingData.length === 0) && <Empty text="רשימה ריקה" />}
                        {shoppingData?.map(item => (
                            <div key={item.id} style={{ ...s.card, opacity: item.done ? 0.55 : 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <input type="checkbox" checked={item.done} onChange={() => toggleShopDone(item)}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                                    <span style={{ flex: 1, textDecoration: item.done ? 'line-through' : 'none', color: '#2d4070', fontSize: '0.95rem' }}>
                                        {item.name} {item.quantity ? `(${item.quantity})` : ''}
                                    </span>
                                    <button style={s.rejectBtn} onClick={() => deleteShopItem(item.id)}>🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* יומן פעילות */}
            <section>
                <h3 style={s.sectionTitle}>📋 יומן פעילות</h3>
                {activityLoading ? <Spinner /> : (
                    <div style={s.list}>
                        {(!activityData || activityData.length === 0) && <Empty text="אין פעילות עדיין" />}
                        {activityData?.slice(0, 30).map(entry => (
                            <div key={entry.id} style={{ ...s.card, padding: '14px 18px' }}>
                                <div style={s.cardTop}>
                                    <span style={{ color: '#2d4070', fontSize: '0.9rem', fontWeight: 600 }}>{entry.details || entry.action}</span>
                                    <span style={s.date}>{fmt(entry.created_at)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

// ─── Tab: עלון שבועי ──────────────────────────────────────
function NewsletterTab({ token }) {
    const { data, loading, reload } = useAdminFetch('/api/newsletters', token);
    const [form, setForm] = useState({ title: '', parasha_name: '', week_of: '' });
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [msg, setMsg] = useState('');
    const fileRef = useRef();

    async function handleUpload(e) {
        e.preventDefault();
        if (!file) { setMsg('⚠️ בחר קובץ PDF או תמונה'); return; }
        setUploading(true);
        setMsg('');
        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('title', form.title);
            fd.append('parasha_name', form.parasha_name);
            fd.append('week_of', form.week_of);
            const res = await fetch(`${API_BASE}/api/admin/newsletters`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const json = await res.json();
            if (res.ok) {
                setMsg('✅ העלון הועלה בהצלחה!');
                setFile(null);
                setForm({ title: '', parasha_name: '', week_of: '' });
                if (fileRef.current) fileRef.current.value = '';
                reload();
                setTimeout(() => setMsg(''), 3000);
            } else setMsg('❌ ' + (json.error || 'שגיאה'));
        } catch { setMsg('❌ שגיאת רשת'); }
        finally { setUploading(false); }
    }

    async function deleteNewsletter(id) {
        if (!window.confirm('למחוק את העלון?')) return;
        try {
            const res = await fetch(`${API_BASE}/api/admin/newsletters/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error();
            reload();
        } catch {
            alert('שגיאה במחיקת העלון');
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <section>
                <h3 style={s.sectionTitle}>📤 העלאת עלון חדש</h3>
                <form onSubmit={handleUpload} style={s.uploadForm}>
                    <input style={s.uploadInput} placeholder="כותרת (למשל: פרשת בראשית)"
                        value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                    <input style={s.uploadInput} placeholder="שם הפרשה"
                        value={form.parasha_name} onChange={e => setForm(p => ({ ...p, parasha_name: e.target.value }))} />
                    <input type="date" style={s.uploadInput}
                        value={form.week_of} onChange={e => setForm(p => ({ ...p, week_of: e.target.value }))} />
                    <div style={{ ...s.fileDropzone, minHeight: '80px' }} onClick={() => fileRef.current?.click()}>
                        {file
                            ? <p style={{ color: '#2d4070', margin: 0 }}>📎 {file.name}</p>
                            : <div style={s.filePrompt}><span style={{ fontSize: '2rem' }}>📄</span><p>PDF או תמונה</p></div>
                        }
                        <input ref={fileRef} type="file" accept=".pdf,image/*" style={{ display: 'none' }}
                            onChange={e => setFile(e.target.files[0] || null)} />
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 4px' }}>
                        💡 תמונות (JPG/PNG) יומרו אוטומטית ל-PDF — כדי שהעלון ייפתח גם באינטרנט מסונן.
                    </p>
                    <button type="submit" style={s.saveBtn} disabled={uploading}>
                        {uploading ? 'מעלה...' : '⬆️ העלה עלון'}
                    </button>
                    {msg && <div style={s.flashMsg}>{msg}</div>}
                </form>
            </section>

            <section>
                <h3 style={s.sectionTitle}>📚 עלונים קיימים</h3>
                {loading ? <Spinner /> : (
                    <div style={s.list}>
                        {(!data || data.length === 0) && <Empty text="אין עלונים עדיין" />}
                        {data?.map(n => (
                            <div key={n.id} style={s.card}>
                                <div style={s.cardTop}>
                                    <strong style={s.name}>{n.title || n.parasha_name}</strong>
                                    <span style={s.date}>{fmt(n.created_at)}</span>
                                </div>
                                <div style={s.meta}>
                                    {n.parasha_name && <span>📖 {n.parasha_name}</span>}
                                    {n.week_of && <span>📅 {new Date(n.week_of).toLocaleDateString('he-IL')}</span>}
                                    <span style={s.badge}>{n.file_type?.includes('pdf') ? 'PDF' : 'תמונה'}</span>
                                </div>
                                <div style={s.actions}>
                                    <a href={`${UPLOADS_BASE}/${n.filename}`} target="_blank" rel="noopener noreferrer" style={s.replyBtn}>
                                        👁️ צפה
                                    </a>
                                    <button style={s.rejectBtn} onClick={() => deleteNewsletter(n.id)}>🗑️ מחק</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

// ─── Tab: מדיה ─────────────────────────────────────────────
function MediaTab({ token }) {
    const { data, loading, reload } = useAdminFetch('/api/admin/media', token);
    const { data: postsData, loading: postsLoading, reload: reloadPosts } = useAdminFetch('/api/gallery-posts', token);
    const [postForm, setPostForm] = useState({ title: '', body: '' });
    const [addingPost, setAddingPost] = useState(false);
    const [postMsg, setPostMsg] = useState('');
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [editPostId, setEditPostId] = useState(null);
    const [editPostForm, setEditPostForm] = useState({ title: '', body: '' });
    const [savingEdit, setSavingEdit] = useState(false);

    async function saveEditPost(id) {
        if (!editPostForm.title.trim()) return;
        setSavingEdit(true);
        try {
            const res = await fetch(`${API_BASE}/api/admin/gallery-posts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(editPostForm),
            });
            if (res.ok) {
                setEditPostId(null);
                reloadPosts();
            }
        } finally {
            setSavingEdit(false);
        }
    }

    async function createPost(e) {
        e.preventDefault();
        if (!postForm.title.trim()) return;
        setAddingPost(true);
        setPostMsg('');
        try {
            const res = await fetch(`${API_BASE}/api/admin/gallery-posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(postForm),
            });
            const json = await res.json();
            if (res.ok) {
                setPostMsg('✅ הפוסט נוצר! עכשיו ניתן להעלות תמונות אליו');
                setSelectedPostId(json.post.id);
                setPostForm({ title: '', body: '' });
                reloadPosts();
                setTimeout(() => setPostMsg(''), 4000);
            } else setPostMsg('❌ ' + json.error);
        } catch { setPostMsg('❌ שגיאת רשת'); }
        finally { setAddingPost(false); }
    }

    async function deletePost(id) {
        if (!window.confirm('למחוק את הפוסט?')) return;
        try {
            const res = await fetch(`${API_BASE}/api/admin/gallery-posts/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error();
            reloadPosts();
        } catch {
            alert('שגיאה במחיקת הפוסט');
        }
    }
    const [uploading, setUploading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState('');
    const [form, setForm] = useState({ title: '', description: '', category: 'general' });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileRef = useRef();

    const CATEGORIES = [
        { value: 'general',      label: '🌟 כללי'    },
        { value: 'toys',         label: '🧸 משחקים'  },
        { value: 'books',        label: '📚 ספרים'   },
        { value: 'food',         label: '🍰 אוכל'    },
        { value: 'preparation',  label: '🎁 הכנות'   },
        { value: 'videos',       label: '🎥 סרטונים' },
    ];

    function onFileChange(e) {
        const f = e.target.files[0];
        if (!f) return;
        setFile(f);
        const url = URL.createObjectURL(f);
        setPreview({ url, type: f.type.startsWith('video') ? 'video' : 'photo' });
    }

    async function handleUpload(e) {
        e.preventDefault();
        if (!file) { setUploadMsg('⚠️ בחר קובץ תחילה'); return; }
        setUploading(true);
        setUploadMsg('');
        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('title', form.title);
            fd.append('description', form.description);
            fd.append('category', form.category);

            const endpoint = selectedPostId
                ? `${API_BASE}/api/admin/gallery-posts/${selectedPostId}/media`
                : `${API_BASE}/api/admin/media`;

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const json = await res.json();
            if (res.ok) {
                setUploadMsg('✅ הקובץ הועלה בהצלחה!');
                setFile(null);
                setPreview(null);
                setForm({ title: '', description: '', category: 'general' });
                if (fileRef.current) fileRef.current.value = '';
                reload();
                if (selectedPostId) reloadPosts();
                setTimeout(() => setUploadMsg(''), 3000);
            } else {
                setUploadMsg('❌ ' + (json.error || 'שגיאה'));
            }
        } catch {
            setUploadMsg('❌ שגיאת רשת');
        } finally {
            setUploading(false);
        }
    }

    async function deleteMedia(id, filename) {
        if (!window.confirm(`למחוק את "${filename}"?`)) return;
        try {
            const res = await fetch(`${API_BASE}/api/admin/media/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error();
            reload();
        } catch {
            alert('שגיאה במחיקת המדיה');
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* ניהול פוסטים */}
            <section>
                <h3 style={s.sectionTitle}>📋 ניהול פוסטים לגלריה</h3>
                <form onSubmit={createPost} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '500px', marginBottom: '16px' }}>
                    <input style={s.uploadInput} placeholder='כותרת (למשל: "השבוע חילקנו ב-3 בתי חולים")' required
                        value={postForm.title} onChange={e => setPostForm(p => ({ ...p, title: e.target.value }))} />
                    <textarea style={{ ...s.uploadInput, resize: 'vertical', minHeight: '70px' }} rows={3}
                        placeholder="תיאור אופציונלי..." value={postForm.body}
                        onChange={e => setPostForm(p => ({ ...p, body: e.target.value }))} />
                    <button type="submit" style={s.saveBtn} disabled={addingPost}>
                        {addingPost ? 'יוצר...' : '+ צור פוסט חדש'}
                    </button>
                    {postMsg && <div style={s.flashMsg}>{postMsg}</div>}
                </form>
                {postsLoading ? <Spinner /> : (
                    <div style={s.list}>
                        {(!postsData || postsData.length === 0) && <Empty text="אין פוסטים עדיין" />}
                        {postsData?.map(p => (
                            <div key={p.id} style={{ ...s.card, borderRight: `4px solid ${selectedPostId === p.id ? '#10b981' : '#dbeafe'}` }}>
                                {editPostId === p.id ? (
                                    <div style={s.replyBox}>
                                        <input style={s.uploadInput} value={editPostForm.title}
                                            onChange={e => setEditPostForm(f => ({ ...f, title: e.target.value }))}
                                            placeholder="כותרת" />
                                        <textarea style={{ ...s.uploadInput, resize: 'vertical', minHeight: '60px' }} rows={3}
                                            value={editPostForm.body}
                                            onChange={e => setEditPostForm(f => ({ ...f, body: e.target.value }))}
                                            placeholder="תיאור" />
                                        <div style={s.actions}>
                                            <button style={s.approveBtn} disabled={savingEdit} onClick={() => saveEditPost(p.id)}>
                                                {savingEdit ? 'שומר...' : '💾 שמור'}
                                            </button>
                                            <button style={s.rejectBtn} onClick={() => setEditPostId(null)}>ביטול</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div style={s.cardTop}>
                                            <strong style={s.name}>{p.title}</strong>
                                            <span style={s.date}>{fmt(p.created_at)}</span>
                                        </div>
                                        {p.body && <p style={s.msg}>{p.body}</p>}
                                        {p.media && p.media.length > 0 && (
                                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                                                {p.media.map(m => (
                                                    <img key={m.id} src={`${UPLOADS_BASE}/${m.filename}`}
                                                        alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                                ))}
                                            </div>
                                        )}
                                        <div style={s.actions}>
                                            <button style={s.replyBtn} onClick={() => setSelectedPostId(p.id === selectedPostId ? null : p.id)}>
                                                {selectedPostId === p.id ? '✓ נבחר להעלאה' : '📎 בחר לצירוף תמונה'}
                                            </button>
                                            <button style={s.replyBtn} onClick={() => { setEditPostId(p.id); setEditPostForm({ title: p.title, body: p.body || '' }); }}>
                                                ✏️ ערוך
                                            </button>
                                            <button style={s.rejectBtn} onClick={() => deletePost(p.id)}>🗑️</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* טופס העלאה */}
            <section>
                <h3 style={s.sectionTitle}>📤 העלאת תמונה / סרטון</h3>
                <form onSubmit={handleUpload} style={s.uploadForm}>
                    <div style={s.fileDropzone} onClick={() => fileRef.current?.click()}>
                        {preview ? (
                            preview.type === 'video'
                                ? <video src={preview.url} style={s.previewMedia} controls />
                                : <img src={preview.url} alt="preview" style={s.previewMedia} />
                        ) : (
                            <div style={s.filePrompt}>
                                <span style={{ fontSize: '2.5rem' }}>📁</span>
                                <p>לחץ לבחירת קובץ<br /><span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>תמונות וסרטונים עד 100MB</span></p>
                            </div>
                        )}
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*,video/*"
                            style={{ display: 'none' }}
                            onChange={onFileChange}
                        />
                    </div>

                    {file && <p style={{ color: '#6478a8', fontSize: '0.85rem', margin: 0 }}>📎 {file.name}</p>}

                    <input
                        style={s.uploadInput}
                        placeholder="כותרת (תוצג בגלריה)"
                        value={form.title}
                        onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    />
                    <input
                        style={s.uploadInput}
                        placeholder="תיאור (אופציונלי)"
                        value={form.description}
                        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    />
                    <select
                        style={s.uploadInput}
                        value={form.category}
                        onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    >
                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>

                    <button type="submit" style={s.saveBtn} disabled={uploading}>
                        {uploading ? 'מעלה...' : '⬆️ העלה'}
                    </button>
                    {uploadMsg && <div style={s.flashMsg}>{uploadMsg}</div>}
                </form>
            </section>

            {/* רשימת מדיה */}
            <section>
                <h3 style={s.sectionTitle}>📂 מדיה קיימת ({data?.length || 0} פריטים)</h3>
                {loading ? <Spinner /> : (
                    data?.length === 0
                        ? <Empty text="עדיין לא הועלו קבצים" />
                        : (
                            <div style={s.mediaGrid}>
                                {data.map(item => (
                                    <div key={item.id} style={s.mediaCard}>
                                        {item.type === 'video'
                                            ? (
                                                <div style={{ ...s.mediaThumbnail, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '4px' }}>
                                                    <span style={{ fontSize: '2rem' }}>🎬</span>
                                                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem' }}>סרטון</span>
                                                </div>
                                            )
                                            : <img src={`${UPLOADS_BASE}/${item.filename}`} alt={item.title} style={s.mediaThumbnail} />
                                        }
                                        <div style={s.mediaInfo}>
                                            <p style={s.mediaTitle}>{item.title || item.original_name}</p>
                                            <p style={s.mediaDate}>{fmt(item.created_at)} · {item.category}</p>
                                        </div>
                                        <button
                                            style={s.deleteBtn}
                                            onClick={() => deleteMedia(item.id, item.original_name)}
                                            title="מחק"
                                        >🗑️</button>
                                    </div>
                                ))}
                            </div>
                        )
                )}
            </section>
        </div>
    );
}

// ─── Helpers ───────────────────────────────────────────────
function Spinner() {
    return <div style={s.spinner}><div style={s.spinnerDot} /></div>;
}
function Empty({ text }) {
    return <div style={s.empty}><span style={{ fontSize: '2.5rem' }}>📭</span><p>{text}</p></div>;
}
function fmt(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleString('he-IL', {
        day: '2-digit', month: '2-digit', year: '2-digit',
        hour: '2-digit', minute: '2-digit',
    });
}
function fmtDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' });
}

// ─── Main ──────────────────────────────────────────────────
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
            <div style={s.header}>
                <div style={s.headerInner}>
                    <div>
                        <h1 style={s.headerTitle}>⚙️ לוח ניהול</h1>
                        <p style={s.headerSub}>חסדי המלך</p>
                    </div>
                    <button style={s.logoutBtn} onClick={logout}>יציאה ←</button>
                </div>
            </div>

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

            <div style={s.content}>
                {tab === 'contacts'   && <ContactsTab    token={token} />}
                {tab === 'volunteers' && <VolunteersTab   token={token} />}
                {tab === 'thankyou'   && <ThankYouTab     token={token} />}
                {tab === 'stats'      && <StatsTab        token={token} />}
                {tab === 'media'      && <MediaTab        token={token} />}
                {tab === 'newsletter' && <NewsletterTab   token={token} />}
            </div>
        </div>
    );
}

const NAVY = '#0f2044';
const BLUE = '#dbeafe';

const s = {
    page: { minHeight: '100vh', background: '#f8fafe', fontFamily: "'Heebo', sans-serif", direction: 'inherit', overflowX: 'hidden' },

    header: { background: 'linear-gradient(135deg, #071530 0%, #0f2044 100%)', padding: '20px' },
    headerInner: { maxWidth: '960px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { color: '#fbbf24', fontSize: '1.4rem', fontWeight: 800, margin: 0 },
    headerSub: { color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', margin: 0 },
    logoutBtn: {
        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
        color: '#fff', padding: '8px 18px', borderRadius: '10px', cursor: 'pointer',
        fontFamily: "'Heebo', sans-serif", fontSize: '0.88rem',
    },

    tabBar: { background: '#fff', borderBottom: `2px solid ${BLUE}`, display: 'flex', overflowX: 'auto', width: '100%', boxSizing: 'border-box' },
    tabBtn: {
        padding: '14px 20px', border: 'none', background: 'none',
        color: '#6478a8', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer',
        fontFamily: "'Heebo', sans-serif", whiteSpace: 'nowrap',
        borderBottom: '3px solid transparent', transition: 'all 0.2s', flexShrink: 0,
    },
    tabBtnActive: { color: NAVY, borderBottom: `3px solid ${NAVY}` },

    content: { maxWidth: '960px', margin: '0 auto', padding: '28px 20px' },

    list: { display: 'flex', flexDirection: 'column', gap: '14px' },
    card: {
        background: '#fff', borderRadius: '16px', padding: '20px 22px',
        boxShadow: '0 2px 10px rgba(15,32,68,0.07)', borderRight: `4px solid ${BLUE}`,
    },
    cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
    name: { color: NAVY, fontSize: '1rem' },
    date: { color: '#6478a8', fontSize: '0.8rem' },
    meta: { display: 'flex', gap: '16px', flexWrap: 'wrap', color: '#2d4070', fontSize: '0.88rem', marginBottom: '10px' },
    badge: { background: BLUE, color: NAVY, padding: '2px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 },
    repliedBadge: { background: '#d1fae5', color: '#059669', padding: '2px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 },
    msg: { color: '#2d4070', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 },
    replyPreview: { background: '#f0fdf4', borderRadius: '8px', padding: '10px 14px', marginTop: '10px', color: '#065f46', fontSize: '0.88rem' },

    actions: { display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' },
    replyBtn: {
        padding: '8px 18px', background: BLUE, color: NAVY,
        border: 'none', borderRadius: '10px', cursor: 'pointer',
        fontFamily: "'Heebo', sans-serif", fontWeight: 600, fontSize: '0.88rem',
    },
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

    replyBox: { display: 'flex', flexDirection: 'column', gap: '10px' },
    replyTextarea: {
        padding: '12px 14px', borderRadius: '12px', border: `2px solid ${BLUE}`,
        fontSize: '0.95rem', fontFamily: "'Heebo', sans-serif", resize: 'vertical',
        direction: 'inherit', outline: 'none', lineHeight: 1.6,
    },

    groupTitle: { color: NAVY, fontSize: '1rem', fontWeight: 700, margin: '0 0 12px' },
    sectionTitle: { color: NAVY, fontSize: '1.05rem', fontWeight: 700, margin: '0 0 16px', paddingBottom: '8px', borderBottom: `2px solid ${BLUE}` },

    statsForm: { display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '460px' },
    statRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' },
    statLabel: { color: '#2d4070', fontSize: '0.95rem', fontWeight: 600 },
    statInput: {
        padding: '10px 14px', borderRadius: '10px', border: `2px solid ${BLUE}`,
        fontSize: '1rem', fontFamily: "'Heebo', sans-serif", width: '120px', textAlign: 'center', outline: 'none',
    },
    saveBtn: {
        padding: '12px 24px', background: NAVY, color: '#fff',
        border: 'none', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 700,
        cursor: 'pointer', fontFamily: "'Heebo', sans-serif",
    },

    visitsWrap: { display: 'flex', flexDirection: 'column', gap: '16px' },
    visitsStat: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' },
    visitsBig: { fontSize: '2.5rem', fontWeight: 800, color: NAVY },
    visitsLabel: { color: '#6478a8', fontSize: '0.9rem' },
    dailyList: { display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '420px' },
    dailyRow: { display: 'flex', alignItems: 'center', gap: '12px' },
    dailyDate: { color: '#6478a8', fontSize: '0.82rem', minWidth: '38px', textAlign: 'left' },
    dailyBar: { flex: 1, height: '10px', background: BLUE, borderRadius: '999px', overflow: 'hidden' },
    dailyBarFill: { height: '100%', background: NAVY, borderRadius: '999px', transition: 'width 0.4s' },
    dailyCount: { color: NAVY, fontSize: '0.82rem', minWidth: '28px', textAlign: 'right', fontWeight: 600 },

    donTotal: { fontSize: '1.2rem', color: '#059669', marginBottom: '20px', fontWeight: 700 },
    donForm: { display: 'flex', flexDirection: 'column', gap: '10px', background: '#f0fdf4', padding: '20px', borderRadius: '16px', maxWidth: '460px', marginBottom: '12px' },
    donRow: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
    donInput: {
        padding: '10px 12px', borderRadius: '10px', border: `2px solid ${BLUE}`,
        fontSize: '0.9rem', fontFamily: "'Heebo', sans-serif", flex: 1, outline: 'none', direction: 'inherit',
    },

    uploadForm: { display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '500px' },
    fileDropzone: {
        border: `2px dashed ${BLUE}`, borderRadius: '16px', padding: '20px',
        cursor: 'pointer', textAlign: 'center', background: '#f8fafe',
        minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
    },
    filePrompt: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#6478a8' },
    previewMedia: { maxWidth: '100%', maxHeight: '200px', borderRadius: '10px', objectFit: 'cover' },
    uploadInput: {
        padding: '10px 14px', borderRadius: '12px', border: `2px solid ${BLUE}`,
        fontSize: '0.95rem', fontFamily: "'Heebo', sans-serif", outline: 'none', direction: 'inherit',
    },

    mediaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' },
    mediaCard: {
        background: '#fff', borderRadius: '16px', overflow: 'hidden',
        boxShadow: '0 2px 14px rgba(15,32,68,0.1)', position: 'relative',
    },
    mediaThumbnail: { width: '100%', height: '200px', objectFit: 'cover', display: 'block', background: '#e5e7eb' },
    mediaInfo: { padding: '12px 14px' },
    mediaTitle: { margin: 0, fontWeight: 600, color: NAVY, fontSize: '0.92rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    mediaDate: { margin: '4px 0 0', color: '#9ca3af', fontSize: '0.78rem' },
    deleteBtn: {
        position: 'absolute', top: '8px', left: '8px',
        background: 'rgba(239,68,68,0.85)', border: 'none', borderRadius: '8px',
        padding: '4px 8px', cursor: 'pointer', fontSize: '1rem',
    },

    waBtn: {
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '8px 18px', background: '#25d366', color: '#fff',
        textDecoration: 'none', borderRadius: '10px', cursor: 'pointer',
        fontFamily: "'Heebo', sans-serif", fontWeight: 600, fontSize: '0.88rem',
        border: 'none',
    },
    notePhoto: {
        width: '100%', maxHeight: '200px', objectFit: 'cover',
        borderRadius: '10px', marginBottom: '10px',
    },
    flashMsg: {
        padding: '10px 16px', borderRadius: '10px', background: '#f0fdf4',
        color: '#065f46', fontSize: '0.9rem', fontWeight: 600,
    },
    empty: { textAlign: 'center', color: '#6478a8', padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
    spinner: { display: 'flex', justifyContent: 'center', padding: '60px 0' },
    spinnerDot: {
        width: '36px', height: '36px', borderRadius: '50%',
        border: `3px solid ${BLUE}`, borderTop: `3px solid ${NAVY}`,
        animation: 'spin 0.8s linear infinite',
    },
};
