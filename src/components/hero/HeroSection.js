"use client";

import React from "react";
import useTranslation from "@/utils/UseTranslation";
import hero_slide_3 from "@/../../public/images/hero_slide_3.jpg";

const HeroSection = () => {
  const { t, loading } = useTranslation();

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={hero_slide_3.src}
          alt="Hero Background"
          className="object-cover w-full h-full transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>{" "}
        {/* Black shade overlay */}
      </div>
      <div className="absolute inset-0 flex items-center justify-center text-center text-white">
        <div className="p-8">
          {loading ? (
            <div className="h-6 bg-gray-200 animate-pulse mb-2 rounded w-40 mx-auto"></div>
          ) : (
            <p className="text-lg mb-2 font-mono text-orange-500">
              {t("hero.welcome")}
            </p>
          )}

          {loading ? (
            <div className="h-10 bg-gray-200 animate-pulse mb-4 rounded w-60 mx-auto"></div>
          ) : (
            <h1 className="text-4xl font-bold uppercase mb-4 font-serif">
              {t("hero.title")}
            </h1>
          )}

          {loading ? (
            <div className="h-6 bg-gray-200 animate-pulse mb-6 rounded w-48 mx-auto"></div>
          ) : (
            <p className="text-lg mb-6 font-mono">{t("hero.flavors")}</p>
          )}

          {loading ? (
            <div className="h-10 bg-orange-600 animate-pulse rounded w-32 mx-auto"></div>
          ) : (
            <a
              href="/menus"
              className="inline-block px-4 py-2 font-semibold text-white bg-orange-600 rounded hover:bg-gray-300 hover:text-orange-600 transition duration-300"
            >
              {t("hero.viewMenus")}
            </a>
          )}
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        {loading ? (
          <div className="h-6 bg-gray-200 animate-pulse rounded w-20 mx-auto"></div>
        ) : (
          <a href="#" className="flex flex-col items-center">
            <span className="text-lg mb-2">{t("hero.scroll")}</span>
            <div className="w-6 h-6 border-2 border-white rounded-full animate-bounce"></div>
          </a>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
