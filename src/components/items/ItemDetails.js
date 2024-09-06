"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import { getItemById } from "@/api/items";
import logo from "@/../../public/images/logo3.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/utils/LanguageContext";
import useTranslation from "@/utils/UseTranslation";
import { displayImageURL } from "@/utils/appUtils";

const ItemDetails = ({ item_id }) => {
  const { activeLanguage } = useLanguage();
  const { data, isLoading, isError } = useQuery(["item", item_id], () =>
    getItemById(item_id)
  );
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);

  const { t, loading } = useTranslation();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error...</p>;

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemIndex = existingCart.findIndex((item) => item.itemId === item_id);

    if (itemIndex !== -1) {
      setShowPopup(true);
    } else {
      existingCart.push({ itemId: item_id, quantity: quantity });
      localStorage.setItem("cart", JSON.stringify(existingCart));
      setQuantity(1); // Reset quantity field after adding to cart
      console.log(`Added ${quantity} of item ${item_id} to cart`);
      console.log("Updated cart:", existingCart);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          key={data.id}
          className="bg-white/70 shadow-lg rounded-lg overflow-hidden hover:shadow-xl w-full"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <img
            className="w-full h-80 object-cover rounded-t-lg"
            src={displayImageURL(data.item_img_url)}
            alt={data.item_name}
            onError={(e) => (e.target.src = logo.src)}
          />
        </motion.div>
        <div className="p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {data[`${activeLanguage}_item_name`]}
            </h2>
            <p className="text-gray-600 mb-4">
              {data[`${activeLanguage}_item_description`]}
            </p>

            <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
                <button
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-l-md hover:bg-gray-300"
                  onClick={handleDecrease}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <span className="px-4 py-1 bg-gray-100 text-gray-800">
                  {quantity}
                </span>
                <button
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300"
                  onClick={handleIncrease}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              <p className="text-lg font-bold text-gray-800">
                {(data.item_price * quantity).toFixed(2)} IQD
              </p>
            </div>
          </div>

          <button
            className="w-full px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md flex items-center justify-center hover:bg-yellow-600"
            onClick={handleAddToCart}
          >
            <FontAwesomeIcon icon={faCartPlus} className="mr-2" />
            {t("item-details.add-to-cart")}
          </button>
        </div>
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-slate-900 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <p>
              This item is already in your cart. Would you like to view your
              cart?
            </p>
            <div className="flex mt-4">
              <button
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md font-semibold mr-2 hover:bg-blue-600"
                onClick={() => (window.location.href = "/cart")} // Adjust the URL as needed
              >
                Go to Cart
              </button>
              <button
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ItemDetails;
