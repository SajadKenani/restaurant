import React, { useState, useEffect } from "react";
import {
  getUsers,
  updateUser,
  deleteUser,
  registerUser,
} from "@/api/auth/authUser";
import useTranslation from "@/utils/UseTranslation";
import {
  getUserIdFromToken,
  decryptPassword,
  getUserRole,
} from "@/utils/appUtils";

const UsersContent = () => {
  const { t, loading } = useTranslation();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    user_name: "",
    user_email: "",
    user_password: "",
    user_role: "moderator",
  });
  const [newPassword, setNewPassword] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Fetch the current user ID from the token
    const userId = getUserIdFromToken();
    setCurrentUserId(userId);

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async () => {
    try {
      const updatedUser = {
        ...editingUser,
        ...(newPassword && { user_password: newPassword }),
      };

      // Remove the user_password property if newPassword is empty
      if (!newPassword) {
        delete updatedUser.user_password;
      }

      await updateUser(editingUser.id, updatedUser);
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id ? updatedUser : user
      );
      setUsers(updatedUsers);
      setEditingUser(null);
      setNewPassword("");
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      const updatedUsers = users.filter((user) => user.id !== id);
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAddUser = async () => {
    try {
      const newUserResponse = await registerUser(newUser);
      setUsers((prevUsers) => [...prevUsers, newUserResponse]);
      setNewUser({
        user_name: "",
        user_email: "",
        user_password: "",
        user_role: "moderator",
      });
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const userRole = getUserRole();

  if (loading) {
    return <p>{t("loading")}</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t("usersManagement.title")}</h2>

      {/* Conditionally Render Add New User Section */}
      {userRole === "admin" && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">
            {t("usersManagement.addUser")}
          </h3>
          <div className="flex">
            <input
              type="text"
              name="user_name"
              value={newUser.user_name}
              onChange={handleNewUserChange}
              placeholder={t("usersManagement.name")}
              className="p-2 border border-gray-300 rounded mr-2"
            />
            <input
              type="email"
              name="user_email"
              value={newUser.user_email}
              onChange={handleNewUserChange}
              placeholder={t("usersManagement.email")}
              className="p-2 border border-gray-300 rounded mr-2"
            />
            <input
              type="password"
              name="user_password"
              value={newUser.user_password}
              onChange={handleNewUserChange}
              placeholder={t("usersManagement.password")}
              className="p-2 border border-gray-300 rounded mr-2"
            />
            <select
              name="user_role"
              value={newUser.user_role}
              onChange={handleNewUserChange}
              className="p-2 border border-gray-300 rounded mr-2"
            >
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
              {t("usersManagement.addUserButton")}
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <table className="w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">{t("usersManagement.name")}</th>
            <th className="p-2 text-left">{t("usersManagement.email")}</th>
            <th className="p-2 text-left">{t("usersManagement.role")}</th>
            <th className="p-2 text-left">{t("usersManagement.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className={`border-b ${
                user.id === currentUserId ? "bg-green-100" : ""
              }`}
            >
              <td className="p-2">{user.user_name}</td>
              <td className="p-2">{user.user_email}</td>
              <td className="p-2">{user.user_role}</td>
              <td className="p-2">
                {userRole === "admin" && user.id !== currentUserId && (
                  <>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-blue-600 hover:underline"
                    >
                      {t("usersManagement.edit")}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:underline ml-2"
                    >
                      {t("usersManagement.delete")}
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit User Dialog */}
      {editingUser && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">
              {t("usersManagement.editUserTitle")}
            </h2>
            <input
              type="text"
              name="user_name"
              value={editingUser.user_name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, user_name: e.target.value })
              }
              placeholder={t("usersManagement.name")}
              className="p-2 border border-gray-300 rounded mb-2 w-full"
            />
            <input
              type="email"
              name="user_email"
              value={editingUser.user_email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, user_email: e.target.value })
              }
              placeholder={t("usersManagement.email")}
              className="p-2 border border-gray-300 rounded mb-2 w-full"
            />
            <select
              name="user_role"
              value={editingUser.user_role}
              onChange={(e) =>
                setEditingUser({ ...editingUser, user_role: e.target.value })
              }
              className="p-2 border border-gray-300 rounded mb-2 w-full"
            >
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
            <input
              type="text"
              value={decryptPassword(editingUser.user_password)} // Decrypt password for display
              readOnly
              placeholder={t("usersManagement.oldPassword")}
              className="p-2 border border-gray-300 rounded mb-2 w-full"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t("usersManagement.newPassword")}
              className="p-2 border border-gray-300 rounded mb-2 w-full"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-red-500 text-white rounded mr-2 hover:bg-red-600 transition duration-200"
              >
                {t("usersManagement.cancel")}
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
              >
                {t("usersManagement.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersContent;
