import React, { Component } from "react";
import { BsArrowRight, BsCheckCircle, BsCheckSquareFill } from "react-icons/bs";
import { ImRadioUnchecked } from "react-icons/im";
import {
  BooleanEnum,
  DocumentValidationStep,
  TenderDocumentInterface,
} from "../../actions";
import { RequiredDocumentInterface } from "../../actions/tender.action";
import Alert, { AlertType } from "../../components/Alert/Alert";
import SelectCustom from "../../components/SelectCustom/SelectCustom";

interface AddTenderDocumentProps {
  documents: TenderDocumentInterface[];
  addDocument: (data: RequiredDocumentInterface) => void;
}
interface AddTenderDocumentState {
  loading: boolean;
  openSelect: boolean;
  selectedDocument: TenderDocumentInterface | null;
  opening_date: string;
  opening_time: string;
  step: DocumentValidationStep;
  required: BooleanEnum;
  error: {
    type:
      | "main"
      | "opening_date"
      | "opening_time"
      | "step"
      | "selectedDocument";
    msg: string;
  } | null;
}

export class AddTenderDocument extends Component<
  AddTenderDocumentProps,
  AddTenderDocumentState
> {
  constructor(props: AddTenderDocumentProps) {
    super(props);

    this.state = {
      loading: false,
      openSelect: false,
      selectedDocument: null,
      opening_date: "",
      step: DocumentValidationStep.ONE,
      required: BooleanEnum.TRUE,
      opening_time: "",
      error: null,
    };
  }
  SendData = () => {
    // Validation
    if (this.state.selectedDocument === null) {
      return this.setState({
        error: { type: "selectedDocument", msg: "Select document" },
      });
    }
    if (this.state.opening_date === "") {
      return this.setState({
        error: { type: "opening_date", msg: "Select opening date" },
      });
    }
    if (this.state.opening_time === "") {
      return this.setState({
        error: { type: "opening_time", msg: "Select opening time" },
      });
    }
    // submit
    this.props.addDocument({
      document_id: this.state.selectedDocument.document_id,
      opening_date: `${this.state.opening_date} ${this.state.opening_time}`,
      required: this.state.required,
      step: this.state.step,
    });
  };
  render() {
    return (
      <div className="">
        <div className="-mt-4 border-t mb-4"></div>
        <div>
          <div className="text-sm mb-1">Document type</div>
          <div
            onClick={() => this.setState({ openSelect: true })}
            className="flex flex-row items-center justify-between px-2 py-2 w-full bg-gray-100 cursor-pointer rounded mb-2 hover:bg-primary-50 hover:text-primary-900"
          >
            <div className="flex flex-row items-center gap-3">
              {this.state.selectedDocument !== null && (
                <div>
                  <BsCheckCircle className="text-2xl" />
                </div>
              )}
              <span>
                {this.state.selectedDocument === null ? (
                  <span className="font-bold">Select document type</span>
                ) : (
                  this.state.selectedDocument.title
                )}
              </span>
            </div>
            <div>
              <BsArrowRight className="text-xl" />
            </div>
          </div>
          {this.state.openSelect === true && (
            <div>
              <SelectCustom
                loading={this.state.loading}
                id={"document_id"}
                title={"title"}
                close={() => this.setState({ openSelect: false })}
                data={this.props.documents}
                click={(data: TenderDocumentInterface) => {
                  const getDocument = this.props.documents.find(
                    (itm) => itm.document_id === data.document_id
                  );
                  this.setState({
                    selectedDocument:
                      getDocument === undefined ? null : getDocument,
                    openSelect: false,
                  });
                }}
              />
            </div>
          )}
          {this.state.error?.type === "selectedDocument" && (
            <Alert
              alertType={AlertType.DANGER}
              title={this.state.error.msg}
              close={() => this.setState({ error: null })}
            />
          )}
        </div>
        <div className="flex flex-col mt-4">
          <div className="text-sm mb-1">Validation step</div>
          <select
            className={`px-3 py-2 rounded bg-gray-100 w-full ${
              this.state.error?.type === "step" ? "border border-red-600" : ""
            }`}
            value={this.state.step}
            onChange={(e) =>
              this.setState({
                step: e.target.value as DocumentValidationStep,
                error: null,
              })
            }
            disabled={this.state.loading}
          >
            <option value=""></option>
            {[
              DocumentValidationStep.ONE,
              DocumentValidationStep.TWO,
              DocumentValidationStep.THREE,
            ].map((step, s) => (
              <option key={s + 1} value={step}>
                {step}
              </option>
            ))}
          </select>
          {this.state.error?.type === "step" && (
            <Alert
              alertType={AlertType.DANGER}
              title={this.state.error.msg}
              close={() => this.setState({ error: null })}
            />
          )}
        </div>
        <div className="flex flex-row items-center justify-center gap-4 w-full">
          <div className="flex flex-col mt-4 w-full">
            <div className="text-sm mb-1">Document opening date</div>
            <input
              type={"date"}
              className={`px-3 py-2 rounded bg-gray-100 w-full ${
                this.state.error?.type === "opening_date"
                  ? "border border-red-600"
                  : ""
              }`}
              value={this.state.opening_date}
              onChange={(e) =>
                this.setState({
                  opening_date: e.target.value,
                  error: null,
                })
              }
              disabled={this.state.loading}
            />
            {this.state.error?.type === "opening_date" && (
              <Alert
                alertType={AlertType.DANGER}
                title={this.state.error.msg}
                close={() => this.setState({ error: null })}
              />
            )}
          </div>
          <div className="flex flex-col mt-4 w-full">
            <div className="text-sm mb-1">Document opening time</div>
            <input
              type={"time"}
              className={`px-3 py-2 rounded bg-gray-100 w-full ${
                this.state.error?.type === "opening_time"
                  ? "border border-red-600"
                  : ""
              }`}
              value={this.state.opening_time}
              onChange={(e) =>
                this.setState({
                  opening_time: e.target.value,
                  error: null,
                })
              }
              disabled={this.state.loading}
            />
            {this.state.error?.type === "opening_time" && (
              <Alert
                alertType={AlertType.DANGER}
                title={this.state.error.msg}
                close={() => this.setState({ error: null })}
              />
            )}
          </div>
        </div>
        <div className="w-full border-t mt-6"></div>
        <div className="mt-4 flex flex-row items-center justify-between">
          <div
            onClick={() =>
              this.setState({
                required:
                  this.state.required === BooleanEnum.TRUE
                    ? BooleanEnum.FALSE
                    : BooleanEnum.TRUE,
              })
            }
            className="flex flex-row items-center gap-2 cursor-pointer"
          >
            <div>
              {this.state.required === BooleanEnum.TRUE ? (
                <BsCheckSquareFill className="text-primary-800 text-2xl" />
              ) : (
                <ImRadioUnchecked className="text-2xl" />
              )}
            </div>
            <div>
              {this.state.required === BooleanEnum.TRUE
                ? "This document is required"
                : "This document is optional"}
            </div>
          </div>
          <div
            onClick={() => this.SendData()}
            className="bg-primary-800 hover:bg-primary-900 text-white px-3 py-2 rounded cursor-pointer"
          >
            Add document requirement
          </div>
        </div>
      </div>
    );
  }
}
