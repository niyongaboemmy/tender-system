import React, { Component, Fragment } from "react";
import { BsFileEarmarkPdf, BsFolder2Open } from "react-icons/bs";
import { HiOutlineBriefcase } from "react-icons/hi";
import { IoMdTime } from "react-icons/io";
import { RiSearchLine } from "react-icons/ri";
import { connect } from "react-redux";
import { Link, RouteComponentProps } from "react-router-dom";
import { Auth, System } from "../../actions";
import {
  CompanyTenderApplicationInterface,
  FC_GetCompanyTenderApplications,
} from "../../actions/tender.action";
import Alert, { AlertType } from "../../components/Alert/Alert";
import LoadingComponent from "../../components/Loading/LoadingComponent";
import { StoreState } from "../../reducers";

interface BidderApplicationsProps
  extends RouteComponentProps<{
    application_id: string | undefined;
    tender_id: string | undefined;
  }> {
  auth: Auth;
  system: System;
}

interface BidderApplicationsState {
  loading: boolean;
  applications: CompanyTenderApplicationInterface[] | null;
  error: string;
  selectedApplication: CompanyTenderApplicationInterface | null;
}

class _BidderApplications extends Component<
  BidderApplicationsProps,
  BidderApplicationsState
> {
  constructor(props: BidderApplicationsProps) {
    super(props);

    this.state = {
      loading: false,
      applications: null,
      error: "",
      selectedApplication: null,
    };
  }
  GetTenderApplications = () => {
    if (
      this.props.auth.user !== null &&
      this.props.auth.user.company.length > 0
    ) {
      this.setState({ loading: true });
      FC_GetCompanyTenderApplications(
        this.props.auth.user.company[0].company_id,
        (
          loading: boolean,
          res: {
            type: "success" | "error";
            msg: string;
            data: CompanyTenderApplicationInterface[];
          } | null
        ) => {
          this.setState({ loading: loading });
          if (res?.type === "success") {
            this.setState({
              applications: res.data,
              loading: false,
              error: "",
            });
            if (
              this.props.match.params.application_id !== undefined &&
              this.props.match.params.tender_id !== undefined
            ) {
              const application = res.data.find(
                (itm) =>
                  itm.application_id === this.props.match.params.application_id
              );
              if (application !== undefined) {
                this.setState({ selectedApplication: application });
              }
            }
          }
          if (res?.type === "error") {
            this.setState({ applications: [], loading: false, error: res.msg });
          }
        }
      );
    } else {
      this.setState({
        error: "Company not found!",
        loading: false,
        applications: [],
      });
    }
  };
  componentDidMount = () => {
    this.GetTenderApplications();
  };
  render() {
    if (this.state.selectedApplication !== null) {
      return <div>Alert</div>;
    }
    return (
      <Fragment>
        <div className="mx-0 md:mx-2 -mt-2">
          <div>
            <div className="flex flex-row items-center justify-between gap-2 w-full mb-3">
              <div className="flex flex-row items-center gap-3">
                <div>
                  <HiOutlineBriefcase className="text-5xl font-bold text-primary-800" />
                </div>
                <div className="font-bold items-center text-2xl">
                  <div>My applications</div>
                  <div className="text-sm text-black font-normal">
                    List of tenders that I have applied for
                  </div>
                </div>
              </div>
              <div>
                <Link
                  to="/tenders"
                  className="bg-white text-primary-800 font-bold px-3 py-2 rounded cursor-pointer hover:bg-primary-800 hover:text-white"
                >
                  Create new application
                </Link>
              </div>
            </div>
          </div>
          {this.state.error !== "" && (
            <div className="my-3">
              <Alert
                alertType={AlertType.DANGER}
                title={this.state.error}
                close={() => this.setState({ error: "" })}
              />
            </div>
          )}
          {/* Body */}
          <div className="mt-3">
            {this.state.applications === null || this.state.loading === true ? (
              <div className="my-3">
                <LoadingComponent />
              </div>
            ) : (
              <div>
                {this.state.applications.length === 0 ? (
                  <div>
                    <div className="flex flex-col items-center justify-center bg-white rounded-md p-6 w-full py-10">
                      <div>
                        <RiSearchLine className="text-8xl text-gray-300" />
                      </div>
                      <div className="text-xl font-bold">
                        No available applications
                      </div>
                      <div className="text-sm text-gray-500">
                        You have not yet applied to any tender publication
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {this.state.applications.map((item, i) => (
                      <div
                        // onClick={() => this.setState({ selectedTender: item })}
                        key={i + 1}
                        className="mb-3 w-full group cursor-pointer hover:text-primary-900"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-white rounded-lg p-2 md:px-4 lg:px-2">
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 lg:gap-2 w-full truncate">
                            <div>
                              <div className="h-20 w-20 bg-primary-50 rounded-lg text-primary-800 flex items-center justify-center">
                                <BsFileEarmarkPdf className="text-5xl" />
                              </div>
                            </div>
                            <div className="w-full truncate">
                              <div className="text-base font-bold">
                                {item.tender_name}
                              </div>
                              <div className="text-sm mb-2 w-full truncate text-gray-500">
                                {item.details}
                              </div>
                              <div className="grid grid-cols-12 gap-1 text-sm w-full">
                                <div className="col-span-12 lg:col-span-6">
                                  <div className="flex flex-row items-center gap-2">
                                    <span className="text-gray-500">
                                      Publication date:
                                    </span>
                                    <span>
                                      {new Date(
                                        item.published_date
                                      ).toUTCString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="col-span-12 lg:col-span-6">
                                  <div className="flex flex-row items-center gap-2">
                                    <div className="flex flex-row items-center gap-1 text-gray-500">
                                      <div>
                                        <IoMdTime className="text-yellow-600 text-xl" />
                                      </div>
                                      <span>Deadline:</span>
                                    </div>
                                    <span>
                                      {new Date(
                                        item.closing_date
                                      ).toUTCString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className=" pr-2">
                            <div className="flex flex-row items-center justify-center gap-2 cursor-pointer bg-gray-100 group-hover:bg-primary-800 group-hover:text-white rounded-md px-2 py-2 pr-3">
                              <div>
                                <BsFolder2Open className="text-xl" />
                              </div>
                              <span className="text-sm font-semibold">
                                Open
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
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

export const BidderApplications = connect(
  mapStateToProps,
  {}
)(_BidderApplications);
