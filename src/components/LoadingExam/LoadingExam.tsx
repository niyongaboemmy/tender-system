import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LoadingExam = () => {
  return (
    <div className="mx-0">
      <div className="grid grid-cols-12 gap-3 w-full">
        <div className="col-span-9">
          {/* Exam title */}
          <div className="bg-gray-50 rounded-md px-2 py-2 w-full mb-2">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-5">
                <div className="text-xs font-light bg-gray-200 animate-pulse h-4 w-full rounded-full mb-2"></div>
                <div className="text-xs font-light bg-gray-200 animate-pulse h-2 w-1/2 rounded-full"></div>
              </div>
              <div className="col-span-7 flex flex-row items-center justify-end gap-2">
                <div className="text-xs font-light bg-gray-200 animate-pulse h-6 w-1/3 rounded-full"></div>
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
          {/* Exam details */}
          <div
            className="bg-gray-50 rounded-md p-3 w-full relative"
            style={{ height: "calc(100vh - 150px)" }}
          >
            <div className="p-4">
              <div className="w-full h-10 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="w-2/4 h-3 bg-gray-200 rounded-xl animate-pulse mt-6"></div>
              <div className="w-3/4 h-3 bg-gray-200 rounded-xl animate-pulse mt-3"></div>
              <div className="w-1/5 h-3 bg-gray-200 rounded-xl animate-pulse mt-3"></div>
              <div className="w-3/5 h-3 bg-gray-200 rounded-xl animate-pulse mt-3"></div>
              <div className="w-full h-3 bg-gray-200 rounded-xl animate-pulse mt-3"></div>
              <div className="w-1/2 h-3 bg-gray-200 rounded-xl animate-pulse mt-3"></div>
            </div>
            <div className=" text-gray-700 absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center text-center">
              <div className="-mt-10">
                <AiOutlineLoading3Quarters className="text-6xl animate-spin" />
              </div>
              <div className="text-base font-light mt-1 mb-10 text-gray-800 animate__animated animate__fadeIn animate__infinite">
                Loading exam, please wait...
              </div>
            </div>
          </div>
        </div>
        {/* Exam questions list */}
        <div className="col-span-3">
          <div className="h-full w-full rounded-lg bg-gray-50 p-3">
            <div className="flex flex-row items-center justify-between gap-3">
              <div className="w-full">
                <div className="w-2/3 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-1/3 h-2 mt-1 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="w-24 h-8 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
            <div className="flex flex-row items-center justify-between gap-3 mt-6">
              <div className="w-full">
                <div className="w-2/3 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-1/4 h-2 mt-1 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="w-24 h-8 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
            <div className="flex flex-row items-center justify-between gap-3 mt-6">
              <div className="w-full">
                <div className="w-full h-4 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-1/2 h-2 mt-1 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="w-24 h-8 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
            <div className="flex flex-row items-center justify-between gap-3 mt-6">
              <div className="w-full">
                <div className="w-2/3 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-1/3 h-2 mt-1 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="w-24 h-8 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingExam;
