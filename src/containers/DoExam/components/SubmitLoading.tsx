import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface SubmitLoadingProps {}
interface SubmitLoadingState {}

export class SubmitLoading extends Component<
  SubmitLoadingProps,
  SubmitLoadingState
> {
  render() {
    return (
      <div className="p-3 md:p-6">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="text-3xl font-bold">Exam Completion</div>
          <div className="text-gray-500 text-center">
            <span className="animate__animated animate__fadeIn animate__infinite animate__slow">
              Submitting your exam, please wait...
            </span>
          </div>
          <div className="mt-3">
            <AiOutlineLoading3Quarters className="text-8xl text-yellow-500 animate-spin" />
          </div>
        </div>
      </div>
    );
  }
}
