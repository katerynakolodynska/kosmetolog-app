import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import pl from './locales/pl/transaction.json';
import uk from './locales/uk/transaction.json';
import en from './locales/en/transaction.json';

i18n.use(initReactI18next).init({
  resources: {
    pl: { translation: pl },
    uk: { translation: uk },
    en: { translation: en },
  },
  lng: 'pl',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
