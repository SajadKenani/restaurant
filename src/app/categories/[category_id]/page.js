"use client";
import React from "react";
import { useParams } from "next/navigation";
import CategoryListVertical from "@/components/categories/CategoryListVertical";
import ItemHero from "@/components/hero/ItemHero";
import ItemList from "@/components/items/ItemList";

const Page = () => {
  const { category_id } = useParams();

  return (
    <div className="flex flex-col bg-gradient-to-r to-lime-100/30 from-cyan-100/30 items-start ">
      <ItemHero />
      <div className="flex flex-col md:flex-row min-h-screen justify-start md:gap-2 md:justify-start w-full">
        <CategoryListVertical category_id={category_id} />
        <ItemList category_id={category_id} />
      </div>
    </div>
  );
};

export default Page;
