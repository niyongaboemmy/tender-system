import axios from "axios";
import { API_URL } from "../utils/api";
import { errorToText } from "../utils/functions";
import {
  BooleanEnum,
  DocumentValidationStep,
  TenderLevel,
} from "./system.action";

export interface RequiredDocumentInterface {
  document_id: string;
  opening_date: string;
  step: DocumentValidationStep;
  required: BooleanEnum;
}

export interface CreateTenderDataInterface {
  category_id: string;
  company_id: string;
  tender_name: string;
  details: string;
  level: TenderLevel;
  bid_document: File;
  published_date: string;
  closing_date: string;
  required_document: RequiredDocumentInterface[];
}
export interface GetTenderOfferInterface {
  tender_id: string;
  category_id: string;
  category: string;
  tender_name: string;
  details: string;
  level: TenderLevel;
  published_date: string;
  closing_date: string;
  bid_document: string;
  documents: RequiredDocumentInterface[];
}

export const FC_CreateTender = async (
  data: CreateTenderDataInterface,
  callBack: (
    loading: boolean,
    res: { type: "success" | "error"; msg: string } | null
  ) => void
) => {
  callBack(true, null);
  try {
    const formData = new FormData();
    formData.append("category_id", data.category_id);
    formData.append("company_id", data.company_id);
    formData.append("tender_name", data.tender_name);
    formData.append("details", data.details);
    formData.append("level", data.level);
    formData.append("bid_document", data.bid_document);
    formData.append("published_date", data.published_date);
    formData.append("closing_date", data.closing_date);
    formData.append(
      "required_document",
      JSON.stringify(data.required_document)
    );
    // Submit form
    const res = await axios.post(`${API_URL}/tender/offers`, formData);
    if (res) {
      console.log("Response: ", res);
      callBack(false, { type: "success", msg: "Tender created successfully!" });
    }
  } catch (error: any) {
    console.log("Err: ", { ...error });
    callBack(false, { type: "error", msg: errorToText(error) });
  }
};

export const FC_GetTendersOffers = async (
  company_id: string,
  callBack: (
    loading: boolean,
    res: {
      type: "success" | "error";
      msg: string;
      data: GetTenderOfferInterface[];
    } | null
  ) => void
) => {
  callBack(true, null);
  try {
    const res = await axios.get<GetTenderOfferInterface[]>(
      `${API_URL}/tender/offers/company/${company_id}`
    );
    if (res) {
      callBack(false, { type: "success", msg: "", data: res.data });
    }
  } catch (error: any) {
    console.log("Err: ", { ...error });
    callBack(false, { type: "error", msg: errorToText(error), data: [] });
  }
};
