import React from "react";
import { HiQuestionMarkCircle } from "react-icons/hi";

const SubmitExamWarning = (props: {
  submit: () => void;
  cancel: () => void;
}) => {
  return (
    <div className="py-6 pt-3 px-3">
      <div className="text-center flex flex-col items-center justify-center w-full">
        <div>
          <HiQuestionMarkCircle className="text-7xl text-gray-400 animate__animated animate__bounceIn" />
        </div>
        <div className="font-bold text-xl">
          Are you sure do you want to submit the exam?
        </div>
        <div className="text-gray-500 text-sm">
          Make sure you have well checked your answers for all questions before
          confirmation
        </div>
        <div className="flex flex-row items-center justify-center gap-2 mt-4">
          <div
            onClick={() => props.cancel()}
            className="bg-gray-100 hover:bg-gray-600 hover:text-white px-3 py-2 rounded-md cursor-pointer font-bold text-sm"
          >
            Back to edit
          </div>
          <div
            onClick={() => props.submit()}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md cursor-pointer font-bold text-sm"
          >
            Yes, submit the exam
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitExamWarning;
