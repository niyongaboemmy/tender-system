import React, { Component } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Alert, { AlertType } from "../Alert/Alert";

interface PersonalInfoProps {
  names: string;
  user_email: string;
  user_phone: string;
  password: string;
  confirm_password: string;
  setNames: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  setError: (
    value: {
      target:
        | "names"
        | "user_email"
        | "user_phone"
        | "password"
        | "confirm_password";
      msg: string;
    } | null
  ) => void;
  loading: boolean;
  error: {
    target:
      | "main"
      | "password"
      | "user_phone"
      | "names"
      | "user_email"
      | "company_name"
      | "country"
      | "company_email"
      | "company_phone"
      | "tin_number"
      | "confirm_password";
    msg: string;
  } | null;
}
interface PersonalInfoState {
  passwordDisplay: boolean;
}

export class PersonalInfo extends Component<
  PersonalInfoProps,
  PersonalInfoState
> {
  constructor(props: PersonalInfoProps) {
    super(props);

    this.state = {
      passwordDisplay: false,
    };
  }
  render() {
    return (
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-6 flex flex-col">
          <div className="mb-1">Full Names</div>
          <input
            type="text"
            className={`w-full ${
              this.props.error?.target === "names"
                ? "bg-white border border-red-600 text-red-700"
                : "bg-gray-100 text-black"
            } px-5 py-3 rounded-md font-normal`}
            disabled={this.props.loading}
            value={this.props.names}
            onChange={(e) => {
              this.props.setNames(e.target.value);
              this.props.setError(null);
            }}
          />
          {this.props.error?.target === "names" && (
            <div className="mt-2">
              <Alert
                alertType={AlertType.DANGER}
                title={this.props.error.msg}
                close={() => this.props.setError(null)}
              />
            </div>
          )}
        </div>
        <div className="col-span-12 md:col-span-6 flex flex-col">
          <div className="mb-1">User Email</div>
          <input
            type="email"
            value={this.props.user_email}
            className={`w-full ${
              this.props.error?.target === "user_email"
                ? "bg-white border border-red-600 text-red-700"
                : "bg-gray-100 text-black"
            } px-5 py-3 rounded-md font-normal`}
            disabled={this.props.loading}
            onChange={(e) => {
              this.props.setEmail(e.target.value);
              this.props.setError(null);
            }}
          />
          {this.props.error?.target === "user_email" && (
            <div className="mt-2">
              <Alert
                alertType={AlertType.DANGER}
                title={this.props.error.msg}
                close={() => this.props.setError(null)}
              />
            </div>
          )}
        </div>
        <div className="col-span-12 md:col-span-6 flex flex-col">
          <div className="mb-1">Phone number</div>
          <input
            type="tel"
            value={this.props.user_phone}
            className={`w-full ${
              this.props.error?.target === "user_phone"
                ? "bg-white border border-red-600 text-red-700"
                : "bg-gray-100 text-black"
            } px-5 py-3 rounded-md font-normal`}
            disabled={this.props.loading}
            onChange={(e) => {
              this.props.setPhone(e.target.value);
              this.props.setError(null);
            }}
          />
          {this.props.error?.target === "user_phone" && (
            <div className="mt-2">
              <Alert
                alertType={AlertType.DANGER}
                title={this.props.error.msg}
                close={() => this.props.setError(null)}
              />
            </div>
          )}
        </div>
        <div className="col-span-12 md:col-span-6 flex flex-col">
          <div className="mb-1">Password</div>
          <div className="relative w-full">
            <input
              type={this.state.passwordDisplay === false ? "password" : "text"}
              value={this.props.password}
              className={`w-full ${
                this.props.error?.target === "password"
                  ? "bg-white border border-red-600 text-red-700"
                  : "bg-gray-100 text-black"
              } px-5 py-3 rounded-md font-normal`}
              disabled={this.props.loading}
              onChange={(e) => {
                this.props.setPassword(e.target.value);
                this.props.setError(null);
              }}
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
          {this.props.error?.target === "password" && (
            <div className="mt-2">
              <Alert
                alertType={AlertType.DANGER}
                title={this.props.error.msg}
                close={() => this.props.setError(null)}
              />
            </div>
          )}
        </div>
        <div className="col-span-12 md:col-span-6 flex flex-col">
          <div className="mb-1">Confirm Password</div>
          <div className="relative w-full">
            <input
              type={this.state.passwordDisplay === false ? "password" : "text"}
              value={this.props.confirm_password}
              className={`w-full ${
                this.props.error?.target === "confirm_password"
                  ? "bg-white border border-red-600 text-red-700"
                  : "bg-gray-100 text-black"
              } px-5 py-3 rounded-md font-normal`}
              disabled={this.props.loading}
              onChange={(e) => {
                this.props.setConfirmPassword(e.target.value);
                this.props.setError(null);
              }}
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
          {this.props.error?.target === "confirm_password" && (
            <div className="mt-2">
              <Alert
                alertType={AlertType.DANGER}
                title={this.props.error.msg}
                close={() => this.props.setError(null)}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
