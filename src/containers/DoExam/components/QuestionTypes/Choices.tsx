import React, { Component } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { FaCheckSquare } from "react-icons/fa";
import { ImCheckboxUnchecked, ImRadioUnchecked } from "react-icons/im";
import {
  QuestionAnswerInterface,
  QuestionCategoryKey,
  QuestionItemInterface,
} from "../../../../actions/exam.action";

interface ChoicesProps {
  selectedQuestionDetails: QuestionItemInterface;
  selectAnswer: (answer: QuestionAnswerInterface) => void;
  question_category: QuestionCategoryKey;
  isAnswer: (question_id: string, answer_id: string) => boolean;
}
interface ChoicesState {}

export class Choices extends Component<ChoicesProps, ChoicesState> {
  constructor(props: ChoicesProps) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <div>
        {this.props.selectedQuestionDetails.question_answers.length === 0 ? (
          <div className="text-lg font-light text-gray-500 py-3">
            No answers found!
          </div>
        ) : (
          this.props.selectedQuestionDetails.question_answers.map((item, i) => (
            <div
              key={i + 1}
              className={`flex flex-row items-center gap-3 group hover:text-primary-800 cursor-pointer px-2 py-2 rounded-md hover:bg-primary-50 w-full`}
              onClick={() => this.props.selectAnswer(item)}
            >
              <div>
                {this.props.isAnswer(item.question_id, item.answer_id) ===
                true ? (
                  <>
                    {this.props.question_category ===
                    QuestionCategoryKey.MULTIPLE_CHOICE ? (
                      <FaCheckSquare className="text-3xl text-primary-800 animate__animated animate__bounceIn -ml-1" />
                    ) : (
                      <BsCheckCircleFill className="text-2xl text-primary-800 animate__animated animate__bounceIn" />
                    )}
                  </>
                ) : (
                  <>
                    {this.props.question_category ===
                    QuestionCategoryKey.MULTIPLE_CHOICE ? (
                      <ImCheckboxUnchecked className="text-2xl text-gray-400 group-hover:text-primary-800 animate__animated animate__fadeIn" />
                    ) : (
                      <ImRadioUnchecked className="text-2xl text-gray-400 group-hover:text-primary-800 animate__animated animate__fadeIn" />
                    )}
                  </>
                )}
              </div>
              <div
                className={`${
                  this.props.isAnswer(item.question_id, item.answer_id) === true
                    ? " text-primary-900"
                    : ""
                }`}
              >
                {item.answer_value}
              </div>
            </div>
          ))
        )}
      </div>
    );
  }
}

export default Choices;
