import { useLang } from '../contexts/LangContext';
import he from '../i18n/he';
import en from '../i18n/en';
import fr from '../i18n/fr';

const dicts = { he, en, fr };

export function useT() {
    const { lang } = useLang();
    const dict = dicts[lang] || dicts.he;
    return (key) => dict[key] ?? dicts.he[key] ?? key;
}
