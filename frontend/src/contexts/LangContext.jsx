import { createContext, useContext, useState, useEffect } from 'react';

const LangContext = createContext({ lang: 'he', setLang: () => {} });

export function LangProvider({ children }) {
    const [lang, setLangState] = useState(() => {
        return localStorage.getItem('site-lang') || 'he';
    });

    function setLang(l) {
        setLangState(l);
        localStorage.setItem('site-lang', l);
        // כיוון הדף — עברית RTL, אנגלית/צרפתית LTR
        document.documentElement.dir = l === 'he' ? 'rtl' : 'ltr';
        document.documentElement.lang = l;
    }

    useEffect(() => {
        document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    }, [lang]);

    return (
        <LangContext.Provider value={{ lang, setLang }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang() {
    return useContext(LangContext);
}
