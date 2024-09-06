import crypto from "crypto";
import { jwtDecode } from "jwt-decode";

// Function to retrieve access token from localStorage
export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};
// Function to decode JWT token and extract user role
export const getUserRole = () => {
  const token = getAccessToken();
  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.user_role; // Assuming `user_role` is the field containing the role
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

export const getUserIdFromToken = () => {
  const token = getAccessToken();
  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.id; // Assuming `user_id` is the field containing the user ID
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

export const displayImageURL = (value) => {
  return `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${value}`;
};

export const decryptPassword = (encryptedData) => {
  const secret_key = process.env.NEXT_PUBLIC_SECRET_KEY;
  const key = Buffer.from(secret_key, "hex");
  const algorithm = "aes-256-cbc";
  const [ivHex, encryptedPasswordHex] = encryptedData.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedPassword = Buffer.from(encryptedPasswordHex, "hex");

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decryptedPassword = decipher.update(encryptedPassword, "hex", "utf8");
  decryptedPassword += decipher.final("utf8");
  return decryptedPassword;
};
