"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faUser,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import LocalSwitcher from "@/utils/local-switcher";
import { useQuery } from "react-query";
import { getSettings } from "@/api/settings";
import useTranslation from "@/utils/UseTranslation";
import { useLanguage } from "@/utils/LanguageContext";
import { displayImageURL } from "@/utils/appUtils";
import logo from "@/../../public/images/logo3.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, loading: translationLoading } = useTranslation();
  const { activeLanguage } = useLanguage();

  const {
    data: settings,
    isLoading: settingsLoading,
    isError,
  } = useQuery("settings", getSettings);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerStyle = {
    fontFamily: "Dancing Script",
  };

  const defaultSiteName = "Default Site Name";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      className={`navbar absolute top-0 left-0 right-0 z-50 py-2 px-6 shadow-md ${
        isScrolled ? "bg-black/80" : "bg-black/20"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-100 flex items-center">
          <a href="/" className="text-gray-100 flex items-center space-x-2">
            {(settingsLoading || isError) && (
              <div className="animate-spin bg-transparent rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-300"></div>
            )}
            {!settingsLoading && !isError && settings && (
              <>
                <img
                  src={displayImageURL(settings.site_logo)}
                  alt="Logo"
                  className="h-14 rounded-full"
                  onError={(e) => (e.target.src = logo.src)}
                />
                <span className="text-lg" style={headerStyle}>
                  {settings[`${activeLanguage}_site_name`] || defaultSiteName}
                </span>
              </>
            )}
          </a>
        </div>
        <div className="hidden lg:flex items-center space-x-6 text-lg">
          <NavItem
            href="/"
            text={t("navbar.home") || "Home"}
            loading={translationLoading}
          />
          <NavItem
            href="/menus"
            text={t("navbar.menus") || "Menus"}
            loading={translationLoading}
          />
          <LocalSwitcher />
          <NavItem
            href="/cart"
            icon={faShoppingCart}
            text={t("navbar.cart") || "Cart"}
            loading={translationLoading}
          />
          <NavItem
            href="/auth/admin/login"
            icon={faUser}
            text={t("navbar.login") || "Login"}
            loading={translationLoading}
          />
        </div>
        <div className="lg:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-gray-100 focus:outline-none z-50"
          >
            <FontAwesomeIcon
              icon={isMenuOpen ? faTimes : faBars}
              size="lg z-50"
            />
          </button>
        </div>
      </div>
      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black bg-opacity-80 z-40 transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-gray-100 text-xl">
          <NavItem
            href="/home"
            text={t("navbar.home") || "Home"}
            loading={translationLoading}
            onClick={toggleMenu}
          />
          <NavItem
            href="/menus"
            text={t("navbar.menus") || "Menus"}
            loading={translationLoading}
            onClick={toggleMenu}
          />
          <LocalSwitcher />
          <NavItem
            href="/cart"
            icon={faShoppingCart}
            text={t("navbar.cart") || "Cart"}
            loading={translationLoading}
            onClick={toggleMenu}
          />
          <NavItem
            href="/auth/admin/login"
            icon={faUser}
            text={t("navbar.login") || "Login"}
            loading={translationLoading}
            onClick={toggleMenu}
          />
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ href, text, icon, loading, onClick }) => (
  <a
    href={href}
    className="text-gray-100 flex items-center space-x-2 hover:text-orange-500"
    onClick={onClick}
  >
    {loading ? (
      <div className="animate-spin bg-transparent rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-300"></div>
    ) : (
      <>
        {icon && <FontAwesomeIcon icon={icon} />}
        <span>{text || "Loading..."}</span>
      </>
    )}
  </a>
);

export default Header;
