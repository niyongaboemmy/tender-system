import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const TimeOutWarning = () => {
  return (
    <div className="p-2 md:p-6">
      <div className="flex flex-col items-center justify-center w-full">
        <div></div>
        <div className="font-extrabold text-3xl text-center">Time is up</div>
        <div className="text-center text-gray-500">
          Your exam time has been completed, now your exam is being submitted
        </div>
        <div className="mt-2">
          <AiOutlineLoading3Quarters className="text-6xl text-yellow-600 animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default TimeOutWarning;
