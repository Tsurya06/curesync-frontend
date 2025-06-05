import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '@/assets/locales/en.json';
import esTranslation from '@/assets/locales/es.json';
import inTranslation from '@/assets/locales/hin.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  hin: {
    translation: inTranslation,
  },
  es: {
    translation: esTranslation,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;