import { useT } from '../../hooks/useT';

export default function AboutSection() {
    const t = useT();
    return (
        <section style={s.section}>
            <div style={s.inner}>
                <h2 style={s.title}>
                    <span style={s.titleIcon}>💜</span>
                    {t('about_title')}
                </h2>

                <div style={s.cards}>
                    <div style={s.card}>
                        <div style={s.cardIconWrap}><span style={s.cardEmoji}>🎯</span></div>
                        <h3 style={s.cardTitle}>{t('about_mission_title')}</h3>
                        <p style={s.cardText}>{t('about_mission_desc')}</p>
                    </div>
                    <div style={s.card}>
                        <div style={s.cardIconWrap}><span style={s.cardEmoji}>🚗</span></div>
                        <h3 style={s.cardTitle}>{t('about_way_title')}</h3>
                        <p style={s.cardText}>{t('about_way_desc')}</p>
                    </div>
                    <div style={s.card}>
                        <div style={s.cardIconWrap}><span style={s.cardEmoji}>🌟</span></div>
                        <h3 style={s.cardTitle}>{t('about_vision_title')}</h3>
                        <p style={s.cardText}>{t('about_vision_desc')}</p>
                    </div>
                </div>

                <div style={s.timeline}>
                    <h3 style={s.timelineTitle}>{t('about_timeline_title')}</h3>
                    <div style={s.timelineItems}>
                        <TimelineItem year="2019" title={t('about_start')} desc={t('about_tl_2019')} />
                        <TimelineItem year="2024" title={t('about_book')}  desc={t('about_tl_2024')} />
                        <TimelineItem year="2026" title={t('about_website')} desc={t('about_tl_2026')} active />
                    </div>
                </div>
            </div>
        </section>
    );
}

function TimelineItem({ year, title, desc, active = false }) {
    return (
        <div style={{
            ...s.tlItem,
            ...(active ? s.tlItemActive : {})
        }}>
            <div style={{
                ...s.tlDot,
                ...(active ? s.tlDotActive : {})
            }} />
            <div style={s.tlContent}>
                <span style={s.tlYear}>{year}</span>
                <h4 style={s.tlTitle}>{title}</h4>
                <p style={s.tlDesc}>{desc}</p>
            </div>
        </div>
    );
}

const s = {
    section: {
        background: 'var(--bg-warm)',
        fontFamily: "'Heebo', sans-serif",
        direction: 'rtl',
        padding: '80px 20px',
    },
    inner: {
        maxWidth: '1000px',
        margin: '0 auto',
    },
    title: {
        fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
        fontWeight: 800,
        color: 'var(--royal)',
        textAlign: 'center',
        marginBottom: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
    },
    titleIcon: { fontSize: '1.4rem' },

    // כרטיסים
    cards: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '24px',
        marginBottom: '64px',
    },
    card: {
        background: 'var(--bg-card)',
        borderRadius: '20px',
        padding: '36px 28px',
        textAlign: 'center',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid rgba(15,32,68,0.06)',
        transition: 'transform 0.3s, box-shadow 0.3s',
    },
    cardIconWrap: {
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        background: 'var(--royal-pale)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
    },
    cardEmoji: { fontSize: '1.8rem' },
    cardTitle: {
        color: 'var(--royal)',
        fontSize: '1.2rem',
        fontWeight: 700,
        marginBottom: '10px',
    },
    cardText: {
        color: 'var(--text-soft)',
        fontSize: '0.95rem',
        lineHeight: 1.7,
        margin: 0,
    },

    // Timeline
    timeline: {
        maxWidth: '600px',
        margin: '0 auto',
    },
    timelineTitle: {
        textAlign: 'center',
        color: 'var(--royal)',
        fontSize: '1.3rem',
        fontWeight: 700,
        marginBottom: '32px',
    },
    timelineItems: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        borderRight: '3px solid var(--royal-pale)',
        paddingRight: '28px',
    },
    tlItem: {
        position: 'relative',
        display: 'flex',
        gap: '12px',
    },
    tlItemActive: {},
    tlDot: {
        position: 'absolute',
        right: '-39px',
        top: '4px',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        background: 'var(--royal-pale)',
        border: '3px solid var(--royal-light)',
    },
    tlDotActive: {
        background: 'var(--gold)',
        border: '3px solid var(--gold-light)',
        boxShadow: '0 0 12px rgba(212,160,23,0.4)',
    },
    tlContent: {
        flex: 1,
    },
    tlYear: {
        fontSize: '0.85rem',
        fontWeight: 700,
        color: 'var(--gold)',
        background: 'rgba(212,160,23,0.1)',
        padding: '2px 12px',
        borderRadius: '999px',
        display: 'inline-block',
        marginBottom: '6px',
    },
    tlTitle: {
        color: 'var(--text)',
        fontSize: '1.1rem',
        fontWeight: 700,
        marginBottom: '4px',
    },
    tlDesc: {
        color: 'var(--text-muted)',
        fontSize: '0.92rem',
        lineHeight: 1.6,
        margin: 0,
    },
};
