import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getSettings, updateSettings } from "@/api/settings";
import { useLanguage } from "@/utils/LanguageContext";
import useTranslation from "@/utils/UseTranslation";
import { displayImageURL, getUserRole } from "@/utils/appUtils";

const Settings = () => {
  const queryClient = useQueryClient();
  const {
    data: settings,
    isLoading,
    isError,
  } = useQuery("settings", getSettings);
  const mutation = useMutation(updateSettings, {
    onSuccess: () => {
      queryClient.invalidateQueries("settings");
    },
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [siteLogo, setSiteLogo] = useState(null);
  const [siteFavicon, setSiteFavicon] = useState(null);
  const { activeLanguage } = useLanguage();
  const { t, loading } = useTranslation();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);
  }, []);

  if (isLoading || loading) return <div>{t("settings.loading")}</div>;
  if (isError) return <div>{t("settings.error")}</div>;

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      if (name === "site_logo" && userRole === "admin") {
        setSiteLogo(files[0]);
      } else if (name === "site_favicon" && userRole === "admin") {
        setSiteFavicon(files[0]);
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleEditMode = () => {
    setFormData(settings);
    setSiteLogo(null);
    setSiteFavicon(null);
    setIsEditMode(true);
  };

  const handleSave = () => {
    if (userRole !== "admin") return;

    const updatedFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      updatedFormData.append(key, formData[key]);
    });

    if (siteLogo) {
      updatedFormData.append("site_logo", siteLogo);
    }
    if (siteFavicon) {
      updatedFormData.append("site_favicon", siteFavicon);
    }

    mutation.mutate(updatedFormData, {
      onSuccess: () => {
        console.log("Update successful");
        setIsEditMode(false);
      },
      onError: (error) => {
        console.error("Error updating settings:", error);
      },
    });
  };

  const handleCancel = () => {
    setFormData(settings);
    setSiteLogo(null);
    setSiteFavicon(null);
    setIsEditMode(false);
  };

  const renderField = (label, name, type = "text") => (
    <div className="flex flex-col mb-4">
      <label className="font-semibold">{label}</label>
      {isEditMode ? (
        type === "textarea" ? (
          <textarea
            name={name}
            value={formData[name] || ""}
            onChange={handleInputChange}
            className="p-2 mt-1 border border-gray-300 rounded"
          />
        ) : type === "file" ? (
          <input
            type={type}
            name={name}
            onChange={handleInputChange}
            className="p-2 mt-1 border border-gray-300 rounded"
            disabled={userRole !== "admin"}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name] || ""}
            onChange={handleInputChange}
            className="p-2 mt-1 border border-gray-300 rounded"
          />
        )
      ) : (
        <div className="mt-1">
          {type === "checkbox"
            ? formData[name]
              ? t("settings.yes")
              : t("settings.no")
            : settings[name]}
        </div>
      )}
    </div>
  );

  const renderDisplayField = (label, value, isImage = false) => (
    <div className="flex mb-4">
      <strong className="w-full md:w-1/4 font-semibold">{label}:</strong>
      <div className="w-full md:w-3/4">
        {isImage ? (
          <img src={displayImageURL(value)} alt={label} className="mt-2 h-10" />
        ) : (
          value
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full mx-auto bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-left">
        {t("settings.title")}
      </h1>
      {isEditMode ? (
        <div className="space-y-6">
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">
              {t("settings.general.title")}
            </h2>
            {renderField(t("settings.general.siteNameEn"), "en_site_name")}
            {renderField(t("settings.general.siteNameAr"), "ar_site_name")}
            {renderField(t("settings.general.siteLogo"), "site_logo", "file")}
            {renderField(
              t("settings.general.siteDescriptionEn"),
              "en_site_description",
              "textarea"
            )}
            {renderField(
              t("settings.general.siteDescriptionAr"),
              "ar_site_description",
              "textarea"
            )}
            {renderField(t("settings.general.siteEmail"), "site_email")}
            {renderField(t("settings.general.siteContact"), "site_contact")}
            {renderField(
              t("settings.general.siteAddress"),
              "site_address",
              "textarea"
            )}
            {renderField(t("settings.general.siteURL"), "site_url")}
            {renderField(
              t("settings.general.siteFavicon"),
              "site_favicon",
              "file"
            )}
            {renderField(
              t("settings.general.siteKeywords"),
              "site_keywords",
              "textarea"
            )}
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">
              {t("settings.social.title")}
            </h2>
            {renderField(t("settings.social.facebook"), "social_facebook")}
            {renderField(t("settings.social.whatsapp"), "social_whatsapp")}
            {renderField(t("settings.social.twitter"), "social_twitter")}
            {renderField(t("settings.social.instagram"), "social_instagram")}
            {renderField(t("settings.social.linkedin"), "social_linkedin")}
            {renderField(t("settings.social.youtube"), "social_youtube")}
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">
              {t("settings.business.title")}
            </h2>
            {renderField(t("settings.business.contact"), "business_contact")}
            {renderField(t("settings.business.weekdays"), "weekdays")}
            {renderField(t("settings.business.hours"), "contact_hours")}
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">
              {t("settings.legal.title")}
            </h2>
            {renderField(
              t("settings.legal.privacyPolicy"),
              "privacy_policy_url"
            )}
            {renderField(
              t("settings.legal.termsOfService"),
              "terms_of_service_url"
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleSave}
              className={`px-4 py-2 rounded text-white ${
                userRole === "admin"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={userRole !== "admin"}
            >
              {t("settings.save")}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              {t("settings.cancel")}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-100 shadow-md p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">
              {t("settings.general.title")}
            </h2>
            {renderDisplayField(
              t("settings.general.siteNameEn"),
              settings.en_site_name
            )}
            {renderDisplayField(
              t("settings.general.siteNameAr"),
              settings.ar_site_name
            )}
            {renderDisplayField(
              t("settings.general.siteLogo"),
              settings.site_logo,
              true
            )}
            {renderDisplayField(
              t("settings.general.siteDescriptionEn"),
              settings.en_site_description
            )}
            {renderDisplayField(
              t("settings.general.siteDescriptionAr"),
              settings.ar_site_description
            )}
            {renderDisplayField(
              t("settings.general.siteEmail"),
              settings.site_email
            )}
            {renderDisplayField(
              t("settings.general.siteContact"),
              settings.site_contact
            )}
            {renderDisplayField(
              t("settings.general.siteAddress"),
              settings.site_address
            )}
            {renderDisplayField(
              t("settings.general.siteURL"),
              settings.site_url
            )}
            {renderDisplayField(
              t("settings.general.siteFavicon"),
              settings.site_favicon,
              true
            )}
            {renderDisplayField(
              t("settings.general.siteKeywords"),
              settings.site_keywords
            )}
          </div>
          <div className="bg-gray-100 shadow-md p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">
              {t("settings.social.title")}
            </h2>
            {renderDisplayField(
              t("settings.social.facebook"),
              settings.social_facebook
            )}
            {renderDisplayField(
              t("settings.social.whatsapp"),
              settings.social_whatsapp
            )}
            {renderDisplayField(
              t("settings.social.twitter"),
              settings.social_twitter
            )}
            {renderDisplayField(
              t("settings.social.instagram"),
              settings.social_instagram
            )}
            {renderDisplayField(
              t("settings.social.linkedin"),
              settings.social_linkedin
            )}
            {renderDisplayField(
              t("settings.social.youtube"),
              settings.social_youtube
            )}
          </div>
          <div className="bg-gray-100 shadow-md p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">
              {t("settings.business.title")}
            </h2>
            {renderDisplayField(
              t("settings.business.contact"),
              settings.business_contact
            )}
            {renderDisplayField(
              t("settings.business.weekdays"),
              settings.weekdays
            )}
            {renderDisplayField(
              t("settings.business.hours"),
              settings.contact_hours
            )}
          </div>
          <div className="bg-gray-100 shadow-md p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">
              {t("settings.legal.title")}
            </h2>
            {renderDisplayField(
              t("settings.legal.privacyPolicy"),
              settings.privacy_policy_url
            )}
            {renderDisplayField(
              t("settings.legal.termsOfService"),
              settings.terms_of_service_url
            )}
          </div>
          {userRole === "admin" && (
            <div className="flex justify-end">
              <button
                onClick={handleEditMode}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {t("settings.edit")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Settings;
