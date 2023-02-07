import React, { Component } from "react";
import {
  API_GetUsersDetails,
  FC_UpdateUserCompanyDetails,
} from "../../actions";
import Alert, { AlertType } from "../../components/Alert/Alert";

interface CompanyDetailsProps {
  action: "VIEW" | "EDIT";
  setAction: (action: "VIEW" | "EDIT") => void;
  onUpdate: () => void;
  user: API_GetUsersDetails;
}
interface CompanyDetailsState {
  company_name: string;
  tin_number: string;
  country: string;
  company_phone: string;
  company_email: string;
  error: {
    type:
      | "company_name"
      | "tin_number"
      | "country"
      | "company_phone"
      | "company_email"
      | "main";
    msg: string;
  } | null;
  loading: boolean;
  success: string;
}

export class CompanyDetails extends Component<
  CompanyDetailsProps,
  CompanyDetailsState
> {
  constructor(props: CompanyDetailsProps) {
    super(props);

    this.state = {
      company_email:
        this.props.user.company.length === 0
          ? ""
          : this.props.user.company[0].company_email,
      company_name:
        this.props.user.company.length === 0
          ? ""
          : this.props.user.company[0].compony_name,
      country:
        this.props.user.company.length === 0
          ? ""
          : this.props.user.company[0].country,
      company_phone:
        this.props.user.company.length === 0
          ? ""
          : this.props.user.company[0].company_phone,
      tin_number:
        this.props.user.company.length === 0
          ? ""
          : this.props.user.company[0].tin_number,
      error: null,
      loading: false,
      success: "",
    };
  }
  ResetForm = () =>
    this.setState({
      company_email:
        this.props.user.company.length === 0
          ? ""
          : this.props.user.company[0].company_email,
      company_name:
        this.props.user.company.length === 0
          ? ""
          : this.props.user.company[0].compony_name,
      country:
        this.props.user.company.length === 0
          ? ""
          : this.props.user.company[0].country,
      company_phone:
        this.props.user.company.length === 0
          ? ""
          : this.props.user.company[0].company_phone,
      tin_number:
        this.props.user.company.length === 0
          ? ""
          : this.props.user.company[0].tin_number,
      error: null,
      loading: false,
      success: "",
    });
  UpdateCompanyDetails = () => {
    if (this.state.company_name === "") {
      return this.setState({
        error: {
          type: "company_name",
          msg: "Please fill company name",
        },
      });
    }
    if (this.state.tin_number === "") {
      return this.setState({
        error: {
          type: "tin_number",
          msg: "Please fill TIN number",
        },
      });
    }
    if (this.state.company_phone === "") {
      return this.setState({
        error: {
          type: "company_phone",
          msg: "Please fill company phone number",
        },
      });
    }
    if (this.state.company_email === "") {
      return this.setState({
        error: {
          type: "company_email",
          msg: "Please fill company email",
        },
      });
    }

    // Submit here
    this.setState({ loading: true });
    FC_UpdateUserCompanyDetails(
      {
        company_id: this.props.user.company[0].company_id,
        user_id: this.props.user.user_id,
        compony_name: this.state.company_name,
        country: this.state.country,
        company_email: this.state.company_email,
        company_phone: this.state.company_phone,
        tin_number: this.state.tin_number,
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
    const selectedCompany =
      this.props.user.company.length === 0 ? null : this.props.user.company[0];
    if (selectedCompany === null) {
      return (
        <div className="bg-yellow-100 rounded-md w-full flex flex-col items-center justify-center p-3">
          <div></div>
          <div className="text-2xl font-bold">No company details found!</div>
          <div className="text-sm">
            Your company details are not found! Please contact the administrator
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="flex flex-row items-center justify-between gap-2 mb-3">
          <div className="font-bold pl-2 text-lg">Company details</div>
          <div>
            {/* {this.props.action === "EDIT" && (
              <div
                onClick={() => this.props.setAction("VIEW")}
                className="bg-yellow-50 text-yellow-700 border border-yellow-300 hover:border-white cursor-pointer hover:bg-primary-800 hover:text-white w-max px-3 py-2 font-bold text-sm rounded"
              >
                Back to details
              </div>
            )} */}
          </div>
        </div>
        {/* Details */}
        {this.props.action === "VIEW" ? (
          <div className="p-2">
            <div className="flex flex-row justify-between gap-2 w-full mb-2 pb-2 border-b">
              <div className="flex flex-col">
                <span className="text-sm">Company name</span>
                <span className="text-sm font-semibold">
                  {selectedCompany.compony_name}
                </span>
              </div>
            </div>
            <div className="flex flex-col mb-2 pb-2 border-b">
              <span className="text-sm">TIN number</span>
              <span className="text-sm font-semibold">
                {selectedCompany.tin_number}
              </span>
            </div>
            <div className="flex flex-col mb-2 pb-2 border-b">
              <span className="text-sm">Country</span>
              <span className="text-sm font-semibold">
                {selectedCompany.country}
              </span>
            </div>
            <div className="flex flex-col mb-2 pb-2 border-b">
              <span className="text-sm">Phone number</span>
              <span className="text-sm font-semibold">
                {selectedCompany.company_phone}
              </span>
            </div>
            <div className="flex flex-col mb-6 pb-2">
              <span className="text-sm">Email</span>
              <span className="text-sm font-semibold">
                {selectedCompany.company_email}
              </span>
            </div>
            <div className="pt-2">
              <div className="flex flex-row items-center gap-2">
                {this.props.action === "VIEW" && (
                  <div
                    onClick={() => this.props.setAction("EDIT")}
                    className="bg-primary-50 text-primary-900 cursor-pointer hover:bg-primary-800 hover:text-white w-max px-3 py-2 font-bold text-sm rounded"
                  >
                    Edit company details
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3">
            <div className="flex flex-col mb-3">
              <span className="text-sm mb-1">Company name</span>
              <input
                type="text"
                className={`px-3 py-2 rounded-md bg-gray-100 w-full font-bold text-sm ${
                  this.state.error?.type === "company_name"
                    ? "border border-red-600"
                    : ""
                }`}
                value={this.state.company_name}
                onChange={(e) =>
                  this.setState({ company_name: e.target.value, error: null })
                }
                disabled={this.state.loading}
              />
              {this.state.error?.type === "company_name" && (
                <Alert
                  alertType={AlertType.DANGER}
                  title={this.state.error.msg}
                  close={() => this.setState({ error: null })}
                />
              )}
            </div>
            <div className="flex flex-col mb-3">
              <span className="text-sm mb-1">TIN number</span>
              <input
                type="text"
                className={`px-3 py-2 rounded-md bg-gray-100 w-full font-bold text-sm ${
                  this.state.error?.type === "tin_number"
                    ? "border border-red-600"
                    : ""
                }`}
                value={this.state.tin_number}
                onChange={(e) =>
                  this.setState({ tin_number: e.target.value, error: null })
                }
                disabled={this.state.loading}
              />
              {this.state.error?.type === "tin_number" && (
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
                  this.state.error?.type === "company_phone"
                    ? "border border-red-600"
                    : ""
                }`}
                value={this.state.company_phone}
                onChange={(e) =>
                  this.setState({ company_phone: e.target.value, error: null })
                }
                disabled={this.state.loading}
              />
              {this.state.error?.type === "company_phone" && (
                <Alert
                  alertType={AlertType.DANGER}
                  title={this.state.error.msg}
                  close={() => this.setState({ error: null })}
                />
              )}
            </div>
            <div className="flex flex-col mb-3">
              <span className="text-sm mb-1">Company Email</span>
              <input
                type="text"
                className={`px-3 py-2 rounded-md bg-gray-100 w-full font-bold text-sm ${
                  this.state.error?.type === "company_email"
                    ? "border border-red-600"
                    : ""
                }`}
                value={this.state.company_email}
                onChange={(e) =>
                  this.setState({ company_email: e.target.value, error: null })
                }
                disabled={this.state.loading}
              />
              {this.state.error?.type === "company_email" && (
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
                  this.state.loading === false && this.UpdateCompanyDetails()
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
