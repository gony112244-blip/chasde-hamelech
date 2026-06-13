import { useState, useEffect, useRef } from 'react';
import { useLang } from '../contexts/LangContext';
import API_BASE from '../config';

// cache client-side כדי לא לשאול שוב ושוב
const clientCache = new Map();

/**
 * useTranslate(text) — מחזיר טקסט מתורגם לשפה הנוכחית.
 * אם השפה היא עברית או הטקסט ריק — מחזיר מיד.
 * אחרת שולח ל-/api/translate ומחזיר את התוצאה.
 */
export function useTranslate(text) {
    const { lang } = useLang();
    const [translated, setTranslated] = useState(text);
    const prevKey = useRef('');

    useEffect(() => {
        if (!text || lang === 'he') {
            setTranslated(text);
            return;
        }

        const key = `${lang}::${text}`;
        if (prevKey.current === key) return;
        prevKey.current = key;

        if (clientCache.has(key)) {
            setTranslated(clientCache.get(key));
            return;
        }

        setTranslated(text); // fallback בינתיים

        fetch(`${API_BASE}/api/translate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, lang }),
        })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data?.translated) {
                    clientCache.set(key, data.translated);
                    setTranslated(data.translated);
                }
            })
            .catch(() => {});
    }, [text, lang]);

    return translated;
}

/**
 * translateBatch(items, fields, lang) — מתרגם מערך של אובייקטים
 * fields: מערך שמות שדות לתרגם, למשל ['title', 'caption']
 */
export async function translateBatch(items, fields, lang) {
    if (!lang || lang === 'he') return items;

    const results = await Promise.all(
        items.map(async (item) => {
            const translations = {};
            for (const field of fields) {
                const text = item[field];
                if (!text) continue;
                const key = `${lang}::${text}`;
                if (clientCache.has(key)) {
                    translations[field] = clientCache.get(key);
                    continue;
                }
                try {
                    const r = await fetch(`${API_BASE}/api/translate`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text, lang }),
                    });
                    if (r.ok) {
                        const data = await r.json();
                        if (data?.translated) {
                            clientCache.set(key, data.translated);
                            translations[field] = data.translated;
                        }
                    }
                } catch (_) { /* fallback */ }
            }
            return { ...item, ...translations };
        })
    );
    return results;
}
