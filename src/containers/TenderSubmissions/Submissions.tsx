import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiArrowSmLeft } from "react-icons/hi";
import {
  ApplicationDecisionEnum,
  ApplicationDocIsCorrect,
  ApplicationStatus,
  BooleanEnum,
  DocFolder,
} from "../../actions";
import {
  RequiredDocumentSummary,
  RequiredDocumentSummaryExport,
  TenderForValidationInterface,
} from "../../actions/tender.action";
import {
  FC_GetTenderSubmissions,
  TenderDocumentsSubmissionsListInterface,
  TenderSubmissionsListInterface,
} from "../../actions/validate-tender.action";
import Alert, { AlertType } from "../../components/Alert/Alert";
import ExportToExcel from "../../components/GenerateReport/ExportToExcel";
import PdfViewer from "../../components/PdfViewer/PdfViewer";
import { API_URL } from "../../utils/api";
import { commaFy, search } from "../../utils/functions";
import { CompaniesRanking } from "./CompaniesRanking";
import { SetAmountBudget } from "./SetAmountBudget";
import { UpdateCompanyDecision } from "./UpdateCompanyDecision";

interface SubmissionsProps {
  tenderSummaryDetails: TenderForValidationInterface;
  onClose: () => void;
  onOpenDocument: (doc_id: string) => void;
}
interface SubmissionsState {
  searchValue: string;
  loading: boolean;
  error: string;
  data: TenderSubmissionsListInterface[] | null;
  selectedFinancialAmount: {
    application_id: string;
    amount: string;
  } | null;
  addingFinancial: boolean;
  addingFinancialError: {
    application_id: string;
    msg: string;
  } | null;
  addingFinancialSuccess: {
    application_id: string;
    msg: string;
  } | null;
  selectedDocumentPreview: {
    application_id: string;
    document_id: string;
    document: string;
  } | null;
  selectedApplicationId: string;
}

export class Submissions extends Component<SubmissionsProps, SubmissionsState> {
  constructor(props: SubmissionsProps) {
    super(props);

    this.state = {
      searchValue: "",
      loading: false,
      error: "",
      data: null,
      selectedFinancialAmount: null,
      addingFinancial: false,
      addingFinancialError: null,
      addingFinancialSuccess: null,
      selectedDocumentPreview: null,
      selectedApplicationId: "",
    };
  }

  GetTenderSubmissions = () => {
    this.setState({ loading: true });
    FC_GetTenderSubmissions(
      this.props.tenderSummaryDetails.tender_id,
      (
        loading: boolean,
        res: {
          type: "success" | "error";
          msg: string;
          data: TenderSubmissionsListInterface[] | null;
        } | null
      ) => {
        this.setState({ loading: loading });
        if (res?.type === "success") {
          this.setState({
            data:
              res.data !== null
                ? res.data.filter(
                    (itm) => itm.status === ApplicationStatus.SUBMITTED
                  )
                : res.data,
            loading: false,
            error: "",
          });
        }
        if (res?.type === "error") {
          this.setState({ error: res.msg, loading: false, data: [] });
        }
      }
    );
  };

  GetTotalSubmissions = (): number => {
    if (this.state.data === null) {
      return 0;
    }
    return this.state.data.length;
  };
  GetTotalValidate = (): number => {
    if (this.state.data === null) {
      return 0;
    }
    return this.state.data.filter((itm) => itm.decision !== null).length;
  };
  GetTotalWaiting = (): number => {
    return this.GetTotalSubmissions() - this.GetTotalValidate();
  };

  GetTenderCompanyDocument = (
    data: TenderDocumentsSubmissionsListInterface[],
    document_id: string
  ) => {
    const response = data.find((itm) => itm.document_id === document_id);
    return response === undefined ? null : response;
  };

  UpdateFinancialAmount = (application_id: string, amount: string) => {
    if (this.state.data !== null) {
      this.setState({
        data: this.state.data.map((item) => ({
          ...item,
          financial_amount:
            item.application_id === application_id
              ? parseInt(amount)
              : item.financial_amount,
        })),
      });
    }
  };
  UpdateTenderApplicationStatus = (
    application_id: string,
    decision: ApplicationDecisionEnum
  ) => {
    if (this.state.data !== null) {
      this.setState({
        data: this.state.data.map((item) => ({
          ...item,
          decision:
            item.application_id === application_id ? decision : item.decision,
        })),
      });
    }
  };

  GetFilteredData = () => {
    if (this.state.data === null) {
      return [];
    }
    var response = this.state.data;
    if (this.state.selectedApplicationId !== "") {
      response = response.filter(
        (itm) => itm.application_id === this.state.selectedApplicationId
      );
    }
    return response;
  };

  componentDidMount = () => {
    this.GetTenderSubmissions();
  };

  GetStatusColor = (
    data: TenderDocumentsSubmissionsListInterface | null
  ): JSX.Element => {
    if (data === null) {
      return (
        <div className="bg-yellow-100 border border-yellow-300 text-xs px-2 py-1 rounded-md w-max">
          Not found!
        </div>
      );
    }
    if (
      data.is_validated === BooleanEnum.FALSE ||
      data.is_validated === null ||
      data.is_correct === null
    ) {
      return (
        <div
          onClick={() => this.props.onOpenDocument(data.document_id)}
          className="bg-yellow-100 text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white cursor-pointer text-xs px-2 py-1 rounded-md w-max"
        >
          Not validated
        </div>
      );
    }
    if (data.is_correct === ApplicationDocIsCorrect.INVALID) {
      return (
        <div
          onClick={() =>
            this.setState({
              selectedDocumentPreview: {
                application_id: data.application_id,
                document_id: data.document_id,
                document: data.doc,
              },
            })
          }
          className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-md w-max cursor-pointer hover:bg-red-100"
        >
          {data.is_correct}
        </div>
      );
    }
    if (data.is_correct === ApplicationDocIsCorrect.NA) {
      return (
        <div
          onClick={() =>
            this.setState({
              selectedDocumentPreview: {
                application_id: data.application_id,
                document_id: data.document_id,
                document: data.doc,
              },
            })
          }
          className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-md w-max cursor-pointer hover:bg-red-100"
        >
          {data.is_correct}
        </div>
      );
    }
    if (data.is_correct === ApplicationDocIsCorrect.VALID) {
      return (
        <div
          onClick={() =>
            this.setState({
              selectedDocumentPreview: {
                application_id: data.application_id,
                document_id: data.document_id,
                document: data.doc,
              },
            })
          }
          className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-md w-max cursor-pointer hover:bg-green-100"
        >
          {data.is_correct}
        </div>
      );
    }
    return (
      <div
        onClick={() =>
          this.setState({
            selectedDocumentPreview: {
              application_id: data.application_id,
              document_id: data.document_id,
              document: data.doc,
            },
          })
        }
        className="bg-gray-100 text-black text-xs px-2 py-1 rounded-md w-max cursor-pointer hover:bg-gray-200"
      >
        {data.is_correct}
      </div>
    );
  };
  render() {
    if (this.state.selectedDocumentPreview !== null) {
      return (
        <div
          style={{ height: "calc(100vh - 80px)", overflowY: "auto" }}
          className="relative animate__animated animate__fadeIn"
        >
          <div className="flex flex-row items-center gap-2 p-2">
            <div
              onClick={() => this.setState({ selectedDocumentPreview: null })}
              className="bg-yellow-600 text-white hover:bg-yellow-800 px-3 py-2 rounded-md text-sm font-bold cursor-pointer"
            >
              Go Back
            </div>
            <div>
              <div className="font-bold">
                {
                  this.props.tenderSummaryDetails.required_documents.find(
                    (itm) =>
                      itm.document_id ===
                      this.state.selectedDocumentPreview?.document_id
                  )?.title
                }
              </div>
              <div className="text-sm text-yellow-800 font-bold bg-yellow-100 w-max px-2 py-1 rounded-full">
                Company:{" "}
                {
                  this.state.data?.find(
                    (itm) =>
                      itm.application_id ===
                      this.state.selectedDocumentPreview?.application_id
                  )?.compony_name
                }
              </div>
            </div>
          </div>
          <div className="h-screen bg-gray-600">
            <PdfViewer
              file_url={`${API_URL}/docs/${DocFolder.other}/${this.state.selectedDocumentPreview.document}`}
              class_name={"h-screen w-full"}
              frame_title={""}
              setLoadingFile={(state: boolean) =>
                this.setState({ loading: state })
              }
            />
          </div>
          <div
            onClick={() => this.setState({ selectedDocumentPreview: null })}
            className="absolute bottom-3 right-3 bg-primary-800 text-white hover:bg-primary-900 px-3 py-2 font-bold w-max cursor-pointer rounded-md animate__animated animate__bounceInUp animate__slower"
          >
            Yes, Continue
          </div>
        </div>
      );
    }
    return (
      <div className="animate__animated animate__fadeIn">
        <div>
          <div className="p-2 bg-primary-800  flex flex-row items-center justify-between gap-3">
            <div className="flex flex-row items-center gap-3 w-full truncate">
              <div>
                <div
                  onClick={() =>
                    this.state.loading === false && this.props.onClose()
                  }
                  className="px-3 pl-2 py-2 rounded bg-primary-700 text-white hover:bg-primary-750 w-max cursor-pointer flex flex-row items-center justify-center gap-1"
                >
                  <div>
                    <HiArrowSmLeft className="text-2xl" />
                  </div>
                  <span>Back</span>
                </div>
              </div>
              <div className="w-full truncate">
                <div className="text-xl font-bold text-white">
                  Tender Submissions validation
                </div>
                <div className="text-sm font-light text-yellow-300 truncate">
                  Tender: {this.props.tenderSummaryDetails.tender_name}
                </div>
              </div>
            </div>
            {this.state.loading === false && (
              <div className="flex flex-row items-center justify-end gap-2">
                <div className="flex flex-col items-center justify-center text-center bg-primary-750 text-white p-1 px-4 rounded-md border border-blue-400">
                  <div className="text-xs font-light w-full text-white truncate">
                    Submissions
                  </div>
                  <div className="text-lg font-extrabold -mt-1 w-full text-white">
                    {commaFy(this.GetTotalSubmissions())}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center text-center bg-primary-750 text-white p-1 px-4 rounded-md border border-blue-400">
                  <div className="text-xs font-light w-full text-white">
                    Validated
                  </div>
                  <div className="text-lg font-extrabold -mt-1 w-full text-white">
                    {commaFy(this.GetTotalValidate())}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center text-center bg-primary-750 text-white p-1 px-4 rounded-md border border-blue-400">
                  <div className="text-xs font-light w-full text-white">
                    Waiting
                  </div>
                  <div className="text-lg font-extrabold -mt-1 w-full text-white">
                    {commaFy(this.GetTotalWaiting())}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Details */}
        {this.state.loading === true || this.state.data === null ? (
          <div className="flex flex-col items-center justify-center mt-4 bg-gray-100 rounded-md px-3 py-6 m-2 md:m-6 lg:m-10">
            <div>
              <AiOutlineLoading3Quarters className="text-8xl text-yellow-600 animate-spin" />
            </div>
            <div className="text-xl font-light text-center animate__animated animate__fadeIn animate__infinite">
              Loading, please wait
            </div>
          </div>
        ) : (
          <div className="mt-2 p-3">
            <div className="mb-4 flex flex-row items-center gap-2">
              <select
                onChange={(e) =>
                  this.setState({ selectedApplicationId: e.target.value })
                }
                value={this.state.selectedApplicationId}
                className="bg-primary-50 rounded-md text-sm px-4 py-3 w-1/3 font-bold text-primary-900"
              >
                <option value="">All companies - Select</option>
                {this.state.data.map((company, c) => (
                  <option key={c + 1} value={company.application_id}>
                    {company.compony_name} - {company.tin_number}
                  </option>
                ))}
              </select>
              <input
                type="search"
                className="bg-gray-100 rounded-md text-sm px-3 py-3 w-full"
                value={this.state.searchValue}
                onChange={(e) => this.setState({ searchValue: e.target.value })}
                placeholder="Search by document name"
              />
              <ExportToExcel
                fileData={(
                  search(
                    this.props.tenderSummaryDetails.required_documents,
                    this.state.searchValue
                  ) as RequiredDocumentSummaryExport[]
                )
                  .map((item) => {
                    var data = item;
                    for (const selected of this.GetFilteredData()) {
                      data[selected.compony_name] =
                        this.GetTenderCompanyDocument(
                          selected.documents,
                          item.document_id
                        ) === null
                          ? "Doc not found!"
                          : this.GetTenderCompanyDocument(
                              selected.documents,
                              item.document_id
                            )!.is_correct;
                    }
                    return data;
                  })
                  .map((itm, k) => ({
                    No: k + 1,
                    ...itm,
                  }))}
                fileName={
                  this.props.tenderSummaryDetails.tender_name +
                  " - Tender submissions summary"
                }
                btnName="Export Excel"
              />
            </div>
            {this.state.error !== "" && (
              <div className="my-4">
                <Alert
                  alertType={AlertType.DANGER}
                  title={this.state.error}
                  close={() => this.setState({ error: "" })}
                />
              </div>
            )}
            {this.props.tenderSummaryDetails.required_documents.length === 0 ? (
              <div className="px-3 py-6 text-center bg-gray-100 font-light text-xl rounded-md mt-3">
                No requirements found!
              </div>
            ) : (
                search(
                  this.props.tenderSummaryDetails.required_documents,
                  this.state.searchValue
                ) as RequiredDocumentSummary[]
              ).length === 0 ? (
              <div className="px-3 py-6 text-center bg-gray-100 font-light text-xl rounded-md mt-3">
                No result found!
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 border">#</th>
                      <th className="px-3 py-2 border">Document name</th>
                      {this.GetFilteredData().map((item, i) => (
                        <th
                          key={i + 1}
                          className="px-2 py-2 border w-12 truncate"
                        >
                          {item.compony_name} ({item.tin_number})
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(
                      search(
                        this.props.tenderSummaryDetails.required_documents,
                        this.state.searchValue
                      ) as RequiredDocumentSummary[]
                    ).map((item, i) => (
                      <tr key={i + 1} className={`group`}>
                        <td className="px-3 py-2 border w-5">{i + 1}</td>
                        <td className="px-3 py-2 border">{item.title}</td>
                        {this.state.data !== null &&
                          this.GetFilteredData().map((company, c) => (
                            <td key={c + 1} className="px-2 py-2 border w-10">
                              {this.GetStatusColor(
                                this.GetTenderCompanyDocument(
                                  company.documents,
                                  item.document_id
                                )
                              )}
                            </td>
                          ))}
                      </tr>
                    ))}
                    <tr>
                      <td className="px-3 py-2 border">
                        {this.props.tenderSummaryDetails.required_documents
                          .length + 1}
                      </td>
                      <td className="px-3 py-2 border">
                        <div className="text-base font-bold text-primary-900">
                          Company Financial amount
                        </div>
                      </td>
                      {this.GetFilteredData().map((company, c) => (
                        <td key={c + 1} className="px-1 py-1 border w-10">
                          {/*  */}
                          <SetAmountBudget
                            selectedTenderSubmission={company}
                            onUpdateBudge={this.UpdateFinancialAmount}
                          />
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td colSpan={2} className="px-3 py-2"></td>
                      {this.GetFilteredData().map((company, c) => (
                        <td key={c + 1} className="px-2 py-2 border w-10">
                          {/*  */}
                          <UpdateCompanyDecision
                            selectedTenderSubmission={company}
                            onUpdateDecision={
                              this.UpdateTenderApplicationStatus
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {/* Tenders ranking */}
        {this.state.data !== null && (
          <CompaniesRanking
            selectedTenderSubmissions={this.state.data
              .filter(
                (itm) =>
                  itm.decision === ApplicationDecisionEnum.PASS &&
                  itm.financial_amount !== null &&
                  itm.financial_amount !== 0
              )
              .sort((a, b) => {
                const small =
                  a.financial_amount === null ? 0 : a.financial_amount;
                const big =
                  b.financial_amount === null ? 0 : b.financial_amount;
                return small - big;
              })}
            selectedApplicationId={this.state.selectedApplicationId}
          />
        )}
      </div>
    );
  }
}
