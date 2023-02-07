import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  API_GetUsersDetails,
  FC_UpdatePersonalInfo,
  UserType,
} from "../../actions";
import Alert, { AlertType } from "../../components/Alert/Alert";

interface PersonalInfoProps {
  action: "VIEW" | "EDIT";
  setAction: (action: "VIEW" | "EDIT") => void;
  onUpdate: () => void;
  user: API_GetUsersDetails;
}
interface PersonalInfoState {
  names: string;
  user_phone: string;
  user_email: string;
  error: {
    type: "names" | "user_phone" | "user_email" | "main";
    msg: string;
  } | null;
  loading: boolean;
  success: string;
}

export class PersonalInfo extends Component<
  PersonalInfoProps,
  PersonalInfoState
> {
  constructor(props: PersonalInfoProps) {
    super(props);

    this.state = {
      names: this.props.user.names,
      user_email: this.props.user.user_email,
      user_phone: this.props.user.user_phone,
      error: null,
      loading: false,
      success: "",
    };
  }
  ResetForm = () => {
    this.setState({
      names: this.props.user.names,
      user_email: this.props.user.user_email,
      user_phone: this.props.user.user_phone,
      error: null,
      loading: false,
    });
  };
  UpdatePersonalInfo = () => {
    if (this.state.names === "") {
      return this.setState({
        error: {
          type: "names",
          msg: "Please fill full name",
        },
      });
    }
    if (this.state.user_phone === "") {
      return this.setState({
        error: {
          type: "user_phone",
          msg: "Please fill phone number",
        },
      });
    }
    if (this.state.user_email === "") {
      return this.setState({
        error: {
          type: "user_email",
          msg: "Please fill email",
        },
      });
    }
    // Submit here
    this.setState({ loading: true });
    FC_UpdatePersonalInfo(
      {
        user_id: this.props.user.user_id,
        names: this.state.names,
        user_email: this.state.user_email,
        user_phone: this.state.user_phone,
      },
      (
        loading: boolean,
        res: {
          type: "success" | "error";
          msg: string;
        } | null
      ) => {
        this.setState({ loading: loading });
        if (res?.type === "success") {
          // Reload profile
          this.setState({ success: res.msg });
          setTimeout(() => {
            this.props.onUpdate();
          }, 500);
        }
        if (res?.type === "error") {
          this.setState({
            error: { type: "main", msg: res.msg },
            loading: false,
          });
        }
      }
    );
  };
  render() {
    return (
      <div>
        <div className="flex flex-row items-center justify-between gap-2 mb-3">
          <div className="font-bold pl-2 text-lg">Personal Info</div>
          <div></div>
        </div>
        {/* Details */}
        {this.props.action === "VIEW" ? (
          <div className="p-2">
            <div className="flex flex-row justify-between gap-2 w-full mb-2 pb-2 border-b">
              <div className="flex flex-col">
                <span className="text-sm">Full names</span>
                <span className="text-sm font-semibold">
                  {this.props.user.names}
                </span>
              </div>
              <div className="px-3 py-1 font-bold bg-yellow-100 text-yellow-800 w-max rounded-full h-8 text-sm flex items-center justify-center">
                {this.props.user.type === UserType.BIDER
                  ? "Bidder"
                  : "Bid Provider"}
              </div>
            </div>
            <div className="flex flex-col mb-2 pb-2 border-b">
              <span className="text-sm">Phone number</span>
              <span className="text-sm font-semibold">
                {this.props.user.user_phone}
              </span>
            </div>
            <div className="flex flex-col mb-2 pb-2">
              <span className="text-sm">Email</span>
              <span className="text-sm font-semibold">
                {this.props.user.user_email}
              </span>
            </div>
            <div className="pt-6">
              <div className="flex flex-row items-center gap-2">
                {this.props.action === "VIEW" && (
                  <div
                    onClick={() => this.props.setAction("EDIT")}
                    className="bg-primary-50 text-primary-900 cursor-pointer hover:bg-primary-800 hover:text-white w-max px-3 py-2 font-bold text-sm rounded"
                  >
                    Edit profile
                  </div>
                )}
                <Link
                  to="/change-password"
                  className="bg-gray-100 text-gray-900 cursor-pointer hover:bg-primary-800 hover:text-white w-max px-3 py-2 font-bold text-sm rounded"
                >
                  Change Password
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3">
            <div className="flex flex-col mb-3">
              <span className="text-sm mb-1">Full names</span>
              <input
                type="text"
                className={`px-3 py-2 rounded-md bg-gray-100 w-full font-bold text-sm ${
                  this.state.error?.type === "names"
                    ? "border border-red-600"
                    : ""
                }`}
                value={this.state.names}
                onChange={(e) =>
                  this.setState({ names: e.target.value, error: null })
                }
                disabled={this.state.loading}
              />
              {this.state.error?.type === "names" && (
                <Alert
                  alertType={AlertType.DANGER}
                  title={this.state.error.msg}
                  close={() => this.setState({ error: null })}
                />
              )}
            </div>
            <div className="flex flex-col mb-3">
              <span className="text-sm mb-1">Phone number</span>
              <input
                type="text"
                className={`px-3 py-2 rounded-md bg-gray-100 w-full font-bold text-sm ${
                  this.state.error?.type === "user_phone"
                    ? "border border-red-600"
                    : ""
                }`}
                value={this.state.user_phone}
                onChange={(e) =>
                  this.setState({ user_phone: e.target.value, error: null })
                }
                disabled={this.state.loading}
              />
              {this.state.error?.type === "user_phone" && (
                <Alert
                  alertType={AlertType.DANGER}
                  title={this.state.error.msg}
                  close={() => this.setState({ error: null })}
                />
              )}
            </div>
            <div className="flex flex-col mb-3">
              <span className="text-sm mb-1">Email</span>
              <input
                type="text"
                className={`px-3 py-2 rounded-md bg-gray-100 w-full font-bold text-sm ${
                  this.state.error?.type === "user_email"
                    ? "border border-red-600"
                    : ""
                }`}
                value={this.state.user_email}
                onChange={(e) =>
                  this.setState({ user_email: e.target.value, error: null })
                }
                disabled={this.state.loading}
              />
              {this.state.error?.type === "user_email" && (
                <Alert
                  alertType={AlertType.DANGER}
                  title={this.state.error.msg}
                  close={() => this.setState({ error: null })}
                />
              )}
            </div>
            {this.state.error?.type === "main" && (
              <div className="mt-4">
                <Alert
                  alertType={AlertType.DANGER}
                  title={this.state.error.msg}
                  close={() => this.setState({ error: null, success: "" })}
                />
              </div>
            )}
            {this.state.success && (
              <div className="mt-4">
                <Alert
                  alertType={AlertType.SUCCESS}
                  title={this.state.success}
                  close={() => this.setState({ error: null, success: "" })}
                />
              </div>
            )}
            <div className="flex flex-row items-center gap-2 pt-6">
              <div
                onClick={() =>
                  this.state.loading === false && this.UpdatePersonalInfo()
                }
                className="bg-primary-800 text-white hover:bg-primary-900 cursor-pointer w-max px-3 py-2 font-bold text-sm rounded"
              >
                {this.state.loading === true ? (
                  <span className="animate__animated animate__fadeIn animate__infinite">
                    Loading, please wait...
                  </span>
                ) : (
                  "Update details"
                )}
              </div>
              <div
                onClick={() => {
                  this.state.loading === false && this.props.setAction("VIEW");
                  this.ResetForm();
                }}
                className="bg-gray-100 black  cursor-pointer hover:bg-primary-800 hover:text-white w-max px-3 py-2 font-bold text-sm rounded"
              >
                Cancel
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
