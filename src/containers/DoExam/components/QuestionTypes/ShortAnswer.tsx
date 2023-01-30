import React, { Component } from "react";
import {
  QuestionAnswerInterface,
  QuestionCategoryKey,
  QuestionItemInterface,
} from "../../../../actions/exam.action";

interface ShortAnswerProps {
  selectedQuestionDetails: QuestionItemInterface;
  selectAnswer: (answer: QuestionAnswerInterface) => void;
  question_category: QuestionCategoryKey;
  exam_answers: QuestionAnswerInterface[];
  SetShortAnswerValue: (Question_answer: QuestionAnswerInterface) => void;
}
interface ShortAnswerState {
  loading: boolean;
  answer: string;
}

export const GetShortAnswerValue = (answers: QuestionAnswerInterface[]) => {
  if (answers.length === 0) {
    return "";
  }
  return answers[0].answer_value;
};

export const GetShortAnswerDetails = (answers: QuestionAnswerInterface[]) => {
  if (answers.length === 0) {
    return null;
  }
  return answers[0];
};

export class ShortAnswer extends Component<ShortAnswerProps, ShortAnswerState> {
  constructor(props: ShortAnswerProps) {
    super(props);

    this.state = {
      loading: false,
      answer: GetShortAnswerValue(
        this.props.exam_answers.filter(
          (itm) =>
            itm.question_id === this.props.selectedQuestionDetails.question_id
        )
      ),
    };
  }
  componentDidMount(): void {
    this.setState({
      answer: GetShortAnswerValue(
        this.props.exam_answers.filter(
          (itm) =>
            itm.question_id === this.props.selectedQuestionDetails.question_id
        )
      ),
    });
  }
  render() {
    const questionAnswerDetails = GetShortAnswerDetails(
      this.props.selectedQuestionDetails.question_answers
    );
    const selectedAddedValue = GetShortAnswerValue(
      this.props.exam_answers.filter(
        (itm) =>
          itm.question_id === this.props.selectedQuestionDetails.question_id
      )
    );
    return (
      <div>
        {this.props.selectedQuestionDetails.question_answers.length === 0 ? (
          <div className="text-lg font-light text-gray-500 py-3">
            No answers found!
          </div>
        ) : (
          this.props.selectedQuestionDetails.question_answers.map((item, i) => (
            <textarea
              key={i + 1}
              className={`${
                this.state.answer !== "" && this.state.answer !== " "
                  ? "border-2 border-primary-800"
                  : "border border-gray-400"
              } rounded-md w-full p-3 text-primary-900`}
              style={{ minHeight: "200px" }}
              value={selectedAddedValue}
              onChange={(e) => {
                questionAnswerDetails !== null &&
                  this.setState({ answer: e.target.value });
                questionAnswerDetails !== null &&
                  this.props.SetShortAnswerValue({
                    question_id: questionAnswerDetails.question_id,
                    answer_id: questionAnswerDetails.answer_id,
                    answer_value: e.target.value,
                    is_correct: questionAnswerDetails.is_correct,
                    item_id: questionAnswerDetails.item_id,
                  });
              }}
            ></textarea>
          ))
        )}
      </div>
    );
  }
}

export default ShortAnswer;
