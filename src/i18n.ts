import Backend from "i18next-xhr-backend";
import detector from "i18next-browser-languagedetector";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import translationEN from '../locales/en/common.json';
// const resources = {
//   en: {
//     translation: translationEN
//   }
// };
i18n
  .use(Backend)
  .use(detector)
  .use(initReactI18next)
  .init({
    supportedLngs: ["lo","th", "en"],
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    defaultNS: "common",
    fallbackLng: ["lo","th", "en"],
  });

export default i18n;
