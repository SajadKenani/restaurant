"use client";
import React, { useState, useEffect } from "react";
import { getItemById } from "@/api/items";
import { createOrder, getOrderById } from "@/api/order";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTrash,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import logo from "@/../../public/images/logo3.png";
import useTranslation from "@/utils/UseTranslation";
import { useLanguage } from "@/utils/LanguageContext";
import { getSettings } from "@/api/settings";
import { useQuery } from "react-query";
import { displayImageURL } from "@/utils/appUtils";
import Loading from "./Loading";

const OrderPlace = () => {
  const { t, loading: translationLoading } = useTranslation();
  const { activeLanguage } = useLanguage();

  const [cartItems, setCartItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const { data: settings } = useQuery("settings", getSettings);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        console.log("Cart from localStorage:", cart);

        const itemPromises = cart.map(async (cartItem) => {
          const itemData = await getItemById(cartItem.itemId);
          console.log("Fetched item data:", itemData);
          return { ...itemData, quantity: cartItem.quantity };
        });

        const items = await Promise.all(itemPromises);
        console.log("All fetched items:", items);
        setCartItems(items);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem(
      "cart",
      JSON.stringify(
        updatedCart.map((item) => ({
          itemId: item.id,
          quantity: item.quantity,
        }))
      )
    );
  };

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      alert(t("order-place.empty-cart-alert"));
      return;
    }

    if (
      !customerName ||
      !customerEmail ||
      !customerContact ||
      !customerAddress
    ) {
      alert(t("order-place.missing-fields-alert"));
      return;
    }

    const subtotal = cartItems.reduce((acc, item) => {
      return acc + parseFloat(item.item_price) * item.quantity;
    }, 0);

    if (subtotal < 1) {
      alert(t("order-place.minimum-order-alert"));
      return;
    }

    const orderDetails = {
      items: cartItems.map((item) => ({
        name: item[`${activeLanguage}_item_name`],
        quantity: item.quantity,
        price: parseFloat(item.item_price),
        subtotal: parseFloat(item.item_price) * item.quantity,
      })),
      totalPrice: cartItems.reduce(
        (acc, item) => acc + parseFloat(item.item_price) * item.quantity,
        0
      ),
      additionalNotes: additionalNotes,
    };

    const orderData = {
      customer_name: customerName,
      customer_email: customerEmail,
      customer_contact: customerContact,
      customer_address: customerAddress,
      total_amount: subtotal,
      order_details: JSON.stringify(orderDetails),
      additional_notes: additionalNotes,
    };

    try {
      const response = await createOrder(orderData);
      if (response.status === 201) {
        console.log("Order created successfully:", response.data);

        const fetchedOrder = await getOrderById(response.data.id);
        setOrderDetails(fetchedOrder.data);

        // Clear the cart and additional notes
        localStorage.removeItem("cart");
        setCartItems([]);
        setCustomerName("");
        setCustomerEmail("");
        setCustomerContact("");
        setCustomerAddress("");
        setAdditionalNotes("");

        setShowPopup(true);
      } else {
        console.error("Failed to create order:", response.data);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handleOpenWhatsApp = async () => {
    if (!orderDetails) return;

    // handleUpdateOrderStatus("completed");

    const message = `${t("order-place.order-id")}: ${orderDetails.id}\n
${t("order-place.customer-name")}: ${orderDetails.customer_name}
${t("order-place.customer-email")}: ${orderDetails.customer_email}
${t("order-place.customer-contact")}: ${orderDetails.customer_contact}
${t("order-place.customer-address")}: ${orderDetails.customer_address}\n
${t("order-place.items")}:
${JSON.parse(orderDetails.order_details)
  .items.map(
    (item) =>
      `  - ${item.name} (x${item.quantity}): ${item.price} IQD ${t(
        "order-place.each"
      )}, ${t("order-place.subtotal")}: ${item.subtotal} IQD`
  )
  .join("\n")}\n
${t("order-place.additional-notes")}: ${orderDetails.additional_notes}
${t("order-place.total-amount")}: ${orderDetails.total_amount} IQD
`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${
      settings?.business_contact || ""
    }&text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  };

  // const handleUpdateOrderStatus = async (status) => {
  //   if (!orderDetails) return;

  //   try {
  //     const response = await updateOrder(orderDetails.id, status);
  //     if (response.status === 200) {
  //       console.log("Order status updated successfully:", response.data);
  //       setOrderDetails((prev) => ({ ...prev, status }));
  //       setShowPopup(false);
  //     } else {
  //       console.error("Failed to update order status:", response.data);
  //     }
  //   } catch (error) {
  //     console.error("Error updating order status:", error);
  //   }
  // };
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  if (loading || translationLoading) return <Loading />;

  return (
    <div className="container mx-auto py-10 p-4">
      <div className="grid gap-8">
        <div className="grid gap-2 w-full p-8 text-white transition-colors duration-750 shadow-sm bg-gray-100 rounded-lg">
          {cartItems.length === 0 ? (
            <div className="flex justify-center items-center h-full text-center text-gray-700">
              <div className="text-center text-2xl text-gray-300 font-semibold mt-40">
                <FontAwesomeIcon
                  icon={faBoxOpen}
                  className="text-6xl text-gray-500 mb-4"
                />
                <p className="text-2xl font-bold">
                  {t("order-place.no-items-in-cart")}
                </p>
              </div>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 text-orange-600 shadow-lg rounded-lg overflow-hidden p-4 flex items-center transition-all duration-300 transform hover:scale-101"
              >
                <img
                  className="w-auto h-32 object-cover rounded-md mr-4"
                  src={displayImageURL(item.item_img_url)}
                  alt={item[`${activeLanguage}_item_name`]}
                  onError={(e) => (e.target.src = logo.src)}
                />
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-orange-600 mb-2">
                    {item[`${activeLanguage}_item_name`]}
                  </h2>
                  <p className="text-orange-600/80 mb-1 font-bold">
                    {t("order-place.quantity")}: {item.quantity}
                  </p>
                  <p className="text-orange-600/80 mb-1 font-bold">
                    {t("order-place.price-per-item")}: {item.item_price} IQD
                  </p>
                  <p className="text-orange-600/80 mb-1 font-bold">
                    {t("order-place.total-price")}:{" "}
                    {(parseFloat(item.item_price) * item.quantity).toFixed(2)}{" "}
                    IQD
                  </p>
                </div>
                <button
                  className="text-red-500 hover:text-red-700 ml-4"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="w-full shadow-lg p-8 text-white transition-colors duration-750 bg-orange-600 rounded-lg">
          <h3 className="mb-6 text-4xl font-bold">
            {t("order-place.contact-us")}
          </h3>
          <div className="mb-6">
            <p className="mb-2 text-2xl">{t("order-place.name-prompt")}</p>
            <input
              type="text"
              placeholder={t("order-place.name-placeholder")}
              className="bg-orange-700 w-full rounded-md p-2 placeholder-white/70 transition-colors duration-750 focus:outline-none"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <p className="mb-2 text-2xl">{t("order-place.email-prompt")}</p>
            <input
              type="email"
              placeholder={t("order-place.email-placeholder")}
              className="bg-orange-700 w-full rounded-md p-2 placeholder-white/70 transition-colors duration-750 focus:outline-none"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <p className="mb-2 text-2xl">{t("order-place.contact-prompt")}</p>
            <input
              type="text"
              placeholder={t("order-place.contact-placeholder")}
              className="bg-orange-700 w-full rounded-md p-2 placeholder-white/70 transition-colors duration-750 focus:outline-none"
              value={customerContact}
              onChange={(e) => setCustomerContact(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <p className="mb-2 text-2xl">{t("order-place.address-prompt")}</p>
            <input
              type="text"
              placeholder={t("order-place.address-placeholder")}
              className="bg-orange-700 w-full rounded-md p-2 placeholder-white/70 transition-colors duration-750 focus:outline-none"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <p className="mb-2 text-2xl">{t("order-place.notes-prompt")}</p>
            <textarea
              placeholder={t("order-place.notes-placeholder")}
              className="bg-orange-700 min-h-[150px] w-full resize-none rounded-md p-2 placeholder-white/70 transition-colors duration-750 focus:outline-none"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-white text-orange-600 w-full rounded-lg py-3 text-center text-lg font-semibold transition-colors duration-750"
            onClick={handleSubmitOrder}
          >
            {t("order-place.submit-order")}
          </button>
        </div>
      </div>

      {showPopup && orderDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl text-center text-slate-900 font-bold mb-4">
              {t("order-place.you-have-placed-an-order")}
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500"
              />
            </h1>
            <h2 className="text-lg text-center border border-gray-600 text-gray-800 font-bold mb-2 mx-auto p-2 max-w-full hover:shadow-md transition-transform duration-300">
              {t("order-place.order-id")} : {orderDetails.id}
            </h2>

            <table className="table-auto text-gray-600 mb-2 w-full text-left">
              <tbody>
                <tr>
                  <td className="font-semibold">
                    {t("order-place.customer-name")}:
                  </td>
                  <td> {orderDetails.customer_name}</td>
                </tr>
                <tr>
                  <td className="font-semibold">
                    {t("order-place.customer-email")}:
                  </td>
                  <td>{orderDetails.customer_email}</td>
                </tr>
                <tr>
                  <td className="font-semibold">
                    {t("order-place.customer-contact")}:
                  </td>
                  <td>{orderDetails.customer_contact}</td>
                </tr>
                <tr>
                  <td className="font-semibold">
                    {t("order-place.customer-address")}:
                  </td>
                  <td>{orderDetails.customer_address}</td>
                </tr>
                <tr>
                  <td className="font-semibold">
                    {t("order-place.additional-notes")}:
                  </td>
                  <td> {orderDetails.additional_notes}</td>
                </tr>
              </tbody>
            </table>
            <table className="w-full table-auto text-gray-500 border-collapse border border-gray-300 mb-4">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 bg-gray-200">
                    {t("order-place.items")}
                  </th>
                  <th className="border border-gray-300 p-2 bg-gray-200">
                    {t("order-place.quantity")}
                  </th>
                  <th className="border border-gray-300 p-2 bg-gray-200">
                    {t("order-place.price")}
                  </th>
                  <th className="border border-gray-300 p-2 bg-gray-200">
                    {t("order-place.subtotal")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {JSON.parse(orderDetails.order_details).items.map(
                  (item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        {item.name}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        {item.price} IQD
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        {item.subtotal} IQD
                      </td>
                    </tr>
                  )
                )}
                <tr>
                  <td
                    colSpan="3"
                    className="border border-gray-300 p-2 text-right font-semibold"
                  >
                    {t("order-place.total-amount")}
                  </td>
                  <td className="border border-gray-300 p-2 text-right font-semibold">
                    {orderDetails.total_amount} IQD
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700"
                onClick={handleOpenWhatsApp}
              >
                <FontAwesomeIcon icon={faWhatsapp} className="mr-2" />
                {t("order-place.confirm-via-whatsapp")}
              </button>
              <button
                className="bg-gray-500 text-white font-semibold py-
2 px-4 rounded-md hover
"
                onClick={handleClosePopup}
              >
                {t("order-place.cancel-order")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPlace;
