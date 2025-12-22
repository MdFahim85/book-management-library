import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/English/translation.json";
import bn from "../locales/Bangla/translation.json";

i18n.use(initReactI18next).init({
  debug: true,
  fallbackLng: "en",
  resources: {
    en: {
      translation: en,
    },
    bn: {
      translation: bn,
    },
  },
});

export default i18n;
