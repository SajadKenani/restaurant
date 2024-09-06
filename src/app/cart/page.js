import React from "react";
import CartList from "@/components/cart/CartList";
import CartHero from "@/components/hero/CartHero";

export default function Page() {
  return (
    <div className="flex min-h-screen bg-gradient-to-r to-white from-white flex-col items-center">
      <CartHero />
      <CartList />
    </div>
  );
}
