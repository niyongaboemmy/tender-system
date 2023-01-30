import React from "react";
import UR_ICON from "../../assets/logo_for_ur.png";

const MainLoading = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-5 rounded-xl bg-gray-200 p-5">
      <div>
        <img
          className="h-36 w-36 mb-3 animate-pulse"
          src={UR_ICON}
          alt="Valuation Management System"
        />
      </div>
      <div className="text-2xl font-extrabold text-gray-400 animate-pulse">
        Loading, please wait...
      </div>
    </div>
  );
};

export default MainLoading;
