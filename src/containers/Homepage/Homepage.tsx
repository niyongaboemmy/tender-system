import React, { Component, Fragment } from "react";
import { StoreState } from "../../reducers";
import { Auth, FC_GetSystemInfo, FC_Login, System } from "../../actions";
import { connect } from "react-redux";
import Container from "../../components/Container/Container";
import {
  FC_GCreateTenderApplicationDraft,
  FC_GetTendersOffersForBidders,
  TenderOfferForBiddersInterface,
} from "../../actions/tender.action";
import MainLoading from "../../components/MainLoading/MainLoading";
import { BsArrowLeft, BsFileEarmarkPdf, BsFolder2Open } from "react-icons/bs";
import { IoMdTime } from "react-icons/io";
import PublicNav from "../../components/PublicNav/PublicNav";
import { RiSearchLine } from "react-icons/ri";
import { DateTimeToString, search } from "../../utils/functions";
import { PublicTenderDetails } from "../../components/PublicTenderDetails/PublicTenderDetails";
import Modal, { ModalSize, Themes } from "../../components/Modal/Modal";
import { Login } from "../../components/Login/Login";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Redirect } from "react-router";
import Alert, { AlertType } from "../../components/Alert/Alert";

interface AppProps {
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
}

interface AppState {
  loading: boolean;
  tenders: TenderOfferForBiddersInterface[] | null;
  error: string;
  searchData: string;
  selectedTender: TenderOfferForBiddersInterface | null;
  openLogin: boolean;
  creatingApplication: boolean;
  redirectApplications: {
    status: boolean;
    tender_id: string;
    application_id: string;
  } | null;
}

class _App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      loading: false,
      tenders: null,
      error: "",
      searchData: "",
      selectedTender: null,
      openLogin: false,
      creatingApplication: false,
      redirectApplications: null,
    };
  }

  GetTenders = () => {
    this.setState({ loading: true });
    FC_GetTendersOffersForBidders(
      (
        loading: boolean,
        res: {
          type: "success" | "error";
          msg: string;
          data: TenderOfferForBiddersInterface[];
        } | null
      ) => {
        this.setState({ loading: loading });
        if (res?.type === "success") {
          this.setState({ tenders: res.data, loading: false, error: "" });
        }
        if (res?.type === "error") {
          this.setState({ tenders: [], loading: false, error: res.msg });
        }
      }
    );
  };

  CreateApplicationDraft = (tender: TenderOfferForBiddersInterface) => {
    if (
      this.props.auth.user !== null &&
      this.props.auth.user.company.length > 0
    ) {
      this.setState({ creatingApplication: true });
      FC_GCreateTenderApplicationDraft(
        this.props.auth.user.company[0].company_id,
        tender.tender_id,
        (
          loading: boolean,
          res: {
            type: "success" | "error";
            msg: string;
            data: {
              application_id: string;
              message: string;
            } | null;
          } | null
        ) => {
          this.setState({ creatingApplication: loading });
          if (res?.type === "success" && res.data !== null) {
            this.setState({
              redirectApplications: {
                application_id: res.data.application_id,
                tender_id: tender.tender_id,
                status: true,
              },
              error: "",
            });
          }
          if (res?.type === "error") {
            this.setState({
              error: res.msg,
              redirectApplications: null,
              creatingApplication: false,
            });
          }
        }
      );
    } else {
      this.setState({ error: "Not authenticated", openLogin: true });
    }
  };

  componentDidMount = () => {
    this.GetTenders();
  };
  render() {
    if (this.state.tenders === null || this.state.loading === true) {
      return <MainLoading />;
    }
    if (this.state.redirectApplications?.status === true) {
      return (
        <Redirect
          to={`/applications/${this.state.redirectApplications.application_id}/${this.state.redirectApplications.tender_id}`}
        />
      );
    }

    return (
      <Fragment>
        <div>
          {this.props.auth.isAuthenticated === false && (
            <div>
              <PublicNav blue={true} />
              <div className="mt-10"></div>
            </div>
          )}
          <div className="min-h-screen">
            <Container
              className={`bg-primary-800 ${
                this.state.selectedTender !== null ? "-mt-4 pb-4" : ""
              }`}
            >
              <div className="text-white pt-12 pb-3 bg-home-pattern">
                <div
                  className={`flex flex-row items-center justify-between gap-3 mt-3 mb-6 ${
                    this.state.selectedTender === null ? "text-center" : ""
                  }`}
                >
                  {this.state.selectedTender !== null && (
                    <div>
                      <div
                        onClick={() => this.setState({ selectedTender: null })}
                        className="h-11 w-max px-3 flex items-center justify-center gap-2 cursor-pointer bg-primary-700 text-white hover:bg-primary-900 rounded-md"
                      >
                        <div>
                          <BsArrowLeft className="text-2xl" />
                        </div>
                        <span>Back</span>
                      </div>
                    </div>
                  )}
                  <div className={`flex flex-row items-center gap-2 w-full`}>
                    <div className="flex flex-col w-full">
                      {this.state.selectedTender !== null && (
                        <div className="text-base text-yellow-400 -mb-2 font-light">
                          Selected tender
                        </div>
                      )}
                      <div className="text-3xl font-bold">
                        {this.state.selectedTender === null ? (
                          "Available tenders"
                        ) : (
                          <span className="text-xl">
                            {this.state.selectedTender.tender_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Search */}
                {this.state.selectedTender === null && (
                  <div className="grid grid-cols-12 gap-3 pb-8">
                    <div className="col-span-12 md:col-span-3"></div>
                    <div className="col-span-12 md:col-span-6">
                      <div className="relative">
                        <input
                          type={"search"}
                          className={`w-full px-3 h-10 pl-10 rounded-md bg-white text-primary-800 font-semilight text-sm shadow-md`}
                          placeholder="Search for tender"
                          value={this.state.searchData}
                          onChange={(e) =>
                            this.setState({ searchData: e.target.value })
                          }
                        />
                        <RiSearchLine
                          className="absolute top-1 mt-2 left-3 text-xl text-primary-800"
                          style={{ marginTop: "6px" }}
                        />
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-3"></div>
                  </div>
                )}
                {this.state.error !== "" && (
                  <div
                    className={
                      this.state.selectedTender === null ? "" : "-mt-16 mb-2"
                    }
                  >
                    <Alert
                      alertType={AlertType.DANGER}
                      title={this.state.error}
                      close={() => this.setState({ error: "" })}
                    />
                  </div>
                )}
              </div>
            </Container>
            {this.state.selectedTender === null ? (
              <Container className="pt-3 bg-gray-100 min-h-screen">
                {/* Content here */}
                {this.state.tenders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center bg-white rounded-md p-6 w-full py-10">
                    <div>
                      <RiSearchLine className="text-8xl text-gray-300" />
                    </div>
                    <div className="text-2xl font-bold">
                      No available tenders
                    </div>
                    <div>
                      For this range of period, there are no published tenders
                      available for application
                    </div>
                  </div>
                ) : (
                    search(
                      this.state.tenders,
                      this.state.searchData
                    ) as TenderOfferForBiddersInterface[]
                  ).length === 0 ? (
                  <div className="flex flex-col items-center justify-center bg-white rounded-md p-6 w-full py-10">
                    <div>
                      <RiSearchLine className="text-8xl text-gray-300" />
                    </div>
                    <div className="text-2xl font-bold">No result found</div>
                    <div>
                      Try for another keyword to find the available tender
                    </div>
                  </div>
                ) : (
                  <div className="mt-3">
                    {(
                      search(
                        this.state.tenders,
                        this.state.searchData
                      ) as TenderOfferForBiddersInterface[]
                    ).map((item, i) => (
                      <div
                        onClick={() => this.setState({ selectedTender: item })}
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
                                      {DateTimeToString(item.published_date)}
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
                                      {DateTimeToString(item.closing_date)}
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
              </Container>
            ) : (
              <Container className="py-5 -mt-12">
                <PublicTenderDetails
                  tender={this.state.selectedTender}
                  system={this.props.system}
                  onClose={() => this.setState({ selectedTender: null })}
                  apply={(tender: TenderOfferForBiddersInterface) => {
                    if (this.props.auth.isAuthenticated === false) {
                      this.setState({ openLogin: true });
                    } else {
                      this.setState({ openLogin: false });
                      this.CreateApplicationDraft(tender);
                    }
                  }}
                />
              </Container>
            )}
          </div>
        </div>
        {this.state.openLogin === true && (
          <Modal
            backDrop={true}
            theme={Themes.default}
            close={() => this.setState({ openLogin: false })}
            backDropClose={true}
            widthSizeClass={ModalSize.medium}
            displayClose={false}
            padding={{
              title: undefined,
              body: undefined,
              footer: undefined,
            }}
          >
            <div className="p-3">
              <Login
                isComponent={true}
                onClose={() => this.setState({ openLogin: false })}
                onSuccess={() => {
                  this.setState({ openLogin: false });
                  if (this.state.selectedTender !== null) {
                    this.CreateApplicationDraft(this.state.selectedTender);
                  }
                }}
              />
            </div>
          </Modal>
        )}
        {this.state.creatingApplication === true && (
          <Modal
            backDrop={true}
            theme={Themes.default}
            close={() => {}}
            backDropClose={false}
            widthSizeClass={ModalSize.medium}
            displayClose={false}
            padding={{
              title: undefined,
              body: undefined,
              footer: undefined,
            }}
          >
            <div className="p-6 py-8">
              <div className="flex flex-col items-center justify-center text-center">
                <div>
                  <AiOutlineLoading3Quarters className="text-8xl text-yellow-600 animate-spin" />
                </div>
                <div className="text-lg font-bold animate-pulse mt-2">
                  Starting application...
                </div>
              </div>
            </div>
          </Modal>
        )}
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

export const Homepage = connect(mapStateToProps, {
  FC_Login,
  FC_GetSystemInfo,
})(_App);
