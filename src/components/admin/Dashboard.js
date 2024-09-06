"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ProfileCard from "./ProfileCard";
import TabContent from "./TabContent";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-1/4 bg-gray-800 text-white">
        <Sidebar setActiveTab={setActiveTab} />
      </div>
      <div className="w-3/4 p-4 space-y-4">
        <ProfileCard />
        <TabContent activeTab={activeTab} />
      </div>
    </div>
  );
};

export default Dashboard;
