import React, { Component } from "react";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { BooleanEnum, DocFolder, System } from "../../actions";
import {
  GetTenderOfferInterface,
  RequiredDocumentInterface,
} from "../../actions/tender.action";
import { API_URL } from "../../utils/api";
import PdfViewer from "../PdfViewer/PdfViewer";

interface TenderDetailsProps {
  tender: GetTenderOfferInterface;
  system: System;
  onSelectDocument: (document: RequiredDocumentInterface) => void;
}
interface TenderDetailsState {
  viewDocument: boolean;
}

export class TenderDetails extends Component<
  TenderDetailsProps,
  TenderDetailsState
> {
  constructor(props: TenderDetailsProps) {
    super(props);

    this.state = {
      viewDocument: false,
    };
  }
  render() {
    return (
      <div className="">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-12">
            <div className="flex flex-col text-sm">
              <span className="text-sm text-gray-500">Tender title</span>
              <span>{this.props.tender.tender_name}</span>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="flex flex-col text-sm">
              <span className="text-sm text-gray-500">Tender category</span>
              <span>{this.props.tender.category}</span>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="flex flex-col text-sm">
              <span className="text-sm text-gray-500">Tender level</span>
              <span>{this.props.tender.level}</span>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="flex flex-col text-sm">
              <span className="text-sm text-gray-500">Publication date</span>
              <span>
                {new Date(this.props.tender.published_date).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="flex flex-col text-sm">
              <span className="text-sm text-gray-500">Closing date</span>
              <span>
                {new Date(this.props.tender.closing_date).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="col-span-12">
            <div className="flex flex-col text-sm">
              <span className="text-sm text-gray-500">Tender description</span>
              <span>{this.props.tender.details}</span>
            </div>
          </div>
          <div className="col-span-12">
            <div className="flex flex-row items-center justify-between gap-2">
              <span className="text-sm text-gray-800 font-bold">
                Bid document
              </span>
              {this.state.viewDocument === true && (
                <div>
                  <div
                    onClick={() => this.setState({ viewDocument: false })}
                    className="px-3 py-2 rounded-md border border-primary-700 hover:border-white bg-primary-50 text-primary-900 w-max text-sm font-bold hover:bg-primary-800 hover:text-white cursor-pointer"
                  >
                    Hide document
                  </div>
                </div>
              )}
            </div>
            <div className="mt-2">
              <div className="w-full h-full bg-gray-500 rounded-md flex items-center justify-center">
                {this.state.viewDocument === true ? (
                  <PdfViewer
                    file_url={`${API_URL}/docs/${DocFolder.bid}/${this.props.tender.bid_document}`}
                    class_name={"w-full h-screen rounded-md"}
                    frame_title={""}
                    setLoadingFile={(state: boolean) => {}}
                  />
                ) : (
                  <div className="p-6">
                    <div
                      onClick={() => this.setState({ viewDocument: true })}
                      className="px-3 py-2 rounded-md border border-white bg-primary-800 w-max text-sm font-bold hover:bg-primary-900 text-white cursor-pointer"
                    >
                      View document
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-12">
            <div className="flex flex-col text-sm mt-3">
              <span className="text-sm text-gray-800 font-bold">
                Required documents
              </span>
              <div className="mt-2">
                {this.props.tender.documents.map((item, i) => (
                  <div
                    key={i + 1}
                    className="bg-gray-50 flex flex-row items-center gap-2 rounded-md p-2 mb-2 cursor-pointer hover:bg-primary-50 hover:text-primary-900 group"
                    onClick={() => this.props.onSelectDocument(item)}
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
                                itm.document_id.toString() ===
                                item.document_id.toString()
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
                        <div className="text-gray-600">
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
                      <div className="px-3 py-2 rounded-md bg-white w-max text-sm font-bold group-hover:bg-primary-800 group-hover:text-white cursor-pointer">
                        Validate
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
