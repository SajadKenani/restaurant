import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { getCurrentUser } from "@/api/auth/authUser";
import useTranslation from "@/utils/UseTranslation";

const ProfileCard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <p>{t("common.loading")}</p>;
  }

  if (error) {
    return (
      <p>
        {t("common.error")}: {error.message}
      </p>
    );
  }

  console.log("User:", user);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faUserCircle}
          className="text-4xl text-gray-600"
        />
        <div className="ml-4">
          <h2 className="text-xl text-gray-600 font-bold">{user.user_name}</h2>
          <p className="text-gray-600">{user.user_email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
