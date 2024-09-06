import React, { useEffect, useState } from "react";
import { getOrders } from "@/api/order";
import { getCategories } from "@/api/category";
import { getUsers } from "@/api/auth/authUser";
import { getItems } from "@/api/items";
import useTranslation from "@/utils/UseTranslation";

const DashboardContent = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);

  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [errorItems, setErrorItems] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
        setLoadingOrders(false);
      } catch (err) {
        setErrorOrders(err);
        setLoadingOrders(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        setLoadingCategories(false);
      } catch (err) {
        setErrorCategories(err);
        setLoadingCategories(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
        setLoadingUsers(false);
      } catch (err) {
        setErrorUsers(err);
        setLoadingUsers(false);
      }
    };

    const fetchItems = async () => {
      try {
        const data = await getItems();
        setItems(data);
        setLoadingItems(false);
      } catch (err) {
        setErrorItems(err);
        setLoadingItems(false);
      }
    };

    fetchOrders();
    fetchCategories();
    fetchUsers();
    fetchItems();
  }, []);

  const totalOrders = orders.length;
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length;
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;
  const canceledOrders = orders.filter(
    (order) => order.status === "cancelled"
  ).length;
  const totalProfit = orders
    .filter((order) => order.status === "completed")
    .reduce((acc, order) => acc + parseFloat(order.total_amount), 0);

  const totalCategories = categories.length;
  const totalItems = items.length;

  const admins = users.filter((user) => user.user_role === "admin").length;
  const moderators = users.filter(
    (user) => user.user_role === "moderator"
  ).length;

  if (loadingOrders || loadingCategories || loadingUsers || loadingItems) {
    return <p>{t("dashboard.loading")}</p>;
  }

  if (errorOrders || errorCategories || errorUsers || errorItems) {
    return (
      <p>
        {t("dashboard.error")}{" "}
        {errorOrders?.message ||
          errorCategories?.message ||
          errorUsers?.message ||
          errorItems?.message}
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t("dashboard.overview")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-100 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">{t("dashboard.totalOrders")}</h3>
          <p className="text-3xl">{totalOrders}</p>
        </div>
        <div className="p-4 bg-green-100 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">
            {t("dashboard.completedOrders")}
          </h3>
          <p className="text-3xl">{completedOrders}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">{t("dashboard.pendingOrders")}</h3>
          <p className="text-3xl">{pendingOrders}</p>
        </div>
        <div className="p-4 bg-red-100 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">{t("dashboard.canceledOrders")}</h3>
          <p className="text-3xl">{canceledOrders}</p>
        </div>
        <div className="p-4 bg-purple-100 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">{t("dashboard.totalProfit")}</h3>
          <p className="text-3xl">${totalProfit.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-indigo-100 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">
            {t("dashboard.totalCategories")}
          </h3>
          <p className="text-3xl">{totalCategories}</p>
        </div>
        <div className="p-4 bg-pink-100 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">{t("dashboard.totalItems")}</h3>
          <p className="text-3xl">{totalItems}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">{t("dashboard.admins")}</h3>
          <p className="text-3xl">{admins}</p>
        </div>
        <div className="p-4 bg-yellow-200 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">{t("dashboard.moderators")}</h3>
          <p className="text-3xl">{moderators}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
