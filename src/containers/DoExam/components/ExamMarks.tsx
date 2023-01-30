import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Link } from "react-router-dom";

interface ExamMarksProps {
  totalScore: number | null;
  loading: boolean;
  onLoadTotalScore: () => void;
  hideDesc?: boolean;
  isComponent: boolean;
}
interface ExamMarksState {}

export class ExamMarks extends Component<ExamMarksProps, ExamMarksState> {
  componentDidMount(): void {
    this.props.onLoadTotalScore();
  }
  render() {
    return (
      <div className="p-3 md:p-6">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="text-3xl font-bold">Total score</div>
          <div className="text-gray-500 text-center">
            {this.props.loading === true || this.props.totalScore === null ? (
              <span className="animate__animated animate__fadeIn animate__infinite animate__slow">
                Calculating your total marks, please wait...
              </span>
            ) : this.props.hideDesc === true ? (
              ""
            ) : (
              "Dear Candidate, Thank you for attending this exam, the following is your total score"
            )}
          </div>
          <div className="mt-3">
            {this.props.loading === false && this.props.totalScore !== null ? (
              <div
                className={`flex items-center justify-center rounded-full h-48 w-48 border-4 ${
                  this.props.totalScore > 80
                    ? "border-green-500 text-green-600"
                    : this.props.totalScore >= 50
                    ? "border-primary-800 text-primary-800"
                    : "border-yellow-500 text-yellow-600"
                }  text-5xl font-extrabold animate__animated animate__bounceIn`}
              >
                {`${this.props.totalScore.toFixed(1)}%`}
              </div>
            ) : (
              <AiOutlineLoading3Quarters className="text-8xl text-yellow-500 animate-spin" />
            )}
          </div>
          {this.props.loading === false &&
            this.props.totalScore !== null &&
            this.props.isComponent === false && (
              <Link to={"/dashboard"} className="mt-5">
                <div className="bg-primary-800 hover:bg-primary-900 px-4 py-2 rounded-md cursor-pointer w-max text-white animate__animated animate__fadeIn">
                  Continue
                </div>
              </Link>
            )}
        </div>
      </div>
    );
  }
}
