"use client";
import React from "react";
import { useQuery } from "react-query";
import { getSettings } from "@/api/settings";
import { useLanguage } from "@/utils/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useTranslation from "@/utils/UseTranslation";
import { displayImageURL } from "@/utils/appUtils";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faWhatsapp,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import logo from "@/../../public/images/logo3.png";

const Footer = () => {
  const { activeLanguage } = useLanguage();
  const { t, loading } = useTranslation();
  const { data: settings } = useQuery("settings", getSettings);

  // Default values if data is not available
  const defaultSiteName = "Default Site Name";
  const defaultSiteDescription = "Default site description";
  const defaultLogoURL = logo.src;
  const defaultSocialURL = "#";
  const defaultAddress = "Loading address...";
  const defaultPhone = "Loading phone...";
  const defaultEmail = "Loading email...";
  const defaultPrivacyPolicyURL = "#";
  const defaultTermsOfServiceURL = "#";

  const siteName = settings?.[`${activeLanguage}_site_name`] || defaultSiteName;
  const siteDescription =
    settings?.[`${activeLanguage}_site_description`] || defaultSiteDescription;
  const logoURL = settings
    ? displayImageURL(settings.site_logo)
    : defaultLogoURL;
  const facebookURL = settings?.social_facebook || defaultSocialURL;
  const twitterURL = settings?.social_twitter || defaultSocialURL;
  const instagramURL = settings?.social_instagram || defaultSocialURL;
  const whatsappURL = settings?.social_whatsapp || defaultSocialURL;
  const linkedinURL = settings?.social_linkedin || defaultSocialURL;
  const youtubeURL = settings?.social_youtube || defaultSocialURL;
  const privacyPolicyURL =
    settings?.privacy_policy_url || defaultPrivacyPolicyURL;
  const termsOfServiceURL =
    settings?.terms_of_service_url || defaultTermsOfServiceURL;
  const address = settings?.site_address || defaultAddress;
  const phone = settings?.site_contact || defaultPhone;
  const email = settings?.site_email || defaultEmail;

  return (
    <footer className="bg-black text-gray-300 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and About */}
          <div className="text-center md:text-left">
            <a
              href="/home"
              className="text-gray-100 flex flex-col items-center md:items-start space-y-2"
            >
              {loading ? (
                <div className="h-14 w-14 bg-gray-700 animate-pulse rounded-full" />
              ) : (
                <img
                  src={logoURL}
                  alt="Logo"
                  className="h-14 rounded-full"
                  onError={(e) => (e.target.src = defaultLogoURL)}
                />
              )}
              <span className="text-xl font-semibold">
                {loading ? (
                  <div className="h-5 w-24 bg-gray-700 animate-pulse rounded" />
                ) : (
                  siteName
                )}
              </span>
            </a>
            <div className="text-sm mt-4">
              {loading ? (
                <div className="h-3 w-full bg-gray-700 animate-pulse rounded" />
              ) : (
                <p>{siteDescription}</p>
              )}
            </div>
            <div className="flex justify-center md:justify-start mt-4 space-x-4">
              {loading ? (
                Array(6)
                  .fill(0)
                  .map((_, idx) => (
                    <div
                      key={idx}
                      className="h-6 w-6 bg-gray-700 animate-pulse rounded-full"
                    />
                  ))
              ) : (
                <>
                  <a
                    href={facebookURL}
                    className="text-gray-300 hover:text-gray-100"
                  >
                    <FontAwesomeIcon icon={faFacebook} size="2x" />
                  </a>
                  <a
                    href={twitterURL}
                    className="text-gray-300 hover:text-gray-100"
                  >
                    <FontAwesomeIcon icon={faTwitter} size="2x" />
                  </a>
                  <a
                    href={instagramURL}
                    className="text-gray-300 hover:text-gray-100"
                  >
                    <FontAwesomeIcon icon={faInstagram} size="2x" />
                  </a>
                  <a
                    href={whatsappURL}
                    className="text-gray-300 hover:text-gray-100"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} size="2x" />
                  </a>
                  <a
                    href={linkedinURL}
                    className="text-gray-300 hover:text-gray-100"
                  >
                    <FontAwesomeIcon icon={faLinkedin} size="2x" />
                  </a>
                  <a
                    href={youtubeURL}
                    className="text-gray-300 hover:text-gray-100"
                  >
                    <FontAwesomeIcon icon={faYoutube} size="2x" />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">
              {loading ? (
                <div className="h-5 w-32 bg-gray-700 animate-pulse rounded" />
              ) : (
                t("footer.quickLinks")
              )}
            </h3>
            <ul className="text-sm space-y-2">
              <li>
                {loading ? (
                  <div className="h-4 w-24 bg-gray-700 animate-pulse rounded" />
                ) : (
                  <a href="/home" className="hover:text-orange-500">
                    {t("footer.home")}
                  </a>
                )}
              </li>
              <li>
                {loading ? (
                  <div className="h-4 w-24 bg-gray-700 animate-pulse rounded" />
                ) : (
                  <a href="#about" className="hover:text-orange-500">
                    {t("footer.aboutUs")}
                  </a>
                )}
              </li>
              <li>
                {loading ? (
                  <div className="h-4 w-24 bg-gray-700 animate-pulse rounded" />
                ) : (
                  <a href="/menus" className="hover:text-orange-500">
                    {t("footer.menus")}
                  </a>
                )}
              </li>
              <li>
                {loading ? (
                  <div className="h-4 w-24 bg-gray-700 animate-pulse rounded" />
                ) : (
                  <a href="#contact" className="hover:text-orange-500">
                    {t("footer.contact")}
                  </a>
                )}
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">
              {loading ? (
                <div className="h-5 w-40 bg-gray-700 animate-pulse rounded" />
              ) : (
                t("footer.contactInformation")
              )}
            </h3>
            <div className="text-sm">
              {loading ? (
                <>
                  <div className="h-3 w-full bg-gray-700 animate-pulse rounded mb-2" />
                  <div className="h-3 w-3/4 bg-gray-700 animate-pulse rounded mb-2" />
                  <div className="h-3 w-1/2 bg-gray-700 animate-pulse rounded" />
                </>
              ) : (
                <>
                  <p>
                    {t("footer.address")}: {address}
                  </p>
                  <p>
                    {t("footer.phone")}: {phone}
                  </p>
                  <p>
                    {t("footer.email")}: {email}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Attribution */}
      <div className="mt-8 text-center text-sm border-t border-gray-700 pt-4">
        {loading ? (
          <div className="h-3 w-3/4 bg-gray-700 animate-pulse rounded mx-auto" />
        ) : (
          <>
            <a href={privacyPolicyURL} className="hover:text-orange-500">
              {t("footer.privacyPolicy")}
            </a>
            <span className="mx-2">|</span>
            <a href={termsOfServiceURL} className="hover:text-orange-500">
              {t("footer.termsOfService")}
            </a>
            <p>
              &copy; {new Date().getFullYear()} {siteName}.{" "}
              {t("footer.allRightsReserved")}.
            </p>
          </>
        )}
      </div>
    </footer>
  );
};

export default Footer;
