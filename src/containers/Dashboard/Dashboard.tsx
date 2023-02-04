import React, { Component, Fragment } from "react";
import { BsFileMedicalFill } from "react-icons/bs";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import {
  Auth,
  FC_SetShowNavigationStatus,
  System,
  UserType,
} from "../../actions";
import { ExamInterface } from "../../actions/exam.action";
import { StoreState } from "../../reducers";

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

  componentDidMount = () => {};

  render() {
    if (
      this.props.auth.user !== null &&
      this.props.auth.user.type === UserType.BIDER
    ) {
      return <Redirect to={"/applications"} />;
    }
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
                to={"/tenders-list"}
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
