import { useEffect } from 'react';

const SITE = 'חסדי המלך';
const BASE_DESC = 'מחלקים משחקים, ספרים ואהבה לילדים מאושפזים בבתי חולים בכל רחבי הארץ.';
const BASE_URL = 'https://chasde-hamelech.org.il';
const OG_IMAGE = `${BASE_URL}/og-share.jpg?v=5`;
const OG_IMAGE_WIDTH = '1200';
const OG_IMAGE_HEIGHT = '1200';

export default function PageMeta({ title, description, path = '', noindex = false }) {
    const fullTitle = !title
        ? SITE
        : (title.includes(SITE) ? title : `${title} | ${SITE}`);
    const desc = description || BASE_DESC;
    const url = `${BASE_URL}${path}`;

    useEffect(() => {
        document.title = fullTitle;
        setMeta('description', desc);
        setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');
        setCanonical(url);
        setMeta('og:title', fullTitle, true);
        setMeta('og:description', desc, true);
        setMeta('og:url', url, true);
        setMeta('og:image', OG_IMAGE, true);
        setMeta('og:image:secure_url', OG_IMAGE, true);
        setMeta('og:image:type', 'image/jpeg', true);
        setMeta('og:image:width', OG_IMAGE_WIDTH, true);
        setMeta('og:image:height', OG_IMAGE_HEIGHT, true);
        setMeta('og:image:alt', fullTitle, true);
        setMeta('og:type', 'website', true);
        setMeta('og:locale', 'he_IL', true);
        setMeta('twitter:card', 'summary_large_image', true);
        setMeta('twitter:title', fullTitle, true);
        setMeta('twitter:description', desc, true);
        setMeta('twitter:image', OG_IMAGE, true);
    }, [fullTitle, desc, url, noindex]);

    return null;
}

function setMeta(name, content, isProperty = false) {
    const attr = isProperty ? 'property' : 'name';
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

function setCanonical(href) {
    let el = document.querySelector('link[rel="canonical"]');
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', 'canonical');
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
}
