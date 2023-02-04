import React, { Component } from "react";
import { BsArrowLeft, BsFileEarmarkPdf } from "react-icons/bs";
import { IoIosSend } from "react-icons/io";
import { BooleanEnum, DocFolder, System } from "../../actions";
import { TenderOfferForBiddersInterface } from "../../actions/tender.action";
import { API_URL } from "../../utils/api";
import Loading from "../Loading/Loading";
import PdfViewer from "../PdfViewer/PdfViewer";

interface PublicTenderDetailsProps {
  tender: TenderOfferForBiddersInterface;
  system: System;
  onClose: () => void;
  apply: (tender: TenderOfferForBiddersInterface) => void;
}
interface PublicTenderDetailsState {
  loading: boolean;
  viewDocument: boolean;
}

export class PublicTenderDetails extends Component<
  PublicTenderDetailsProps,
  PublicTenderDetailsState
> {
  constructor(props: PublicTenderDetailsProps) {
    super(props);

    this.state = {
      loading: false,
      viewDocument: false,
    };
  }
  render() {
    return (
      <div className="bg-white p-5 rounded-md">
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
            <div className="flex flex-col text-sm mt-3">
              <span className="text-sm text-gray-800 font-bold">
                Required documents
              </span>
              <div className="mt-2">
                {this.props.tender.documents.map((item, i) => (
                  <div
                    key={i + 1}
                    className="bg-gray-50 flex flex-row items-center gap-2 rounded-md p-2 mb-2"
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
                    <div>{/*  */}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-12">
            <div className="flex flex-row items-center justify-between">
              <span className="text-sm text-gray-800 font-bold">
                Bid document
              </span>
              {this.state.viewDocument === true && (
                <div
                  onClick={() => this.setState({ viewDocument: false })}
                  className="px-3 py-2 rounded bg-primary-800 cursor-pointer hover:bg-primary-900 text-white w-max"
                >
                  Hide document
                </div>
              )}
            </div>
            <div className="mt-2">
              {this.state.viewDocument === false ? (
                <div className="w-full h-36 bg-gray-100 rounded-md flex from-white items-center p-8">
                  <div
                    onClick={() => this.setState({ viewDocument: true })}
                    className="px-3 py-2 bg-white text-primary-900 flex flex-row items-center justify-center gap-2 rounded bordr border-primary-700 cursor-pointer hover:border-primary-800 hover:bg-primary-800 hover:text-white w-max"
                  >
                    <div>
                      <BsFileEarmarkPdf className="text-xl" />
                    </div>
                    <span>Open document</span>
                  </div>
                </div>
              ) : (
                <div className="h-screen">
                  {this.state.loading === true ? (
                    <Loading />
                  ) : (
                    <PdfViewer
                      file_url={`${API_URL}/docs/${DocFolder.bid}/${this.props.tender.bid_document}`}
                      class_name={"w-full rounded-md h-screen"}
                      frame_title={"Bid Document"}
                      setLoadingFile={(state: boolean) =>
                        this.setState({ loading: state })
                      }
                      full_height={true}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="col-span-12">
            <div className="pt-4 mt-4 border-t flex flex-row items-center gap-2">
              <div
                onClick={this.props.onClose}
                className="bg-gray-100 hover:text-white hover:bg-primary-750 px-3 py-2 rounded-md flex flex-row items-center justify-center gap-2 cursor-pointer"
              >
                <div>
                  <BsArrowLeft className="text-xl" />
                </div>
                <span className="font-bold">Back to list</span>
              </div>
              {/* <div className="bg-primary-800 text-white px-3 py-2 hover:bg-primary-900 rounded-md flex flex-row items-center justify-center gap-2">
                <span>Apply now</span>
              </div> */}
            </div>
          </div>
        </div>
        <div
          onClick={() => this.props.apply(this.props.tender)}
          className="fixed bottom-4 right-4 cursor-pointer bg-green-600 text-white px-3 py-2 hover:bg-green-700 rounded-md flex flex-row items-center justify-center gap-2"
        >
          <div>
            <IoIosSend className="text-xl" />
          </div>
          <span>Apply now</span>
        </div>
      </div>
    );
  }
}
