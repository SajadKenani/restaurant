"use client";
import React from "react";
import useTranslation from "@/utils/UseTranslation";

const NotFoundPage = () => {
  const { t, loading } = useTranslation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-900">
        <div className="w-full max-w-md h-[400px] bg-gray-400 shadow-lg rounded-lg p-8">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-16 w-48 mx-auto rounded"></div>
            <div className="mt-4 bg-gray-300 h-8 w-64 mx-auto rounded"></div>
            <div className="mt-2 bg-gray-300 h-6 w-56 mx-auto rounded"></div>
            <div className="mt-6">
              <div className="bg-gray-300 h-12 w-32 mx-auto rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-900">
      <div className="w-full text-center max-w-md h-auto bg-gray-400 shadow-lg rounded-lg p-8">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-red-600">
          {t("notFound.title")}
        </h1>
        <p className="mt-4 text-lg md:text-xl font-semibold text-gray-700">
          {t("notFound.message")}
        </p>
        <p className="mt-2 text-gray-600">{t("notFound.description")}</p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-block px-4 py-2 md:px-6 md:py-3 text-sm md:text-lg font-medium text-white bg-slate-600 rounded-lg shadow hover:bg-slate-700 transition duration-300"
          >
            {t("notFound.homeButton")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
