import axios from "axios";
import { Dispatch } from "redux";
import { ActionTypes } from "./types";
import { API_URL } from "../utils/api";
import { setAxiosToken } from "../utils/AxiosToken";

/**
 * * ****************************** INTERFACES *****************************
 */

export enum UserType {
  HOLDER = "HOLDER",
  BIDER = "BIDER",
}
export enum BooleanEnum {
  TRUE = "TRUE",
  FALSE = "FALSE",
}
export enum DocumentType {
  ADMIN = "ADMIN",
  TECHNICAL = "TECHNICAL",
  FINANCIAL = "FINANCIAL",
}
export enum TenderLevel {
  INTERNATIONAL = "INTERNATIONAL",
  NATIONAL = "NATIONAL",
}
export enum DocumentValidationStep {
  ONE = "ONE",
  TWO = "TWO",
  THREE = "THREE",
}

export enum ApplicationStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
}

export enum DocFolder {
  other = "other",
  bid = "bid",
}

export enum ApplicationDecisionEnum {
  PASS = "PASS",
  FAIL = "FAIL",
}

export enum ApplicationDocIsCorrect {
  VALID = "VALID",
  INVALID = "INVALID",
}

export interface TenderDocumentInterface {
  document_id: string;
  title: string;
  type: DocumentType;
}

export interface TenderCategoryInterface {
  category_id: string;
  category: string;
}

export interface BasicInfo {
  category: TenderCategoryInterface[];
  document: TenderDocumentInterface[];
}

interface BasicInfoGetData {
  category: TenderCategoryInterface[];
  document: TenderDocumentInterface[];
}

export interface System {
  side_nav: boolean;
  basic_info: BasicInfo | null;
  error: string;
  showNavigation: boolean;
}

//* ********************** ACTION TYPE INTERCACES ********************** */
export interface GetSystemInfoAction {
  type: ActionTypes.GET_SYSTEM_INFO;
  payload: BasicInfo;
}

export interface SetSystemErrorMessageAction {
  type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE;
  payload: string;
}

export interface SetShowNavigationStatusAction {
  type: ActionTypes.SET_SHOW_NAVIGATION;
  payload: boolean;
}

/**
 * * ****************************** ACTIONS *****************************
 */
/**
 * @description Register the account to the api
 * @param account
 * @param MsgHandler return the error from the API
 * @returns
 */
export const FC_GetSystemInfo = (callback: (loading: boolean) => void) => {
  return async (dispatch: Dispatch) => {
    callback(true);
    setAxiosToken();
    try {
      const res = await axios.get<BasicInfoGetData>(`${API_URL}/basics/data`);

      console.log({ system_basic_info: res.data });

      dispatch<GetSystemInfoAction>({
        type: ActionTypes.GET_SYSTEM_INFO,
        payload: res.data,
      });
      callback(false);
    } catch (error) {
      callback(false);
      console.log("err: ", { ...(error as any) });
    }
  };
};

export const FC_SetError = (msg: string) => {
  return async (dispatch: Dispatch) => {
    dispatch<SetSystemErrorMessageAction>({
      type: ActionTypes.SET_SYSTEM_ERROR_MESSAGE,
      payload: msg,
    });
  };
};

export const FC_SetShowNavigationStatus = (status: boolean) => {
  return async (dispatch: Dispatch) => {
    dispatch<SetShowNavigationStatusAction>({
      type: ActionTypes.SET_SHOW_NAVIGATION,
      payload: status,
    });
  };
};
