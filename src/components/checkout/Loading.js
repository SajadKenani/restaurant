import React from "react";

const Loading = () => {
  return (
    <div className="container mx-auto py-10 p-4">
      <div className="grid gap-8">
        <div className="grid gap-2 w-full p-8 bg-gray-200 rounded-lg">
          <div className="w-full h-8 bg-gray-300 rounded-md mb-4"></div>
          <div className="w-full h-8 bg-gray-300 rounded-md mb-4"></div>
          <div className="w-full h-8 bg-gray-300 rounded-md mb-4"></div>
          <div className="w-full h-8 bg-gray-300 rounded-md"></div>
        </div>
        <div className="w-full p-8 bg-gray-200 rounded-lg">
          <div className="w-full h-8 bg-gray-300 rounded-md mb-4"></div>
          <div className="w-full h-8 bg-gray-300 rounded-md mb-4"></div>
          <div className="w-full h-8 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
