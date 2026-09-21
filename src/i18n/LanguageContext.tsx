import React, { createContext, useContext, useState, useEffect } from "react";
import { DisplayLanguage, Locale } from "../features/quiz/types";
import { messages, TranslationDict } from "./messages";
import { loadLocalePreference, saveLocalePreference } from "../features/quiz/storage";

interface LanguageContextValue {
  language: DisplayLanguage;
  setLanguage: (lang: DisplayLanguage) => void;
  // Primary messages object (zh-CN if language === 'zh-CN', otherwise en)
  t: TranslationDict;
  // Second messages object for bilingual secondary subtitles
  tSecondary?: TranslationDict;
  renderText: (en: string, zh: string) => React.ReactNode;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectDefaultLanguage(): DisplayLanguage {
  const saved = loadLocalePreference();
  if (saved === "zh-CN" || saved === "en" || saved === "bilingual") {
    return saved as DisplayLanguage;
  }

  // Browser language detection
  const navLang = (navigator.language || (navigator.languages && navigator.languages[0]) || "").toLowerCase();
  if (navLang.startsWith("zh")) {
    return "bilingual"; // Default bilingual for Chinese users to see both, as requested in handoff
  }
  return "en";
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<DisplayLanguage>(detectDefaultLanguage);

  useEffect(() => {
    saveLocalePreference(language);
    // Update HTML lang attribute
    const htmlLang = language === "en" ? "en" : "zh-CN";
    document.documentElement.lang = htmlLang;
  }, [language]);

  const setLanguage = (lang: DisplayLanguage) => {
    setLanguageState(lang);
  };

  const primaryLocale: Locale = language === "zh-CN" ? "zh-CN" : "en";
  const t = messages[primaryLocale];
  const tSecondary = language === "bilingual" ? messages["zh-CN"] : undefined;

  const renderText = (en: string, zh: string): React.ReactNode => {
    if (language === "zh-CN") {
      return zh;
    }
    if (language === "en") {
      return en;
    }
    // Bilingual mode: English primary, Chinese secondary
    return (
      <>
        <span>{en}</span>
        <span style={{ display: "block", fontSize: "0.88em", opacity: 0.85, marginTop: "2px" }}>{zh}</span>
      </>
    );
  };

  return <LanguageContext.Provider value={{ language, setLanguage, t, tSecondary, renderText }}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
