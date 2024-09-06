import React, { useState, useEffect } from "react";
import { getOrders, updateOrder } from "@/api/order";
import { motion } from "framer-motion";
import useTranslation from "@/utils/UseTranslation";
import { useLanguage } from "@/utils/LanguageContext";
import { format } from "date-fns";

const OrderContent = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const { t, loading } = useTranslation();
  const { activeLanguage } = useLanguage();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
        setFilteredOrders(data); // Initially display all orders
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleSearch = () => {
    if (searchId.trim() === "") {
      applyFilter(filterStatus, orders); // Reset to display all orders if search is empty
    } else {
      const filtered = orders.filter(
        (order) => order.id.toString() === searchId
      );
      setFilteredOrders(filtered);
    }
  };

  const handleStatusChange = async () => {
    try {
      const response = await updateOrder(selectedOrderId, {
        status: selectedStatus,
      });
      console.log("Order status updated successfully:", response);
      // Refresh orders list after status update
      const updatedOrders = orders.map((order) =>
        order.id === selectedOrderId
          ? { ...order, status: selectedStatus }
          : order
      );
      setOrders(updatedOrders);
      applyFilter(filterStatus, updatedOrders);
      setDialogOpen(false);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleOpenDialog = (orderId) => {
    setSelectedOrderId(orderId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedOrderId(null);
    setSelectedStatus("");
    setDialogOpen(false);
  };

  const applyFilter = (status, ordersToFilter) => {
    if (status === "all") {
      setFilteredOrders(ordersToFilter);
    } else {
      const filtered = ordersToFilter.filter(
        (order) => order.status === status
      );
      setFilteredOrders(filtered);
    }
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    applyFilter(e.target.value, orders);
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 border-green-400";
      case "pending":
        return "bg-yellow-100 border-yellow-400";
      case "cancelled":
        return "bg-red-100 border-red-400";
      default:
        return "bg-white border-gray-200";
    }
  };

  const translateStatus = (status) => {
    if (activeLanguage === "ar") {
      switch (status) {
        case "pending":
          return "قيد الانتظار";
        case "completed":
          return "مكتمل";
        case "cancelled":
          return "ملغى";
        default:
          return status;
      }
    }
    return status;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd-MMMM-yyyy 'at' HH:mm");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center mb-4 gap-2">
        <input
          type="text"
          placeholder={t("order-content.search-placeholder")}
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="p-2 border border-gray-300 rounded focus:outline-none"
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 focus:outline-none"
          onClick={handleSearch}
        >
          {t("order-content.search")}
        </button>
        <select
          value={filterStatus}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded focus:outline-none"
        >
          <option value="all">{t("order-content.all")}</option>
          <option value="pending">{t("order-content.pending")}</option>
          <option value="completed">{t("order-content.completed")}</option>
          <option value="cancelled">{t("order-content.cancelled")}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <motion.div
            key={order.id}
            className={`border rounded-lg overflow-hidden shadow-lg p-6 transition duration-300 ${getStatusBgColor(
              order.status
            )}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex flex-col h-full">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {t("order-content.order-id")}: {order.id}
                </h2>
                <p className="text-gray-800 mb-2">
                  {t("order-content.customer-name")}: {order.customer_name}
                </p>
                <p className="text-gray-800 mb-2">
                  {t("order-content.customer-email")}: {order.customer_email}
                </p>
                <p className="text-gray-800 mb-2">
                  {t("order-content.total-amount")}: {order.total_amount} IQD
                </p>
                <p className="text-gray-800 mb-2">
                  {t("order-content.additional-notes")}:{" "}
                  {order.additional_notes}
                </p>
                <p className="text-gray-800 mb-2">
                  {t("order-content.contact")}: {order.customer_contact}
                </p>
                <p className="text-gray-800 mb-2">
                  {t("order-content.address")}: {order.customer_address}
                </p>
                <p className="text-gray-800 mb-2 font-semibold">
                  {t("order-content.order-date")}:{" "}
                  {formatDate(order.order_date)}
                </p>
                <p className="text-gray-800 mb-2 font-semibold">
                  {t("order-content.status")}:{" "}
                  <span className="capitalize">
                    {translateStatus(order.status)}
                  </span>
                </p>
              </div>
              <div className="mt-auto flex justify-end">
                <button
                  onClick={() => handleOpenDialog(order.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 focus:outline-none"
                >
                  {t("order-content.change-status")}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {dialogOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-white p-6 rounded shadow-md w-80"
          >
            <h2 className="text-xl font-bold mb-4">
              {t("order-content.change-status")}
            </h2>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none"
            >
              <option value="pending">{t("order-content.pending")}</option>
              <option value="completed">{t("order-content.completed")}</option>
              <option value="cancelled">{t("order-content.cancelled")}</option>
            </select>
            <div className="flex justify-end">
              <button
                onClick={handleCloseDialog}
                className="px-4 py-2 bg-red-500 text-white rounded mr-2 hover:bg-red-600 transition duration-200 focus:outline-none"
              >
                {t("order-content.cancel")}
              </button>
              <button
                onClick={handleStatusChange}
                disabled={!selectedStatus}
                className={`px-4 py-2 bg-green-500 text-white rounded ${
                  selectedStatus
                    ? "hover:bg-green-600"
                    : "opacity-50 cursor-not-allowed"
                } transition duration-200 focus:outline-none`}
              >
                {t("order-content.save")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OrderContent;
