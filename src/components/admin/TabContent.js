// components/TabContent.js
import React from "react";
import DashboardContent from "./content/DashboardContent";
import UsersContent from "./content/UsersContent";
import Settings from "./content/SettingsContent";
import CategoryContent from "./content/CategoryContent";
import ItemContent from "./content/ItemContent";
import OrderContent from "./content/OrderContent";

const TabContent = ({ activeTab }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-black">
      {activeTab === "dashboard" && <DashboardContent />}
      {activeTab === "users" && <UsersContent />}
      {activeTab === "settings" && <Settings />}
      {activeTab === "categories" && <CategoryContent />}
      {activeTab === "items" && <ItemContent />}
      {activeTab === "orders" && <OrderContent />}
    </div>
  );
};

export default TabContent;
