import React from "react";
import UR_ICON from "../../assets/logo_for_ur.png";

const AppLoading = () => {
  return (
    <div>
      <div className="h-screen bg-gray-200 overflow-y-hidden ">
        <div className="bg-primary-800 h-16 p-3 flex flex-row items-center justify-between w-full">
          <div className="flex flex-row items-center gap-2">
            <div className="h-12 w-12 rounded-full bg-primary-700 animate-pulse"></div>
            <div className="h-6 w-32 rounded-xl bg-primary-700 animate-pulse"></div>
          </div>
          <div>
            <div className="flex flex-row items-center gap-2 justify-end">
              <div className="h-10 w-10 rounded-full bg-primary-700 animate-pulse"></div>
              <div className="h-10 w-10 rounded-full bg-primary-700 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 h-full ">
          <div className="hidden col-span-2 lg:flex flex-col gap-3 bg-white p-5 h-full animate-pulse">
            {/* <div className="bg-gray-200 rounded-xl h-20 w-full animate-pulse"></div> */}
            <div className="flex flex-row items-center gap-2 w-full">
              <div className="bg-gray-200 rounded-full h-10 w-14 animate-pulse"></div>
              <div className="bg-gray-200 rounded-3xl h-10 w-full animate-pulse"></div>
            </div>
            <div className="flex flex-row items-center gap-2 w-full">
              <div className="bg-gray-200 rounded-full h-10 w-14 animate-pulse"></div>
              <div className="bg-gray-200 rounded-3xl h-10 w-full animate-pulse"></div>
            </div>
            <div className="flex flex-row items-center gap-2 w-full">
              <div className="bg-gray-200 rounded-full h-10 w-14 animate-pulse"></div>
              <div className="bg-gray-200 rounded-3xl h-10 w-full animate-pulse"></div>
            </div>
            <div className="flex flex-row items-center gap-2 w-full">
              <div className="bg-gray-200 rounded-full h-10 w-14 animate-pulse"></div>
              <div className="bg-gray-200 rounded-3xl h-10 w-full animate-pulse"></div>
            </div>
            <div className="flex flex-row items-center gap-2 w-full">
              <div className="bg-gray-200 rounded-full h-10 w-14 animate-pulse"></div>
              <div className="bg-gray-200 rounded-3xl h-10 w-full animate-pulse"></div>
            </div>
            <div className="flex flex-row items-center gap-2 w-full">
              <div className="bg-gray-200 rounded-full h-10 w-14 animate-pulse"></div>
              <div className="bg-gray-200 rounded-3xl h-10 w-full animate-pulse"></div>
            </div>
            <div className="flex flex-row items-center gap-2 w-full">
              <div className="bg-gray-200 rounded-full h-10 w-14 animate-pulse"></div>
              <div className="bg-gray-200 rounded-3xl h-10 w-full animate-pulse"></div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-10 p-5 h-full">
            <div className="grid grid-cols-12 gap-3 h-full">
              <div className="col-span-4 bg-gray-100 rounded w-full h-32 animate-pulse"></div>
              <div className="col-span-4 bg-gray-100 rounded w-full h-32 animate-pulse"></div>
              <div className="col-span-4 bg-gray-100 rounded w-full h-32 animate-pulse"></div>
              <div className="col-span-12 bg-gray-100 rounded w-full h-screen animate-pulse">
                <div className="w-full pt-20 flex flex-col items-center justify-center ga-5">
                  <div>
                    <img
                      className="h-36 w-36 mb-5 animate-pulse"
                      src={UR_ICON}
                      alt="Valuation Management System"
                    />
                  </div>
                  <div className="text-xl font-extrabold text-gray-400 animate-pulse">
                    Loading, please wait...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLoading;
