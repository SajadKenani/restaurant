"use client";

import React from "react";
import useTranslation from "@/utils/UseTranslation";

const SplashScreen = () => {
  const { t, loading, error } = useTranslation();

  if (loading || error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-cyan-700 to-indigo-800 text-white text-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-xl">
            {error ? "Failed to load data. Retrying..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-cyan-600 to-indigo-800 text-white text-center">
      <div className="p-10 bg-black bg-opacity-50 rounded-lg">
        <h1 className="text-5xl mb-4">{t("splash.language")}</h1>
        <p className="text-2xl">{t("splash.splash-description")}</p>
      </div>
    </div>
  );
};

export default SplashScreen;
