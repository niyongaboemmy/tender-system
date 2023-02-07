import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdPersonAdd } from "react-icons/io";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import {
  Auth,
  FC_GetSystemInfo,
  FC_RegisterAccount,
  RegisterDataInterface,
  System,
  UserType,
} from "../../actions";
import { StoreState } from "../../reducers";
import Alert, { AlertType } from "../Alert/Alert";
import { CompanyInfo } from "./CompanyInfo";
import { PersonalInfo } from "./PersonalInfo";
import { StepItem, Steps } from "./Steps";

interface RegisterProps {
  auth: Auth;
  system: System;
  FC_RegisterAccount: (
    data: RegisterDataInterface,
    callBack: (
      loading: boolean,
      res: { type: "success" | "error"; msg: string } | null
    ) => void
  ) => void;
  FC_GetSystemInfo: (callback: (loading: boolean) => void) => void;
}
interface RegisterState {
  redirect: boolean;
  // ---------Form data
  user_phone: string;
  type: UserType;
  names: string;
  user_email: string;
  password: string;
  company_name: string;
  country: string;
  company_email: string;
  company_phone: string;
  tin_number: string;
  // ---------Form data
  loading: boolean;
  error: {
    target:
      | "user_phone"
      | "names"
      | "user_email"
      | "password"
      | "company_name"
      | "country"
      | "company_email"
      | "company_phone"
      | "tin_number"
      | "confirm_password"
      | "main";
    msg: string;
  } | null;
  success: string;
  passwordDisplay: boolean;
  confirm_password: string;
  selectedStep: StepItem;
}

class _Register extends Component<RegisterProps, RegisterState> {
  constructor(props: RegisterProps) {
    super(props);

    this.state = {
      redirect: false,
      company_email: "",
      company_phone: "",
      company_name: "",
      country: "",
      names: "",
      password: "",
      tin_number: "",
      type: UserType.BIDER,
      user_email: "",
      user_phone: "",
      loading: false,
      error: null,
      success: "",
      passwordDisplay: false,
      confirm_password: "",
      selectedStep: StepItem.STEP1,
    };
  }
  RegisterFn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.state.names === "") {
      return this.setState({
        error: {
          target: "names",
          msg: "Please fill your names",
        },
      });
    }
    if (this.state.user_phone === "") {
      return this.setState({
        error: {
          target: "user_phone",
          msg: "Please fill your phone number",
        },
      });
    }
    if (this.state.user_email === "") {
      return this.setState({
        error: {
          target: "user_email",
          msg: "Please fill your email",
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
    if (this.state.confirm_password === "") {
      return this.setState({
        error: {
          target: "confirm_password",
          msg: "Please confirm password",
        },
      });
    }
    if (this.state.password !== this.state.confirm_password) {
      return this.setState({
        error: {
          target: "confirm_password",
          msg: "Please password does not match",
        },
      });
    }
    // Next step
    if (this.state.selectedStep === StepItem.STEP1) {
      return this.setState({ selectedStep: StepItem.STEP2 });
    }
    if (this.state.company_name === "") {
      return this.setState({
        error: {
          target: "company_name",
          msg: "Please fill company name",
        },
      });
    }
    if (this.state.company_phone === "") {
      return this.setState({
        error: {
          target: "company_phone",
          msg: "Please fill company phone number",
        },
      });
    }
    if (this.state.company_email === "") {
      return this.setState({
        error: {
          target: "company_email",
          msg: "Please fill company email",
        },
      });
    }
    if (this.state.tin_number === "") {
      return this.setState({
        error: {
          target: "tin_number",
          msg: "Please fill company TIN number",
        },
      });
    }
    if (this.state.country === "") {
      return this.setState({
        error: {
          target: "country",
          msg: "Please fill company country",
        },
      });
    }
    this.setState({ loading: true });
    this.props.FC_RegisterAccount(
      {
        company_email: this.state.company_email,
        company_phone: this.state.company_phone,
        compony_name: this.state.company_name,
        country: this.state.country,
        names: this.state.names,
        password: this.state.password,
        tin_number: this.state.tin_number,
        type: this.state.type,
        user_email: this.state.user_email,
        user_phone: this.state.user_phone,
      },
      (
        loading: boolean,
        res: { type: "success" | "error"; msg: string } | null
      ) => {
        res?.type === "error" &&
          this.setState({
            error: {
              target: "main",
              msg: res.msg,
            },
            loading: false,
            redirect: false,
            success: "",
          });
        if (res?.type === "success") {
          this.setState({
            error: null,
            loading: true,
            success: res.msg,
          });
          setTimeout(() => {
            this.setState({ redirect: true });
          }, 1000);
        }
      }
    );
  };
  validateStep = (step: StepItem): boolean => {
    if (step === StepItem.STEP1) {
      if (
        this.state.names !== "" &&
        this.state.user_email !== "" &&
        this.state.user_phone !== "" &&
        this.state.password !== "" &&
        this.state.confirm_password !== "" &&
        this.state.password === this.state.confirm_password
      ) {
        return true;
      }
      return false;
    }
    if (
      this.state.company_email !== "" &&
      this.state.company_name !== "" &&
      this.state.company_phone !== "" &&
      this.state.country !== "" &&
      this.state.tin_number !== ""
    ) {
      return true;
    }
    return false;
  };
  render() {
    if (this.state.redirect === true) {
      return <Redirect to={"/login"} />;
    }
    return (
      <div className="bg-white w-full md:w-3/5 lg:w-4/5 rounded-lg">
        <div className="w-full p-3 px-5 md:py-8 md:px-8">
          <div className="flex flex-row items-center gap-3 ">
            <div className="text-xl font-bold">Login Account</div>
          </div>
          <div>
            <Steps
              selected={this.state.selectedStep}
              isValidated={this.validateStep}
              selectStep={(step: StepItem) =>
                this.validateStep(step) === true &&
                this.setState({ selectedStep: step })
              }
            />
          </div>
          <div className="mt-8 text-gray-700">
            <form onSubmit={this.RegisterFn}>
              {/* Personal info */}
              {this.state.selectedStep === StepItem.STEP1 && (
                <PersonalInfo
                  names={this.state.names}
                  user_email={this.state.user_email}
                  user_phone={this.state.user_phone}
                  password={this.state.password}
                  confirm_password={this.state.confirm_password}
                  setNames={(value) => this.setState({ names: value })}
                  setEmail={(value) => this.setState({ user_email: value })}
                  setPhone={(value) => this.setState({ user_phone: value })}
                  setPassword={(value) => this.setState({ password: value })}
                  setConfirmPassword={(value) =>
                    this.setState({ confirm_password: value })
                  }
                  setError={(
                    value: {
                      target:
                        | "password"
                        | "user_phone"
                        | "names"
                        | "user_email"
                        | "confirm_password";
                      msg: string;
                    } | null
                  ) => this.setState({ error: value })}
                  loading={false}
                  error={this.state.error}
                />
              )}
              {this.state.selectedStep === StepItem.STEP2 && (
                <CompanyInfo
                  company_name={this.state.company_name}
                  company_email={this.state.company_email}
                  company_phone={this.state.company_phone}
                  country={this.state.country}
                  tin_number={this.state.tin_number}
                  setCompanyEmail={(value) =>
                    this.setState({ company_email: value })
                  }
                  setCompanyName={(value) =>
                    this.setState({ company_name: value })
                  }
                  setCompanyPhone={(value) =>
                    this.setState({ company_phone: value })
                  }
                  setCountry={(value) => this.setState({ country: value })}
                  setTinNumber={(value) => this.setState({ tin_number: value })}
                  setError={(
                    value: {
                      target:
                        | "company_name"
                        | "company_email"
                        | "company_phone"
                        | "country"
                        | "tin_number";
                      msg: string;
                    } | null
                  ) => this.setState({ error: value })}
                  loading={false}
                  error={this.state.error}
                />
              )}
              {this.state.success !== "" && (
                <div className="mt-2">
                  <Alert
                    alertType={AlertType.SUCCESS}
                    title={this.state.success}
                    close={() => this.setState({ error: null, success: "" })}
                  />
                </div>
              )}
              {this.state.error?.target === "main" && (
                <div className="mt-2">
                  <Alert
                    alertType={AlertType.DANGER}
                    title={this.state.error.msg}
                    close={() => this.setState({ error: null })}
                  />
                </div>
              )}
              <div className="flex flex-row items-center justify-between gap-2 mt-6">
                {this.state.selectedStep === StepItem.STEP1 ? (
                  <Link
                    className="text-primary-900 hover:underline text-sm font-bold"
                    to={"/login"}
                  >
                    I have account, Login?
                  </Link>
                ) : (
                  ""
                )}
                <div className="flex flex-row items-center justify-end gap-3">
                  {this.state.selectedStep === StepItem.STEP2 &&
                    this.state.loading === false && (
                      <div
                        onClick={() =>
                          this.setState({ selectedStep: StepItem.STEP1 })
                        }
                        className="px-3 py-2 rounded-md bg-primary-100 text-primary-800 hover:bg-primary-800 hover:text-white cursor-pointer w-max"
                      >
                        Edit personal info
                      </div>
                    )}
                  <button
                    className={`flex flex-row items-center justify-center gap-2 p-2 pr-4 ${
                      this.state.selectedStep === StepItem.STEP2
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-primary-800 hover:bg-primary-900"
                    } text-white rounded`}
                    type="submit"
                    disabled={this.state.loading}
                  >
                    <div>
                      {this.state.loading === true ? (
                        <AiOutlineLoading3Quarters className="text-2xl animate-spin" />
                      ) : this.state.selectedStep === StepItem.STEP2 ? (
                        <IoMdPersonAdd className="text-2xl" />
                      ) : (
                        ""
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
                        : this.state.selectedStep === StepItem.STEP1
                        ? "Next step"
                        : "Register"}
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

export const Register = connect(mapStateToProps, {
  FC_RegisterAccount,
  FC_GetSystemInfo,
})(_Register);
