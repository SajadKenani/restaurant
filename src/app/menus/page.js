import React from "react";
import CategoryList from "@/components/categories/CategoryList";
import MenuHero from "@/components/hero/MenuHero";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <MenuHero />
      <CategoryList />
    </div>
  );
}
