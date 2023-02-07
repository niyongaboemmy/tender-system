import React, { Component } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Auth, FC_ReloadUserInfo, System } from "../../actions";
import Alert, { AlertType } from "../../components/Alert/Alert";
import LoadingComponent from "../../components/Loading/LoadingComponent";
import { StoreState } from "../../reducers";
import { CompanyDetails } from "./CompanyDetails";
import { PersonalInfo } from "./PersonalInfo";

interface ProfileProps {
  auth: Auth;
  system: System;
  FC_ReloadUserInfo: (callBack: (status: boolean) => void) => void;
}
interface ProfileState {
  editType: "PERSONAL_INFO" | "COMPANY" | null;
  loading: boolean;
  success: string;
}

class _Profile extends Component<ProfileProps, ProfileState> {
  constructor(props: ProfileProps) {
    super(props);

    this.state = {
      editType: null,
      loading: false,
      success: "",
    };
  }
  ReloadProfile = () => {
    this.setState({ loading: true });
    FC_ReloadUserInfo((status: boolean) => {
      if (status === false) {
        this.setState({
          loading: false,
          success: "Profile updated successfully!",
        });
      }
    });
  };
  render() {
    if (
      this.props.auth.user === null ||
      this.props.auth.loading === true ||
      this.state.loading === true
    ) {
      return <LoadingComponent />;
    }
    return (
      <div className="px-2 md:px-3 mt-2">
        <div>
          <div className="flex flex-row items-center justify-between gap-2 w-full mb-3">
            <div className="flex flex-row items-center gap-3">
              <div>
                <BsPersonCircle className="text-5xl font-bold text-primary-800" />
              </div>
              <div className="font-bold items-center text-2xl">
                <div>My profile</div>
                <div className="text-sm text-black font-normal">
                  You can update or modify profile info and company details
                </div>
              </div>
            </div>
            <div>
              <Link
                to="/change-password"
                className="bg-white text-primary-800 font-bold px-3 py-2 rounded cursor-pointer hover:bg-primary-800 hover:text-white"
              >
                Change Password
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-12 gap-4">
          {this.state.success !== "" && (
            <div className="bg-white p-1 col-span-12 rounded-md">
              <Alert
                alertType={AlertType.SUCCESS}
                title={this.state.success}
                close={() => this.setState({ success: "" })}
              />
            </div>
          )}
          <div className="col-span-12 md:col-span-6">
            <div className="bg-white rounded-md p-3 h-full">
              <PersonalInfo
                action={
                  this.state.editType === "PERSONAL_INFO" ? "EDIT" : "VIEW"
                }
                setAction={(action: "EDIT" | "VIEW") => {
                  if (action === "EDIT") {
                    this.setState({ editType: "PERSONAL_INFO" });
                  } else {
                    this.setState({
                      editType:
                        this.state.editType === "COMPANY"
                          ? this.state.editType
                          : null,
                    });
                  }
                }}
                onUpdate={() => {
                  // Need to reload the profile
                  this.ReloadProfile();
                }}
                user={this.props.auth.user}
              />
            </div>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="bg-white rounded-md p-3 h-full">
              <CompanyDetails
                action={this.state.editType === "COMPANY" ? "EDIT" : "VIEW"}
                setAction={(action: "EDIT" | "VIEW") => {
                  if (action === "EDIT") {
                    this.setState({ editType: "COMPANY" });
                  } else {
                    this.setState({
                      editType:
                        this.state.editType === "PERSONAL_INFO"
                          ? this.state.editType
                          : null,
                    });
                  }
                }}
                onUpdate={() => {
                  // Need to reload the profile
                  this.ReloadProfile();
                }}
                user={this.props.auth.user}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  auth,
  system,
}: StoreState): { auth: Auth; system: System } => {
  return { auth, system };
};

export const Profile = connect(mapStateToProps, { FC_ReloadUserInfo })(
  _Profile
);
