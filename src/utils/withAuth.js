import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { verifyToken } from "@/api/auth/authUser"; // Adjust the import path as needed

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const accessToken = localStorage.getItem("accessToken");

      if (
        !accessToken ||
        accessToken === "undefined" ||
        accessToken === "null"
      ) {
        router.push("/auth/admin/login");
        return;
      }

      verifyToken(accessToken)
        .then((response) => {
          if (response.isValid) {
            try {
              const decodedToken = jwtDecode(accessToken);
              const currentTime = Date.now() / 1000;

              if (decodedToken.exp < currentTime) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                router.push("/auth/admin/login");
              } else {
                setLoading(false);
              }
            } catch (error) {
              console.error("Invalid token:", error);
              router.push("/auth/admin/login");
            }
          } else {
            router.push("/auth/admin/login");
          }
        })
        .catch((error) => {
          console.error("Error verifying token:", error);
          router.push("/auth/admin/login");
        });
    }, [router]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-cyan-700 to-indigo-800">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
