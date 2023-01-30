import React from "react";
import { RiWifiOffLine } from "react-icons/ri";

const NetworkError = () => {
  return (
    <div className="bg-red-100 rounded-md fixed bottom-1 right-1 cursor-pointer p-3 animate__animated animate__fadeIn z-50">
      <div className="w-full flex flex-row items-center gap-2">
        <div>
          <div className=" h-14 w-14 bg-red-200 rounded-full flex items-center justify-center">
            <RiWifiOffLine className="text-4xl text-red-600" />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row items-center gap-3 justify-between -mt-2">
            <div className="text-xl font-extrabold text-red-800 mt-2">
              Network disconnected
            </div>
            <div>
              <a
                href="/"
                className="truncate bg-white rounded px-2 py-1 mb-1 text-sm font-bold w-max"
              >
                Reload
              </a>
            </div>
          </div>
          <span className="text-base font-light text-red-800">
            You are offline now, Please check your network adapter and try
            again!
          </span>
        </div>
      </div>
    </div>
  );
};

export default NetworkError;
