"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserShield } from "@fortawesome/free-solid-svg-icons";
import { authLogin } from "@/api/auth/authUser";
import { useRouter } from "next/navigation";

const Login = () => {
  const [user_email, setEmail] = useState("");
  const [user_password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberMe");
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!user_email || !user_password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const credentials = { user_email, user_password };
      const response = await authLogin(credentials);
      console.log("Login response:", credentials, response);

      // Handle successful login
      console.log("Login successful:", response);
      setError("");

      // Save email to localStorage if rememberMe is checked
      if (rememberMe) {
        localStorage.setItem("rememberMe", user_email);
      } else {
        localStorage.removeItem("rememberMe");
      }

      // Save tokens to local storage
      localStorage.setItem("accessToken", response.token);
      localStorage.setItem("refreshToken", response.refreshToken);

      router.push("/auth/admin/dashboard");
      // Redirect or perform other actions after successful login
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-cyan-700 to-indigo-800 ">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-white/50 rounded-lg shadow-md"
      >
        <div className="flex justify-center">
          <FontAwesomeIcon
            icon={faUserShield}
            className="text-4xl text-blue-600"
          />
        </div>
        <h2 className="text-2xl font-serif  font-bold text-center text-gray-900">
          Admin Login
        </h2>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
            role="alert"
          >
            {error}
          </motion.div>
        )}
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-2 border bg-white/80 text-black border-gray-300 rounded-t-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email address"
                value={user_email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="-mt-px">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full px-3 py-2 border bg-white/80 text-black border-gray-300 rounded-b-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Password"
                value={user_password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label
                htmlFor="remember-me"
                className="block ml-2 text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Have an account?
              </a>
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600/80 border border-transparent rounded-md group hover:bg-blue-700/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
