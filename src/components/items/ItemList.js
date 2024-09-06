"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import { getItemsByCategoryId, getItems } from "@/api/items";
import logo from "@/../../public/images/logo3.png";
import ItemDetails from "./ItemDetails";
import { useLanguage } from "@/utils/LanguageContext";
import { displayImageURL } from "@/utils/appUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import useTranslation from "@/utils/UseTranslation";

const ItemList = ({ category_id }) => {
  const { activeLanguage } = useLanguage();
  const { t } = useTranslation();
  const { data, isLoading, isError } = useQuery(["items", category_id], () =>
    category_id === "0" ? getItems() : getItemsByCategoryId(category_id)
  );

  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleItemClick = (itemId) => {
    setSelectedItemId(itemId);
  };

  const handleClosePopup = () => {
    setSelectedItemId(null);
  };

  const renderLoadingOrErrorState = () => (
    <div
      id="foods-list"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8"
    >
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="bg-black/10 shadow-lg rounded-lg overflow-hidden flex flex-col lg:flex-row animate-pulse"
        >
          <div className="lg:w-1/3 h-48 p-1 bg-gray-300 rounded-xl"></div>
          <div className="p-6 flex-1 space-y-4">
            <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
            <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
            <div className="mt-4 flex justify-between items-center">
              <div className="w-1/3 h-6 bg-gray-300 rounded"></div>
              <div className="w-1/4 h-10 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      {isLoading || isError ? (
        renderLoadingOrErrorState()
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <FontAwesomeIcon
            icon={faBoxOpen}
            className="text-6xl text-gray-500 mb-4"
          />
          <p className="text-xl font-bold text-gray-500">
            {t("common.noData")}
          </p>
        </div>
      ) : (
        <div
          id="foods-list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {data.map((item) => (
            <motion.div
              key={item.id}
              className="cursor-pointer"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="bg-black/10 shadow-lg rounded-lg overflow-hidden flex flex-col lg:flex-row">
                <img
                  className="lg:w-1/3 h-48 p-1 rounded-xl object-cover"
                  src={displayImageURL(item.item_img_url)}
                  alt={item.en_item_name}
                  onError={(e) => (e.target.src = logo.src)}
                />
                <div className="p-6 flex-1">
                  <h3 className="font-bold text-xl text-gray-800">
                    {item[`${activeLanguage}_item_name`] || "Unnamed Item"}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {item[`${activeLanguage}_item_description`] ||
                      "No description available"}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-gray-800 font-semibold text-lg">
                      {item.item_price
                        ? `${item.item_price} IQD`
                        : "Price not available"}
                    </span>
                    <button
                      onClick={() => handleItemClick(item.id)}
                      className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-md"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedItemId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg p-8 max-w-2xl w-full">
            <button
              className="absolute text-2xl font-bold top-2 right-4 text-gray-500 hover:text-gray-800"
              onClick={handleClosePopup}
            >
              &times;
            </button>
            <ItemDetails item_id={selectedItemId} />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ItemList;
