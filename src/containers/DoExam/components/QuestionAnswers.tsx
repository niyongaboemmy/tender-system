import React, { Component } from "react";
import {
  QuestionAnswerInterface,
  QuestionCategoryKey,
  QuestionItemInterface,
} from "../../../actions/exam.action";
import Choices from "./QuestionTypes/Choices";
import ShortAnswer from "./QuestionTypes/ShortAnswer";

interface QuestionAnswersProps {
  selectedQuestionDetails: QuestionItemInterface;
  selectAnswer: (answer: QuestionAnswerInterface) => void;
  question_category: QuestionCategoryKey;
  isAnswer: (question_id: string, answer_id: string) => boolean;
  exam_answers: QuestionAnswerInterface[];
  SetShortAnswerValue: (Question_answer: QuestionAnswerInterface) => void;
}
interface QuestionAnswersState {
  loading: boolean;
}

export class QuestionAnswers extends Component<
  QuestionAnswersProps,
  QuestionAnswersState
> {
  constructor(props: QuestionAnswersProps) {
    super(props);

    this.state = {
      loading: false,
    };
  }
  render() {
    if (this.props.question_category === QuestionCategoryKey.SHORT_ANSWER) {
      return (
        <ShortAnswer
          question_category={this.props.question_category}
          selectAnswer={this.props.selectAnswer}
          selectedQuestionDetails={this.props.selectedQuestionDetails}
          exam_answers={this.props.exam_answers}
          SetShortAnswerValue={this.props.SetShortAnswerValue}
        />
      );
    }
    return (
      <Choices
        isAnswer={this.props.isAnswer}
        question_category={this.props.question_category}
        selectAnswer={this.props.selectAnswer}
        selectedQuestionDetails={this.props.selectedQuestionDetails}
      />
    );
  }
}
