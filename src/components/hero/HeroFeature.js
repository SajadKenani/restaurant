"use client";

import React from "react";
import useTranslation from "@/utils/UseTranslation";
import hero_slide_2 from "@/../../public/images/bg2.jpg";

const HeroFeature = () => {
  const { t, loading } = useTranslation();

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={hero_slide_2.src}
          alt="Hero Background"
          className="object-cover w-full h-full transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>{" "}
        {/* Black shade overlay */}
      </div>
      <div className="absolute inset-0 flex items-center justify-center text-center text-white">
        <div className="p-8">
          {loading ? (
            <div className="h-10 bg-gray-200 animate-pulse mb-4 rounded w-60 mx-auto"></div>
          ) : (
            <h1 className="text-4xl font-bold uppercase mb-4 font-serif">
              {t("hero-paper.title")}
            </h1>
          )}

          {loading ? (
            <div className="h-6 bg-gray-200 animate-pulse mb-6 rounded w-48 mx-auto"></div>
          ) : (
            <p className="text-lg mb-6 font-mono">
              {" "}
              {t("hero-paper.description")}
            </p>
          )}

          {loading ? (
            <div className="h-10 bg-orange-600 animate-pulse rounded w-32 mx-auto"></div>
          ) : (
            <a
              href="/menus"
              className="inline-block px-4 py-2 font-semibold text-white bg-orange-600 rounded hover:bg-gray-300 hover:text-orange-600 transition duration-300"
            >
              {t("hero-paper.getStarted")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroFeature;
