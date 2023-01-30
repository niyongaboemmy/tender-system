import React, { Component, Fragment } from "react";
import { HiDocumentText } from "react-icons/hi";
import { ImWarning } from "react-icons/im";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { connect } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { Auth, FC_SetShowNavigationStatus, System } from "../../actions";
import {
  BooleanEnum,
  CandidateAnswerSubmittedInterface,
  ExamInterface,
  ExamMarksGetInterface,
  FC_GetCandidateExamAnswers,
  FC_GetExamById,
  FC_GetUserTotalExamMarks,
  FC_SubmitCandidateAnswer,
  FC_SubmitCandidateExam,
  GetExamQuestionByLanguage,
  QuestionAnswerInterface,
  QuestionCategoryKey,
  QuestionInterface,
  QuestionLanguages,
} from "../../actions/exam.action";
import ExamCountDown from "../../components/ExamCountDown/ExamCountDown";
import LoadingExam from "../../components/LoadingExam/LoadingExam";
import Failed from "../../components/Messages/Failed";
import Success from "../../components/Messages/Success";
import Modal, { ModalSize, Themes } from "../../components/Modal/Modal";
import { StoreState } from "../../reducers";
import {
  DATE,
  DisableSpecialFunctionKeys,
  LeaveBrowser,
} from "../../utils/functions";
import { ExamMarks } from "./components/ExamMarks";
import { QuestionDetails } from "./components/QuestionDetails";
import { SideNav } from "./components/SideNav";
import SubmitExamWarning from "./components/SubmitExamWarning";
import { SubmitLoading } from "./components/SubmitLoading";

interface DoExamProps
  extends RouteComponentProps<{ exam_id: string | undefined }> {
  auth: Auth;
  system: System;
  FC_SetShowNavigationStatus: (status: boolean) => void;
}

interface DoExamState {
  loading: boolean;
  error: string;
  selectedExam: ExamInterface | null;
  selectedLanguage: QuestionLanguages;
  selectedQuestion: QuestionInterface | null;
  exam_answers: QuestionAnswerInterface[];
  submittedExam: boolean;
  examTotalMarks: number | null;
  loading_calculate_total_marks: boolean;
  submitExamWarning: boolean;
  loadingSubmittingAnswer: boolean;
  loadingSubmittingExam: boolean;
  saveChanges: {
    status: boolean;
    question_id: string;
  }[];
  success: string;
  redirect: boolean;
  request_fullScreen: boolean;
  exit_fullScreen: boolean;
  left_browser_area: boolean;
}

export class _DoExam extends Component<DoExamProps, DoExamState> {
  constructor(props: DoExamProps) {
    super(props);

    this.state = {
      loading: false,
      error: "",
      selectedExam: null,
      selectedLanguage: QuestionLanguages.ENG,
      selectedQuestion: null,
      exam_answers: [],
      submittedExam: false,
      examTotalMarks: null,
      loading_calculate_total_marks: false,
      submitExamWarning: false,
      loadingSubmittingAnswer: false,
      loadingSubmittingExam: false,
      saveChanges: [],
      success: "",
      redirect: false,
      request_fullScreen: true,
      exit_fullScreen: false,
      left_browser_area: false,
    };
  }
  findQuestionIndex = (question_id: string): number => {
    if (this.state.selectedExam !== null) {
      for (
        let x: number = 0;
        x < this.state.selectedExam.questions.length;
        x++
      ) {
        if (
          this.state.selectedExam.questions[x].question_id.toString() ===
          question_id.toString()
        ) {
          return x;
        }
      }
      return 0;
    }
    return 0;
  };
  GetNextPreviousQuestion = (
    question_id: string
  ): {
    previousIndex: number;
    nextIndex: number;
  } => {
    const selectedIndexPrevious: number =
      this.state.selectedQuestion !== null && this.state.selectedExam !== null
        ? this.findQuestionIndex(question_id) > 0
          ? this.findQuestionIndex(question_id)
          : this.state.selectedExam.questions.length
        : -1;

    const selectedIndexNext: number =
      this.state.selectedQuestion !== null && this.state.selectedExam !== null
        ? this.findQuestionIndex(question_id) > 0 &&
          this.findQuestionIndex(question_id) <
            this.state.selectedExam.questions.length - 1
          ? this.findQuestionIndex(question_id)
          : this.findQuestionIndex(question_id) === 0
          ? 0
          : -1
        : 0;
    return {
      previousIndex: selectedIndexPrevious,
      nextIndex: selectedIndexNext,
    };
  };
  // Get User answers
  GetUserExamAnswers = (selectedExam: ExamInterface) => {
    const exam_id = this.props.match.params.exam_id;
    if (exam_id !== undefined) {
      this.setState({ loading: true });
      FC_GetCandidateExamAnswers(
        exam_id,
        (
          loading: boolean,
          res: {
            data: QuestionAnswerInterface[];
            type: "error" | "success";
            msg: string;
          } | null
        ) => {
          this.setState({ loading: loading });
          if (res?.type === "success") {
            // Check previous selected language
            if (res.data.length > 0 && selectedExam !== null) {
              const selectedAnswer = res.data[0];
              const selectedQuestionAnswers = selectedExam.questions.find(
                (itm) => itm.question_id === selectedAnswer.question_id
              );
              if (selectedQuestionAnswers !== undefined) {
                const selectedQuestionAnswerItem =
                  selectedQuestionAnswers.question.find(
                    (itm) => itm.item_id === selectedAnswer.item_id
                  );
                if (selectedQuestionAnswerItem !== undefined) {
                  this.setState({
                    selectedLanguage: selectedQuestionAnswerItem.language,
                  });
                }
              }
            }
            this.setState({
              exam_answers: res.data,
              loading: false,
              error: "",
              success: res.data.length > 0 ? "Exam loaded successfully!" : "",
            });
          }
          if (res?.type === "error") {
            this.setState({
              exam_answers: [],
              loading: false,
              error: res.msg,
            });
          }
        }
      );
    }
  };
  // Get candidate exam
  LoadSelectedExam = () => {
    const exam_id = this.props.match.params.exam_id;
    this.setState({ loading: true });
    this.props.auth.user !== null &&
      exam_id !== undefined &&
      exam_id !== null &&
      exam_id !== "" &&
      FC_GetExamById(
        exam_id,
        (
          loading: boolean,
          res: {
            data: ExamInterface[];
            type: "error" | "success";
            msg: string;
          } | null
        ) => {
          this.setState({ loading: loading });
          if (res?.type === "success" && res.data.length > 0) {
            if (res.data[0].is_submitted === BooleanEnum.TRUE) {
              return this.setState({ redirect: true });
            }
            this.setState({
              selectedExam: res.data.length > 0 ? res.data[0] : null,
              error: res.data.length > 0 ? "" : "Exam is not found!",
              success: res.data.length > 0 ? "" : "",
              selectedQuestion:
                res.data.length > 0
                  ? res.data[0].questions.length > 0
                    ? res.data[0].questions[0]
                    : null
                  : null,
            });
            res.data.length > 0 && this.GetUserExamAnswers(res.data[0]);
          }
          if (res?.type === "error") {
            this.setState({
              selectedExam: null,
              loading: false,
              error: res.msg,
              selectedQuestion: null,
            });
          }
        }
      );
  };

  // Submit candidate answer
  SubmitCandidateAnswer = (question_id: string) => {
    // When question saved successfully!
    // this.setSaveChanges(false, question_id);

    if (this.state.selectedExam !== null && this.props.auth.user !== null) {
      this.setState({ loadingSubmittingAnswer: true, success: "", error: "" });
      var data: CandidateAnswerSubmittedInterface | null = null;
      const questionAnswerDetails = this.state.exam_answers.find(
        (itm) => itm.question_id.toString() === question_id.toString()
      );
      const questionDetails = this.state.selectedExam.questions.find(
        (itm) => itm.question_id.toString() === question_id.toString()
      );
      if (
        questionAnswerDetails !== undefined &&
        questionDetails !== undefined &&
        questionAnswerDetails.question_id.toString() ===
          questionDetails.question_id.toString()
      ) {
        const selectedQuestionAnswers = this.state.exam_answers.filter(
          (itm) => itm.question_id.toString() === question_id.toString()
        );
        if (selectedQuestionAnswers.length > 0) {
          data = {
            answers: selectedQuestionAnswers,
            exam_id: this.state.selectedExam.exam_id,
            item_id: selectedQuestionAnswers[0].item_id,
            question_id: questionAnswerDetails.question_id,
            user_id: this.props.auth.user.user_id,
          };

          FC_SubmitCandidateAnswer(
            data,
            (
              loading: boolean,
              res: {
                type: "error" | "success";
                msg: string;
              } | null
            ) => {
              this.setState({ loadingSubmittingAnswer: loading });
              if (res?.type === "success") {
                this.setState({
                  loadingSubmittingAnswer: false,
                  error: "",
                  success: "Answer saved successfully!",
                });
                this.setSaveChanges(false, question_id);
              }
              if (res?.type === "error") {
                this.setState({
                  loadingSubmittingAnswer: false,
                  error: res.msg,
                  success: "",
                });
                this.setSaveChanges(true, question_id);
              }
            }
          );
        } else {
          this.setState({
            selectedQuestion: questionDetails,
            loadingSubmittingAnswer: false,
            error: "Please provide your answer!",
            success: "",
          });
        }
      } else {
        this.setState({
          loadingSubmittingAnswer: false,
          error:
            "No answer provided, please make sure you answer the question!",
          success: "",
        });
      }
    }
  };

  // Submit candidate exam

  SubmitCandidateExam = () => {
    if (this.state.selectedExam !== null) {
      this.setState({ loadingSubmittingExam: true, loading: false });
      FC_SubmitCandidateExam(
        {
          exam_id: this.state.selectedExam.exam_id,
          is_submitted: BooleanEnum.TRUE,
        },
        (
          loading: boolean,
          res: {
            type: "error" | "success";
            msg: string;
          } | null
        ) => {
          this.setState({ loadingSubmittingExam: loading });
          if (res?.type === "success") {
            this.setState({
              loadingSubmittingExam: false,
              loading_calculate_total_marks: true,
              success: "Exam submitted successfully!",
              submittedExam: true,
              submitExamWarning: false,
              examTotalMarks: null,
              loadingSubmittingAnswer: false,
            });
            this.CalculateTotalMarks();
          }
          if (res?.type === "error") {
            this.setState({
              loadingSubmittingExam: false,
              error: res.msg,
              success: "",
              submittedExam: false,
              submitExamWarning: false,
              examTotalMarks: null,
              loadingSubmittingAnswer: false,
            });
          }
        }
      );
    }
  };

  ResetLanguage = (
    selectedQuestion: QuestionInterface,
    lang: QuestionLanguages
  ) => {
    if (GetExamQuestionByLanguage(selectedQuestion, lang) === null) {
      if (selectedQuestion.question.length > 0) {
        const selectedQuestionItem = selectedQuestion.question[0];
        this.setState({
          selectedLanguage: selectedQuestionItem.language,
        });
      }
    }
  };

  selectLanguageFn = (language: QuestionLanguages) => {
    // if (this.state.selectedQuestion !== null) {
    //   this.ResetLanguage(this.state.selectedQuestion, language);
    // } else {
    this.setState({ selectedLanguage: language });
    // }
  };

  requestFullScreen = () => {
    if (
      !document.fullscreenElement &&
      document.documentElement.requestFullscreen
    ) {
      document.documentElement.requestFullscreen();
    }
    this.setState({
      request_fullScreen: false,
      exit_fullScreen: false,
    });
  };

  exitFullScreen = () => {
    this.setState({
      request_fullScreen: false,
      exit_fullScreen: false,
    });
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  componentDidMount = () => {
    this.props.FC_SetShowNavigationStatus(false);
    // Check if left browser area
    LeaveBrowser((status: boolean) =>
      this.setState({ left_browser_area: status })
    );
    // Disable not allowed keys functions
    DisableSpecialFunctionKeys();
    // --------------------------------
    this.LoadSelectedExam();
  };

  selectQuestionFn = (selectedQuestion: QuestionInterface) => {
    // Select a question
    this.setState({ selectedQuestion: selectedQuestion });
    this.ResetLanguage(selectedQuestion, this.state.selectedLanguage);
  };

  isAnswer = (question_id: string, answer_id: string): boolean => {
    if (this.state.exam_answers.length > 0) {
      if (
        this.state.exam_answers.find(
          (itm) =>
            itm.answer_id === answer_id &&
            itm.question_id.toString() === question_id.toString()
        ) !== undefined
      ) {
        return true;
      }
    }
    return false;
  };

  hasAnswer = (question_id: string): boolean => {
    if (this.state.exam_answers.length > 0) {
      if (
        this.state.exam_answers.find(
          (itm) => itm.question_id.toString() === question_id.toString()
        ) !== undefined
      ) {
        return true;
      }
    }
    return false;
  };

  GetQuestionIndex = (question_id: string): number => {
    var response: number = 0;
    if (this.state.selectedExam !== null) {
      for (const item of this.state.selectedExam.questions) {
        if (item.question_id.toString() !== question_id.toString()) {
          response += 1;
        } else {
          return response;
        }
      }
    }
    return response;
  };

  selectAnswer = (answer: QuestionAnswerInterface) => {
    const QuestionAnswers = this.state.exam_answers.filter(
      (itm) => itm.question_id.toString() === answer.question_id.toString()
    );
    const otherQuestionsAnswers = this.state.exam_answers.filter(
      (itm) => itm.question_id.toString() !== answer.question_id.toString()
    );
    this.setState({
      exam_answers:
        this.state.exam_answers.length === 0
          ? [answer]
          : [
              ...otherQuestionsAnswers,
              ...QuestionAnswers.filter(
                (itm) =>
                  (itm.question_id.toString() !==
                    answer.question_id.toString() &&
                    itm.answer_id !== answer.answer_id) ||
                  (this.state.selectedQuestion !== null &&
                    this.state.selectedQuestion.key ===
                      QuestionCategoryKey.MULTIPLE_CHOICE &&
                    itm.answer_id !== answer.answer_id)
              ),
              ...(this.state.selectedQuestion !== null &&
              this.state.selectedQuestion.key ===
                QuestionCategoryKey.MULTIPLE_CHOICE &&
              QuestionAnswers.find(
                (test) => test.answer_id === answer.answer_id
              ) !== undefined
                ? []
                : [answer]),
            ],
    });
  };

  SetShortAnswerValue = (Question_answer: QuestionAnswerInterface) => {
    const selectedQuestionAnswer = this.state.exam_answers.find(
      (itm) =>
        itm.question_id.toString() === Question_answer.question_id.toString()
    );
    if (
      Question_answer.answer_value === "" ||
      Question_answer.answer_value.length === 0 ||
      Question_answer.answer_value === " "
    ) {
      // Clean the answer
      this.setState({
        exam_answers: [
          ...this.state.exam_answers.filter(
            (itm) =>
              itm.question_id.toString() !==
              Question_answer.question_id.toString()
          ),
        ],
      });
    } else {
      if (selectedQuestionAnswer !== undefined) {
        this.setState({
          exam_answers: [
            ...this.state.exam_answers.filter(
              (itm) =>
                itm.question_id.toString() !==
                Question_answer.question_id.toString()
            ),
            Question_answer,
          ],
        });
      } else {
        this.setState({
          exam_answers: [...this.state.exam_answers, Question_answer],
        });
      }
    }
  };

  GetTotalAnsweredQuestions = () => {
    var response: QuestionAnswerInterface[] = [];
    for (const item of this.state.exam_answers) {
      if (
        response.find(
          (itm) => itm.question_id.toString() === item.question_id.toString()
        ) === undefined
      ) {
        response = [...response, item];
      }
    }
    return response.length;
  };

  // Submit candidate exam
  SubmitCandidateExamAction = () => {
    this.setState({
      loading_calculate_total_marks: false,
      examTotalMarks: null,
      submittedExam: false,
      loadingSubmittingExam: true,
      loadingSubmittingAnswer: false,
      submitExamWarning: false,
    });
    this.SubmitCandidateExam();
  };

  // Get user exam total marks
  GetUserExamTotalMarks = () => {
    // Exit fullscreen mode
    this.exitFullScreen();
    // Show menus
    this.props.FC_SetShowNavigationStatus(true);
    // -----------------------------------------
    const User = this.props.auth.user;
    const Exam = this.state.selectedExam;
    if (User === null) {
      return this.setState({ error: "User not found!" });
    }
    if (Exam === null) {
      return this.setState({ error: "Exam not found!" });
    }
    this.setState({ loadingSubmittingExam: false });
    FC_GetUserTotalExamMarks(
      User.user_id,
      Exam.exam_id,
      (
        loading: boolean,
        res: {
          data: ExamMarksGetInterface[];
          type: "error" | "success";
          msg: string;
        } | null
      ) => {
        this.setState({ loading_calculate_total_marks: loading });
        if (
          res?.type === "success" &&
          res.data !== null &&
          res.data.length > 0
        ) {
          const selectedMark = res.data.find(
            (itm) =>
              this.props.auth.user !== null &&
              itm.user_id === this.props.auth.user.user_id
          );
          if (selectedMark !== undefined) {
            const marks =
              selectedMark.quest_marks.toString() === "0"
                ? 0
                : (parseInt(selectedMark.cand_marks as unknown as string) *
                    100) /
                  parseInt(selectedMark.quest_marks as unknown as string);
            this.setState({
              submittedExam: true,
              examTotalMarks: marks,
              loading_calculate_total_marks: false,
              loadingSubmittingExam: false,
            });
          }
        }
        if (res?.type === "error") {
          this.setState({
            submittedExam: true,
            examTotalMarks: null,
            loading_calculate_total_marks: true,
            error: res.msg,
            loadingSubmittingExam: false,
          });
        }
      }
    );
  };

  // Calculate total marks
  CalculateTotalMarks = () => {
    this.GetUserExamTotalMarks();
  };

  setSaveChanges = (saveChanges: boolean, question_id: string) =>
    this.setState({
      saveChanges: [
        ...this.state.saveChanges.filter(
          (itm) => itm.question_id.toString() !== question_id.toString()
        ),
        { question_id: question_id, status: saveChanges },
      ],
    });

  render() {
    if (this.state.redirect === true) {
      return <Redirect to={"/dashboard"} />;
    }
    // ---------------------WINDOW EVENTS----------------------

    // ** Left browser area
    if (
      this.state.left_browser_area === true &&
      this.state.submittedExam === false &&
      this.state.examTotalMarks === null
    ) {
      return (
        <div className="bg-yellow-100 w-auto mt-6 rounded-md mx-auto text-center p-5 max-w-sm animate__bounceIn">
          <div className="">
            <div className="mb-2 flex flex-row items-center justify-center w-full">
              <div className="flex items-center justify-center">
                <ImWarning className="text-8xl inline text-yellow-600 opacity-50" />
              </div>
            </div>
            <h1 className="text-3xl text-yellow-600 font-bold">
              Left exam window!{" "}
            </h1>
            <p className="mt-2 text-gray-700">
              You are required to go back to the exam in <b>Full-screen mode</b>
              (Important)
            </p>
            <button
              className=" bg-green-600 hover:bg-green-800 text-white p-3 font-bold text-md rounded-md w-full mt-3"
              onClick={() => {
                this.requestFullScreen();
                this.setState({ left_browser_area: false });
              }}
            >
              Yes, Back to exam
            </button>
          </div>
        </div>
      );
    }
    //* Request for the full screen
    if (this.state.request_fullScreen === true) {
      return (
        <div className="bg-green-100 w-auto mt-6 rounded-md mx-auto text-center p-5 max-w-sm animate__bounceIn">
          <div className="">
            <MdFullscreenExit className="text-9xl inline text-green-600 opacity-50" />
            <h1 className="text-3xl text-green-500 font-bold">
              Full-Screen mode{" "}
            </h1>
            <p className="mt-2 text-gray-700">
              You are required to go in <b>Full-screen mode</b>, to help you
              focus on your exam (Important)
            </p>
            <button
              className=" bg-green-600 hover:bg-green-800 text-white p-3 font-bold text-md rounded-md w-full mt-3"
              onClick={() => this.requestFullScreen()}
            >
              Yes, Go full screen
            </button>
          </div>
        </div>
      );
    }

    //* Exit for the full screen
    if (this.state.exit_fullScreen === true) {
      return (
        <div className="bg-blue-100 w-auto mt-6 rounded-md mx-auto text-center p-5 max-w-sm animate__bounceIn">
          <div className="">
            <MdFullscreen className="text-9xl inline text-blue-600 opacity-50" />
            <h1 className="text-3xl text-blue-600 font-bold">
              Quit Full-Screen mode
            </h1>
            <p className="mt-2 text-gray-700">
              Exam is completed, you can quit the <b>Fullscreen mode</b>
              (optional)
            </p>
            <button
              className=" bg-blue-600 text-white p-3 font-bold text-md rounded-md w-full mt-3"
              onClick={() => this.exitFullScreen()}
            >
              Exit full-screen
            </button>
          </div>
        </div>
      );
    }
    if (
      this.props.match.params.exam_id === undefined ||
      this.props.match.params.exam_id === null ||
      this.props.match.params.exam_id === ""
    ) {
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
    if (this.state.selectedExam === null || this.state.loading === true) {
      return (
        <div className="bg-white mt-3 rounded-md p-3 py-6w-full text-center mx-3 md:mx-6">
          <LoadingExam />
        </div>
      );
    }
    return (
      <Fragment>
        <div className="mx-0 md:mx-4">
          <div className="grid grid-cols-12 gap-3 w-full">
            <div className="col-span-9">
              {/* Exam title */}
              <div className="bg-gray-50 rounded-md px-3 py-2 w-full mb-2">
                <div className="flex flex-row items-center justify-between">
                  <div className="mr-3">
                    <div className="text-gray-500 text-sm">Candidate Exam</div>
                    <div className="font-bold text-lg">
                      {this.state.selectedExam.title}
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-end gap-4">
                    <div className="truncate">
                      <div className="text-xs font-light">Duration</div>
                      <div className="font-bold">
                        {this.state.selectedExam &&
                        this.state.selectedExam.duration / 60 > 1
                          ? (this.state.selectedExam.duration / 60).toFixed(0) +
                            " hours"
                          : this.state.selectedExam &&
                            (this.state.selectedExam.duration / 60).toFixed(0) +
                              " hour"}
                        {this.state.selectedExam &&
                          this.state.selectedExam.duration % 60 > 0 &&
                          ", " +
                            (this.state.selectedExam.duration % 60) +
                            " mins"}
                      </div>
                    </div>
                    <div className="truncate">
                      <div>
                        <ExamCountDown
                          datetime={
                            new Date(
                              `${DATE(
                                this.state.selectedExam.exam_date,
                                "YYYY/MM/DD"
                              )} ${this.state.selectedExam.start_time}`
                            )
                          }
                          minutes={this.state.selectedExam.duration}
                          onTimeOut={() => {
                            // this.setState({ timeOutAlert: true });
                            this.state.examTotalMarks === null &&
                              this.state.submittedExam === false &&
                              this.state.examTotalMarks === null &&
                              this.state.submitExamWarning === false &&
                              this.SubmitCandidateExamAction();
                          }}
                        />
                      </div>
                    </div>
                    {this.state.selectedExam.questions.length > 0 &&
                    this.state.selectedExam.questions.length ===
                      this.GetTotalAnsweredQuestions() &&
                    this.state.loadingSubmittingAnswer === false &&
                    this.state.loadingSubmittingExam === false &&
                    this.state.loading_calculate_total_marks === false &&
                    this.state.saveChanges.find(
                      (itm) => itm.status === true
                    ) === undefined ? (
                      <div
                        onClick={() => {
                          this.setState({ submitExamWarning: true });
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md w-max font-bold cursor-pointer animate__animated animate__bounceIn truncate"
                      >
                        Submit exam
                      </div>
                    ) : (
                      <div className="text-xl text-gray-900 text-right truncate">
                        <div className="text-sm">Answers</div>
                        <div className="-mt-1 font-bold">
                          <span className="text-yellow-600">
                            {this.GetTotalAnsweredQuestions()}
                          </span>
                          <span className="text-base">/</span>
                          <span>
                            {this.state.selectedExam.questions.length}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Exam details */}
              <div
                className="bg-gray-50 rounded-md p-3 w-full"
                style={{ height: "calc(100vh - 150px)" }}
              >
                {this.state.selectedQuestion !== null && (
                  <QuestionDetails
                    questionDetails={this.state.selectedQuestion}
                    selectedLanguage={this.state.selectedLanguage}
                    selectAnswer={this.selectAnswer}
                    question_category={this.state.selectedQuestion.key}
                    isAnswer={this.isAnswer}
                    GetQuestionIndex={this.GetQuestionIndex}
                    GetNextPreviousQuestion={this.GetNextPreviousQuestion}
                    setQuestionByIndex={(index: number) => {
                      this.state.selectedExam !== null &&
                        this.setState({
                          selectedQuestion:
                            this.state.selectedExam.questions[index],
                        });
                      this.state.selectedExam !== null &&
                        this.ResetLanguage(
                          this.state.selectedExam.questions[index],
                          this.state.selectedLanguage
                        );
                    }}
                    exam_answers={this.state.exam_answers}
                    SetShortAnswerValue={this.SetShortAnswerValue}
                    saveChanges={
                      this.state.saveChanges.find(
                        (itm) =>
                          this.state.selectedQuestion !== null &&
                          itm.question_id.toString() ===
                            this.state.selectedQuestion.question_id.toString() &&
                          itm.status === true
                      ) !== undefined
                        ? true
                        : false
                    }
                    setSaveChanges={this.setSaveChanges}
                    submitQuestionAnswer={(question_id: string) =>
                      this.SubmitCandidateAnswer(question_id)
                    }
                    loadingSubmittingAnswer={this.state.loadingSubmittingAnswer}
                  />
                )}
              </div>
            </div>
            {/* Exam questions list */}
            <div className="col-span-3">
              {this.state.selectedExam.questions.length === 0 &&
                this.state.loading === false && (
                  <div className="w-full">
                    <div className="flex flex-col items-center justify-center w-full bg-yellow-50 text-yellow-800 text-center p-3 rounded-md py-6 animate__animated animate__bounceIn">
                      <div className="text-2xl font-bold">
                        No questions found
                      </div>
                      <span className="text-sm">
                        No questions uploaded! Please wait for the administrator
                        and try to reload the page
                      </span>
                    </div>
                  </div>
                )}
              {this.state.selectedQuestion !== null && (
                <SideNav
                  QuestionsList={this.state.selectedExam.questions}
                  selectedLanguage={this.state.selectedLanguage}
                  selectedQuestion={this.state.selectedQuestion}
                  selectLanguageFn={this.selectLanguageFn}
                  selectQuestionFn={this.selectQuestionFn}
                  hasAnswer={this.hasAnswer}
                  saveChanges={
                    this.state.saveChanges.find(
                      (itm) =>
                        this.state.selectedQuestion !== null &&
                        itm.question_id.toString() ===
                          this.state.selectedQuestion.question_id.toString() &&
                        itm.status === true
                    ) !== undefined
                      ? true
                      : false
                  }
                  examDetails={this.state.selectedExam}
                  setError={(message: string) =>
                    this.setState({ error: message, success: "" })
                  }
                  setSuccess={(message: string) =>
                    this.setState({ error: "", success: message })
                  }
                />
              )}
            </div>
          </div>
        </div>
        {this.state.submittedExam === true && (
          <Modal
            backDrop={true}
            theme={Themes.default}
            close={() => {}}
            backDropClose={false}
            widthSizeClass={ModalSize.large}
            displayClose={false}
            padding={{
              title: undefined,
              body: true,
              footer: undefined,
            }}
          >
            <ExamMarks
              loading={this.state.loading_calculate_total_marks}
              onLoadTotalScore={() => this.CalculateTotalMarks()}
              totalScore={this.state.examTotalMarks}
              isComponent={false}
            />
          </Modal>
        )}
        {this.state.submitExamWarning === true &&
          this.state.loading_calculate_total_marks === false && (
            <Modal
              backDrop={true}
              theme={Themes.default}
              close={() => {}}
              backDropClose={false}
              widthSizeClass={ModalSize.medium}
              displayClose={false}
              padding={{
                title: undefined,
                body: true,
                footer: undefined,
              }}
            >
              <SubmitExamWarning
                submit={() => this.SubmitCandidateExamAction()}
                cancel={() => this.setState({ submitExamWarning: false })}
              />
            </Modal>
          )}
        {this.state.loadingSubmittingExam === true && (
          <Modal
            backDrop={true}
            theme={Themes.default}
            close={() => {}}
            backDropClose={false}
            widthSizeClass={ModalSize.medium}
            displayClose={false}
            padding={{
              title: undefined,
              body: true,
              footer: undefined,
            }}
          >
            <SubmitLoading />
          </Modal>
        )}
        {this.state.success !== "" && (
          <div className="fixed top-1 right-2" style={{ zIndex: 9 }}>
            <Success
              message={this.state.success}
              onClose={() => {
                this.setState({ error: "", success: "" });
              }}
            />
          </div>
        )}
        {this.state.error !== "" && (
          <div className="fixed top-1 right-2" style={{ zIndex: 9 }}>
            <Failed
              message={this.state.error}
              onClose={() => {
                this.setState({ error: "", success: "" });
              }}
            />
          </div>
        )}
        {/* --------------------------WINDOW EVENTS---------------------- */}
      </Fragment>
    );
  }
}

const mapStateToProps = ({
  auth,
  system,
}: StoreState): { auth: Auth; system: System } => {
  return { auth, system };
};

export const DoExam = connect(mapStateToProps, { FC_SetShowNavigationStatus })(
  _DoExam
);
