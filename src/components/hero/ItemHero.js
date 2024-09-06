"use client";
import React from "react";
import useTranslation from "@/utils/UseTranslation";

const ItemHero = () => {
  const { t, loading } = useTranslation();

  if (loading) {
    return (
      <div className="relative h-[45vh] w-full flex items-center justify-center bg-gradient-to-r to-lime-800 from-cyan-800">
        <div className="relative z-10 text-center text-white px-4 mt-20">
          <div className="flex flex-col items-center">
            <div className="w-64 h-12 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="w-32 h-12 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[45vh] w-full flex items-center justify-center bg-gradient-to-r to-lime-800 from-cyan-800">
      <div className="relative z-10 text-center text-white px-4 mt-20">
        <h1 className="text-5xl font-bold mb-4">{t("item-hero.title")}</h1>
        <div className="bottom-8">
          <a href="#next-section" className="flex flex-col items-center">
            <span className="text-lg mb-2">{t("item-hero.scroll")}</span>
            <div className="w-6 h-6 border-2 border-white rounded-full animate-bounce"></div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ItemHero;
