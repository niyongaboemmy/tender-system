import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsFileEarmarkPdf } from "react-icons/bs";
import {
  ApplicationDocIsCorrect,
  BooleanEnum,
  DocFolder,
  DocumentType,
  GetDocStatus,
} from "../../actions";
import {
  FC_SetApplicationFinancialBudget,
  FC_UpdateDocumentDecision,
  GetApplicationForValidation,
  RequiredDocumentForValidation,
} from "../../actions/validate-tender.action";
import Alert, { AlertType } from "../../components/Alert/Alert";
import PdfViewer from "../../components/PdfViewer/PdfViewer";
import { API_URL } from "../../utils/api";

interface DocumentValidationProps {
  data: GetApplicationForValidation;
  selectedDocument: RequiredDocumentForValidation | null;
  onGoBack: () => void;
  onSubmitUpdate: () => void;
}
interface DocumentValidationState {
  loading: boolean;
  validation_comment: string;
  error: string;
  success: string;
  selectedStatus: ApplicationDocIsCorrect;
  amount: string;
}

export class DocumentValidation extends Component<
  DocumentValidationProps,
  DocumentValidationState
> {
  constructor(props: DocumentValidationProps) {
    super(props);

    this.state = {
      loading: false,
      validation_comment: "",
      error: "",
      success: "",
      selectedStatus: ApplicationDocIsCorrect.VALID,
      amount: "",
    };
  }
  SelectedDocument = () => {
    const response = this.props.data.documents.find(
      (itm) => itm.document_id === this.props.selectedDocument?.document_id
    );
    if (response !== undefined) {
      return response;
    }
    return null;
  };
  ValidateDocument = (selectedStatus: ApplicationDocIsCorrect) => {
    this.SelectedDocument() !== null &&
      FC_UpdateDocumentDecision(
        {
          application_document_id:
            this.SelectedDocument()!.application_document_id,
          is_correct: selectedStatus,
          comment: this.state.validation_comment,
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
            this.setState({
              success: "Status added successfully!",
              loading: false,
              error: "",
            });
            setTimeout(() => {
              this.props.onSubmitUpdate();
            }, 2000);
          }
          if (res?.type === "error") {
            this.setState({ error: res.msg, success: "", loading: false });
          }
        }
      );
  };
  UpdateDocumentStatus = () => {
    const selectedStatus = this.state.selectedStatus;
    this.setState({ error: "", success: "" });
    if (
      window.confirm(
        `Are you sure do you want to set document status as ${GetDocStatus(
          selectedStatus
        )}?`
      ) === true
    ) {
      if (this.state.validation_comment === "") {
        return this.setState({
          error: "Please fill the comment for your decision",
        });
      }
      //   Submit
      this.setState({ loading: true });
      // Update financial amount
      if (
        this.state.amount !== "" &&
        this.props.selectedDocument?.type === DocumentType.FINANCIAL
      ) {
        FC_SetApplicationFinancialBudget(
          {
            application_id: this.props.data.application_id,
            financial_amount: this.state.amount,
          },
          (
            loading: boolean,
            res: {
              type: "success" | "error";
              msg: string;
            } | null
          ) => {
            this.setState({ loading: true });
            if (res?.type === "success") {
              this.ValidateDocument(selectedStatus);
            }
            if (res?.type === "error") {
              this.setState({ error: res.msg, success: "", loading: false });
            }
          }
        );
      } else {
        this.ValidateDocument(selectedStatus);
      }
    }
  };
  render() {
    if (this.props.selectedDocument === null) {
      return (
        <div>
          <div>Document not found!</div>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-12">
        <div
          className="bg-gray-500 h-screen overflow-y-auto col-span-12 lg:col-span-8"
          style={{ height: "calc(100vh - 10px)" }}
        >
          {this.SelectedDocument() === null ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-center p-3">
              <div className="mb-2">
                <BsFileEarmarkPdf className="text-9xl text-gray-300" />
              </div>
              <div className="text-3xl font-bold text-white">
                No Document found!
              </div>
              <div className="text-lg text-gray-300">
                This applicant does not have this type of document
              </div>
            </div>
          ) : (
            <PdfViewer
              file_url={`${API_URL}/docs/${DocFolder.other}/${
                this.SelectedDocument()!.doc
              }`}
              class_name={"w-full h-screen"}
              frame_title={""}
              setLoadingFile={(loading: boolean) =>
                this.setState({ loading: loading })
              }
            />
          )}
        </div>
        <div
          className="col-span-12 lg:col-span-4 p-3 h-screen overflow-y-auto"
          style={{ height: "calc(100vh - 10px)" }}
        >
          <div className="flex flex-row items-center justify-between gap-3">
            <div className="flex flex-row items-center gap-2">
              <span className="text-xl font-bold">Document validation</span>
            </div>
            <div>
              <div
                onClick={() =>
                  this.state.loading === false && this.props.onGoBack()
                }
                className="px-3 py-2 rounded-md bg-red-100 text-red-800 hover:text-white hover:bg-red-600 text-sm font-bold w-max cursor-pointer"
              >
                Close
              </div>
            </div>
          </div>
          {/* Selected document */}
          <div className="bg-primary-50 text-primary-900 rounded p-3 mt-3">
            <div className="flex flex-row items-center gap-2 w-full border-b border-primary-200 pb-2 mb-2">
              <div className="text-sm text-black font-bold">
                Selected Document
              </div>
              <div className="text-sm font-bold px-2 rounded-full text-center w-max flex items-center justify-center bg-primary-800 text-white">
                {this.props.selectedDocument.type} Document
              </div>
            </div>
            <div className="font-bold">{this.props.selectedDocument.title}</div>
          </div>
          <div className="mt-3 bg-white rounded-md pt-3 text-sm">
            <div className="flex flex-col w-full border-b pb-2 mb-2 px-3">
              <span className="text-sm font-light text-gray-500">
                Company name
              </span>
              <span className="font-bold text-primary-900">
                {this.props.data.compony_name}
              </span>
            </div>
            <div className="flex flex-col w-full border-b pb-2 mb-2 px-3">
              <span className="text-sm font-light text-gray-500">Country</span>
              <span>{this.props.data.country}</span>
            </div>
            <div className="flex flex-col w-full border-b pb-2 mb-2 px-3">
              <span className="text-sm font-light text-gray-500">
                Company TIN number
              </span>
              <span>{this.props.data.tin_number}</span>
            </div>
            <div className="flex flex-col w-full border-b pb-2 mb-2 px-3">
              <span className="text-sm font-light text-gray-500">
                Company email
              </span>
              <span>{this.props.data.company_email}</span>
            </div>
            <div className="flex flex-col w-full border-b pb-2 mb-2 px-3">
              <span className="text-sm font-light text-gray-500">
                Company phone number
              </span>
              <span>{this.props.data.company_phone}</span>
            </div>
            <div className="mt-4">
              <div className="mb-2">
                <div className="text-sm mb-1 font-bold">
                  Comment for the document
                </div>
                {this.SelectedDocument() !== null &&
                this.SelectedDocument()!.is_validated === BooleanEnum.TRUE ? (
                  <div className="font-bold text-sm">
                    {this.SelectedDocument()?.comment}
                  </div>
                ) : (
                  <textarea
                    className="bg-gray-100 rounded-md w-full px-3 py-2 text-sm"
                    style={{ minHeight: "80px" }}
                    placeholder="This document is correct"
                    value={this.state.validation_comment}
                    onChange={(e) =>
                      this.setState({
                        validation_comment: e.target.value,
                        error: "",
                        success: "",
                      })
                    }
                  />
                )}
              </div>
              {this.props.selectedDocument.type === DocumentType.FINANCIAL && (
                <div className="mb-4">
                  <div className="text-sm mb-1 font-bold">
                    Financial plan budget amount
                  </div>
                  {this.SelectedDocument() !== null &&
                  this.SelectedDocument()!.is_validated === BooleanEnum.TRUE ? (
                    <div className="font-bold text-sm">
                      {"Amount submitted"}
                    </div>
                  ) : (
                    <input
                      type={"number"}
                      className="bg-gray-100 rounded-md w-full px-3 py-2 text-sm"
                      placeholder="Amount in the document (RWF)"
                      value={this.state.amount}
                      onChange={(e) =>
                        this.setState({
                          amount: e.target.value,
                          error: "",
                          success: "",
                        })
                      }
                    />
                  )}
                </div>
              )}
              {this.state.error !== "" && (
                <div className="my-2">
                  <Alert
                    alertType={AlertType.DANGER}
                    title={this.state.error}
                    close={() => this.setState({ error: "", success: "" })}
                  />
                </div>
              )}
              {this.state.success !== "" && (
                <div className="my-2">
                  <Alert
                    alertType={AlertType.SUCCESS}
                    title={this.state.success}
                    close={() => this.setState({ error: "", success: "" })}
                  />
                </div>
              )}
              {this.state.loading === true ? (
                <div className="py-1">
                  <div className="flex flex-col items-center justify-center w-full text-center">
                    <div className="mb-2">
                      <AiOutlineLoading3Quarters className="text-7xl text-yellow-600 animate-spin" />
                    </div>
                    <span>Loading, please wait...</span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-sm font-bold mb-2">Decision</div>
                  {this.SelectedDocument() !== null &&
                  this.SelectedDocument()!.is_validated ===
                    BooleanEnum.FALSE ? (
                    <>
                      <div className="flex flex-row items-center justify-between gap-2 w-full">
                        <select
                          className="w-full px-3 py-2 rounded-md bg-gray-100"
                          value={this.state.selectedStatus}
                          onChange={(e) =>
                            this.setState({
                              selectedStatus: e.target
                                .value as ApplicationDocIsCorrect,
                            })
                          }
                        >
                          {[
                            ApplicationDocIsCorrect.VALID,
                            ApplicationDocIsCorrect.PNC,
                            ApplicationDocIsCorrect.PC,
                            ApplicationDocIsCorrect.NA,
                            ApplicationDocIsCorrect.INVALID,
                          ].map((doc, d) => (
                            <option key={d + 1} value={doc}>
                              {GetDocStatus(doc)}
                            </option>
                          ))}
                        </select>
                        <div
                          onClick={() => this.UpdateDocumentStatus()}
                          className="px-3 py-2 font-bold rounded-md bg-green-600 text-white hover:bg-green-700 cursor-pointer w-max"
                        >
                          Validate
                        </div>
                      </div>
                    </>
                  ) : this.SelectedDocument() !== null &&
                    this.SelectedDocument()!.is_correct ===
                      ApplicationDocIsCorrect.VALID ? (
                    <div className="bg-green-100 text-green-700 px-2 py-1 rounded-md w-max">
                      Document Accepted
                    </div>
                  ) : (
                    <div className="bg-red-100 text-red-700 px-2 py-1 rounded-md w-max">
                      Document Rejected
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
