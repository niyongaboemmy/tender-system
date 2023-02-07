import axios from "axios";
import React, { Component } from "react";
import { AiFillEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import Alert, { AlertType } from "../../components/Alert/Alert";
import MainContainer from "../../components/MainContainer/MainContainer";
import { API_URL } from "../../utils/api";
import { errorToText } from "../../utils/functions";

interface ChangePasswordProps {}
interface ChangePasswordState {
  loading: boolean;
  current_password: string;
  new_password: string;
  confirm_password: string;
  formError: {
    target: string;
    msg: string;
  } | null;
  passwordDisplay: boolean;
  success: string;
}

export class ChangePassword extends Component<
  ChangePasswordProps,
  ChangePasswordState
> {
  constructor(props: ChangePasswordProps) {
    super(props);

    this.state = {
      loading: false,
      current_password: "",
      new_password: "",
      confirm_password: "",
      formError: null,
      passwordDisplay: false,
      success: "",
    };
  }
  SubmitChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState({ formError: null });
    if (this.state.current_password === "") {
      return this.setState({
        formError: {
          target: "current_password",
          msg: "Please fill current password!",
        },
      });
    }
    if (this.state.new_password === "") {
      return this.setState({
        formError: {
          target: "new_password",
          msg: "Please fill new password!",
        },
      });
    }
    if (this.state.confirm_password === "") {
      return this.setState({
        formError: {
          target: "confirm_password",
          msg: "Please fill confirm password!",
        },
      });
    }
    if (this.state.new_password !== this.state.confirm_password) {
      return this.setState({
        formError: {
          target: "confirm_password",
          msg: "Password does not match with your new password!",
        },
      });
    }
    this.setState({ loading: true, formError: null, success: "" });
    try {
      const res = await axios.post(`${API_URL}/user/change/password`, {
        newPassword: this.state.new_password,
        oldPassword: this.state.current_password,
      });
      if (res) {
        this.setState({
          success: "Password has changed successfully!",
          loading: false,
          formError: null,
        });
      }
    } catch (error: any) {
      console.log("Err: ", { ...error });
      this.setState({
        formError: { target: "main", msg: errorToText(error) },
        success: "",
        loading: false,
      });
    }
  };
  render() {
    return (
      <div className="">
        <div className="flex flex-row items-center mb-4 p-2 md:p-3 md:pb-0">
          <div className="font-extrabold text-2xl text-gray-700 flex flex-row items-center gap-2">
            <div>
              <RiLockPasswordLine className="text-5xl" />
            </div>
            <span>Change Password</span>
          </div>
        </div>
        <MainContainer className="mt-3">
          <form onSubmit={this.SubmitChangePassword} className="w-full">
            <div className="w-full md:w-2/3">
              <div className="flex flex-col gap-1 mb-5 w-full">
                <span className="font-light text-base">Current Password </span>
                <div className="relative w-full">
                  <input
                    type={
                      this.state.passwordDisplay === true ? "text" : "password"
                    }
                    value={this.state.current_password}
                    disabled={this.state.loading}
                    onChange={(e) => {
                      this.setState({
                        current_password: e.target.value,
                        formError: null,
                      });
                    }}
                    className={`border ${
                      this.state.formError?.target === "current_password"
                        ? "border-red-300"
                        : "border-primary-700"
                    } ${
                      this.state.loading === true ? "cursor-not-allowed" : ""
                    } bg-white rounded-md px-3 py-2 w-full`}
                  />
                  <div
                    onClick={() =>
                      this.setState({
                        passwordDisplay: !this.state.passwordDisplay,
                      })
                    }
                    className="absolute inset-y-0 right-0 pr-3 flex items-center leading-5 text-3xl cursor-pointer text-primary-700"
                  >
                    {this.state.passwordDisplay === false ? (
                      <AiFillEye />
                    ) : (
                      <AiOutlineEyeInvisible />
                    )}
                  </div>
                </div>
                <div>
                  {this.state.formError?.target === "current_password" && (
                    <Alert
                      alertType={AlertType.DANGER}
                      title={"Error Occurred"}
                      description={this.state.formError.msg}
                      close={() => this.setState({ formError: null })}
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1 mb-5 w-full">
                <span className="font-light text-base">New Password </span>
                <div className="relative w-full">
                  <input
                    type={
                      this.state.passwordDisplay === true ? "text" : "password"
                    }
                    value={this.state.new_password}
                    disabled={this.state.loading}
                    onChange={(e) => {
                      this.setState({
                        new_password: e.target.value,
                        formError: null,
                      });
                    }}
                    className={`border ${
                      this.state.formError?.target === "new_password"
                        ? "border-red-300"
                        : "border-primary-700"
                    } ${
                      this.state.loading === true ? "cursor-not-allowed" : ""
                    } bg-white rounded-md px-3 py-2 w-full`}
                  />
                  <div
                    onClick={() =>
                      this.setState({
                        passwordDisplay: !this.state.passwordDisplay,
                      })
                    }
                    className="absolute inset-y-0 right-0 pr-3 flex items-center leading-5 text-3xl cursor-pointer text-primary-700"
                  >
                    {this.state.passwordDisplay === false ? (
                      <AiFillEye />
                    ) : (
                      <AiOutlineEyeInvisible />
                    )}
                  </div>
                </div>
                <div>
                  {this.state.formError?.target === "new_password" && (
                    <Alert
                      alertType={AlertType.DANGER}
                      title={"Error Occurred"}
                      description={this.state.formError.msg}
                      close={() => this.setState({ formError: null })}
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1 mb-5 w-full">
                <span className="font-light text-base">Confirm Password </span>
                <div className="relative w-full">
                  <input
                    type={
                      this.state.passwordDisplay === true ? "text" : "password"
                    }
                    value={this.state.confirm_password}
                    disabled={this.state.loading}
                    onChange={(e) => {
                      this.setState({
                        confirm_password: e.target.value,
                        formError: null,
                      });
                    }}
                    className={`border ${
                      this.state.formError?.target === "confirm_password"
                        ? "border-red-300"
                        : "border-primary-700"
                    } ${
                      this.state.loading === true ? "cursor-not-allowed" : ""
                    } bg-white rounded-md px-3 py-2 w-full`}
                  />
                  <div
                    onClick={() =>
                      this.setState({
                        passwordDisplay: !this.state.passwordDisplay,
                      })
                    }
                    className="absolute inset-y-0 right-0 pr-3 flex items-center leading-5 text-3xl cursor-pointer text-primary-700"
                  >
                    {this.state.passwordDisplay === false ? (
                      <AiFillEye />
                    ) : (
                      <AiOutlineEyeInvisible />
                    )}
                  </div>
                </div>
                <div>
                  {this.state.formError?.target === "confirm_password" && (
                    <Alert
                      alertType={AlertType.DANGER}
                      title={"Error Occurred"}
                      description={this.state.formError.msg}
                      close={() => this.setState({ formError: null })}
                    />
                  )}
                </div>
              </div>
              {this.state.formError?.target === "main" && (
                <div className="w-full mb-2 -mt-2">
                  <Alert
                    alertType={AlertType.DANGER}
                    title={"Action Failed"}
                    description={this.state.formError.msg}
                    close={() => this.setState({ formError: null })}
                  />
                </div>
              )}
              {this.state.success !== "" && (
                <div className="w-full mb-2 -mt-2">
                  <Alert
                    alertType={AlertType.SUCCESS}
                    title={"Action succeeded"}
                    description={this.state.success}
                    close={() => this.setState({ success: "" })}
                  />
                </div>
              )}
              <div>
                <button
                  type="submit"
                  disabled={this.state.loading}
                  className={`px-3 py-2 rounded ${
                    this.state.loading === true
                      ? "bg-gray-300 font-bold cursor-not-allowed"
                      : "bg-primary-700 hover:bg-primary-900 text-white cursor-pointer"
                  } w-max`}
                >
                  {this.state.loading === true ? (
                    <span className="animate__animated animate__fadeIn animate__faster animate__infinite">
                      Loading, please wait...
                    </span>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </div>
            </div>
          </form>
        </MainContainer>
      </div>
    );
  }
}
