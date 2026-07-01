/** אייקון בית חולים — SVG נקי במקום אימוג'י עם צלב/צל שבור ב-Windows */
export function HospitalIcon({ size = 40 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="hospRoof" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#d4a017" />
                </linearGradient>
            </defs>
            {/* בסיס */}
            <rect x="10" y="26" width="44" height="30" rx="5" fill="#1a3460" />
            <rect x="10" y="26" width="44" height="11" rx="5" fill="url(#hospRoof)" />
            {/* חלונות */}
            <rect x="16" y="42" width="8" height="8" rx="1.5" fill="rgba(255,255,255,0.35)" />
            <rect x="40" y="42" width="8" height="8" rx="1.5" fill="rgba(255,255,255,0.35)" />
            {/* לב במקום צלב — מתאים לרוח העמותה */}
            <path
                d="M32 48 C32 48 24 41.5 24 36.5 C24 33 26.5 30.5 29.5 30.5 C31 30.5 32 31.5 32 31.5 C32 31.5 33 30.5 34.5 30.5 C37.5 30.5 40 33 40 36.5 C40 41.5 32 48 32 48Z"
                fill="#f87171"
            />
            {/* דגל קטן */}
            <rect x="30" y="14" width="4" height="14" rx="1" fill="#fbbf24" />
            <path d="M34 14 H48 V22 C48 22 42 24 34 20 Z" fill="#fbbf24" opacity="0.85" />
        </svg>
    );
}
