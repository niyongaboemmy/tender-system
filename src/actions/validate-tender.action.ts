import axios from "axios";
import { API_URL } from "../utils/api";
import { errorToText } from "../utils/functions";
import {
  ApplicationDecisionEnum,
  ApplicationStatus,
  BooleanEnum,
  DocumentType,
  DocumentValidationStep,
  TenderLevel,
} from "./system.action";

export interface DocumentItemForValidation {
  application_document_id: string;
  required_document_id: string;
  application_id: string;
  doc: string;
  is_validated: BooleanEnum;
  comment: string;
  document_id: string;
}

export interface TenderApplicationsListInterface {
  tender_id: string;
  category_id: string;
  category: string;
  tender_name: string;
  details: string;
  level: TenderLevel;
  published_date: string;
  closing_date: string;
  bid_document: string;
  required_document: {
    tender_id: string;
    document_id: string;
    opening_date: string;
    step: DocumentValidationStep;
    required: BooleanEnum;
    title: string;
    type: DocumentType;
  }[];
  application: {
    company_id: string;
    application_id: string;
    document_id: string;
    status: ApplicationStatus;
    documents: {
      application_document_id: string;
      required_document_id: string;
      application_id: string;
      doc: string;
      is_validated: BooleanEnum;
      is_correct: any | null;
      comment: string | null;
      document_id: string;
    }[];
  }[];
}

export const FC_GetTenderApplicationsToBeValidated = async (
  required_document_id: string,
  tender_id: string,
  callBack: (
    loading: boolean,
    res: {
      type: "success" | "error";
      msg: string;
      data: TenderApplicationsListInterface | null;
    } | null
  ) => void
) => {
  callBack(true, null);
  try {
    const res = await axios.get<TenderApplicationsListInterface>(
      `${API_URL}/application/remain/${required_document_id}/${tender_id}`
    );
    console.log("Res: ", res);
    if (res) {
      callBack(false, { type: "success", msg: "", data: res.data });
    }
  } catch (error: any) {
    console.log("Err: ", { ...error });
    callBack(false, { type: "error", msg: errorToText(error), data: null });
  }
};

export const FC_AddTenderApplicationFinancialAmount = async (
  data: {
    application_id: string;
    financial_amount: number;
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
  try {
    const res = await axios.patch(`${API_URL}/application/remain`, data);
    console.log("Res: ", res);
    if (res) {
      callBack(false, { type: "success", msg: "" });
    }
  } catch (error: any) {
    console.log("Err: ", { ...error });
    callBack(false, { type: "error", msg: errorToText(error) });
  }
};

export const FC_SaveApplicationDecision = async (
  data: {
    application_id: string;
    decision: ApplicationDecisionEnum;
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
  try {
    const res = await axios.patch(`${API_URL}/application/decision`, data);
    console.log("Res: ", res);
    if (res) {
      callBack(false, { type: "success", msg: "" });
    }
  } catch (error: any) {
    console.log("Err: ", { ...error });
    callBack(false, { type: "error", msg: errorToText(error) });
  }
};
