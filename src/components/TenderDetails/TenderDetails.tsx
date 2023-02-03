import React, { Component } from "react";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { BooleanEnum, System } from "../../actions";
import {
  GetTenderOfferInterface,
  RequiredDocumentInterface,
} from "../../actions/tender.action";

interface TenderDetailsProps {
  tender: GetTenderOfferInterface;
  system: System;
  onSelectDocument: (document: RequiredDocumentInterface) => void;
}
interface TenderDetailsState {}

export class TenderDetails extends Component<
  TenderDetailsProps,
  TenderDetailsState
> {
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
            <span className="text-sm text-gray-800 font-bold">
              Bid document
            </span>
            <div className="mt-2">
              <div className="w-full h-64 bg-gray-600 rounded-md"></div>
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
                            <span>
                              {new Date(item.opening_date).toLocaleString()}
                            </span>
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
        </div>
      </div>
    );
  }
}
