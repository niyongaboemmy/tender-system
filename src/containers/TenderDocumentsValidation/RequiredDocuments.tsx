import React, { Component } from "react";
import { HiArrowSmLeft } from "react-icons/hi";
import {
  RequiredDocumentSummary,
  TenderForValidationInterface,
} from "../../actions/tender.action";
import { commaFy, DateTimeToString, search } from "../../utils/functions";

interface RequiredDocumentsProps {
  tenderSummaryDetails: TenderForValidationInterface;
  onClose: () => void;
  onOpenDocument: (doc_id: string) => void;
}
interface RequiredDocumentsState {
  searchValue: string;
}

export class RequiredDocuments extends Component<
  RequiredDocumentsProps,
  RequiredDocumentsState
> {
  constructor(props: RequiredDocumentsProps) {
    super(props);

    this.state = {
      searchValue: "",
    };
  }
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
  render() {
    return (
      <div>
        <div>
          <div className="p-2 bg-primary-800  flex flex-row items-center justify-between gap-3">
            <div className="flex flex-row items-center gap-3 w-full truncate">
              <div>
                <div
                  onClick={this.props.onClose}
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
                  List of required documents
                </div>
                <div className="text-sm font-light text-yellow-300 truncate">
                  Tender: {this.props.tenderSummaryDetails.tender_name}
                </div>
              </div>
            </div>
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
          </div>
        </div>
        {/* Details */}
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
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="px-3 py-2 border">#</th>
                  <th className="px-3 py-2 border">Document name</th>
                  <th className="px-3 py-2 border text-center">Opening date</th>
                  <th className="px-2 py-2 border text-center">Submissions</th>
                  <th className="px-3 py-2 border text-center">Validated</th>
                  <th className="px-3 py-2 border text-center">Waiting</th>
                  <th className="px-3 py-2 border"></th>
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
                    className={`group cursor-pointer hover:text-primary-900`}
                    onClick={() => this.props.onOpenDocument(item.document_id)}
                  >
                    <td className="px-3 py-2 border">{i + 1}</td>
                    <td className="px-3 py-2 border">{item.title}</td>
                    <td className="px-2 py-2 border text-xs text-center truncate">
                      {DateTimeToString(item.opening_date)}
                    </td>
                    <td className="px-3 py-2 border text-center">
                      {commaFy(item.total_document)}
                    </td>
                    <td className="px-2 py-2 border text-center">
                      {commaFy(item.total_validated)}
                    </td>
                    <td className="px-3 py-2 border text-center">
                      {commaFy(item.total_document - item.total_validated)}
                    </td>
                    <td className="px-1 py-1 border">
                      {item.total_document - item.total_validated > 0 ? (
                        <div className="flex flex-row items-center justify-center gap-2 bg-white text-primary-900 group-hover:bg-primary-800 group-hover:text-white text-sm px-3 py-2 border border-primary-800 rounded font-semibold cursor-pointer">
                          <span>Open</span>
                        </div>
                      ) : (
                        <div className="flex flex-row items-center justify-center gap-2 bg-gray-100 text-gray-600 group-hover:bg-gray-400 group-hover:text-white text-sm px-3 py-2 rounded font-semibold cursor-pointer">
                          Done
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
}
