export default function Logo({ size = 40, showText = true, darkBg = true }) {
    const textColor = darkBg ? '#fbbf24' : '#0f2044';

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
                width: size,
                height: size,
                borderRadius: '50%',
                background: '#0f2044',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
            }}>
                <img
                    src="/crown-logo.png"
                    alt="חסדי המלך"
                    style={{
                        width: '80%',
                        height: '80%',
                        objectFit: 'contain',
                    }}
                />
            </div>
            {showText && (
                <span style={{
                    fontFamily: "'Heebo', sans-serif",
                    fontWeight: 800,
                    fontSize: size * 0.42,
                    color: textColor,
                    letterSpacing: '0.5px',
                    lineHeight: 1
                }}>
                    חסדי המלך
                </span>
            )}
        </div>
    );
}
