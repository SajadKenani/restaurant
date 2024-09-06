"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/utils/LanguageContext";

export default function LocalSwitcher() {
  const { activeLanguage, changeLanguage } = useLanguage();
  const [localLanguage, setLocalLanguage] = useState(activeLanguage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const locale = localStorage.getItem("locale") || activeLanguage;
    if (locale !== activeLanguage) {
      changeLanguage(locale);
    }
    setLoading(false);
  }, [changeLanguage, activeLanguage]);

  const onSelectChange = useCallback(
    (e) => {
      const newLanguage = e.target.value;
      if (newLanguage !== activeLanguage) {
        setLoading(true);
        try {
          changeLanguage(newLanguage);
          setLocalLanguage(newLanguage);
          setLoading(false);
        } catch {
          setError(true);
          setLoading(false);
        }
      }
    },
    [activeLanguage, changeLanguage]
  );

  useEffect(() => {
    setLocalLanguage(activeLanguage);
  }, [activeLanguage]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {loading ? (
          <div className="animate-spin bg-transparent rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-300"></div>
        ) : error ? (
          <div className="p-1 border-2 border-red-500 rounded-2xl bg-red-100/20 text-red-600">
            Failed to load language. Try again.
          </div>
        ) : (
          <select
            className="relative p-1 border-2 border-slate-900/50 rounded-2xl bg-white/20 text-gray-900 hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ backdropFilter: "blur(10px)" }}
            value={localLanguage}
            onChange={onSelectChange}
            disabled={loading}
          >
            <option className="text-black" value="en">
              English
            </option>
            <option className="text-black" value="ar">
              Arabic
            </option>
          </select>
        )}
      </div>
    </div>
  );
}
