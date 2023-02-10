import React, { Component, Fragment } from "react";
import { FaVoteYea } from "react-icons/fa";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Auth, System } from "../../actions";
import {
  FC_GetTendersSummaryForValidation,
  RequiredDocumentInterface,
  TenderForValidationInterface,
} from "../../actions/tender.action";
import Alert, { AlertType } from "../../components/Alert/Alert";
import ExportToExcel from "../../components/GenerateReport/ExportToExcel";
import LoadingComponent from "../../components/Loading/LoadingComponent";
import Modal, { Themes, ModalSize } from "../../components/Modal/Modal";
import { StoreState } from "../../reducers";
import { search, DateTimeToString, commaFy } from "../../utils/functions";
import { Submissions } from "./Submissions";

interface TenderSubmissionsProps
  extends RouteComponentProps<{
    tender_id: string | undefined;
  }> {
  auth: Auth;
  system: System;
}
interface TenderSubmissionsState {
  loading: boolean;
  tenders: TenderForValidationInterface[] | null;
  error: string;
  selectedTender: TenderForValidationInterface | null;
  selectedDocument: RequiredDocumentInterface | null;
  searchData: string;
}

export class _TenderSubmissions extends Component<
  TenderSubmissionsProps,
  TenderSubmissionsState
> {
  constructor(props: TenderSubmissionsProps) {
    super(props);

    this.state = {
      loading: false,
      tenders: null,
      error: "",
      selectedTender: null,
      selectedDocument: null,
      searchData: "",
    };
  }
  GetTendersSummary = () => {
    if (
      this.props.auth.user !== null &&
      this.props.auth.user.company.length > 0
    ) {
      this.setState({ loading: true });
      const companyId = this.props.auth.user.company[0].company_id;
      FC_GetTendersSummaryForValidation(
        companyId,
        (
          loading: boolean,
          res: {
            type: "success" | "error";
            msg: string;
            data: TenderForValidationInterface[];
          } | null
        ) => {
          this.setState({ loading: loading });
          if (res?.type === "success") {
            console.log("RES: ", res.data);
            this.setState({ tenders: res.data, error: "", loading: false });
            if (
              this.props.match.params.tender_id !== undefined &&
              res.data.length > 0
            ) {
              const selectedTender = res.data.find(
                (itm) => itm.tender_id === this.props.match.params.tender_id
              );
              if (selectedTender !== undefined) {
                this.setState({ selectedTender: selectedTender });
              }
            }
          }
          if (res?.type === "error") {
            this.setState({ tenders: [], error: res.msg, loading: false });
          }
        }
      );
    }
  };
  GetTotalDocuments = (
    tenderSummaryDetails: TenderForValidationInterface
  ): number => {
    var total: number = 0;
    for (const item of tenderSummaryDetails.required_documents) {
      total += item.total_document;
    }
    return total;
  };
  componentDidMount = () => {
    this.GetTendersSummary();
  };
  render() {
    return (
      <Fragment>
        <div className="mx-0 md:mx-2">
          <div>
            <div className="flex flex-row items-center justify-between gap-2 w-full my-3">
              <div className="flex flex-row items-center gap-2">
                <div>
                  <div className="flex items-center justify-center bg-gray-50 rounded-md h-14 w-14">
                    <FaVoteYea className="text-5xl font-bold text-primary-800" />
                  </div>
                </div>
                <div className="font-bold items-center text-2xl">
                  <div>Tender submissions validation</div>
                  <div className="text-sm text-gray-500 font-normal">
                    Choose tender to view summary of tender submissions and
                    their docs validation statuses
                  </div>
                </div>
              </div>
              <div>
                {/* <Link
                  to="/create-tender"
                  className="bg-white text-primary-800 font-bold px-3 py-2 rounded cursor-pointer hover:bg-primary-800 hover:text-white"
                >
                  Create tender
                </Link> */}
              </div>
            </div>
          </div>
          {/* Body */}
          <div className="">
            {this.state.loading === true || this.state.tenders === null ? (
              <LoadingComponent />
            ) : (
              <div className="bg-white rounded-md">
                <div className="p-3 flex flex-row items-center gap-2">
                  <input
                    type="search"
                    className="bg-gray-100 w-full px-3 py-3 text-sm rounded-md"
                    placeholder="Search by name"
                    onChange={(e) =>
                      this.setState({ searchData: e.target.value })
                    }
                    value={this.state.searchData}
                  />
                  <ExportToExcel
                    fileData={(
                      search(
                        this.state.tenders,
                        this.state.searchData
                      ) as TenderForValidationInterface[]
                    ).map((item, i) => ({
                      No: i + 1,
                      TenderName: item.tender_name,
                      TenderCategory: item.category,
                      TenderLevel: item.level,
                      PublicationDate: DateTimeToString(item.published_date),
                      ClosingDate: DateTimeToString(item.closing_date),
                      TotalSubmissions:
                        item.required_documents.length === 0
                          ? 0
                          : item.required_documents[0].total_document,
                    }))}
                    fileName={"Tenders submissions summary"}
                    btnName="Export Excel"
                  />
                </div>
                {this.state.error !== "" && (
                  <div className="my-3 px-4">
                    <Alert
                      alertType={AlertType.DANGER}
                      title={this.state.error}
                      close={() => this.setState({ error: "" })}
                    />
                  </div>
                )}
                {this.state.tenders.length === 0 ? (
                  <div className="p-3 text-center w-full text-xl font-light">
                    No tenders available
                  </div>
                ) : (
                    search(
                      this.state.tenders,
                      this.state.searchData
                    ) as TenderForValidationInterface[]
                  ).length === 0 ? (
                  <div className="p-3 text-center w-full text-xl font-light">
                    No result found!
                  </div>
                ) : (
                  <div>
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 border">#</th>
                          <th className="px-3 py-2 border">Tender name</th>
                          <th className="px-3 py-2 border">Category</th>
                          <th className="px-3 py-2 border">Level</th>
                          <th className="px-3 py-2 border">Publication date</th>
                          <th className="px-3 py-2 border">Closing date</th>
                          <th className="px-3 py-2 border">
                            Total submissions
                          </th>
                          <th className="px-3 py-2 border"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {(
                          search(
                            this.state.tenders,
                            this.state.searchData
                          ) as TenderForValidationInterface[]
                        ).map((item, i) => (
                          <tr
                            onClick={() =>
                              this.setState({ selectedTender: item })
                            }
                            key={i + 1}
                            className={`cursor-pointer hover:text-primary-900 group`}
                          >
                            <td className="px-2 py-2 border text-center">
                              {i + 1}
                            </td>
                            <td className="px-2 py-2 border">
                              {item.tender_name}
                            </td>
                            <td className="px-2 py-2 border">
                              {item.category}
                            </td>
                            <td className="px-2 py-2 border">{item.level}</td>
                            <td className="px-2 py-2 border text-xs">
                              {DateTimeToString(item.published_date)}
                            </td>
                            <td className="px-2 py-2 border text-xs">
                              {DateTimeToString(item.closing_date)}
                            </td>
                            <td className="px-2 py-2 border text-center">
                              {commaFy(
                                item.required_documents.length === 0
                                  ? 0
                                  : item.required_documents[0].total_document
                              )}
                            </td>
                            <td className="px-2 py-1 border w-12">
                              <div className="flex flex-row items-center justify-center gap-2 bg-primary-50 text-primary-900 group-hover:bg-primary-800 group-hover:text-white text-sm px-3 py-2 rounded-md font-semibold">
                                <span>Open</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {this.state.selectedTender !== null && (
          <Modal
            backDrop={true}
            theme={Themes.default}
            close={() => {
              this.setState({ selectedTender: null });
              if (this.props.match.params.tender_id !== undefined) {
                this.props.history.push("/tender-docs-validation");
              }
            }}
            backDropClose={true}
            widthSizeClass={ModalSize.extraExtraLarge}
            displayClose={false}
            padding={{
              title: false,
              body: false,
              footer: undefined,
            }}
          >
            <div className="" style={{ minHeight: "calc(100vh - 100px)" }}>
              <Submissions
                tenderSummaryDetails={this.state.selectedTender}
                onClose={() => {
                  this.setState({ selectedTender: null });
                  if (this.props.match.params.tender_id !== undefined) {
                    this.props.history.push("/tender-docs-validation");
                  }
                }}
                onOpenDocument={(doc_id: string) => {
                  this.state.selectedTender !== null &&
                    this.props.history.push(
                      `/validate-application-document/${
                        this.state.selectedTender.tender_id
                      }/${doc_id}/${
                        this.state.selectedTender.required_documents.find(
                          (itm) => itm.document_id === doc_id
                        )?.opening_date
                      }/${
                        this.state.selectedTender.required_documents.find(
                          (itm) => itm.document_id === doc_id
                        )?.title
                      }`
                    );
                }}
              />
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

export const TenderSubmissions = connect(
  mapStateToProps,
  {}
)(_TenderSubmissions);
