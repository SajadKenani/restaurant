"use client";
import Dashboard from "@/components/admin/Dashboard";
import React from "react";
import withAuth from "@/utils/withAuth";

const DashboardPage = () => {
  return (
    <div className=" bg-black">
      <div className="pt-20">
        <Dashboard />
      </div>
    </div>
  );
};

export default withAuth(DashboardPage);
