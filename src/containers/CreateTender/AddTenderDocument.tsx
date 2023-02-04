import React, { Component } from "react";
import { BsCheckSquareFill } from "react-icons/bs";
import { ImCheckboxUnchecked, ImRadioUnchecked } from "react-icons/im";
import {
  BooleanEnum,
  DocumentType,
  DocumentValidationStep,
  TenderDocumentInterface,
} from "../../actions";
import { RequiredDocumentInterface } from "../../actions/tender.action";
import { search } from "../../utils/functions";

interface AddTenderDocumentProps {
  documents: TenderDocumentInterface[];
  addedDocuments: TenderDocumentInterface[];
  addDocument: (data: RequiredDocumentInterface) => void;
  onClose: () => void;
}
interface AddTenderDocumentState {
  loading: boolean;
  openSelect: boolean;
  selectedDocument: TenderDocumentInterface[];
  step: DocumentValidationStep;
  required: BooleanEnum;
  error: {
    type: "main" | "step" | "selectedDocument";
    msg: string;
  } | null;
  searchData: string;
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
      selectedDocument: [],
      step: DocumentValidationStep.ONE,
      required: BooleanEnum.TRUE,
      error: null,
      searchData: "",
    };
  }
  render() {
    return (
      <div className="pb-6">
        <div className="mb-4 -mt-5">
          <input
            type="search"
            className="px-3 py-2 rounded-md bg-gray-100 w-full"
            placeholder="Search by name"
            value={this.state.searchData}
            onChange={(e) => this.setState({ searchData: e.target.value })}
          />
        </div>
        <div
          className="overflow-y-auto"
          style={{ height: "calc(100vh - 300px)" }}
        >
          {(
            search(
              this.props.documents,
              this.state.searchData
            ) as TenderDocumentInterface[]
          ).length === 0 ? (
            <div className="p-6 text-center w-full text-xl font-light bg-gray-100 rounded-lg">
              No result found
            </div>
          ) : (
            (
              search(
                this.props.documents,
                this.state.searchData
              ) as TenderDocumentInterface[]
            ).map((item, i) => (
              <div
                key={i + 1}
                onClick={() =>
                  this.props.addDocument({
                    document_id: item.document_id,
                    opening_date: ``,
                    required: this.state.required,
                    step: this.state.step,
                    document_type: item.type,
                  })
                }
                className="flex flex-row items-center gap-3 cursor-pointer hover:text-primary-800 mb-2 border-b pb-2"
              >
                <div>
                  {this.props.addedDocuments.find(
                    (itm) => itm.document_id === item.document_id
                  ) === undefined ? (
                    <ImCheckboxUnchecked className="text-gray-500 text-2xl cursor-pointer" />
                  ) : (
                    <BsCheckSquareFill className="text-primary-800 text-2xl cursor-pointer" />
                  )}
                </div>
                <div className="flex flex-col">
                  <div>{item.title}</div>
                  <div className="text-xs text-gray-500">
                    {item.type === DocumentType.ADMIN
                      ? "Administrative"
                      : item.type === DocumentType.TECHNICAL
                      ? "Technical"
                      : "Financial"}{" "}
                    document
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="w-full mt-6"></div>
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
                <BsCheckSquareFill className="text-green-600 text-2xl" />
              ) : (
                <ImRadioUnchecked className="text-2xl text-yellow-500" />
              )}
            </div>
            <div>
              {this.state.required === BooleanEnum.TRUE
                ? "This document is required"
                : "This document is optional"}
            </div>
          </div>
          <div
            onClick={this.props.onClose}
            className=" bg-primary-800 hover:bg-primary-900 text-white px-3 py-2 rounded cursor-pointer"
          >
            Yes, Completed
          </div>
        </div>
      </div>
    );
  }
}
