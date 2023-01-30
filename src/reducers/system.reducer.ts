import { Action, ActionTypes, System } from "../actions";
// default state
const defaultState: System = {
  side_nav: false,
  basic_info: null,
  error: "",
  showNavigation: true,
};

/**
 * this is the action
 * @param state
 * @param action
 * @returns
 */
export const systemReducer = (state: System = defaultState, action: Action) => {
  switch (action.type) {
    case ActionTypes.GET_SYSTEM_INFO:
      return {
        ...state,
        basic_info: action.payload,
      };
    case ActionTypes.SET_SYSTEM_ERROR_MESSAGE:
      return {
        ...state,
        error: action.payload,
      };
    case ActionTypes.SET_SHOW_NAVIGATION:
      return {
        ...state,
        showNavigation: action.payload,
      };
    default:
      return state;
  }
};
