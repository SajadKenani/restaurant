"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [activeLanguage, setActiveLanguage] = useState("en"); // Default to "en" during SSR

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure localStorage access only happens in the browser
      const locale = localStorage.getItem("locale") || "en";
      setActiveLanguage(locale);
    }
  }, []);

  const changeLanguage = (locale) => {
    setActiveLanguage(locale);
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", locale);
    }
  };

  return (
    <LanguageContext.Provider value={{ activeLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Handle cases where the context is not available, e.g., SSR
    return { activeLanguage: "en", changeLanguage: () => {} }; // Default values
  }
  return context;
};
