import React, { Component, Fragment } from "react";
import { BsFileMedicalFill } from "react-icons/bs";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Auth, FC_SetShowNavigationStatus, System } from "../../actions";
import {
  ExamInterface,
  ExamMarksGetInterface,
  FC_GetUserExams,
  FC_GetUserTotalExamMarks,
} from "../../actions/exam.action";
import { StoreState } from "../../reducers";
import { search } from "../../utils/functions";

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
                  <div>Dashboard</div>
                  <div className="text-sm text-gray-500">
                    Choose the exam you are going to work on
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-5 bg-white rounded-md text-center text-3xl mt-6 flex flex-col items-center justify-center">
            <div>Welcome to Tendering System</div>
            <div className="flex flex-row items-center justify-center gap-2 mt-4 text-base">
              <Link
                className="bg-primary-800 hover:bg-primary-900 text-white rounded px-3 py-2"
                to={"/create-tender"}
              >
                Create new tender
              </Link>
              <Link
                className="bg-primary-100 hover:border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white rounded px-3 py-2"
                to={"/create-tender"}
              >
                Tenders list
              </Link>
            </div>
          </div>
        </div>
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
