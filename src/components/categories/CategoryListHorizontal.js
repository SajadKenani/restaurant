import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import { getCategories } from "@/api/category";
import "./scroll.css";

const CategoryListHorizontal = ({ category_id }) => {
  const { data: categories, isLoading } = useQuery("categories", getCategories);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    // Retrieve active category from localStorage on component mount
    const activeCategoryId = category_id;
    setActiveCategory(activeCategoryId ? parseInt(activeCategoryId) : null);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="py-4 container  flex overflow-x-auto hide-scroll-bar">
      <div className="mx-auto flex space-x-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.id}`}>
            <motion.div
              className={`flex items-center px-4 py-2 rounded-lg cursor-pointer ${
                activeCategory === category.id
                  ? "bg-yellow-600 text-white"
                  : "bg-black text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a className="block p-2 font-bold">{category.title}</a>
            </motion.div>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default CategoryListHorizontal;
