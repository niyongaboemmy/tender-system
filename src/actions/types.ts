import {
  CleanUserDetails,
  LoginSuccessDetails,
  LogoutUser,
} from "./auth.action";
import {
  GetSystemInfoAction,
  SetShowNavigationStatusAction,
  SetSystemErrorMessageAction,
} from "./system.action";

export enum ActionTypes {
  LOGIN_DETAILS = "LOGIN_DETAILS",
  USER_LOGIN_SUCCESS_DATA = "USER_LOGIN_SUCCESS_DATA",
  CLEAN_USER_DETAILS = "CLEAN_USER_DETAILS",
  LOGOUT = "LOGOUT",
  GET_SYSTEM_INFO = "GET_SYSTEM_INFO",
  SET_SYSTEM_ERROR_MESSAGE = "SET_SYSTEM_ERROR_MESSAGE",
  SET_SHOW_NAVIGATION = "SET_SHOW_NAVIGATION",
}

export type Action =
  | CleanUserDetails
  | LoginSuccessDetails
  | LogoutUser
  | GetSystemInfoAction
  | SetSystemErrorMessageAction
  | SetShowNavigationStatusAction;
