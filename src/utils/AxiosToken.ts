import axios from "axios";

export const APP_TOKEN_NAME = "exam_t_tosoweuhfsofo";

export const setAxiosToken = () => {
  if (localStorage[APP_TOKEN_NAME]) {
    axios.defaults.headers.common["exam-token"] = localStorage[APP_TOKEN_NAME];
  } else {
    delete axios.defaults.headers.common["exam-token"];
  }
};
