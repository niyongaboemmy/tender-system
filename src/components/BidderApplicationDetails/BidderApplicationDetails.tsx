import React, { Component, Fragment } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsArrowLeft, BsCheckCircle, BsFileEarmarkPdf } from "react-icons/bs";
import { RiDraftLine, RiUploadCloud2Fill } from "react-icons/ri";
import { ApplicationStatus, DocFolder, System } from "../../actions";
import {
  CompanyTenderApplicationInterface,
  FC_CancelApplication,
  FC_SubmitApplication,
  FC_SubmitRequiredDocument,
} from "../../actions/tender.action";
import { API_URL } from "../../utils/api";
import { DateTimeToString } from "../../utils/functions";
import Alert, { AlertType } from "../Alert/Alert";
import FilePreview from "../FilePreview/FilePreview";
import Modal, { ModalSize, Themes } from "../Modal/Modal";
import PdfViewer from "../PdfViewer/PdfViewer";

interface BidderApplicationDetailsProps {
  application: CompanyTenderApplicationInterface;
  system: System;
  onBack: () => void;
  onSuccess: () => void;
  onRemoveApplication: () => void;
}
interface BidderApplicationDetailsState {
  viewDocument: string;
  loading: boolean;
  selectedFile: {
    file: File;
    document_id: string;
    document_title: string;
  } | null;
  selectedDocumentPreview: {
    document_id: string;
    title: string;
    doc: string;
  } | null;
  error: string;
  success: string;
  cancelling: boolean;
  submitting: boolean;
}

export class BidderApplicationDetails extends Component<
  BidderApplicationDetailsProps,
  BidderApplicationDetailsState
> {
  constructor(props: BidderApplicationDetailsProps) {
    super(props);

    this.state = {
      loading: false,
      viewDocument: "",
      selectedFile: null,
      error: "",
      success: "",
      cancelling: false,
      submitting: false,
      selectedDocumentPreview: null,
    };
  }
  FindDocument = (document_id: string) => {
    const selected = this.props.application.documents.find(
      (itm) => itm.document_id === document_id
    );
    if (selected !== undefined) {
      return selected;
    }
    return null;
  };
  AddDocument = (
    application_id: string,
    required_document_id: string,
    doc: File
  ) => {
    this.setState({ loading: true });
    FC_SubmitRequiredDocument(
      {
        application_id: application_id,
        required_document_id: required_document_id,
        doc: doc,
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
            error: "",
            success: res.msg,
          });
          // Reload the details
          setTimeout(() => {
            this.props.onSuccess();
          }, 2000);
        }
        if (res?.type === "error") {
          this.setState({
            error: res.msg,
            success: "",
            loading: false,
            selectedFile: null,
          });
        }
      }
    );
  };
  CancelApplication = () => {
    if (
      window.confirm(
        "Are you sure do you want to remove the application? You can not undo the action!"
      ) === true
    ) {
      this.setState({ cancelling: true });
      FC_CancelApplication(
        this.props.application.application_id,
        (
          loading: boolean,
          res: {
            type: "success" | "error";
            msg: string;
          } | null
        ) => {
          this.setState({ cancelling: loading });
          if (res?.type === "success") {
            this.setState({ success: res.msg, error: "", cancelling: false });
            // Reload the details
            setTimeout(() => {
              this.props.onRemoveApplication();
            }, 2000);
          }
          if (res?.type === "error") {
            this.setState({ error: res.msg, success: "", cancelling: false });
          }
        }
      );
    }
  };
  SubmitApplication = () => {
    if (
      this.props.application.required_document.find(
        (itm) =>
          this.props.application.documents.find(
            (test) => test.document_id === itm.document_id
          ) === undefined
      ) !== undefined
    ) {
      //Check of there is document which is not uploaded
      return this.setState({ error: "Please upload all of the documents!" });
    }
    if (
      window.confirm(
        "Are you sure do you want to submit the application?, Make sure you have checked for your submitted documents!"
      ) === true
    ) {
      this.setState({ submitting: true });
      FC_SubmitApplication(
        this.props.application.application_id,
        (
          loading: boolean,
          res: {
            type: "success" | "error";
            msg: string;
          } | null
        ) => {
          this.setState({ submitting: loading });
          if (res?.type === "success") {
            this.setState({ success: res.msg, error: "", submitting: false });
            // Reload the details
            setTimeout(() => {
              this.props.onSuccess();
            }, 2000);
          }
          if (res?.type === "error") {
            this.setState({ error: res.msg, success: "", submitting: false });
          }
        }
      );
    }
  };
  render() {
    if (
      this.state.loading === true ||
      this.state.submitting === true ||
      this.state.cancelling === true
    ) {
      return (
        <div className="bg-white p-3 py-8 px-6 rounded-md">
          <div className="flex flex-col items-center justify-center text-center p-6 py-8">
            <div>
              <AiOutlineLoading3Quarters className="animate-spin text-7xl text-yellow-600" />
            </div>
            <div className="text-lg font-light animate-pulse mt-2">
              Performing action, please wait...
            </div>
          </div>
        </div>
      );
    }
    return (
      <Fragment>
        <div className="bg-white p-3 rounded-md">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-12 border-b pb-4 flex flex-row items-center justify-between gap-2">
              <div className="flex flex-row items-center gap-2">
                <div>
                  <div
                    onClick={this.props.onBack}
                    className="bg-primary-50 text-primary-900 hover:bg-primary-800 hover:text-white rounded-md px-3 py-2 cursor-pointer flex flex-row items-center justify-center gap-2 w-max"
                  >
                    <div>
                      <BsArrowLeft className="text-xl" />
                    </div>
                    <span className="font-bold">Back</span>
                  </div>
                </div>
                <div className="flex flex-col text-sm">
                  <span className="text-lg font-bold text-primary-900">
                    {this.props.application.tender_name}
                  </span>
                  <span className="text-sm font-light">
                    Complete uploading the required document to submit the
                    application
                  </span>
                </div>
              </div>
              <div>
                {this.props.application.status === ApplicationStatus.DRAFT ? (
                  <div className="text-left">
                    <div className="text-yellow-600 font-bold rounded-md text-sm w-max flex flex-row items-center gap-3">
                      <div>
                        <div className="p-2 rounded-lg bg-yellow-100">
                          <RiDraftLine className="text-2xl animate__animated animate__zoomIn animate__infinite animate__slow" />
                        </div>
                      </div>
                      <div className="text-black">
                        <div className="text-sm font-light">
                          Application status
                        </div>
                        <div className="font-bold">Draft, please submit</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center flex flex-col items-end">
                    <div className="text-sm font-bold">Application status</div>
                    <div className="bg-green-100 text-green-600 px-3 py-2 rounded-md text-sm w-max flex flex-row items-center justify-center gap-2">
                      Submitted
                    </div>
                  </div>
                )}
              </div>
            </div>
            {this.state.error !== "" && (
              <div className="col-span-12 my-3">
                <Alert
                  alertType={AlertType.DANGER}
                  title={this.state.error}
                  close={() => {
                    this.setState({ error: "", success: "" });
                  }}
                />
              </div>
            )}
            {this.state.success !== "" && (
              <div className="col-span-12 my-3">
                <Alert
                  alertType={AlertType.SUCCESS}
                  title={this.state.success}
                  close={() => {
                    this.setState({ error: "", success: "" });
                  }}
                />
              </div>
            )}
            <div className="col-span-12">
              <div className="flex flex-col text-sm">
                <div className="flex flex-row items-center justify-between gap-2 mb-4">
                  <span className="text-base text-gray-800 font-bold">
                    Required documents
                  </span>
                  <div></div>
                </div>
                {this.props.application.required_document.map((item, i) => (
                  <div
                    key={i + 1}
                    className={`flex flex-row items-center justify-between gap-2 mb-2 border-b ${
                      this.FindDocument(item.document_id) === null
                        ? ""
                        : "border-blue-200"
                    } group`}
                  >
                    <div className="flex flex-row items-center gap-2 w-full">
                      <div>
                        {this.FindDocument(item.document_id) === null ? (
                          <div className="h-14 w-14 rounded-t-lg flex items-center justify-center bg-gray-100 text-gray-400">
                            <BsFileEarmarkPdf className="text-4xl" />
                          </div>
                        ) : (
                          <div className="h-14 w-14 rounded-t-lg flex items-center justify-center bg-primary-50 text-primary-800">
                            <BsFileEarmarkPdf className="text-4xl" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          {item.title}
                        </div>
                        {this.FindDocument(item.document_id) === null ? (
                          <div className="text-xs font-light italic text-gray-400">
                            Not added
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 mt-1">
                            Validation date:{" "}
                            {DateTimeToString(item.opening_date)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      {this.FindDocument(item.document_id) === null ? (
                        this.props.application.status ===
                        ApplicationStatus.DRAFT ? (
                          <div className="overflow-hidden relative cursor-pointer flex flex-row items-center justify-center">
                            <button className="font-bold bg-white border border-primary-750 text-primary-800 group-hover:bg-primary-800 group-hover:text-white group-hover:border-white px-2 py-2 pr-3 rounded-md w-max cursor-pointer text-sm flex flex-row items-center justify-center gap-2 mb-2">
                              <div>
                                <RiUploadCloud2Fill className="text-2xl" />
                              </div>
                              <span className="">Upload Document</span>
                            </button>
                            <input
                              className="cursor-pointer absolute block py-2 px-4 w-full opacity-0 pin-r pin-t"
                              type={"file"}
                              accept={"pdf/*"}
                              onChange={(e) => {
                                this.setState({
                                  selectedFile:
                                    e.target.files === null ||
                                    e.target.files.length === 0
                                      ? null
                                      : {
                                          document_id: item.document_id,
                                          file: e.target.files[0],
                                          document_title: item.title,
                                        },
                                });
                              }}
                            />
                          </div>
                        ) : (
                          <div className="truncate">Not added</div>
                        )
                      ) : (
                        <div className="flex flex-row items-center justify-end gap-2">
                          <div>
                            <BsCheckCircle className="text-green-600 text-3xl" />
                          </div>
                          <div
                            onClick={() =>
                              this.FindDocument(item.document_id) !== null &&
                              this.setState({
                                selectedDocumentPreview: {
                                  doc: this.FindDocument(item.document_id)!.doc,
                                  document_id: item.document_id,
                                  title: item.title,
                                },
                              })
                            }
                            className="px-3 py-2 rounded-md font-bold bg-gray-100 text-gray-800 hover:bg-gray-500 hover:text-white cursor-pointer w-max"
                          >
                            View
                          </div>
                          {this.props.application.status ===
                            ApplicationStatus.DRAFT && (
                            <div className="px-3 py-2 rounded-md bg-red-100 text-red-800 hover:bg-red-600 hover:text-white cursor-pointer w-max">
                              Remove
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-12 flex flex-row items-center justify-end gap-2">
              <div
                onClick={() => this.CancelApplication()}
                className="bg-yellow-100 text-yellow-800 hover:text-white hover:bg-yellow-700 px-3 py-2 rounded-md w-max cursor-pointer"
              >
                Cancel application
              </div>
              {this.props.application.status === ApplicationStatus.DRAFT && (
                <div
                  onClick={() => this.SubmitApplication()}
                  className="bg-green-600 text-white hover:bg-green-700 px-3 py-2 rounded-md w-max cursor-pointer"
                >
                  Submit application
                </div>
              )}
            </div>
          </div>
        </div>
        {this.state.selectedFile !== null && (
          <Modal
            backDrop={true}
            theme={Themes.default}
            close={() =>
              this.state.loading === false &&
              this.setState({ selectedFile: null })
            }
            backDropClose={true}
            widthSizeClass={ModalSize.extraLarge}
            displayClose={true}
            padding={{
              title: true,
              body: undefined,
              footer: undefined,
            }}
            title={this.state.selectedFile.document_title}
          >
            {this.state.success !== "" && (
              <div className="col-span-12 my-3">
                <Alert
                  alertType={AlertType.SUCCESS}
                  title={this.state.success}
                  close={() => {
                    this.setState({ error: "", success: "" });
                  }}
                />
              </div>
            )}
            {this.state.loading === false ? (
              <div
                className="overflow-y-auto"
                style={{ height: "calc(100vh - 200px)" }}
              >
                <FilePreview
                  selectedFile={this.state.selectedFile.file}
                  onClose={() => {}}
                  isComponent={true}
                  className="h-full"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 py-8">
                <div>
                  <AiOutlineLoading3Quarters className="animate-spin text-7xl text-yellow-600" />
                </div>
                <div className="text-lg font-light animate-pulse mt-2">
                  Saving changes, please wait...
                </div>
              </div>
            )}
            {this.state.loading === false && (
              <div className="border-t p-3 flex flex-row items-center justify-end gap-2">
                <div
                  onClick={() => this.setState({ selectedFile: null })}
                  className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-500 hover:text-white cursor-pointer"
                >
                  Cancel
                </div>
                <div
                  onClick={() =>
                    this.state.selectedFile !== null &&
                    this.AddDocument(
                      this.props.application.application_id,
                      this.state.selectedFile.document_id,
                      this.state.selectedFile.file
                    )
                  }
                  className="px-3 py-2 rounded-md bg-primary-800 hover:bg-primary-500 text-white cursor-pointer"
                >
                  Submit document
                </div>
              </div>
            )}
          </Modal>
        )}
        {this.state.selectedDocumentPreview !== null && (
          <Modal
            backDrop={true}
            theme={Themes.default}
            close={() =>
              this.state.loading === false &&
              this.setState({ selectedDocumentPreview: null })
            }
            backDropClose={true}
            widthSizeClass={ModalSize.extraLarge}
            displayClose={true}
            padding={{
              title: true,
              body: undefined,
              footer: undefined,
            }}
            title={this.state.selectedDocumentPreview.title}
          >
            {this.state.success !== "" && (
              <div className="col-span-12 my-3">
                <Alert
                  alertType={AlertType.SUCCESS}
                  title={this.state.success}
                  close={() => {
                    this.setState({ error: "", success: "" });
                  }}
                />
              </div>
            )}
            {this.state.loading === false ? (
              <div
                className="overflow-y-auto bg-gray-500"
                style={{ height: "calc(100vh - 200px)" }}
              >
                <PdfViewer
                  file_url={`${API_URL}/docs/${DocFolder.other}/${this.state.selectedDocumentPreview.doc}`}
                  class_name={"min-h-screen h-min w-full"}
                  frame_title={""}
                  setLoadingFile={(state: boolean) =>
                    this.setState({ loading: state })
                  }
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 py-8">
                <div>
                  <AiOutlineLoading3Quarters className="animate-spin text-7xl text-yellow-600" />
                </div>
                <div className="text-lg font-light animate-pulse mt-2">
                  Loading, please wait...
                </div>
              </div>
            )}
            {this.state.loading === false && (
              <div className="border-t p-3 flex flex-row items-center justify-end gap-2">
                <div
                  onClick={() =>
                    this.setState({ selectedDocumentPreview: null })
                  }
                  className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-500 hover:text-white cursor-pointer"
                >
                  Close window
                </div>
                {this.props.application.status === ApplicationStatus.DRAFT && (
                  <div
                    onClick={() => {
                      // Waiting
                    }}
                    className="px-3 py-2 rounded-md bg-red-100 text-red-700 hover:bg-red-700 hover:text-white cursor-pointer"
                  >
                    Remove document
                  </div>
                )}
              </div>
            )}
          </Modal>
        )}
      </Fragment>
    );
  }
}
