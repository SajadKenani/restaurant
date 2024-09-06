import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUsers,
  faCog,
  faChartBar,
  faSignOutAlt,
  faUtensils,
  faVanShuttle,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import useTranslation from "@/utils/UseTranslation";
import { logoutUser } from "@/api/auth/authUser";

const Sidebar = ({ setActiveTab }) => {
  const router = useRouter();
  const { t, loading } = useTranslation();

  const handleLogout = async () => {
    try {
      // Call the logout API
      await logoutUser();

      // Remove tokens from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Redirect to the login page
      router.push("/auth/admin/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="h-full p-4 bg-gray-800 text-white">
      <div className="flex flex-col space-y-4">
        <button
          onClick={() => setActiveTab("dashboard")}
          className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
        >
          <FontAwesomeIcon icon={faHome} />
          <span>{t("sidebar.dashboard")}</span>
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
        >
          <FontAwesomeIcon icon={faUsers} />
          <span>{t("sidebar.users")}</span>
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
        >
          <FontAwesomeIcon icon={faCog} />
          <span>{t("sidebar.settings")}</span>
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
        >
          <FontAwesomeIcon icon={faChartBar} />
          <span>{t("sidebar.categories")}</span>
        </button>
        <button
          onClick={() => setActiveTab("items")}
          className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
        >
          <FontAwesomeIcon icon={faUtensils} />
          <span>{t("sidebar.items")}</span>
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
        >
          <FontAwesomeIcon icon={faVanShuttle} />
          <span>{t("sidebar.orders")}</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>{t("sidebar.logout")}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
