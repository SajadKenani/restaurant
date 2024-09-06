import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getCategories } from "@/api/category";
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "@/api/items";
import { useLanguage } from "@/utils/LanguageContext";
import useTranslation from "@/utils/UseTranslation";
import { displayImageURL } from "@/utils/appUtils";

const ItemContent = () => {
  const queryClient = useQueryClient();
  const { activeLanguage } = useLanguage();
  const { t, loading } = useTranslation();

  const initialFormData = {
    category_id: 1,
    en_item_name: "",
    ar_item_name: "",
    en_item_description: "",
    ar_item_description: "",
    img: null,
    item_price: 0,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [existingImgUrl, setExistingImgUrl] = useState("");

  const {
    data: items = [],
    isLoading: itemsLoading,
    isError: itemsError,
    refetch: refetchItems,
  } = useQuery("items", getItems, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery("categories", getCategories, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  const createItemMutation = useMutation(createItem, {
    onSuccess: () => {
      queryClient.invalidateQueries("items");
      setFormData(initialFormData);
    },
  });

  const updateItemMutation = useMutation(updateItem, {
    onSuccess: () => {
      queryClient.invalidateQueries("items");
      setEditMode(false);
      setEditItemId(null);
      setFormData(initialFormData);
      setExistingImgUrl("");
    },
    onSettled: () => {
      setEditMode(false);
      setEditItemId(null);
      refetchItems();
    },
  });

  const deleteItemMutation = useMutation(deleteItem, {
    onSuccess: () => {
      queryClient.invalidateQueries("items");
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
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    await createItemMutation.mutate(formDataToSend);
  };

  const handleEdit = useCallback(async (id) => {
    try {
      const item = await getItemById(id);
      setFormData({
        category_id: item.category_id,
        en_item_name: item.en_item_name,
        ar_item_name: item.ar_item_name,
        en_item_description: item.en_item_description,
        ar_item_description: item.ar_item_description,
        img: null,
        item_price: item.item_price,
      });
      setExistingImgUrl(item.item_img_url);
      setEditMode(true);
      setEditItemId(id);
      console.log("Item fetched for edit:", item);
    } catch (error) {
      console.error("Error fetching item for edit:", error);
    }
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (editItemId) {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      await updateItemMutation.mutate({
        id: editItemId,
        formData: formDataToSend,
      });
    } else {
      console.error("editItemId is not set");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteItemMutation.mutate(id);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const closeDialog = () => {
    setEditMode(false);
    setEditItemId(null);
    setFormData(initialFormData);
    setExistingImgUrl("");
  };

  if (itemsLoading || categoriesLoading || loading) {
    return <p>Loading...</p>;
  }

  if (itemsError || categoriesError) {
    return <p>Error fetching data...</p>;
  }

  // const displayImageURL = (item) => {
  //   return `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${item.item_img_url}`;
  // };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category[`${activeLanguage}_title`] : "";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("item-content.title")}</h1>

      <form
        onSubmit={editMode ? handleUpdate : handleCreate}
        className="mb-8 bg-white p-6 shadow-md rounded-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="category_id"
              className="block text-sm font-semibold mb-2"
            >
              {t("item-content.category")}:
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              required
              className="w-full p-3 border text-black border-gray-300 rounded-lg"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category[`${activeLanguage}_title`]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="en_item_name"
              className="block text-sm font-semibold mb-2"
            >
              {t("item-content.en-name")}:
            </label>
            <input
              id="en_item_name"
              type="text"
              name="en_item_name"
              value={formData.en_item_name}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="ar_item_name"
              className="block text-sm font-semibold mb-2"
            >
              {t("item-content.ar-name")}:
            </label>
            <input
              id="ar_item_name"
              type="text"
              name="ar_item_name"
              value={formData.ar_item_name}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="col-span-2">
            <label
              htmlFor="en_item_description"
              className="block text-sm font-semibold mb-2"
            >
              {t("item-content.en-description")}:
            </label>
            <textarea
              id="en_item_description"
              name="en_item_description"
              value={formData.en_item_description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg"
            ></textarea>
          </div>
          <div className="col-span-2">
            <label
              htmlFor="ar_item_description"
              className="block text-sm font-semibold mb-2"
            >
              {t("item-content.ar-description")}:
            </label>
            <textarea
              id="ar_item_description"
              name="ar_item_description"
              value={formData.ar_item_description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="item_img_url"
              className="block text-sm font-semibold mb-2"
            >
              {t("item-content.img-url")}:
            </label>
            <input
              id="item_img_url"
              type="file"
              name="img"
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="item_price"
              className="block text-sm font-semibold mb-2"
            >
              {t("item-content.price")}:
            </label>
            <input
              id="item_price"
              type="number"
              name="item_price"
              value={formData.item_price}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className={`px-6 py-3 rounded-lg ${
              editMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {editMode ? t("item-content.update") : t("item-content.create")}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 shadow-md rounded-lg flex flex-col justify-between"
          >
            <div>
              {item.item_img_url && (
                <img
                  src={displayImageURL(item.item_img_url)}
                  alt={item.en_item_name}
                  className="mb-2 w-full rounded-lg"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <h2 className="text-xl font-semibold mb-2">
                {item[`${activeLanguage}_item_name`]}
              </h2>
              <p className="mb-4">
                {item[`${activeLanguage}_item_description`]}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                {getCategoryName(item.category_id)}
              </p>
              <p className="text-lg font-bold mb-4">{item.item_price} IQD</p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => handleEdit(item.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                {t("item-content.edit")}
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                {t("item-content.delete")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {editMode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="edit_category_id"
                    className="block text-sm font-semibold mb-2"
                  >
                    {t("item-content.category")}:
                  </label>
                  <select
                    id="edit_category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category[`${activeLanguage}_title`]}
                      </option>
                    ))}
                  </select>
                  <label
                    htmlFor="edit_en_item_name"
                    className="block text-sm font-semibold mb-2"
                  >
                    {t("item-content.en-name")}:
                  </label>
                  <input
                    id="edit_en_item_name"
                    type="text"
                    name="en_item_name"
                    value={formData.en_item_name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="edit_ar_item_name"
                    className="block text-sm font-semibold mb-2"
                  >
                    {t("item-content.ar-name")}:
                  </label>
                  <input
                    id="edit_ar_item_name"
                    type="text"
                    name="ar_item_name"
                    value={formData.ar_item_name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="edit_item_price"
                    className="block text-sm font-semibold mb-2"
                  >
                    {t("item-content.price")}:
                  </label>
                  <input
                    id="edit_item_price"
                    type="number"
                    name="item_price"
                    value={formData.item_price}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit_en_item_description"
                    className="block text-sm font-semibold mb-2"
                  >
                    {t("item-content.en-description")}:
                  </label>
                  <textarea
                    id="edit_en_item_description"
                    name="en_item_description"
                    value={formData.en_item_description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                  <label
                    htmlFor="edit_ar_item_description"
                    className="block text-sm font-semibold mb-2"
                  >
                    {t("item-content.ar-description")}:
                  </label>
                  <textarea
                    id="edit_ar_item_description"
                    name="ar_item_description"
                    value={formData.ar_item_description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label
                    htmlFor="edit_item_img_url"
                    className="block text-sm font-semibold mb-2"
                  >
                    {t("item-content.img-url")}:
                  </label>
                  {existingImgUrl && (
                    <img
                      src={displayImageURL(existingImgUrl)}
                      alt="Existing"
                      className="mb-2 w-full rounded-lg object-cover h-24"
                    />
                  )}
                  <input
                    id="edit_item_img_url"
                    type="file"
                    name="img"
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
                >
                  {t("item-content.cancel")}
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  {t("item-content.update")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemContent;
