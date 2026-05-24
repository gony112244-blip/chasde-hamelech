// לוגו SVG של חסדי המלך — כתר זהב מלכותי
export default function Logo({ size = 40, showText = true, darkBg = true }) {
    const textColor = darkBg ? '#fbbf24' : '#0f2044';

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <defs>
                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24"/>
                        <stop offset="100%" stopColor="#d4a017"/>
                    </linearGradient>
                </defs>
                {/* כתר */}
                <path
                    d="M10 70 L10 45 L30 60 L50 20 L70 60 L90 45 L90 70 Z"
                    fill="url(#logoGrad)"
                    stroke="#a07820"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
                {/* בסיס הכתר */}
                <rect x="10" y="70" width="80" height="14" rx="4" fill="url(#logoGrad)" stroke="#a07820" strokeWidth="2"/>
                {/* לב קטן במרכז הכתר */}
                <path
                    d="M50 55 C50 55 42 48 42 43 C42 39.5 44.5 37 47.5 37 C49 37 50 38 50 38 C50 38 51 37 52.5 37 C55.5 37 58 39.5 58 43 C58 48 50 55 50 55Z"
                    fill="#fff"
                    opacity="0.95"
                />
                {/* נקודות קישוט על הכתר */}
                <circle cx="10" cy="45" r="4" fill="#fbbf24"/>
                <circle cx="50" cy="20" r="5" fill="#fbbf24"/>
                <circle cx="90" cy="45" r="4" fill="#fbbf24"/>
            </svg>
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
