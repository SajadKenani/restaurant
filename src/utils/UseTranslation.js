"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "./LanguageContext"; // Adjust path alias as necessary

const preloadLocales = () => {
  const locales = ["en", "ar"]; // Add other supported languages here
  const promises = locales.map((locale) =>
    fetch(`/locales/${locale}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${locale} translations`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error(error);
        return {};
      })
  );

  return Promise.all(promises).then((results) => {
    const localeData = {};
    locales.forEach((locale, index) => {
      localeData[locale] = results[index];
    });
    return localeData;
  });
};

const useTranslation = () => {
  const { activeLanguage } = useLanguage();
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);
  const [localeData, setLocaleData] = useState({});
  const [error, setError] = useState(false);

  useEffect(() => {
    preloadLocales()
      .then((data) => {
        setLocaleData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (localeData[activeLanguage]) {
      setTranslations(localeData[activeLanguage]);
      setError(false);
    } else {
      setError(true);
    }
  }, [activeLanguage, localeData]);

  const t = (key) => {
    return (
      key
        .split(".")
        .reduce((obj, keyPart) => obj && obj[keyPart], translations) || key
    );
  };

  return { t, loading, error };
};

export default useTranslation;
