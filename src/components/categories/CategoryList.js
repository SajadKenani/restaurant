"use client";
import React from "react";
import Link from "next/link";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import { getCategories } from "@/api/category";
import { useLanguage } from "@/utils/LanguageContext";
import logo from "@/../../public/images/logo3.png";
import { displayImageURL } from "@/utils/appUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faFrown } from "@fortawesome/free-solid-svg-icons";
import useTranslation from "@/utils/UseTranslation";

const CategoryList = () => {
  const { activeLanguage } = useLanguage();
  const { t } = useTranslation();
  const { data, isLoading, isError } = useQuery("categories", getCategories);

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-200 h-48 sm:h-60 md:h-72 lg:h-80 animate-pulse"
            >
              <div className="h-full bg-gray-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-center text-white">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-xl font-semibold text-red-600">
          {t("common.error")}
        </p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faFrown}
            className="text-4xl text-gray-500 mb-4"
          />
          <p className="text-xl font-semibold text-gray-500">
            {t("common.noData")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {data.map((category) => (
          <Link key={category.id} href={`/categories/${category.id}`} passHref>
            <motion.a
              className="relative rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105"
              whileTap={{ scale: 0.98 }}
            >
              <motion.img
                className="w-full h-48 sm:h-60 md:h-72 lg:h-80 object-cover object-center"
                src={displayImageURL(category.img_url)}
                alt={category[`${activeLanguage}_title`]}
                onError={(e) => (e.target.src = logo.src)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-center text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-bold">
                  {category[`${activeLanguage}_title`]}
                </h2>
              </motion.div>
            </motion.a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
