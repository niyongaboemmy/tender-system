import React, { Component } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Alert, { AlertType } from "../Alert/Alert";

interface CompanyInfoProps {
  company_name: string;
  country: string;
  company_email: string;
  company_phone: string;
  tin_number: string;
  setCompanyName: (value: string) => void;
  setCountry: (value: string) => void;
  setCompanyEmail: (value: string) => void;
  setCompanyPhone: (value: string) => void;
  setTinNumber: (value: string) => void;
  setError: (
    value: {
      target:
        | "company_name"
        | "country"
        | "company_email"
        | "company_phone"
        | "tin_number";
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
interface CompanyInfoState {
  passwordDisplay: boolean;
}

export class CompanyInfo extends Component<CompanyInfoProps, CompanyInfoState> {
  constructor(props: CompanyInfoProps) {
    super(props);

    this.state = {
      passwordDisplay: false,
    };
  }
  render() {
    return (
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-6 flex flex-col">
          <div className="mb-1 text-sm">Company name</div>
          <input
            type="text"
            className={`w-full ${
              this.props.error?.target === "company_name"
                ? "bg-white border border-red-600 text-red-700"
                : "bg-gray-100 text-black"
            } px-5 py-3 rounded-md font-normal`}
            disabled={this.props.loading}
            value={this.props.company_name}
            onChange={(e) => {
              this.props.setCompanyName(e.target.value);
              this.props.setError(null);
            }}
          />
          {this.props.error?.target === "company_name" && (
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
          <div className="mb-1 text-sm">Company TIN number</div>
          <input
            type="string"
            value={this.props.tin_number}
            className={`w-full ${
              this.props.error?.target === "tin_number"
                ? "bg-white border border-red-600 text-red-700"
                : "bg-gray-100 text-black"
            } px-5 py-3 rounded-md font-normal`}
            disabled={this.props.loading}
            onChange={(e) => {
              this.props.setTinNumber(e.target.value);
              this.props.setError(null);
            }}
          />
          {this.props.error?.target === "tin_number" && (
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
          <div className="mb-1 text-sm">Company Phone number</div>
          <input
            type="tel"
            value={this.props.company_phone}
            className={`w-full ${
              this.props.error?.target === "company_phone"
                ? "bg-white border border-red-600 text-red-700"
                : "bg-gray-100 text-black"
            } px-5 py-3 rounded-md font-normal`}
            disabled={this.props.loading}
            onChange={(e) => {
              this.props.setCompanyPhone(e.target.value);
              this.props.setError(null);
            }}
          />
          {this.props.error?.target === "company_phone" && (
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
          <div className="mb-1 text-sm">Company Email</div>
          <input
            type="email"
            value={this.props.company_email}
            className={`w-full ${
              this.props.error?.target === "company_email"
                ? "bg-white border border-red-600 text-red-700"
                : "bg-gray-100 text-black"
            } px-5 py-3 rounded-md font-normal`}
            disabled={this.props.loading}
            onChange={(e) => {
              this.props.setCompanyEmail(e.target.value);
              this.props.setError(null);
            }}
          />
          {this.props.error?.target === "company_email" && (
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
          <div className="mb-1 text-sm">Country</div>
          <input
            type="text"
            value={this.props.country}
            className={`w-full ${
              this.props.error?.target === "country"
                ? "bg-white border border-red-600 text-red-700"
                : "bg-gray-100 text-black"
            } px-5 py-3 rounded-md font-normal`}
            disabled={this.props.loading}
            onChange={(e) => {
              this.props.setCountry(e.target.value);
              this.props.setError(null);
            }}
          />
          {this.props.error?.target === "country" && (
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
