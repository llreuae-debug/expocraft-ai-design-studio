"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SupportedLanguage, SupportedCurrency, LanguageConfig, CurrencyConfig } from "@/types/i18n";
import { SUPPORTED_LANGUAGES, CURRENCY_CONFIGS, TRANSLATIONS } from "@/lib/translations";

interface I18nContextType {
  currentLanguage: SupportedLanguage;
  currentDirection: "ltr" | "rtl";
  allLanguages: LanguageConfig[];
  setLanguage: (lang: SupportedLanguage) => void;
  
  currentCurrency: SupportedCurrency;
  allCurrencies: CurrencyConfig[];
  setCurrency: (cur: SupportedCurrency) => void;
  
  t: (key: string) => string;
  formatPrice: (amountUSD: number) => string;
  convertFromUSD: (amountUSD: number) => number;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>("en");
  const [currentCurrency, setCurrentCurrency] = useState<SupportedCurrency>("USD");

  useEffect(() => {
    const savedLang = localStorage.getItem("expocraft_lang") as SupportedLanguage;
    if (savedLang && TRANSLATIONS[savedLang]) {
      setCurrentLanguage(savedLang);
    }
    const savedCur = localStorage.getItem("expocraft_cur") as SupportedCurrency;
    if (savedCur && CURRENCY_CONFIGS[savedCur]) {
      setCurrentCurrency(savedCur);
    }
  }, []);

  const selectedLangConfig = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  const currentDirection = selectedLangConfig.direction;

  const setLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    localStorage.setItem("expocraft_lang", lang);
    document.documentElement.dir = SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.direction || "ltr";
  };

  const setCurrency = (cur: SupportedCurrency) => {
    setCurrentCurrency(cur);
    localStorage.setItem("expocraft_cur", cur);
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  const convertFromUSD = (amountUSD: number): number => {
    const config = CURRENCY_CONFIGS[currentCurrency] || CURRENCY_CONFIGS.USD;
    return Number((amountUSD * config.rateAgainstUSD).toFixed(config.decimalDigits));
  };

  const formatPrice = (amountUSD: number): string => {
    const config = CURRENCY_CONFIGS[currentCurrency] || CURRENCY_CONFIGS.USD;
    const converted = amountUSD * config.rateAgainstUSD;
    return `${config.symbol}${converted.toLocaleString("en-US", {
      minimumFractionDigits: config.decimalDigits,
      maximumFractionDigits: config.decimalDigits,
    })}`;
  };

  return (
    <I18nContext.Provider
      value={{
        currentLanguage,
        currentDirection,
        allLanguages: SUPPORTED_LANGUAGES,
        setLanguage,
        currentCurrency,
        allCurrencies: Object.values(CURRENCY_CONFIGS),
        setCurrency,
        t,
        formatPrice,
        convertFromUSD,
      }}
    >
      <div dir={currentDirection} className={currentDirection === "rtl" ? "font-sans" : ""}>
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
