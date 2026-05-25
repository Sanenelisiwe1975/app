import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import zu from './locales/zu.json';
import xh from './locales/xh.json';
import st from './locales/st.json';
import af from './locales/af.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zu: { translation: zu },
      xh: { translation: xh },
      st: { translation: st },
      af: { translation: af },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'translation',
  });

export default i18n;
