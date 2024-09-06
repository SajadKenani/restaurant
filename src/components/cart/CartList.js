"use client";
import React, { useEffect, useState } from "react";
import { getItemById } from "@/api/items";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faShoppingCart,
  faPlus,
  faMinus,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
import logo from "@/../../public/images/logo3.png";
import { useLanguage } from "@/utils/LanguageContext";
import useTranslation from "@/utils/UseTranslation";
import { displayImageURL } from "@/utils/appUtils";

const CartList = () => {
  const { activeLanguage } = useLanguage();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const { t, loading } = useTranslation();
  const [error, setError] = useState(false); // Add state for error

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const itemPromises = cart.map(async (cartItem) => {
          const itemData = await getItemById(cartItem.itemId);
          return { ...itemData, quantity: cartItem.quantity };
        });
        const items = await Promise.all(itemPromises);
        setCartItems(items);
        calculateTotalPrice(items);
        calculateTotalItems(items);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setError(true); // Set error state to true if there's an error
      }
    };

    fetchCartItems();
  }, []);

  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => {
      return sum + item.item_price * item.quantity;
    }, 0);
    setTotalPrice(total.toFixed(2));
  };

  const calculateTotalItems = (items) => {
    const total = items.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);
    setTotalItems(total);
  };

  const updateLocalStorage = (items) => {
    localStorage.setItem(
      "cart",
      JSON.stringify(
        items.map((item) => ({
          itemId: item.id,
          quantity: item.quantity,
        }))
      )
    );
  };

  const handleIncrease = (itemId) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(updatedCart);
    updateLocalStorage(updatedCart);
    calculateTotalPrice(updatedCart);
    calculateTotalItems(updatedCart);
  };

  const handleDecrease = (itemId) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === itemId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCartItems(updatedCart);
    updateLocalStorage(updatedCart);
    calculateTotalPrice(updatedCart);
    calculateTotalItems(updatedCart);
  };

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    updateLocalStorage(updatedCart);
    calculateTotalPrice(updatedCart);
    calculateTotalItems(updatedCart);
  };

  // Loading and Error state view
  if (loading || error) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent border-solid rounded-full animate-spin"></div>
          <div className="mt-4 space-y-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-300 rounded-lg h-12 w-3/4 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {cartItems.length === 0 ? (
        <div className="text-center text-2xl text-gray-300 font-semibold mt-40">
          <FontAwesomeIcon
            icon={faBoxOpen}
            className="text-6xl text-gray-500 mb-4"
          />
          <p>{t("cartlist.empty-cart")}</p>
        </div>
      ) : (
        <div className="grid gap-4 bg-gray-100 p-4">
          <div className="bg-gradient-to-r from-indigo-500/90 via-blue-500/90 to-blue-500/90 text-white mb-2 p-6 flex flex-col sm:flex-row justify-between items-center rounded-lg shadow-md">
            <p className="text-2xl font-bold">
              {t("cartlist.no-of-items")}: <span>{cartItems.length}</span>
            </p>
            <p className="text-2xl font-bold">
              {t("cartlist.total-price")}: <span>{totalPrice} IQD</span>
            </p>
          </div>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/80 shadow-lg rounded-lg overflow-hidden p-4 flex flex-col sm:flex-row items-center"
            >
              <img
                className="w-24 h-24 object-cover rounded-md mb-4 sm:mb-0 sm:mr-4"
                src={displayImageURL(item.item_img_url)}
                alt={item.en_item_name}
                onError={(e) => (e.target.src = logo.src)}
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">
                  {item[`${activeLanguage}_item_name`]}
                </h2>
                <div className="flex items-center mt-2">
                  <button
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-l-md hover:bg-gray-300 transition-colors duration-300"
                    onClick={() => handleDecrease(item.id)}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <span className="px-4 py-1 bg-gray-100 text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 transition-colors duration-300"
                    onClick={() => handleIncrease(item.id)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <p className="text-gray-600 mt-2">
                  {t("cartlist.total-price")}:{" "}
                  {(parseFloat(item.item_price) * item.quantity).toFixed(2)} IQD
                </p>
              </div>
              <button
                className="text-red-500 hover:text-red-700 transition-colors duration-300 ml-4"
                onClick={() => handleRemoveItem(item.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
          <a
            href="/cart/checkout"
            className="bg-orange-500 text-center ml-auto text-xl text-white px-4 py-2 rounded-md font-semibold mt-4 hover:bg-orange-600 transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
            {t("cartlist.checkout")}
          </a>
        </div>
      )}
    </div>
  );
};

export default CartList;
