import i18n from "i18next"
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend'
import LanguageDetector from "i18next-browser-languagedetector"

import translationsEN from 'vibemap-constants/translations/english.json';
import translationsES from 'vibemap-constants/translations/spanish.json';

const options = {
  fallbackLng: "en",
  debug: true,
  //load: 'languageOnly', // we only provide en, es -> no region specific locals like en-US, de-DE
  ns: ["translations"], // have a common namespace used around the full app
  defaultNS: "translations",
  keySeparator: false, // we use content as keys
  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ","
  },
  react: { 
    wait: true 
  },
  // we init with resources
  resources: {
    en: { translations: translationsEN },
    es: { translations: translationsES }
  },
  saveMissing: true,
  wait: process && !process.release
}

// for browser use xhr backend to load translations and browser lng detector
if (process && !process.release) {
  i18n
    .use(Backend)
    .use(initReactI18next)
    .use(LanguageDetector)

}

// initialize if not already initialized
if (!i18n.isInitialized) i18n.init(options);

export default i18n;