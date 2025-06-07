import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(Backend) // <-- enable HTTP loading
  .use(initReactI18next) // <-- hook into React
  .init({
    fallbackLng: "en",
    ns: ["common"],
    defaultNS: "common",
    preload: ["common","dashboard"], // <-- common.json fetched at startup
    backend: {
      loadPath: "/assets/locales/{{lng}}/{{ns}}.json",
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: true },
  });

export default i18n;
