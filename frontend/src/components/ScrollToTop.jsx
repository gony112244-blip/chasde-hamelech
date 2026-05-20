import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// רכיב שמחזיר את הגלילה לראש הדף בכל ניווט
export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [pathname]);

    return null;
}
