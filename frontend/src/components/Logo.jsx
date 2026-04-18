// לוגו SVG של חסדי המלך — כתר זהב עם לב
// ניתן להחליף בתמונה אמיתית בהמשך
export default function Logo({ size = 40, showText = true }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* כתר */}
                <path
                    d="M10 70 L10 45 L30 60 L50 20 L70 60 L90 45 L90 70 Z"
                    fill="#c9a227"
                    stroke="#a07820"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
                {/* בסיס הכתר */}
                <rect x="10" y="70" width="80" height="14" rx="4" fill="#c9a227" stroke="#a07820" strokeWidth="2"/>
                {/* לב קטן במרכז הכתר */}
                <path
                    d="M50 55 C50 55 42 48 42 43 C42 39.5 44.5 37 47.5 37 C49 37 50 38 50 38 C50 38 51 37 52.5 37 C55.5 37 58 39.5 58 43 C58 48 50 55 50 55Z"
                    fill="#fff"
                    opacity="0.9"
                />
                {/* נקודות קישוט על הכתר */}
                <circle cx="10" cy="45" r="4" fill="#f0c040"/>
                <circle cx="50" cy="20" r="5" fill="#f0c040"/>
                <circle cx="90" cy="45" r="4" fill="#f0c040"/>
            </svg>
            {showText && (
                <span style={{
                    fontFamily: "'Heebo', sans-serif",
                    fontWeight: 800,
                    fontSize: size * 0.42,
                    color: '#c9a227',
                    letterSpacing: '0.5px',
                    lineHeight: 1
                }}>
                    חסדי המלך
                </span>
            )}
        </div>
    );
}
