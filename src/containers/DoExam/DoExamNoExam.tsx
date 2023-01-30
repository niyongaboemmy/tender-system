import React, { Component } from "react";
import { HiDocumentText } from "react-icons/hi";
import { Link } from "react-router-dom";

export class DoExamNoExam extends Component {
  render() {
    return (
      <div className="bg-white mt-3 rounded-md p-3 py-6 flex flex-col items-center justify-center w-full text-center">
        <div>
          <HiDocumentText className="text-8xl text-yellow-600" />
        </div>
        <div className="text-xl font-light">
          No exam selected or you visited wrong page
        </div>
        <div className="mt-4 flex flex-row items-center justify-center gap-2">
          <Link
            to="/dashboard"
            className="bg-gray-100 rounded-md px-3 py-2 w-max cursor-pointer hover:bg-primary-800 hover:text-white font-bold"
          >
            Bak to exams
          </Link>
        </div>
      </div>
    );
  }
}
