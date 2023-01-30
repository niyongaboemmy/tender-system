import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdCircleNotifications } from "react-icons/md";
import {
  GetExamQuestionByLanguage,
  QuestionAnswerInterface,
  QuestionCategoryKey,
  QuestionInterface,
  QuestionLanguages,
} from "../../../actions/exam.action";
import { QuestionAnswers } from "./QuestionAnswers";

interface QuestionDetailsProps {
  questionDetails: QuestionInterface;
  selectedLanguage: QuestionLanguages;
  selectAnswer: (answer: QuestionAnswerInterface) => void;
  question_category: QuestionCategoryKey;
  isAnswer: (question_id: string, answer_id: string) => boolean;
  GetQuestionIndex: (question_id: string) => number;
  GetNextPreviousQuestion: (question_id: string) => {
    previousIndex: number;
    nextIndex: number;
  };
  setQuestionByIndex: (index: number) => void;
  exam_answers: QuestionAnswerInterface[];
  SetShortAnswerValue: (Question_answer: QuestionAnswerInterface) => void;
  saveChanges: boolean;
  setSaveChanges: (saveChanges: boolean, question_id: string) => void;
  submitQuestionAnswer: (question_id: string) => void;
  loadingSubmittingAnswer: boolean;
}

interface QuestionDetailsState {}

export class QuestionDetails extends Component<
  QuestionDetailsProps,
  QuestionDetailsState
> {
  constructor(props: QuestionDetailsProps) {
    super(props);

    this.state = {};
  }
  render() {
    // Selected Question details
    const Question = GetExamQuestionByLanguage(
      this.props.questionDetails,
      this.props.selectedLanguage
    );
    if (Question === null) {
      return <div>No question selected</div>;
    }
    return (
      <div className="md:p-3 relative pb-8">
        <div
          className="flex flex-col gap-3"
          style={{ height: "calc(100vh - 240px)", overflowY: "auto" }}
        >
          <div className="flex flex-row items-center justify-between gap-3">
            <div className="rounded-md flex  gap-2 items-center">
              <span className="text-2xl font-bold">
                Qn
                {this.props.GetQuestionIndex(
                  this.props.questionDetails.question_id
                ) + 1}{" "}
              </span>
              <span className="bg-primary-800 text-white rounded-full px-2 py-1 text-sm w-max">
                ({this.props.questionDetails.marks} marks)
              </span>
            </div>
            {this.props.loadingSubmittingAnswer === true && (
              <div className="flex flex-row items-center justify-end gap-2 font-bold animate__animated animate__bounceIn">
                <AiOutlineLoading3Quarters className="text-yellow-500 text-3xl animate-spin" />
                <div className="animate__animated animate__fadeIn animate__infinite">
                  Saving answer...
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="text-gray-500 text-sm">
              {Question.question_title}
            </div>
            <div>{Question.question_description}</div>
            <div className="mt-6">
              <QuestionAnswers
                selectedQuestionDetails={Question}
                selectAnswer={(answer: QuestionAnswerInterface) => {
                  this.props.selectAnswer(answer);
                  this.props.setSaveChanges(
                    true,
                    this.props.questionDetails.question_id
                  );
                }}
                question_category={this.props.question_category}
                isAnswer={this.props.isAnswer}
                exam_answers={this.props.exam_answers}
                SetShortAnswerValue={(
                  Question_answer: QuestionAnswerInterface
                ) => {
                  this.props.setSaveChanges(
                    Question_answer.answer_value !== "" ? true : false,
                    this.props.questionDetails.question_id
                  );
                  this.props.SetShortAnswerValue(Question_answer);
                }}
              />
            </div>
          </div>
          {this.props.saveChanges === true && (
            <div className="mt-5 px-3  mr-5">
              {this.props.loadingSubmittingAnswer === false && (
                <div className="flex flex-row items-center justify-end relative">
                  <div
                    onClick={() =>
                      this.props.submitQuestionAnswer(
                        this.props.questionDetails.question_id
                      )
                    }
                    className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 text-base cursor-pointer w-max shadow-xl animate__animated animate__bounceIn font-bold"
                  >
                    Save changes
                  </div>
                  <div className="p-0 bg-white rounded-full absolute top-0 right-0 text-2xl -mt-3 -mr-3 flex items-center justify-center shadow-xl">
                    <MdCircleNotifications className=" text-yellow-500 text-3xl animate__animated animate__fadeIn animate__infinite animate__faster" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Next buttons */}
        <div className="w-full py-3 pb-4">
          <div className="flex flex-row items-center justify-end gap-2 font-bold">
            {this.props.saveChanges === false ? (
              <>
                <div
                  onClick={() =>
                    this.props.setQuestionByIndex(
                      this.props.GetNextPreviousQuestion(
                        this.props.questionDetails.question_id
                      ).previousIndex - 1
                    )
                  }
                  className="bg-gray-500 hover:bg-gray-600 text-white rounded px-4 py-2 text-sm cursor-pointer w-max animate__animated animate__bounceIn"
                >
                  Previous Question
                </div>
                <div
                  onClick={() =>
                    this.props.setQuestionByIndex(
                      this.props.GetNextPreviousQuestion(
                        this.props.questionDetails.question_id
                      ).nextIndex + 1
                    )
                  }
                  className="bg-primary-800 hover:bg-primary-900 text-white rounded px-4 py-2 text-sm cursor-pointer w-max animate__animated animate__bounceIn"
                >
                  Next Question
                </div>
              </>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
