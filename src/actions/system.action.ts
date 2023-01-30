import axios from "axios";
import { Dispatch } from "redux";
import { ActionTypes } from "./types";
import { API_URL } from "../utils/api";
import { setAxiosToken } from "../utils/AxiosToken";

/**
 * * ****************************** INTERFACES *****************************
 */

export interface BasicInfo {
  roles: any;
  banks: any;
}

interface BasicInfoGetStrings {
  roles: {
    access: string;
    role_id: string;
    role_name: string;
  }[];
  banks: any;
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
      const res = await axios.get<BasicInfoGetStrings>(
        `${API_URL}/register/basicinfo`
      );

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
