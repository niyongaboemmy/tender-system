import React, { Component, Fragment } from "react";
import { BsFileMedicalFill } from "react-icons/bs";
import { MdAirplay, MdAlarmOn } from "react-icons/md";
import { RiSearchLine } from "react-icons/ri";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Auth, FC_SetShowNavigationStatus, System } from "../../actions";
import {
  BooleanEnum,
  ExamInterface,
  ExamMarksGetInterface,
  FC_GetUserExams,
  FC_GetUserTotalExamMarks,
} from "../../actions/exam.action";
import Alert, { AlertType } from "../../components/Alert/Alert";
import LoadingComponent from "../../components/Loading/LoadingComponent";
import Modal, { ModalSize, Themes } from "../../components/Modal/Modal";
import { StoreState } from "../../reducers";
import { DATE, search } from "../../utils/functions";
import { ExamMarks } from "../DoExam/components/ExamMarks";

interface DashboardProps {
  auth: Auth;
  system: System;
  FC_SetShowNavigationStatus: (status: boolean) => void;
}
interface DashboardState {
  loading: boolean;
  exams: ExamInterface[] | null;
  error: string;
  searchData: string;
  selectedExam: ExamInterface | null;
  loadingMarks: boolean;
  totalMarks: number | null;
}

export class _Dashboard extends Component<DashboardProps, DashboardState> {
  constructor(props: DashboardProps) {
    super(props);

    this.state = {
      loading: false,
      exams: null,
      searchData: "",
      error: "",
      selectedExam: null,
      loadingMarks: false,
      totalMarks: null,
    };
  }
  LoadExamsList = () => {
    this.setState({ loading: true });
    this.props.auth.user !== null &&
      FC_GetUserExams(
        (
          loading: boolean,
          res: {
            data: ExamInterface[];
            type: "error" | "success";
            msg: string;
          } | null
        ) => {
          this.setState({ loading: loading });
          if (res?.type === "success") {
            this.setState({
              exams: res.data,
              loading: false,
              error: "",
            });
          }
          if (res?.type === "error") {
            this.setState({
              exams: [],
              loading: false,
              // error: res.msg,
            });
          }
        }
      );
  };

  // Get User total marks
  GetUserExamTotalMarks = () => {
    const User = this.props.auth.user;
    const Exam = this.state.selectedExam;
    if (User === null) {
      return this.setState({ error: "User not found!" });
    }
    if (Exam === null) {
      return this.setState({ error: "Exam not found!" });
    }
    this.setState({ loadingMarks: true, loading: false });
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
        this.setState({ loadingMarks: loading });
        if (res?.type === "success" && res.data !== null) {
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
              loadingMarks: false,
              loading: false,
              totalMarks: marks,
            });
          } else {
            this.setState({
              loadingMarks: false,
              loading: false,
              totalMarks: 0,
              error: "Your marks are not found!",
            });
          }
        }
        if (res?.type === "error") {
          this.setState({
            loadingMarks: false,
            loading: false,
            error: res.msg,
            totalMarks: 0,
          });
        }
      }
    );
  };

  GetFilteredData = (data: ExamInterface[]): ExamInterface[] => {
    return search(data, this.state.searchData) as ExamInterface[];
  };

  VerifyTime = (date: string) => {
    var today = new Date();
    var examDate = new Date(date);
    console.log("TEST TIME: ", {
      exam_date: examDate,
      today: today,
    });
    return examDate <= today ? true : false;
  };

  componentDidMount = () => {
    if (this.props.system.showNavigation === false) {
      this.props.FC_SetShowNavigationStatus(true);
    }
    this.LoadExamsList();
  };

  render() {
    return (
      <Fragment>
        <div className="mx-0 md:mx-4">
          <div>
            <div className="flex flex-row items-center justify-between gap-2 w-full my-3">
              <div className="flex flex-row items-center gap-2">
                <div>
                  <BsFileMedicalFill className="text-5xl font-bold text-primary-800" />
                </div>
                <div className="font-bold items-center text-2xl">
                  <div>List of exams</div>
                  <div className="text-sm text-gray-500">
                    Choose the exam you are going to work on
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center justify-end gap-3 w-full md:w-1/2 lg:w-1/3">
                <div className="w-full relative">
                  <input
                    type={"search"}
                    className="bg-gray-100 px-3 py-2 pl-10 w-full text-base rounded-md"
                    disabled={this.state.loading}
                    value={this.state.searchData}
                    onChange={(e) =>
                      this.setState({ searchData: e.target.value })
                    }
                    placeholder={"Search..."}
                  />
                  <RiSearchLine className="absolute text-primary-800 text-2xl top-2 left-2" />
                </div>
                {this.state.exams !== null && this.state.loading === false && (
                  <div className="flex flex-col items-end">
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="font-extrabold -mt-1">
                      {this.state.exams.length}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {this.state.error !== "" && (
              <div className="my-4 border border-white rounded-lg">
                <Alert
                  alertType={AlertType.DANGER}
                  title={this.state.error}
                  close={() => {
                    this.setState({ error: "" });
                  }}
                />
              </div>
            )}
            {this.state.loading === true || this.state.exams === null ? (
              <LoadingComponent />
            ) : (
              <div className="mt-6">
                {this.state.exams.length === 0 ? (
                  <div className="flex flex-col items-center justify-center w-full bg-gray-100 p-4 py-9 rounded-md my-4">
                    <div>
                      <RiSearchLine className="text-5xl text-gray-300" />
                    </div>
                    <div className="text-center text-lg font-light text-gray-500">
                      No exams found!
                    </div>
                  </div>
                ) : (
                  <div>
                    {this.GetFilteredData(this.state.exams).length === 0 ? (
                      <div className="flex flex-col items-center justify-center w-full bg-gray-100 p-4 py-9 rounded-md my-4">
                        <div>
                          <RiSearchLine className="text-5xl text-gray-300" />
                        </div>
                        <div className="text-center text-lg font-light text-gray-500">
                          No result found!
                        </div>
                      </div>
                    ) : (
                      this.GetFilteredData(this.state.exams).map((item, i) => (
                        <div
                          key={i + 1}
                          className="mb-3 bg-gray-50 rounded-lg p-2 border border-white hover:border-primary-700 w-full group cursor-pointer hover:bg-primary-50 hover:text-primary-900 group"
                          onClick={() => this.setState({ selectedExam: item })}
                        >
                          <div className="grid grid-cols-12 gap-3 w-full">
                            <div className="col-span-10">
                              <div className="flex flex-row items-center w-full gap-4 truncate">
                                <div>
                                  <div className="h-28 w-28 rounded-lg bg-gray-200 group-hover:bg-white flex items-center justify-center">
                                    <MdAlarmOn className="text-7xl text-gray-400 group-hover:text-primary-900" />
                                  </div>
                                </div>
                                <div className="flex flex-col truncate">
                                  <div className="text-lg font-semibold">
                                    {item.title}
                                  </div>
                                  <div className="text-sm font-light text-gray-500 group-hover:text-black w-full truncate">
                                    {item.exam_description}
                                  </div>
                                  <div className="flex flex-row items-center gap-2 mt-3 text-sm">
                                    <span className="text-gray-500">
                                      Exam date:
                                    </span>
                                    <span className="text-black">
                                      {DATE(item.exam_date)}
                                    </span>
                                  </div>
                                  <div className="flex flex-row items-center gap-2 mt-1 text-sm">
                                    <span className="text-gray-500 group-hover:text-primary-800">
                                      Start time:
                                    </span>
                                    <div className="bg-gray-500 text-white group-hover:bg-primary-800 px-2 rounded-full font-bold">
                                      {item.start_time}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 flex flex-col justify-center items-end pr-3">
                              <div className="px-3 py-2 bg-primary-700 text-white group-hover:bg-primary-900 rounded-md w-max">
                                Open exam
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {this.state.selectedExam !== null && (
          <Modal
            backDrop={true}
            theme={Themes.success}
            close={() =>
              this.setState({
                selectedExam: null,
                error: "",
                loadingMarks: false,
              })
            }
            backDropClose={true}
            widthSizeClass={ModalSize.large}
            displayClose={true}
            padding={{
              title: true,
              body: true,
              footer: undefined,
            }}
            title={
              <div className="text-xl">
                <div className="font-extrabold text-white">
                  {this.state.selectedExam.title}
                </div>
              </div>
            }
          >
            {this.state.error !== "" ? (
              <div className="-mt-4 mb-5">
                <Alert
                  alertType={AlertType.DANGER}
                  title={this.state.error}
                  close={() => {
                    this.setState({ error: "", selectedExam: null });
                  }}
                />
              </div>
            ) : this.state.selectedExam.is_submitted === BooleanEnum.TRUE ? (
              <div className="bg-gray-50 rounded-lg -mt-2 animate__animated anima__fadeIn">
                <ExamMarks
                  loading={this.state.loadingMarks}
                  onLoadTotalScore={() => this.GetUserExamTotalMarks()}
                  totalScore={this.state.totalMarks}
                  hideDesc={false}
                  isComponent={true}
                />
              </div>
            ) : (
              <div className="p-2 pt-5 -mt-3">
                <div className="flex flex-col mb-4">
                  <div className=" font-bold text-sm mb-2">
                    Exam description
                  </div>
                  <div className="text-gray-500 text-sm">
                    {this.state.selectedExam.exam_description}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row w-full mt-2 border-t pt-4 border-b pb-4">
                  <div className="w-full flex flex-col">
                    <span className=" font-bold text-sm truncate text-gray-500">
                      Exam date
                    </span>
                    <div className="text-xl font-bold text-black">
                      <span>{DATE(this.state.selectedExam.exam_date)}</span>
                    </div>
                  </div>
                  <div className="w-full flex flex-col">
                    <span className=" font-bold text-sm truncate text-gray-500">
                      Start time
                    </span>
                    <div className="text-xl font-bold text-black">
                      <span>{this.state.selectedExam.start_time}</span>
                    </div>
                  </div>
                </div>
                {/* Rules and instructions */}
                <div className="py-3 pb-6 border-b">
                  <div className="font-bold mb-3">Instructions</div>
                  <ol className="grid grid-cols-12 gap-2 text-sm text-gray-600 hover:text-primary-900">
                    <li className="flex flex-row items-center gap-2 col-span-12 md:col-span-6">
                      <div className="h-6 w-6 font-bold flex items-center justify-center rounded-full bg-primary-800 text-white">
                        1
                      </div>
                      <span>Don't leave the browser window</span>
                    </li>
                    <li className="flex flex-row items-center gap-2 col-span-12 md:col-span-6">
                      <div className="h-6 w-6 font-bold flex items-center justify-center rounded-full bg-primary-800 text-white">
                        2
                      </div>
                      <span>Copy, cut, and paste is not allowed</span>
                    </li>
                    <li className="flex flex-row items-center gap-2 col-span-12 md:col-span-6">
                      <div className="h-6 w-6 font-bold flex items-center justify-center rounded-full bg-primary-800 text-white">
                        3
                      </div>
                      <span>Mobile phones are prohibited</span>
                    </li>
                    <li className="flex flex-row items-center gap-2 col-span-12 md:col-span-6">
                      <div className="h-6 w-6 font-bold flex items-center justify-center rounded-full bg-primary-800 text-white">
                        4
                      </div>
                      <span>All questions are required</span>
                    </li>
                  </ol>
                </div>
                <div className="mt-6 flex flex-row justify-between gap-3 w-full">
                  <div className="flex flex-col justify-center rounded-lg">
                    <span className=" font-bold text-sm truncate">
                      Exam duration (Minutes)
                    </span>
                    <div className="text-5xl font-bold text-primary-800">
                      <span>{this.state.selectedExam.duration}</span>
                    </div>
                  </div>

                  {this.VerifyTime(
                    `${DATE(this.state.selectedExam.exam_date, "YYYY/MM/DD")} ${
                      this.state.selectedExam.start_time
                    }`
                  ) === false ? (
                    <div className="bg-yellow-100 text-yellow-700 font-bold text-center w-max px-3 py-2 rounded-md cursor-not-allowed h-10 animate-pulse">
                      Waiting for exam start time
                    </div>
                  ) : this.state.selectedExam.is_open === BooleanEnum.TRUE ? (
                    <div className="flex flex-col items-end justify-center">
                      <div className="text-sm text-yellow-600 mb-2 font-semibold text-right">
                        If you continue, the system will start to count down!
                      </div>
                      <div className="relative">
                        <Link
                          to={`/do-exam/${this.state.selectedExam.exam_id}`}
                          className="flex flex-row items-center justify-center gap-2 px-3 py-2 font-bold rounded-md w-max bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                        >
                          <div>
                            <MdAirplay className="text-2xl" />
                          </div>
                          <span>Start exam</span>
                        </Link>
                        <div className="absolute right-0 top-0 h-3 w-3 rounded-full bg-yellow-600 animate-ping border border-yellow-600 -mt-1 -mr-1"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-row items-center justify-center gap-2 px-3 py-2 font-bold rounded-md w-max bg-gray-400 hover:bg-gray-500 text-white cursor-not-allowed h-10 mt-2">
                      <span>Not open</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Modal>
        )}
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

export const Dashboard = connect(mapStateToProps, {
  FC_SetShowNavigationStatus,
})(_Dashboard);
