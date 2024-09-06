"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import about1 from "@/../../public/images/about1.jpg";
import about2 from "@/../../public/images/about2.jpg";
import useTranslation from "@/utils/UseTranslation";
import { getSettings } from "@/api/settings";
import { useQuery } from "react-query";

const AboutSection = () => {
  const { t, loading: translationLoading } = useTranslation();
  const { data: settings, isLoading: settingsLoading } = useQuery(
    "settings",
    getSettings
  );

  // Default values for settings
  const defaultHours = "9:00 AM - 5:00 PM";
  const defaultWeekdays = "Mon - Fri";
  const defaultContact = "N/A";
  const defaultEmail = "N/A";

  return (
    <section className="bg-gray-100 py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="text-center md:text-left">
            {translationLoading ? (
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 animate-pulse mb-2 rounded w-40 mx-auto"></div>
                <div className="h-8 bg-gray-200 animate-pulse mb-4 rounded w-60 mx-auto"></div>
                <div className="h-6 bg-gray-200 animate-pulse mb-6 rounded w-48 mx-auto"></div>
                <div className="h-10 bg-gray-200 animate-pulse rounded w-32 mx-auto"></div>
              </div>
            ) : (
              <>
                <p className="text-yellow-600 font-semibold">
                  {t("about.our")}
                </p>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  {t("about.story")}
                  <span className="block h-1 w-20 bg-yellow-600 mt-2"></span>
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {t("about.description")}
                </p>
                <a
                  href="/menus"
                  className="inline-block py-2 px-6 border border-gray-800 text-gray-800 bg-white hover:bg-gray-200 transition duration-300"
                >
                  {t("about.explore")}
                </a>
              </>
            )}
          </div>

          {/* Image */}
          <div className="text-center">
            <div
              className="rounded-lg shadow-lg"
              style={{ width: "100%", height: "auto" }}
            >
              <img
                src={about1.src}
                alt="About Us"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="my-12"></div>

        {/* Opening Hours */}
        <div className="flex flex-wrap items-center justify-center">
          {/* Left Column (Image) */}
          <div className="w-full md:w-1/2 md:pr-4">
            <div
              className="rounded-lg shadow-lg"
              style={{ width: "100%", height: "auto" }}
            >
              <img
                src={about2.src}
                alt="Opening Hours"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>

          {/* Right Column (Text Content) */}
          <div className="w-full md:w-1/2 md:pl-4 mt-8 md:mt-0">
            <div className="text-center md:text-center">
              {settingsLoading ? (
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 animate-pulse mb-2 rounded w-48 mx-auto"></div>
                  <div className="h-6 bg-gray-200 animate-pulse mb-2 rounded w-64 mx-auto"></div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center justify-center mb-4">
                    <FontAwesomeIcon
                      icon={faClock}
                      className="text-4xl text-yellow-600 mr-3"
                    />
                    <div className="text-2xl font-bold text-gray-950">
                      {t("about.openingHours")}
                    </div>
                  </div>
                  <p className="text-gray-700 text-lg mb-6">
                    <b>{settings?.contact_hours || defaultHours}</b>
                    <br />
                    <span>{settings?.weekdays || defaultWeekdays}</span>
                    <br />
                    <br />
                    Call.{" "}
                    <b>
                      <a
                        href={`tel:${settings?.site_contact || defaultContact}`}
                      >
                        {settings?.site_contact || defaultContact}
                      </a>
                    </b>
                    <br />
                    Email.{" "}
                    <b>
                      <a
                        href={`mailto:${settings?.site_email || defaultEmail}`}
                      >
                        {settings?.site_email || defaultEmail}
                      </a>
                    </b>
                  </p>
                  <a
                    href="#"
                    className="inline-block py-3 px-8 bg-white text-gray-700 border border-gray-400 rounded-lg font-semibold hover:bg-gray-200 transition duration-300"
                  >
                    {t("about.getDirections")}
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
