import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/api/category";
import { useLanguage } from "@/utils/LanguageContext";
import useTranslation from "@/utils/UseTranslation";
import { displayImageURL } from "@/utils/appUtils";

const CategoryContent = () => {
  const queryClient = useQueryClient();
  const { activeLanguage } = useLanguage();
  const { t, loading } = useTranslation();

  // Fetch categories using React Query
  const {
    data: categories = [],
    isLoading,
    isError,
    refetch: refetchCategories,
  } = useQuery("categories", getCategories);

  const [formData, setFormData] = useState({
    en_title: "",
    ar_title: "",
    img: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [existingImgUrl, setExistingImgUrl] = useState(""); // For displaying existing image

  // Mutations for creating and updating categories
  const createCategoryMutation = useMutation(createCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
      setFormData({ en_title: "", ar_title: "", img: null });
    },
  });

  const updateCategoryMutation = useMutation(updateCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
      setEditMode(false);
      setEditCategoryId(null);
      setFormData({ en_title: "", ar_title: "", img: null });
      setExistingImgUrl(""); // Clear the existing image URL after update
    },
    onSettled: () => {
      setEditMode(false);
      setEditCategoryId(null);
      refetchCategories(); // Refetch categories to reflect updates immediately
    },
  });

  const deleteCategoryMutation = useMutation(deleteCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
    },
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "img") {
      setFormData((prevData) => ({
        ...prevData,
        img: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("en_title", formData.en_title);
    formDataToSend.append("ar_title", formData.ar_title);
    formDataToSend.append("img", formData.img);
    await createCategoryMutation.mutate(formDataToSend);
  };

  const handleEdit = async (id) => {
    try {
      const category = await getCategoryById(id);
      setFormData({
        en_title: category.en_title,
        ar_title: category.ar_title,
        img: null, // Reset img field
      });
      setExistingImgUrl(category.img_url); // Set existing image URL
      setEditMode(true);
      setEditCategoryId(id);
    } catch (error) {
      console.error("Error fetching category for edit:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (editCategoryId) {
      const formDataToSend = new FormData();
      formDataToSend.append("en_title", formData.en_title);
      formDataToSend.append("ar_title", formData.ar_title);
      formDataToSend.append("img", formData.img);
      await updateCategoryMutation.mutate({
        id: editCategoryId,
        formData: formDataToSend,
      });
    } else {
      console.error("editCategoryId is not set");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategoryMutation.mutate(id);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const closeDialog = () => {
    setEditMode(false);
    setEditCategoryId(null);
    setFormData({ en_title: "", ar_title: "", img: null });
    setExistingImgUrl(""); // Clear the existing image URL
  };

  if (loading || isLoading) {
    return <p>Loading...</p>;
  }

  // const displayImageURL = (category) => {
  //   return `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${category.img_url}`;
  // };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {t("admin-category.category-management")}
      </h1>

      {/* Form for creating categories */}
      <form
        onSubmit={handleCreate}
        className="mb-4 bg-white p-4 shadow-md rounded-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              {t("admin-category.en-title")}:
            </label>
            <input
              type="text"
              name="en_title"
              value={formData.en_title}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              {t("admin-category.ar-title")}:
            </label>
            <input
              type="text"
              name="ar_title"
              value={formData.ar_title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              {t("admin-category.img-url")}:
            </label>
            <input
              type="file"
              name="img"
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t("admin-category.create")}
          </button>
        </div>
      </form>

      {/* List of categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-gray-100 p-4 rounded-lg shadow-md"
          >
            <h2 className="text-lg font-semibold mb-2">
              {category[`${activeLanguage}_title`]}
            </h2>
            {category.img_url && (
              <img
                src={displayImageURL(category.img_url)}
                alt={category.en_title}
                className="mb-2 w-full rounded-lg"
                style={{ height: "200px", objectFit: "cover" }}
              />
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(category.id)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                {t("admin-category.edit")}
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                {t("admin-category.delete")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popup dialog for editing category */}
      {editMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">
              {t("admin-category.edit-category")}
            </h2>
            <form
              onSubmit={handleUpdate}
              className="mb-4 bg-white p-4 shadow-md rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">
                    {t("admin-category.en-title")}:
                  </label>
                  <input
                    type="text"
                    name="en_title"
                    value={formData.en_title}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">
                    {t("admin-category.ar-title")}:
                  </label>
                  <input
                    type="text"
                    name="ar_title"
                    value={formData.ar_title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">
                    {t("admin-category.img-url")}:
                  </label>
                  {existingImgUrl && (
                    <img
                      src={displayImageURL(existingImgUrl)}
                      alt="Existing"
                      className="mb-2 w-full rounded-lg"
                      style={{ height: "100px", objectFit: "cover" }}
                    />
                  )}
                  <input
                    type="file"
                    name="img"
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  {t("admin-category.cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {t("admin-category.update")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryContent;
