import React, { Component } from "react";
import { BsArrowRightCircleFill, BsCheckCircleFill } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import {
  ExamInterface,
  GetExamQuestionByLanguage,
  GetLanguageTitle,
  QuestionInterface,
  QuestionLanguages,
  QuestionLanguagesList,
} from "../../../actions/exam.action";
import { QuestionsTab } from "./QuestionsTab";

interface SideNavProps {
  selectedLanguage: QuestionLanguages;
  selectedQuestion: QuestionInterface;
  QuestionsList: QuestionInterface[];
  selectLanguageFn: (language: QuestionLanguages) => void;
  selectQuestionFn: (selectedQuestion: QuestionInterface) => void;
  hasAnswer: (question_id: string) => boolean;
  saveChanges: boolean;
  examDetails: ExamInterface;
  setError: (message: string) => void;
  setSuccess: (message: string) => void;
}
interface SideNavState {
  selectLanguage: boolean;
  viewExamDetails: boolean;
}

export class SideNav extends Component<SideNavProps, SideNavState> {
  constructor(props: SideNavProps) {
    super(props);

    this.state = {
      selectLanguage: false,
      viewExamDetails: true,
    };
  }
  selectQuestionFn = (question: QuestionInterface) => {
    this.props.selectQuestionFn(question);
  };
  LanguageComponent = (props: {
    title: string;
    selectedLanguage: QuestionLanguages;
    onClick: () => void;
  }) => {
    return (
      <div
        onClick={props.onClick}
        className={`flex flex-row items-center justify-between w-full px-2 py-2 ${
          props.selectedLanguage === this.props.selectedLanguage
            ? "bg-primary-800 border border-green-300 animate__animated animate__bounceIn"
            : "bg-primary-700"
        } hover:bg-primary-900 rounded-md cursor-pointer group mb-2`}
      >
        <div
          className={`${
            props.selectedLanguage === this.props.selectedLanguage
              ? "text-green-200 group-hover:text-white font-bold"
              : ""
          } pl-2`}
        >
          {props.title}{" "}
          {props.selectedLanguage === this.props.selectedLanguage ? (
            <span className="text-sm text-white font-bold">(Selected)</span>
          ) : (
            ""
          )}
        </div>
        {GetExamQuestionByLanguage(
          this.props.selectedQuestion,
          props.selectedLanguage
        ) === null ? (
          <div className="text-sm font-bold text-yellow-200 py-2 px-1">
            Not found!
          </div>
        ) : (
          <div>
            {props.selectedLanguage !== this.props.selectedLanguage ? (
              <BsArrowRightCircleFill className="text-3xl" />
            ) : (
              <BsCheckCircleFill className="text-3xl text-green-300 group-hover:text-white" />
            )}
          </div>
        )}
      </div>
    );
  };
  componentDidMount = () => {
    setTimeout(() => {
      this.setState({ viewExamDetails: false });
    }, 2000);
  };
  render() {
    return (
      <div
        className="bg-gray-50 rounded-md p-3 w-full"
        style={{ height: "calc(100vh - 80px)", overflowY: "auto" }}
      >
        <div className="w-full mb-3">
          <div className="flex flex-row items-center mb-2 w-full justify-between gap-2 pb-3 border-b">
            <div className="pl-1">
              <div className="font-bold text-black">Instructions</div>
              <div className="text-sm text-gray-500 font-light flex flex-row items-center gap-1">
                <span>Start time:</span>
                <div className="bg-primary-100 text-primary-900 rounded-md px-1 text-xs font-bold">
                  {this.props.examDetails.start_time}
                </div>
              </div>
            </div>
            <div
              onClick={() =>
                this.setState({ viewExamDetails: !this.state.viewExamDetails })
              }
              className={`flex flex-row items-center justify-end ${
                this.state.viewExamDetails === true
                  ? "bg-red-100 text-red-700 hover:bg-red-600 hover:text-white"
                  : "bg-gray-100 text-black hover:bg-primary-800 hover:text-white animate__animated animate__bounceIn"
              } rounded-md text-sm pl-3 py-2 px-3 cursor-pointer group`}
            >
              <div className="font-bold">
                {this.state.viewExamDetails === true ? "Close" : "Open"}
              </div>
            </div>
          </div>
          {this.state.viewExamDetails === true && (
            <div className="bg-white rounded-md p-2 w-full h-auto mb-3 animate__animated animate__fadeIn">
              {/* {this.props.examDetails.exam_description} */}
              <ol className="flex flex-col gap-2 text-sm text-gray-600 hover:text-primary-900">
                <li className="flex flex-row items-center gap-2">
                  <div className="h-6 w-6 font-bold flex items-center justify-center rounded-full bg-primary-800 text-white">
                    1
                  </div>
                  <span>Don't leave the browser window</span>
                </li>
                <li className="flex flex-row items-center gap-2">
                  <div className="h-6 w-6 font-bold flex items-center justify-center rounded-full bg-primary-800 text-white">
                    2
                  </div>
                  <span>Copy, cut, and paste is not allowed</span>
                </li>
                <li className="flex flex-row items-center gap-2">
                  <div className="h-6 w-6 font-bold flex items-center justify-center rounded-full bg-primary-800 text-white">
                    3
                  </div>
                  <span>Mobile phones are prohibited</span>
                </li>
                <li className="flex flex-row items-center gap-2">
                  <div className="h-6 w-6 font-bold flex items-center justify-center rounded-full bg-primary-800 text-white">
                    4
                  </div>
                  <span>All questions are required</span>
                </li>
              </ol>
            </div>
          )}
        </div>
        {/* ----------------------------------------- */}
        <div className="w-full relative">
          <div className="flex flex-row items-center mb-3 w-full justify-between gap-2">
            <div className="pl-1">
              <div className="font-bold">Language</div>
              <div className="text-xs text-gray-500 font-light">
                Preferred language
              </div>
            </div>
            <div
              onClick={() => this.setState({ selectLanguage: true })}
              className="flex flex-row items-center justify-end text-primary-900 border border-primary-700 rounded-md pl-3 py-1 cursor-pointer group hover:bg-primary-800 hover:text-white hover:border-primary-800"
            >
              <div className="font-bold">
                {GetLanguageTitle(this.props.selectedLanguage)}
              </div>
              <div>
                <MdOutlineKeyboardArrowDown className="text-2xl text-primary-800 group-hover:text-white" />
              </div>
            </div>
          </div>
          {/* Open select language */}
          {this.state.selectLanguage === true && (
            <div
              className="bg-primary-800 w-full absolute left-0 right-0 top-11 rounded-lg animate__animated animate__fadeInUp animate__faster shadow-xl"
              style={{ zIndex: 9 }}
            >
              <div className="bg-primary-900 text-white font-extrabold flex flex-row items-center justify-between w-full p-2 rounded-t-lg">
                <div className="pl-2">Choose language</div>
                <div
                  onClick={() => this.setState({ selectLanguage: false })}
                  className="px-2 rounded-md py-1 bg-red-100 text-red-700 hover:text-white hover:bg-red-700 w-max cursor-pointer"
                >
                  Close
                </div>
              </div>
              <div className="text-white p-2">
                {QuestionLanguagesList.map((lang, l) => (
                  <this.LanguageComponent
                    key={l + 1}
                    selectedLanguage={lang.key}
                    title={lang.title}
                    onClick={() => {
                      this.props.selectLanguageFn(lang.key);
                      setTimeout(() => {
                        this.setState({ selectLanguage: false });
                        this.props.setSuccess(
                          "Language Change to " + lang.title + " Successfully!"
                        );
                      }, 500);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <QuestionsTab
          QuestionsList={this.props.QuestionsList}
          selectedQuestion={this.props.selectedQuestion}
          selectQuestionFn={this.selectQuestionFn}
          hasAnswer={this.props.hasAnswer}
          saveChanges={this.props.saveChanges}
          setError={this.props.setError}
        />
      </div>
    );
  }
}
