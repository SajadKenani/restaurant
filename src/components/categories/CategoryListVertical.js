"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { getCategories } from "@/api/category";
import { useLanguage } from "@/utils/LanguageContext";
import DrawOutlineButton from "@/components/libs/DrawOutlineButton.js";
import useTranslation from "@/utils/UseTranslation";

const CategoryListVertical = ({ category_id }) => {
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery("categories", getCategories);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { activeLanguage } = useLanguage();
  const { t, loading: translationLoading } = useTranslation();

  useEffect(() => {
    setActiveCategory(parseInt(category_id));
  }, [category_id]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderLoadingOrErrorState = () => (
    <div className="space-y-2">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="bg-gray-300 rounded-lg h-12 w-full animate-pulse"
        ></div>
      ))}
    </div>
  );

  if (isLoading || isError || translationLoading) {
    return (
      <div className="relative mt-8">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950/90 md:ml-6 rounded-2xl p-4 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64 overflow-y-auto`}
        >
          {renderLoadingOrErrorState()}
        </aside>
      </div>
    );
  }

  return (
    <div className="relative mt-8">
      <div className="grid bg-gray-950 place-content-center p-4 md:rounded-2xl md:hidden">
        <DrawOutlineButton onClick={toggleSidebar}>
          <span className="text-white">
            <FontAwesomeIcon icon={faBars} size="lg" />
            <span className="text-white font-bold font-serif pl-4">
              {t("category-list.show-menus")}
            </span>
          </span>
        </DrawOutlineButton>
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950/90 md:ml-6 rounded-2xl p-4 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64 overflow-y-auto`}
      >
        <ul className="space-y-2">
          <li key={0}>
            <Link href={`/categories/0`}>
              <p
                className={`group relative flex items-center justify-between border-b-2 border-transparent py-2 transition-colors duration-500 hover:border-neutral-50 md:py-4 ${
                  activeCategory === 0 ? "text-orange-500" : ""
                }`}
                onClick={() => {
                  setActiveCategory(0);
                  setIsSidebarOpen(false);
                }}
              >
                <span className="block text-lg font-bold">
                  {t("category-list.all-items")}
                </span>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className={`ml-2 transition-opacity duration-300 ${
                    activeCategory === 0
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                />
              </p>
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link href={`/categories/${category.id}`}>
                <p
                  className={`group relative flex items-center justify-between border-b-2 border-transparent py-2 transition-colors duration-500 hover:border-neutral-50 md:py-4 ${
                    activeCategory === category.id ? "text-orange-500" : ""
                  }`}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setIsSidebarOpen(false);
                  }}
                >
                  <span className="block text-lg font-bold">
                    {category[`${activeLanguage}_title`]}
                  </span>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className={`ml-2 transition-opacity duration-300 ${
                      activeCategory === category.id
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default CategoryListVertical;
