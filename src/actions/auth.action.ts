import axios from "axios";
import { Dispatch } from "redux";
import { ActionTypes } from "./types";
import { API_URL } from "../utils/api";
import { APP_TOKEN_NAME, setAxiosToken } from "../utils/AxiosToken";
import { errorToText } from "../utils/functions";

/**
 * * ****************************** INTERFACES *****************************
 */

export interface API_GetUsersDetails {
  user_id: string;
  user_code: string;
  jwt: string;
}

export interface Auth {
  loading: boolean;
  isAuthenticated: boolean;
  token: string;
  user: API_GetUsersDetails | null;
}

//* ********************** ACTION TYPE INTERCACES ********************** */
export interface FetchLoginDetails {
  type: ActionTypes.LOGIN_DETAILS;
  payload: Auth;
}

export interface LoginSuccessDetails {
  type: ActionTypes.USER_LOGIN_SUCCESS_DATA;
  payload: {
    data: API_GetUsersDetails;
    token: string;
  };
}

export interface CleanUserDetails {
  type: ActionTypes.CLEAN_USER_DETAILS;
}

export interface LogoutUser {
  type: ActionTypes.LOGOUT;
}

/**
 * * ****************************** ACTIONS *****************************
 */

export const FC_CleanUserDetails = () => {
  return (dispatch: Dispatch) => {
    dispatch<CleanUserDetails>({
      type: ActionTypes.CLEAN_USER_DETAILS,
    });
  };
};

/**
 * @description Register the account to the api
 * @param account
 * @param MsgHandler return the error from the API
 * @returns
 */
export const FC_Login = (
  data: {
    username: string;
    password: string;
  },
  CallbackFunc: Function
) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.post<API_GetUsersDetails>(
        `${API_URL}/user/login`,
        data
      );

      console.log({ data_after_login: res.data });

      localStorage.setItem(APP_TOKEN_NAME, res.data.jwt);
      dispatch<LoginSuccessDetails>({
        type: ActionTypes.USER_LOGIN_SUCCESS_DATA,
        payload: {
          data: res.data,
          token: res.data.jwt,
        },
      });
      CallbackFunc(true, "");
    } catch (error) {
      console.log("Login err: ", { ...(error as any) });
      console.log("Login err: ", error);
      // CallbackFunc(false, errorToText(error:any));
      CallbackFunc(false, errorToText(error));
    }
  };
};

/**
 * @description Check if the user is logged in based on the logged in account
 * @param account
 * @param MsgHandler return the error from the API
 * @returns
 */

export const FC_CheckLoggedIn = (callBack: (status: boolean) => void) => {
  callBack(false);
  const token = localStorage.getItem(APP_TOKEN_NAME);
  return async (dispatch: Dispatch) => {
    if (token === null) {
      dispatch<LogoutUser>({
        type: ActionTypes.LOGOUT,
      });
      return false;
    }
    try {
      setAxiosToken();
      const res = await axios.get<API_GetUsersDetails>(
        `${API_URL}/user/logged`
      );
      console.log({ logged_user_details: res.data });
      dispatch<LoginSuccessDetails>({
        type: ActionTypes.USER_LOGIN_SUCCESS_DATA,
        payload: {
          data: res.data,
          token: token!,
        },
      });
      callBack(true);
    } catch (error) {
      callBack(false);
      console.log("User not: ", { ...(error as any) });
      dispatch<LogoutUser>({
        type: ActionTypes.LOGOUT,
      });
    }
  };
};

export const FC_ReloadUserInfo = (callBack: (status: boolean) => void) => {
  const token = localStorage.getItem(APP_TOKEN_NAME);
  callBack(false);
  return async (dispatch: Dispatch) => {
    try {
      setAxiosToken();
      const res = await axios.get<API_GetUsersDetails>(
        `${API_URL}/user/current`
      );
      console.log({ logged_user_details: res.data });
      dispatch<LoginSuccessDetails>({
        type: ActionTypes.USER_LOGIN_SUCCESS_DATA,
        payload: {
          data: res.data,
          token: token!,
        },
      });
      callBack(true);
    } catch (error) {
      callBack(false);
      console.log("User not: ", { ...(error as any) });
      dispatch<LogoutUser>({
        type: ActionTypes.LOGOUT,
      });
    }
  };
};

/**
 * @description Logout the user into the system
 * @returns null
 */
export const FC_Logout = () => {
  return (dispatch: Dispatch) => {
    dispatch<LogoutUser>({
      type: ActionTypes.LOGOUT,
    });
  };
};

/**
 * @description Register the account to the api
 * @param account
 * @param MsgHandler return the error from the API
 * @returns
 */

export interface FC_ChangePassword_Interface {
  user_id: string;
  old_password: string;
  new_password: string;
}

export const FC_ChangePassword = (
  data: FC_ChangePassword_Interface,
  callback: Function
) => {
  return async (dispatch: Dispatch) => {
    try {
      setAxiosToken();

      await axios.patch(`${API_URL}/users/changepassword`, {
        user_id: data.user_id,
        old_password: data.old_password,
        new_password: data.new_password,
      });

      callback(true, "");
    } catch (error) {
      callback(false, errorToText(error));
    }
  };
};

/**
 * Edit users documents
 * @param data
 * @param user_id
 * @param callback
 * @returns
 */

export interface FC_ForgetPassword_Interface {
  address: string;
  verify_type: string;
}
/**
 * Send the reset password
 * @param data
 * @param callback
 * @returns
 */
export const FC_ForgetPassword = (
  data: FC_ForgetPassword_Interface,
  callback: Function
) => {
  return async (dispatch: Dispatch) => {
    try {
      setAxiosToken();

      const res = await axios.post<{
        message: string;
        code?: string;
      }>(`${API_URL}/users/password/address`, {
        address: data.address,
        verify_type: data.verify_type,
      });

      console.log({ CODE: res.data.code });

      callback(true, res.data.message);
    } catch (error) {
      callback(false, "errorToText(error:any)");
    }
  };
};

export interface FC_ForgetPassword_Check_Interface {
  address: string;
  verification_code: string;
  new_password: string;
}
/**
 * Send the new password and update that
 * @param data
 * @param callback
 * @returns
 */
export const FC_ForgetPassword_Check = (
  data: FC_ForgetPassword_Check_Interface,
  callback: Function
) => {
  return async (dispatch: Dispatch) => {
    try {
      setAxiosToken();

      const res = await axios.post<{
        message: string;
      }>(`${API_URL}/users/password/reset`, {
        address: data.address,
        verification_code: data.verification_code,
        new_password: data.new_password,
      });

      callback(true, res.data.message);
    } catch (error) {
      callback(false, "errorToText(error:any)");
    }
  };
};
