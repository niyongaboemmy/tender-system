import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { HiArrowSmLeft } from "react-icons/hi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { ApplicationDocIsCorrect, BooleanEnum } from "../../actions";
import {
  RequiredDocumentSummary,
  TenderForValidationInterface,
} from "../../actions/tender.action";
import {
  FC_GetTenderSubmissions,
  TenderDocumentsSubmissionsListInterface,
  TenderSubmissionsListInterface,
} from "../../actions/validate-tender.action";
import Alert, { AlertType } from "../../components/Alert/Alert";
import { commaFy, search } from "../../utils/functions";

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
}

export class Submissions extends Component<SubmissionsProps, SubmissionsState> {
  constructor(props: SubmissionsProps) {
    super(props);

    this.state = {
      searchValue: "",
      loading: false,
      error: "",
      data: null,
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
          this.setState({ data: res.data, loading: false, error: "" });
        }
        if (res?.type === "error") {
          this.setState({ error: res.msg, loading: false, data: [] });
        }
      }
    );
  };

  GetTotalDocuments = (): number => {
    var total: number = 0;
    for (const item of this.props.tenderSummaryDetails.required_documents) {
      total += item.total_document;
    }
    return total;
  };
  GetTotalValidate = (): number => {
    var total: number = 0;
    for (const item of this.props.tenderSummaryDetails.required_documents) {
      total += item.total_validated;
    }
    return total;
  };
  GetTotalWaiting = (): number => {
    return this.GetTotalDocuments() - this.GetTotalValidate();
  };

  GetTenderCompanyDocument = (
    data: TenderDocumentsSubmissionsListInterface[],
    document_id: string
  ) => {
    const response = data.find((itm) => itm.document_id === document_id);
    return response === undefined ? null : response;
  };

  GetNotValidateDocuments = (
    data: TenderDocumentsSubmissionsListInterface[]
  ) => {
    return data.filter(
      (itm) =>
        itm.is_validated === null || itm.is_validated === BooleanEnum.FALSE
    );
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
        <div className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-md w-max">
          Rejected
        </div>
      );
    }
    return (
      <div className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-md w-max">
        Accepted
      </div>
    );
  };
  render() {
    return (
      <div>
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
                    Total Docs
                  </div>
                  <div className="text-lg font-extrabold -mt-1 w-full text-white">
                    {commaFy(this.GetTotalDocuments())}
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
            <div className="mb-4">
              <input
                type="search"
                className="bg-gray-100 rounded-md text-sm px-4 py-3 w-full"
                value={this.state.searchValue}
                onChange={(e) => this.setState({ searchValue: e.target.value })}
                placeholder="Search by name"
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
                      {this.state.data.map((item, i) => (
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
                      <tr
                        key={i + 1}
                        className={`group hover:text-primary-900`}
                      >
                        <td className="px-3 py-2 border w-5">{i + 1}</td>
                        <td className="px-3 py-2 border">{item.title}</td>
                        {this.state.data !== null &&
                          this.state.data.map((company, c) => (
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
                      <td colSpan={2} className="px-3 py-2">
                        {/* <div className="text-xl font-bold">
                          Validate company
                        </div> */}
                      </td>
                      {this.state.data.map((company, c) => (
                        <td key={c + 1} className="px-2 py-2 border w-10">
                          {console.log("Test not validated: ", {
                            notValidated: this.GetNotValidateDocuments(
                              company.documents
                            ),
                            allDocs: company.documents,
                          })}
                          {this.GetNotValidateDocuments(company.documents)
                            .length === 0 ? (
                            <div className="border border-primary-700 hover:border-primary-800 text-primary-900 hover:bg-primary-800 hover:text-white px-3 py-1 pr-2 text-sm font-bold rounded w-max flex flex-row items-center justify-center gap-2 cursor-pointer">
                              <span>Validate</span>
                              <div>
                                <RiArrowDropDownLine className="text-2xl" />
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-yellow-600 flex flex-row items-center gap-1 py-1">
                              <div>
                                <BsInfoCircle className="text-xl" />
                              </div>
                              <span className="text-black truncate">
                                Validate all docs
                              </span>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
