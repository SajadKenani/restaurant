"use client";
import React from "react";
import useTranslation from "@/utils/UseTranslation";

const MenuHero = () => {
  const { t, loading } = useTranslation();

  return (
    <div className="relative h-[45vh] top-0 w-full flex items-center justify-center bg-gradient-to-r to-lime-800 from-cyan-800">
      <div className="relative z-10 text-center text-white px-4 mt-20">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="w-64 h-12 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="w-48 h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="w-32 h-12 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
        ) : (
          <>
            <h1 className="text-5xl font-bold mb-4">{t("menu-hero.title")}</h1>
            <p className="text-lg mb-4">{t("menu-hero.description")}</p>
            <a
              href="/categories/0"
              className="inline-block bg-white hover:bg-black hover:text-orange-500 text-orange-500 font-bold py-3 px-6 rounded-full"
            >
              {t("menu-hero.viewItems")}
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default MenuHero;
