import React, { Component, Fragment } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsFileEarmarkPdf, BsFileMedicalFill } from "react-icons/bs";
import { MdOutlineClose } from "react-icons/md";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Auth, BooleanEnum, System, TenderLevel } from "../../actions";
import {
  FC_CreateTender,
  RequiredDocumentInterface,
} from "../../actions/tender.action";
import Alert, { AlertType } from "../../components/Alert/Alert";
import LoadingComponent from "../../components/Loading/LoadingComponent";
import Modal, { ModalSize, Themes } from "../../components/Modal/Modal";
import { StoreState } from "../../reducers";
import { AddTenderDocument } from "./AddTenderDocument";

interface CreateTenderProps {
  auth: Auth;
  system: System;
}
interface CreateTenderState {
  loading: boolean;
  success: string;
  error: {
    type:
      | "main"
      | "category_id"
      | "company_id"
      | "tender_name"
      | "details"
      | "level"
      | "bid_document"
      | "published_date"
      | "published_time"
      | "closing_date"
      | "closing_time"
      | "required_document";
    msg: string;
  } | null;
  selectDocument: boolean;
  //   Form
  category_id: string;
  company_id: string;
  tender_name: string;
  details: string;
  level: TenderLevel;
  bid_document: File | null;
  published_date: string;
  published_time: string;
  closing_date: string;
  closing_time: string;
  required_document: RequiredDocumentInterface[];
}

const InitialState: CreateTenderState = {
  category_id: "",
  company_id: "",
  tender_name: "",
  details: "",
  level: TenderLevel.NATIONAL,
  bid_document: null,
  published_date: "",
  published_time: "",
  closing_date: "",
  closing_time: "",
  required_document: [],
  loading: false,
  success: "",
  error: null,
  selectDocument: false,
};
class _CreateTender extends Component<CreateTenderProps, CreateTenderState> {
  constructor(props: CreateTenderProps) {
    super(props);

    this.state = InitialState;
  }
  //   Create tender
  SubmitTenderCreated = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Initialize company
    var companyId = "";
    if (
      this.props.auth.user !== null &&
      this.props.auth.user.company.length > 0 &&
      this.state.company_id === ""
    ) {
      companyId = this.props.auth.user.company[0].company_id;
      this.setState({ company_id: this.props.auth.user.company[0].company_id });
    }
    // Validation data
    if (this.state.category_id === "") {
      return this.setState({
        error: { type: "category_id", msg: "Please select tender category" },
      });
    }
    if (companyId === "") {
      return this.setState({
        error: {
          type: "main",
          msg: "Tender provider is not found! Please contact the administrator",
        },
      });
    }
    if (this.state.tender_name === "") {
      return this.setState({
        error: { type: "tender_name", msg: "Please fill tender title" },
      });
    }
    if (this.state.details === "") {
      return this.setState({
        error: { type: "details", msg: "Please fill tender description" },
      });
    }

    if (this.state.published_date === "") {
      return this.setState({
        error: {
          type: "published_date",
          msg: "Please fill tender publication date",
        },
      });
    }
    if (this.state.published_time === "") {
      return this.setState({
        error: {
          type: "published_time",
          msg: "Please fill tender publication time",
        },
      });
    }
    if (this.state.closing_date === "") {
      return this.setState({
        error: {
          type: "closing_date",
          msg: "Please fill tender closing date",
        },
      });
    }
    if (this.state.closing_time === "") {
      return this.setState({
        error: {
          type: "closing_time",
          msg: "Please fill tender closing time",
        },
      });
    }
    if (this.state.bid_document === null) {
      return this.setState({
        error: {
          type: "bid_document",
          msg: "Please select tender BID document",
        },
      });
    }
    if (this.state.required_document.length <= 0) {
      return this.setState({
        error: {
          type: "required_document",
          msg: "Please select tender required documents",
        },
      });
    }
    // Submit data
    this.setState({ loading: true });
    FC_CreateTender(
      {
        bid_document: this.state.bid_document,
        category_id: this.state.category_id,
        closing_date: `${this.state.closing_date} ${this.state.closing_time}`,
        company_id: companyId,
        details: this.state.details,
        level: this.state.level,
        published_date: `${this.state.published_date} ${this.state.published_time}`,
        required_document: this.state.required_document,
        tender_name: this.state.tender_name,
      },
      (
        loading: boolean,
        res: { type: "success" | "error"; msg: string } | null
      ) => {
        this.setState({ loading: loading });
        if (res?.type === "success") {
          this.setState(InitialState);
          this.setState({ loading: false, success: res.msg, error: null });
        }
        if (res?.type === "error") {
          this.setState({
            error: { type: "main", msg: res.msg },
            success: "",
            loading: false,
          });
        }
      }
    );
  };
  //   Did mount
  componentDidMount(): void {
    // Initialize company prepared bid
  }
  render() {
    if (this.props.system.basic_info === null) {
      return <LoadingComponent />;
    }
    return (
      <Fragment>
        <div className="mx-0 md:mx-2">
          <div>
            <div className="flex flex-row items-center justify-between gap-2 w-full my-3">
              <div className="flex flex-row items-center gap-2">
                <div>
                  <BsFileMedicalFill className="text-5xl font-bold text-primary-800" />
                </div>
                <div className="font-bold items-center text-2xl">
                  <div>Create tender offer</div>
                  <div className="text-sm text-gray-500">
                    Fill the following form to create tender offer
                  </div>
                </div>
              </div>
              <div>
                <Link
                  to="/tenders-list"
                  className="bg-white text-primary-800 font-bold px-3 py-2 rounded cursor-pointer hover:bg-primary-800 hover:text-white"
                >
                  View tenders
                </Link>
              </div>
            </div>
          </div>
          {/* Body */}
          <div className="">
            <form onSubmit={this.SubmitTenderCreated}>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-6">
                  <div className="bg-white rounded-md p-3 h-full">
                    <div className="mb-3 font-bold text-lg">
                      General tender information
                    </div>
                    <div>
                      <div className="flex flex-col mb-4">
                        <div className="text-sm mb-1">Tender category</div>
                        <select
                          className={`px-3 py-2 rounded bg-gray-100 w-full ${
                            this.state.error?.type === "category_id"
                              ? "border border-red-600"
                              : ""
                          }`}
                          value={this.state.category_id}
                          onChange={(e) =>
                            this.setState({
                              category_id: e.target.value,
                              error: null,
                            })
                          }
                          disabled={this.state.loading}
                        >
                          <option value=""></option>
                          {this.props.system.basic_info.category.map(
                            (category, c) => (
                              <option key={c + 1} value={category.category_id}>
                                {category.category}
                              </option>
                            )
                          )}
                        </select>
                        {this.state.error?.type === "category_id" && (
                          <Alert
                            alertType={AlertType.DANGER}
                            title={this.state.error.msg}
                            close={() => this.setState({ error: null })}
                          />
                        )}
                      </div>
                      <div className="flex flex-col mb-4">
                        <div className="text-sm mb-1">Tender level</div>
                        <select
                          className={`px-3 py-2 rounded bg-gray-100 w-full ${
                            this.state.error?.type === "level"
                              ? "border border-red-600"
                              : ""
                          }`}
                          value={this.state.level}
                          onChange={(e) =>
                            this.setState({
                              level: e.target.value as TenderLevel,
                              error: null,
                            })
                          }
                          disabled={this.state.loading}
                        >
                          {[
                            TenderLevel.NATIONAL,
                            TenderLevel.INTERNATIONAL,
                          ].map((tenderLevel, l) => (
                            <option key={l + 1} value={tenderLevel}>
                              {tenderLevel}
                            </option>
                          ))}
                        </select>
                        {this.state.error?.type === "level" && (
                          <Alert
                            alertType={AlertType.DANGER}
                            title={this.state.error.msg}
                            close={() => this.setState({ error: null })}
                          />
                        )}
                      </div>
                      <div className="flex flex-col mb-4">
                        <div className="text-sm mb-1">Tender title/name</div>
                        <input
                          type={"text"}
                          className={`px-3 py-2 rounded bg-gray-100 w-full ${
                            this.state.error?.type === "tender_name"
                              ? "border border-red-600"
                              : ""
                          }`}
                          value={this.state.tender_name}
                          onChange={(e) =>
                            this.setState({
                              tender_name: e.target.value,
                              error: null,
                            })
                          }
                          disabled={this.state.loading}
                        />
                        {this.state.error?.type === "tender_name" && (
                          <Alert
                            alertType={AlertType.DANGER}
                            title={this.state.error.msg}
                            close={() => this.setState({ error: null })}
                          />
                        )}
                      </div>
                      <div className="flex flex-row items-center justify-center gap-4 w-full">
                        <div className="flex flex-col mb-4 w-full">
                          <div className="text-sm mb-1">Publication date</div>
                          <input
                            type={"date"}
                            className={`px-3 py-2 rounded bg-gray-100 w-full ${
                              this.state.error?.type === "published_date"
                                ? "border border-red-600"
                                : ""
                            }`}
                            value={this.state.published_date}
                            onChange={(e) =>
                              this.setState({
                                published_date: e.target.value,
                                error: null,
                              })
                            }
                            disabled={this.state.loading}
                          />
                          {this.state.error?.type === "published_date" && (
                            <Alert
                              alertType={AlertType.DANGER}
                              title={this.state.error.msg}
                              close={() => this.setState({ error: null })}
                            />
                          )}
                        </div>
                        <div className="flex flex-col mb-4 w-full">
                          <div className="text-sm mb-1">Publication time</div>
                          <input
                            type={"time"}
                            className={`px-3 py-2 rounded bg-gray-100 w-full ${
                              this.state.error?.type === "published_time"
                                ? "border border-red-600"
                                : ""
                            }`}
                            value={this.state.published_time}
                            onChange={(e) =>
                              this.setState({
                                published_time: e.target.value,
                                error: null,
                              })
                            }
                            disabled={this.state.loading}
                          />
                          {this.state.error?.type === "published_time" && (
                            <Alert
                              alertType={AlertType.DANGER}
                              title={this.state.error.msg}
                              close={() => this.setState({ error: null })}
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row items-center justify-center gap-4 w-full mt-2 mb-2">
                        <div className="flex flex-col mb-4 w-full">
                          <div className="text-sm mb-1">Closing date</div>
                          <input
                            type={"date"}
                            className={`px-3 py-2 rounded bg-gray-100 w-full ${
                              this.state.error?.type === "closing_date"
                                ? "border border-red-600"
                                : ""
                            }`}
                            value={this.state.closing_date}
                            onChange={(e) =>
                              this.setState({
                                closing_date: e.target.value,
                                error: null,
                              })
                            }
                            disabled={this.state.loading}
                          />
                          {this.state.error?.type === "closing_date" && (
                            <Alert
                              alertType={AlertType.DANGER}
                              title={this.state.error.msg}
                              close={() => this.setState({ error: null })}
                            />
                          )}
                        </div>
                        <div className="flex flex-col mb-4 w-full">
                          <div className="text-sm mb-1">Closing time</div>
                          <input
                            type={"time"}
                            className={`px-3 py-2 rounded bg-gray-100 w-full ${
                              this.state.error?.type === "closing_time"
                                ? "border border-red-600"
                                : ""
                            }`}
                            value={this.state.closing_time}
                            onChange={(e) =>
                              this.setState({
                                closing_time: e.target.value,
                                error: null,
                              })
                            }
                            disabled={this.state.loading}
                          />
                          {this.state.error?.type === "closing_time" && (
                            <Alert
                              alertType={AlertType.DANGER}
                              title={this.state.error.msg}
                              close={() => this.setState({ error: null })}
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-sm mb-1">Tender description</div>
                        <textarea
                          className={`px-3 py-2 rounded bg-gray-100 w-full ${
                            this.state.error?.type === "details"
                              ? "border border-red-600"
                              : ""
                          }`}
                          value={this.state.details}
                          onChange={(e) =>
                            this.setState({
                              details: e.target.value,
                              error: null,
                            })
                          }
                          disabled={this.state.loading}
                        />
                        {this.state.error?.type === "details" && (
                          <Alert
                            alertType={AlertType.DANGER}
                            title={this.state.error.msg}
                            close={() => this.setState({ error: null })}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <div className="bg-white rounded-md p-3 h-full">
                    <div className="mb-3 font-bold text-lg">
                      Tender documents
                    </div>
                    <div>
                      <div className="flex flex-col mb-4">
                        <div className="text-sm mb-1">Bid Document</div>
                        <input
                          type={"file"}
                          className={`px-3 py-2 rounded bg-gray-100 w-full ${
                            this.state.error?.type === "bid_document"
                              ? "border border-red-600"
                              : ""
                          }`}
                          onChange={(e) =>
                            this.setState({
                              bid_document:
                                e.target.files === null ||
                                e.target.files.length === 0
                                  ? null
                                  : e.target.files[0],
                              error: null,
                            })
                          }
                          disabled={this.state.loading}
                        />
                        {this.state.error?.type === "bid_document" && (
                          <Alert
                            alertType={AlertType.DANGER}
                            title={this.state.error.msg}
                            close={() => this.setState({ error: null })}
                          />
                        )}
                      </div>
                      {/* Required documents should be added here */}
                      <div>
                        {this.state.required_document.length > 0 && (
                          <div className="flex flex-row items-center justify-between gap-3">
                            <div className="font-bold text-lg mt-2 mb-5">
                              <div>
                                Tender required documents{" "}
                                <span className="bg-yellow-600 text-white text-sm px-2 rounded-lg">
                                  {this.state.required_document.length}
                                </span>
                              </div>
                              <div className="text-xs font-light">
                                List of documents that bidders will upload and
                                validated
                              </div>
                            </div>
                            <div
                              onClick={() =>
                                this.state.loading === false &&
                                this.setState({ selectDocument: true })
                              }
                              className="bg-white text-sm font-bold border border-primary-700 rounded px-3 py-2 cursor-pointer text-primary-800 hover:bg-primary-800 hover:text-white hover:border-primary-800"
                            >
                              Add document
                            </div>
                          </div>
                        )}
                        {/* List fo required documents */}
                        {this.state.required_document.length === 0 ? (
                          <div className="flex flex-col items-center justify-center w-full bg-gray-100 rounded-md p-5 py-8 text-center mt-3 animate__animated animate__fadeIn animate__slower">
                            <div className="mb-3">
                              <BsFileEarmarkPdf className="text-7xl text-gray-300" />
                            </div>
                            <div className="text-lg font-bold">
                              No required documents added
                            </div>
                            <div className="text-xs text-gray-500">
                              List of documents that bidders will upload so that
                              they will be validated
                            </div>
                            <div
                              onClick={() =>
                                this.setState({ selectDocument: true })
                              }
                              className="bg-white mt-4 text-sm font-bold border border-primary-700 rounded px-3 py-2 cursor-pointer text-primary-800 hover:bg-primary-800 hover:text-white hover:border-primary-800"
                            >
                              Add document
                            </div>
                          </div>
                        ) : (
                          <div
                            className="overflow-y-auto"
                            style={{ maxHeight: "400px" }}
                          >
                            {this.state.required_document.map((item, i) => (
                              <div
                                key={i + 1}
                                className="bg-primary-50 flex flex-row items-center gap-2 rounded-md p-2 mb-2"
                              >
                                <div className="flex flex-row items-center gap-2 w-full">
                                  <div>
                                    <BsFileEarmarkPdf className="text-4xl text-primary-800" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-sm">
                                      {
                                        this.props.system.basic_info?.document.find(
                                          (itm) =>
                                            itm.document_id === item.document_id
                                        )?.title
                                      }{" "}
                                      {item.required === BooleanEnum.FALSE && (
                                        <span className="text-xs px-2 rounded-md bg-yellow-600 text-white">
                                          {item.required === BooleanEnum.FALSE
                                            ? "Optional"
                                            : ""}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-gray-500">
                                      <div className="flex flex-row items-center gap-2 text-xs mt-1">
                                        <span>Opening date</span>
                                        <span>{item.opening_date}</span>
                                      </div>
                                      <div className="flex flex-row items-center gap-2 text-xs">
                                        <span>Opening step</span>
                                        <span>{item.step}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          "Are you sure do you want to remove this document requirement?"
                                        ) === true
                                      ) {
                                        this.setState({
                                          required_document:
                                            this.state.required_document.filter(
                                              (itm) =>
                                                itm.document_id !==
                                                item.document_id
                                            ),
                                        });
                                      }
                                    }}
                                    className="flex items-center justify-center bg-white text-red-700 rounded-full cursor-pointer hover:bg-red-600 p-1 hover:text-white"
                                  >
                                    <MdOutlineClose className="text-2xl" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {this.state.success !== "" && (
                      <div className="mt-3">
                        <Alert
                          alertType={AlertType.SUCCESS}
                          title={this.state.success}
                          close={() =>
                            this.setState({ error: null, success: "" })
                          }
                        />
                      </div>
                    )}
                    {this.state.error !== null &&
                      this.state.error.type === "main" && (
                        <div className="mt-3">
                          <Alert
                            alertType={AlertType.DANGER}
                            title={this.state.error.msg}
                            close={() =>
                              this.setState({ error: null, success: "" })
                            }
                          />
                        </div>
                      )}
                    <div className="mt-3 mb-3">
                      <button
                        type="submit"
                        disabled={this.state.loading}
                        className="px-3 py-2 rounded bg-primary-800 hover:bg-primary-900 text-white flex flex-row items-center justify-center gap-2"
                      >
                        {this.state.loading === true && (
                          <div>
                            <AiOutlineLoading3Quarters className="text-2xl animate-spin" />
                          </div>
                        )}
                        <span
                          className={`${
                            this.state.loading === true
                              ? "animate__animated animate__fadeIn animate__infinite"
                              : ""
                          }`}
                        >
                          {this.state.loading === true
                            ? "Loading, please wait..."
                            : "Create tender"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        {this.state.selectDocument === true && (
          <Modal
            backDrop={true}
            theme={Themes.default}
            close={() => this.setState({ selectDocument: false })}
            backDropClose={true}
            widthSizeClass={ModalSize.large}
            displayClose={true}
            padding={{
              title: true,
              body: true,
              footer: undefined,
            }}
            title={<div>Add new required bid document</div>}
          >
            <AddTenderDocument
              documents={this.props.system.basic_info.document.filter(
                (itm) =>
                  this.state.required_document.find(
                    (item) => item.document_id === itm.document_id
                  ) === undefined
              )}
              addDocument={(data: RequiredDocumentInterface) => {
                this.setState({
                  required_document: [...this.state.required_document, data],
                  selectDocument: false,
                });
              }}
            />
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

export const CreateTender = connect(mapStateToProps, {})(_CreateTender);
