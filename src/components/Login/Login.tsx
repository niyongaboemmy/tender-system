import React, { Component } from "react";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlineLoading3Quarters,
  AiOutlineLogin,
} from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Auth, FC_GetSystemInfo, FC_Login, System } from "../../actions";
import { StoreState } from "../../reducers";
import Alert, { AlertType } from "../Alert/Alert";

interface LoginProps {
  auth: Auth;
  system: System;
  FC_Login: (
    data: {
      username: string;
      password: string;
    },
    CallbackFunc: Function
  ) => void;
  FC_GetSystemInfo: (callback: (loading: boolean) => void) => void;
  isComponent: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
interface LoginState {
  redirect: boolean;
  username: string;
  password: string;
  loading: boolean;
  error: {
    target: "username" | "password" | "main";
    msg: string;
  } | null;
  passwordDisplay: boolean;
}

class _Login extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);

    this.state = {
      redirect: false,
      username: "",
      password: "",
      loading: false,
      error: null,
      passwordDisplay: false,
    };
  }
  LoginFn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.state.username === "") {
      return this.setState({
        error: {
          target: "username",
          msg: "Please fill phone number or email",
        },
      });
    }
    if (this.state.password === "") {
      return this.setState({
        error: {
          target: "password",
          msg: "Please fill password",
        },
      });
    }
    if (this.state.username !== "" && this.state.password !== "") {
      this.setState({ loading: true });
      this.props.FC_Login(
        { username: this.state.username, password: this.state.password },
        (status: boolean, msg: string) => {
          status === false &&
            this.setState({
              error: {
                target: "main",
                msg: msg,
              },
              loading: false,
              redirect: false,
            });
          if (status === true) {
            this.props.system.basic_info === null &&
              this.props.FC_GetSystemInfo((loading_status: boolean) => {
                this.setState({ loading: loading_status });
                loading_status === true &&
                  this.props.system.basic_info !== null &&
                  this.setState({ redirect: true });
              });
            this.props.onSuccess();
          }
        }
      );
    }
  };
  render() {
    return (
      <div
        className={`bg-white w-full ${
          this.props.isComponent === true ? "" : "md:w-3/5 lg:w-2/5"
        }  rounded-lg`}
      >
        <div
          className={`w-full ${
            this.props.isComponent === true ? "p-2" : "p-3 px-5 md:py-8 md:px-8"
          }`}
        >
          <div className="flex flex-row items-center gap-3 ">
            <div>
              <FaUserCircle className="text-3xl text-primary-800" />
            </div>
            <div className="text-xl font-bold">User Login</div>
          </div>
          <div className="mt-8 text-gray-700">
            <form onSubmit={this.LoginFn}>
              <div className="flex flex-col">
                <div className="mb-1">Username</div>
                <input
                  type="text"
                  className={`w-full ${
                    this.state.error?.target === "username"
                      ? "bg-white border border-red-600 text-red-700"
                      : "bg-gray-100 text-black"
                  } px-5 py-3 rounded-md font-bold`}
                  disabled={this.state.loading}
                  onChange={(e) =>
                    this.setState({ username: e.target.value, error: null })
                  }
                />
                {this.state.error?.target === "username" && (
                  <div className="mt-2">
                    <Alert
                      alertType={AlertType.DANGER}
                      title={this.state.error.msg}
                      close={() => this.setState({ error: null })}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col mt-6">
                <div className="mb-1">Password</div>
                <div className="relative w-full">
                  <input
                    type={
                      this.state.passwordDisplay === false ? "password" : "text"
                    }
                    className={`w-full ${
                      this.state.error?.target === "password"
                        ? "bg-white border border-red-600 text-red-700"
                        : "bg-gray-100 text-black"
                    } px-5 py-3 rounded-md font-bold`}
                    disabled={this.state.loading}
                    onChange={(e) =>
                      this.setState({ password: e.target.value, error: null })
                    }
                  />
                  {this.state.passwordDisplay === false ? (
                    <AiFillEyeInvisible
                      className="text-3xl text-gray-500 cursor-pointer absolute top-2 right-2"
                      onClick={() => this.setState({ passwordDisplay: true })}
                    />
                  ) : (
                    <AiFillEye
                      className="text-3xl text-primary-800 cursor-pointer absolute top-2 right-2"
                      onClick={() => this.setState({ passwordDisplay: false })}
                    />
                  )}
                </div>
                {this.state.error?.target === "password" && (
                  <div className="mt-2">
                    <Alert
                      alertType={AlertType.DANGER}
                      title={this.state.error.msg}
                      close={() => this.setState({ error: null })}
                    />
                  </div>
                )}
              </div>
              {this.state.error?.target === "main" && (
                <div className="mt-2">
                  <Alert
                    alertType={AlertType.DANGER}
                    title={this.state.error.msg}
                    close={() => this.setState({ error: null })}
                  />
                </div>
              )}
              <div className="flex flex-row items-center justify-between gap-2 w-full mt-6">
                <Link
                  className="text-gray-500 hover:text-primary-900 hover:underline text-sm"
                  to={"/register"}
                >
                  Register Account?
                </Link>
                <div className="flex flex-row items-center justify-end gap-2">
                  {this.props.isComponent === true && (
                    <div
                      onClick={this.props.onClose}
                      className="px-3 py-2 rounded cursor-pointer bg-gray-100 hover:bg-gray-500 hover:text-white font-bold"
                    >
                      Cancel
                    </div>
                  )}
                  <button
                    className="flex flex-row items-center justify-center gap-2 p-2 pr-4 bg-primary-800 text-white hover:bg-primary-900 rounded"
                    type="submit"
                    disabled={this.state.loading}
                  >
                    <div>
                      {this.state.loading === true ? (
                        <AiOutlineLoading3Quarters className="text-2xl animate-spin" />
                      ) : (
                        <AiOutlineLogin className="text-xl" />
                      )}
                    </div>
                    <span
                      className={`${
                        this.state.loading === true
                          ? "animate__animated animate__fadeIn animate__infinite"
                          : ""
                      }`}
                    >
                      {this.state.loading === true
                        ? "Loading, please wait..."
                        : "Login to continue"}
                    </span>
                  </button>
                </div>
              </div>
            </form>
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

export const Login = connect(mapStateToProps, {
  FC_Login,
  FC_GetSystemInfo,
})(_Login);
