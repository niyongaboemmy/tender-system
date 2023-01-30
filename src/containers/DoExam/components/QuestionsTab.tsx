import React, { Component } from "react";
import { BsInfoCircle } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { QuestionInterface } from "../../../actions/exam.action";
import { commaFy } from "../../../utils/functions";

interface QuestionsTabProps {
  QuestionsList: QuestionInterface[];
  selectedQuestion: QuestionInterface;
  selectQuestionFn: (selectedQuestion: QuestionInterface) => void;
  hasAnswer: (question_id: string) => boolean;
  saveChanges: boolean;
  setError: (message: string) => void;
}
interface QuestionsTabState {
  showSubmitAllQuestionWarning: boolean;
}

export class QuestionsTab extends Component<
  QuestionsTabProps,
  QuestionsTabState
> {
  constructor(props: QuestionsTabProps) {
    super(props);

    this.state = {
      showSubmitAllQuestionWarning: true,
    };
  }
  componentDidMount = () => {
    setTimeout(() => {
      this.setState({ showSubmitAllQuestionWarning: false });
    }, 9000);
  };
  render() {
    return (
      <div>
        <div className="border-t pt-3 mt-3">
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="font-semibold">Questions</div>
            <div className="px-2 rounded-md  text-black text-sm">
              Total: {commaFy(this.props.QuestionsList.length)}
            </div>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-12 gap-3 bg-white rounded-xl py-3 px-2">
          {this.props.QuestionsList.map((question, q) => (
            <div className="col-span-2 flex flex-row items-center justify-center">
              <div
                key={q + 1}
                title="Click to select this question"
                onClick={() => {
                  if (this.props.saveChanges === false) {
                    this.props.selectQuestionFn(question);
                  } else {
                    this.props.setError(
                      "Please save changes before switching questions"
                    );
                  }
                }}
                className={`h-9 w-9 ${
                  this.props.hasAnswer(question.question_id) === true
                    ? this.props.selectedQuestion.question_id ===
                      question.question_id
                      ? "bg-primary-800 text-white animate__animated animate__jackInTheBox"
                      : "bg-white text-primary-900 border border-primary-700 animate__animated animate__jackInTheBox"
                    : this.props.selectedQuestion.question_id ===
                      question.question_id
                    ? "bg-yellow-600 text-white animate__animated animate__fadeIn"
                    : "bg-gray-100 border hover:border-primary-700 hover:text-primary-800 hover:bg-primary-50"
                } rounded-full text-base font-extrabold cursor-pointer flex items-center justify-center group`}
              >
                <span className={`truncate ${q >= 19 ? "text-xs" : ""}`}>{`${
                  q + 1
                }`}</span>
              </div>
            </div>
          ))}
        </div>
        {this.state.showSubmitAllQuestionWarning === true && (
          <div
            onClick={() =>
              this.setState({ showSubmitAllQuestionWarning: false })
            }
            title="Click to close the warning"
            className="bg-yellow-50 border border-yellow-300 px-2 py-2 rounded-md w-full mt-6 text-sm text-yellow-800 flex from-white items-center justify-between gap-3 cursor-pointer hover:bg-yellow-100"
          >
            <div className="flex flex-row items-center w-full gap-2">
              <div>
                <BsInfoCircle className="text-3xl" />
              </div>
              <div>All questions are required to be answered</div>
            </div>
            <div>
              <MdClose className="text-2xl" />
            </div>
          </div>
        )}
      </div>
    );
  }
}
