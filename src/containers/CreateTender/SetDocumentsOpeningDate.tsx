import React, { Component } from "react";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { HiOutlineArrowSmLeft } from "react-icons/hi";
import {
  DocumentType,
  DocumentValidationStep,
  TenderVisibility,
} from "../../actions";
import { RequiredDocumentInterface } from "../../actions/tender.action";
import Alert, { AlertType } from "../../components/Alert/Alert";
import { DateTimeToString } from "../../utils/functions";

interface SetDocumentsOpeningDateProps {
  requiredDocuments: RequiredDocumentInterface[];
  setRequiredDocuments: (data: RequiredDocumentInterface[]) => void; //The output
  onSubmitTender: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  tenderVisibility: TenderVisibility;
  setTenderVisibility: (visibility: TenderVisibility) => void;
}
interface EditDocumentOpeningDate {
  document_type: DocumentType;
  opening_date: string;
  opening_time: string;
}
interface SetDocumentsOpeningDateState {
  requiredDocuments: RequiredDocumentInterface[];
  editDocument: EditDocumentOpeningDate | null;
  error: string;
}

export class SetDocumentsOpeningDate extends Component<
  SetDocumentsOpeningDateProps,
  SetDocumentsOpeningDateState
> {
  constructor(props: SetDocumentsOpeningDateProps) {
    super(props);

    this.state = {
      requiredDocuments: this.props.requiredDocuments,
      editDocument: null,
      error: "",
    };
  }
  SubmitTender = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validation here
    if (this.state.requiredDocuments.length === 0) {
      return this.setState({
        error:
          "No documents requirements added, please go back and add documents requirements",
      });
    }
    if (
      this.state.requiredDocuments.find((itm) => itm.opening_date === "") !==
      undefined
    ) {
      return this.setState({
        error: "Please add opening date and time for every document category",
      });
    }
    // Submit the result
    this.props.onSubmitTender(e);
  };
  setDocumentStatus = (selectedCategoryDetails: EditDocumentOpeningDate) => {
    if (selectedCategoryDetails.opening_date === "") {
      return this.setState({
        error: "Please select opening date",
      });
    }
    if (selectedCategoryDetails.opening_time === "") {
      return this.setState({
        error: "Please select opening time",
      });
    }
    const selectedDocuments = this.state.requiredDocuments.filter(
      (itm) => itm.document_type === selectedCategoryDetails.document_type
    );
    const res: RequiredDocumentInterface[] = [];
    for (const item of selectedDocuments) {
      res.push({
        document_id: item.document_id,
        document_type: item.document_type,
        opening_date: `${selectedCategoryDetails.opening_date} ${selectedCategoryDetails.opening_time}`,
        required: item.required,
        step:
          item.document_type === DocumentType.ADMIN
            ? DocumentValidationStep.ONE
            : item.document_type === DocumentType.TECHNICAL
            ? DocumentValidationStep.TWO
            : DocumentValidationStep.THREE,
      });
    }
    res.length > 0 &&
      this.setState({
        requiredDocuments: [
          ...this.state.requiredDocuments.filter(
            (itm) =>
              res.find((test) => test.document_id === itm.document_id) ===
              undefined
          ),
          ...res,
        ],
      });
    //   Update list
    this.props.setRequiredDocuments([
      ...this.state.requiredDocuments.filter(
        (itm) =>
          res.find((test) => test.document_id === itm.document_id) === undefined
      ),
      ...res,
    ]);
    this.setState({ editDocument: null });
  };
  GetDocumentTypeDateTime = (
    document_type: DocumentType
  ): RequiredDocumentInterface | null => {
    const response = this.state.requiredDocuments.find(
      (itm) => itm.document_type === document_type
    );
    if (response !== undefined && response.opening_date !== "") {
      return response;
    }
    return null;
  };
  render() {
    const DocumentCategories = [
      {
        documentType: DocumentType.ADMIN,
        title: "Administrative document",
      },
      {
        documentType: DocumentType.TECHNICAL,
        title: "Technical document",
      },
      {
        documentType: DocumentType.FINANCIAL,
        title: "Financial document",
      },
    ].filter(
      (itm) =>
        this.state.requiredDocuments.find(
          (test) => test.document_type === itm.documentType
        ) !== undefined
    );
    return (
      <div>
        <div className="flex flex-row items-center gap-2 mb-3 border-b pb-3">
          <div
            onClick={this.props.onClose}
            className="px-3 py-2 pl-2 rounded-md bg-primary-50 text-primary-800 hover:bg-primary-100 cursor-pointer flex flex-row items-center gap-1 justify-center"
          >
            <div>
              <HiOutlineArrowSmLeft className="text-2xl" />
            </div>
            <span>Back</span>
          </div>
          <div>
            <div className="font-bold text-xl">
              Set Document category opening date and time
            </div>
            {/* <div className="text-sm font-light">
              You are required to assign opening time for every document
              category before submit
            </div> */}
          </div>
        </div>
        <div>
          <form onSubmit={this.SubmitTender}>
            {DocumentCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center bg-gray-100 rounded-md p-6">
                <div className="mb-2">
                  <div>
                    <BsFileEarmarkPdf className="text-7xl text-gray-300" />
                  </div>
                </div>
                <div className="text-xl font-bold text-gray-500">
                  No documents requirements found!
                </div>
                <div className="text-sm font-light mb-4 text-gray-400">
                  Please go back and add documents requirements
                </div>
                <div
                  onClick={this.props.onClose}
                  className="bg-white text-primary-900 font-semibold hover:bg-primary-900 hover:text-white px-3 py-2 rounded-md cursor-pointer w-max text-sm border border-primary-700 hover:border-white"
                >
                  Continue
                </div>
              </div>
            ) : (
              DocumentCategories.map((item, i) => (
                <div
                  key={i + 1}
                  className={`border-b flex flex-row items-end justify-between gap-2 mb-3 pb-3`}
                >
                  <div className="w-full">
                    <div className="flex flex-row items-center gap-2 mb-4">
                      <div>
                        <BsFileEarmarkPdf className="text-primary-800 text-2xl" />
                      </div>
                      <div className="font-bold">{item.title}</div>
                    </div>
                    {this.state.editDocument?.document_type ===
                    item.documentType ? (
                      <div className="flex flex-row items-center gap-2 w-full">
                        <div className="flex flex-col w-full">
                          <span className="text-sm">Opening date</span>
                          <input
                            type={"date"}
                            className="bg-gray-100 rounded-md px-3 py-2 w-full text-sm"
                            onChange={(e) =>
                              this.setState({
                                editDocument: {
                                  document_type: item.documentType,
                                  opening_date: e.target.value,
                                  opening_time:
                                    this.state.editDocument === null
                                      ? ""
                                      : this.state.editDocument.opening_time,
                                },
                                error: "",
                              })
                            }
                            value={
                              this.state.editDocument === null
                                ? ""
                                : this.state.editDocument.opening_date
                            }
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <span className="text-sm">Opening time</span>
                          <input
                            type={"time"}
                            className="bg-gray-100 rounded-md px-3 py-2 w-full text-sm"
                            onChange={(e) =>
                              this.setState({
                                editDocument: {
                                  document_type: item.documentType,
                                  opening_time: e.target.value,
                                  opening_date:
                                    this.state.editDocument === null
                                      ? ""
                                      : this.state.editDocument.opening_date,
                                },
                                error: "",
                              })
                            }
                            value={
                              this.state.editDocument === null
                                ? ""
                                : this.state.editDocument.opening_time
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-row items-center gap-2 w-full">
                        <div className="flex flex-col px-1">
                          <div className="text-sm">Opening date and time</div>
                          <div className="font-bold text-sm">
                            {this.GetDocumentTypeDateTime(item.documentType) ===
                            null ? (
                              <span className="text-center text-yellow-600">
                                Not found!
                              </span>
                            ) : (
                              DateTimeToString(
                                this.GetDocumentTypeDateTime(item.documentType)!
                                  .opening_date
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    {this.GetDocumentTypeDateTime(item.documentType) === null ||
                    this.state.editDocument?.document_type ===
                      item.documentType ? (
                      this.state.editDocument?.document_type ===
                      item.documentType ? (
                        <div className="flex flex-row items-center justify-end gap-2">
                          <div
                            onClick={() =>
                              this.setState({ editDocument: null })
                            }
                            className="bg-gray-100 text-gray-900 font-semibold hover:bg-gray-500 hover:text-white px-3 py-2 rounded-md cursor-pointer w-max text-sm border border-gray-300 hover:border-white"
                          >
                            Cancel
                          </div>
                          <div
                            onClick={() => {
                              if (this.state.editDocument === null) {
                                this.setState({
                                  error: "Please provide opening date and time",
                                });
                              } else {
                                this.setDocumentStatus(this.state.editDocument);
                              }
                            }}
                            className="bg-white text-primary-900 font-semibold hover:bg-primary-900 hover:text-white px-3 py-2 rounded-md cursor-pointer w-max text-sm border border-primary-700 hover:border-white"
                          >
                            Save changes
                          </div>
                        </div>
                      ) : (
                        this.state.editDocument === null && (
                          <div
                            onClick={() =>
                              this.setState({
                                editDocument: {
                                  document_type: item.documentType,
                                  opening_date: "",
                                  opening_time: "",
                                },
                              })
                            }
                            className="bg-white text-primary-900 font-semibold hover:bg-primary-900 hover:text-white px-3 py-2 rounded-md cursor-pointer w-max text-sm border border-primary-700 hover:border-white"
                          >
                            Add date and time
                          </div>
                        )
                      )
                    ) : (
                      this.state.editDocument === null && (
                        <div
                          onClick={() =>
                            this.setState({
                              editDocument: {
                                document_type: item.documentType,
                                opening_date: "",
                                opening_time: "",
                              },
                            })
                          }
                          className="bg-white text-primary-900 font-semibold hover:bg-primary-900 hover:text-white px-3 py-2 rounded-md cursor-pointer w-max text-sm border border-primary-700 hover:border-white"
                        >
                          Update
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))
            )}
            {this.state.error !== "" && (
              <div>
                <Alert
                  alertType={AlertType.DANGER}
                  title={this.state.error}
                  close={() => this.setState({ error: "" })}
                />
              </div>
            )}
            {DocumentCategories.length > 0 && (
              <div className="flex flex-col w-full bg-gray-100 p-3 my-3">
                <div className="text-sm font-bold mb-1">
                  Choose tender visibility
                </div>
                <select
                  value={this.props.tenderVisibility}
                  onChange={(e) =>
                    this.props.setTenderVisibility(
                      e.target.value as TenderVisibility
                    )
                  }
                  className="border-2 border-yellow-600 w-full px-4 py-3 font-bold text-black rounded-md"
                >
                  <option value={TenderVisibility.PUBLIC}>To the Public</option>
                  <option value={TenderVisibility.PRIVATE}>Private</option>
                </select>
              </div>
            )}
            {DocumentCategories.length > 0 && (
              <div className="mt-3 flex flex-row items-center justify-end gap-2 text-sm">
                <div
                  onClick={this.props.onClose}
                  className="bg-gray-100 hover:bg-gray-500 hover:text-white px-3 py-2 rounded-md cursor-pointer w-max font-bold"
                >
                  Cancel
                </div>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md cursor-pointer w-max font-bold"
                >
                  Submit tender
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }
}
