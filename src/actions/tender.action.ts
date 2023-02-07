import axios from "axios";
import { StepItem } from "../components/Register/Steps";
import { API_URL } from "../utils/api";
import { setAxiosToken } from "../utils/AxiosToken";
import { errorToText } from "../utils/functions";
import {
  ApplicationStatus,
  BooleanEnum,
  DocumentType,
  DocumentValidationStep,
  TenderLevel,
  TenderVisibility,
} from "./system.action";

export interface RequiredDocumentInterface {
  document_id: string;
  opening_date: string;
  step: DocumentValidationStep;
  required: BooleanEnum;
  document_type: DocumentType;
}

export interface RequiredDocumentSummary {
  title: string;
  document_id: string;
  opening_date: string;
  required: BooleanEnum;
  step: StepItem;
  type: DocumentType;
  tender_id: string;
  required_document_id: string;
  total_document: number;
  total_validated: number;
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
  visibility: TenderVisibility;
}
export interface TenderForValidationInterface {
  tender_id: string;
  category_id: string;
  category: string;
  tender_name: string;
  details: string;
  level: TenderLevel;
  published_date: string;
  closing_date: string;
  bid_document: string;
  required_documents: RequiredDocumentSummary[];
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

export interface TenderOfferForBiddersInterface {
  tender_id: string;
  category_id: string;
  category: string;
  company_id: string;
  tin_number: string;
  compony_name: string;
  country: string;
  company_phone: string;
  company_email: string;
  tender_name: string;
  details: string;
  level: TenderLevel;
  published_date: string;
  closing_date: string;
  bid_document: string;
  documents: RequiredDocumentInterface[];
}

export interface CompanyTenderApplicationInterface {
  company_id: string;
  application_id: string;
  tender_id: string;
  category_id: string;
  category: string;
  tender_name: string;
  details: string;
  level: TenderLevel;
  published_date: string;
  closing_date: string;
  bid_document: string;
  status: ApplicationStatus;
  documents: {
    application_document_id: string;
    application_id: string;
    doc: string;
    document_id: string;
  }[];
  required_document: {
    title: string;
    document_id: string;
    opening_date: string;
    required: BooleanEnum;
    step: StepItem;
    tender_id: string;
    required_document_id: string;
  }[];
}

export const FC_CreateTender = async (
  data: CreateTenderDataInterface,
  callBack: (
    loading: boolean,
    res: { type: "success" | "error"; msg: string } | null
  ) => void
) => {
  callBack(true, null);
  setAxiosToken();
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
  setAxiosToken();
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

export const FC_GetTendersOffersForBidders = async (
  callBack: (
    loading: boolean,
    res: {
      type: "success" | "error";
      msg: string;
      data: TenderOfferForBiddersInterface[];
    } | null
  ) => void
) => {
  callBack(true, null);
  try {
    const res = await axios.get<TenderOfferForBiddersInterface[]>(
      `${API_URL}/tender/offers`
    );
    if (res) {
      callBack(false, { type: "success", msg: "", data: res.data });
    }
  } catch (error: any) {
    console.log("Err: ", { ...error });
    callBack(false, { type: "error", msg: errorToText(error), data: [] });
  }
};

export const FC_GetCompanyTenderApplications = async (
  company_id: string,
  callBack: (
    loading: boolean,
    res: {
      type: "success" | "error";
      msg: string;
      data: CompanyTenderApplicationInterface[];
    } | null
  ) => void
) => {
  callBack(true, null);
  setAxiosToken();
  try {
    const res = await axios.get<CompanyTenderApplicationInterface[]>(
      `${API_URL}/application/company/${company_id}`
    );
    console.log("Res: ", res);
    if (res) {
      callBack(false, { type: "success", msg: "", data: res.data });
    }
  } catch (error: any) {
    console.log("Err: ", { ...error });
    callBack(false, { type: "error", msg: errorToText(error), data: [] });
  }
};

export const FC_GCreateTenderApplicationDraft = async (
  company_id: string,
  tender_id: string,
  callBack: (
    loading: boolean,
    res: {
      type: "success" | "error";
      msg: string;
      data: {
        application_id: string;
        message: string;
      } | null;
    } | null
  ) => void
) => {
  callBack(true, null);
  setAxiosToken();
  try {
    const res = await axios.post<{ application_id: string; message: string }>(
      `${API_URL}/application`,
      {
        company_id: company_id,
        tender_id: tender_id,
      }
    );
    console.log("Res: ", res.data);
    if (res) {
      callBack(false, {
        type: "success",
        msg: "Created successfully",
        data: res.data,
      });
    }
  } catch (error: any) {
    console.log("Err: ", { ...error });
    callBack(false, { type: "error", msg: errorToText(error), data: null });
  }
};

export const FC_SubmitRequiredDocument = async (
  data: {
    application_id: string;
    required_document_id: string;
    doc: File;
  },
  callBack: (
    loading: boolean,
    res: {
      type: "success" | "error";
      msg: string;
    } | null
  ) => void
) => {
  callBack(true, null);
  setAxiosToken();
  const formData = new FormData();
  formData.append("application_id", data.application_id);
  formData.append("required_document_id", data.required_document_id);
  formData.append("doc", data.doc);
  try {
    const res = await axios.post(`${API_URL}/application/doc`, formData);
    console.log("Res: ", res.data);
    if (res) {
      callBack(false, { type: "success", msg: "Submitted successfully!" });
    }
  } catch (error: any) {
    console.log("Err: ", { ...error });
    callBack(false, { type: "error", msg: errorToText(error) });
  }
};

export const FC_CancelApplication = async (
  application_id: string,
  callBack: (
    loading: boolean,
    res: {
      type: "success" | "error";
      msg: string;
    } | null
  ) => void
) => {
  callBack(true, null);
  setAxiosToken();
  try {
    const res = await axios.delete(`${API_URL}/application/${application_id}`);
    if (res) {
      callBack(false, {
        type: "success",
        msg: "Application canceled successfully",
      });
    }
  } catch (error: any) {
    console.log("Err: ", { ...error });
    callBack(false, { type: "error", msg: errorToText(error) });
  }
};

export const FC_SubmitApplication = async (
  application_id: string,
  callBack: (
    loading: boolean,
    res: {
      type: "success" | "error";
      msg: string;
    } | null
  ) => void
) => {
  callBack(true, null);
  setAxiosToken();
  try {
    const res = await axios.post(`${API_URL}/application/submission`, {
      application_id: application_id,
    });
    if (res) {
      callBack(false, {
        type: "success",
        msg: "Application submitted successfully!",
      });
    }
  } catch (error: any) {
    console.log("Err: ", { ...error });
    callBack(false, { type: "error", msg: errorToText(error) });
  }
};

export const FC_RemoveDocument = async (
  application_document_id: string,
  callBack: (
    loading: boolean,
    res: {
      type: "success" | "error";
      msg: string;
    } | null
  ) => void
) => {
  callBack(true, null);
  setAxiosToken();
  try {
    const res = await axios.delete(
      `${API_URL}/application/doc/${application_document_id}`
    );
    if (res) {
      callBack(false, {
        type: "success",
        msg: "Document removed successfully",
      });
    }
  } catch (error: any) {
    console.log("Err: ", { ...error });
    callBack(false, { type: "error", msg: errorToText(error) });
  }
};

export const FC_GetTendersSummaryForValidation = async (
  company_id: string,
  callBack: (
    loading: boolean,
    res: {
      type: "success" | "error";
      msg: string;
      data: TenderForValidationInterface[];
    } | null
  ) => void
) => {
  callBack(true, null);
  setAxiosToken();
  try {
    const res = await axios.get<TenderForValidationInterface[]>(
      `${API_URL}/tender/offers/summary/company/${company_id}`
    );
    if (res) {
      callBack(false, { type: "success", msg: "", data: res.data });
    }
  } catch (error: any) {
    console.log("Err: ", { ...error });
    callBack(false, { type: "error", msg: errorToText(error), data: [] });
  }
};
