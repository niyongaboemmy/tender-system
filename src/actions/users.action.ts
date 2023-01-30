import axios from "axios";
import { API_URL, PAYMENT_ORGANIZATION_ID } from "../utils/api";
import { setAxiosToken } from "../utils/AxiosToken";
import { errorToText } from "../utils/functions";

export interface BankUserItemInterface {
  user_id: string;
  valuer_id: string;
  fname: string;
  lname: string;
  gender: string;
  nid: string;
  location: string;
  profile_pic: string | null;
  role_id: string;
  email: string;
  phone: string;
  company_name: string;
  company_logo: string;
  role_name: string;
}

export const FC_GetUsersListByBank = async (
  bank_id: string,
  callBack: (
    loading: boolean,
    res: {
      type: "success" | "error";
      msg: string;
      data: BankUserItemInterface[] | null;
    } | null
  ) => void
) => {
  callBack(true, null);
  setAxiosToken();
  try {
    const res = await axios.get<BankUserItemInterface[]>(
      `${API_URL}/user/bank/${bank_id}`
    );
    callBack(false, {
      type: "success",
      data: res.data,
      msg: "Data loaded successfully!",
    });
  } catch (error: any) {
    callBack(false, {
      type: "error",
      data: null,
      msg: errorToText(error),
    });
    console.log("err: ", { ...error });
  }
};

export const SendPaymentRequest = async (
  data: {
    phone_number: string;
    amount: number;
    transactionId: string;
  },
  callBack: (
    loading: boolean,
    res: {
      type: "success" | "error";
      msg: string;
      data: {
        phone_number: string;
        amount: number;
        transactionId: string;
      };
    } | null
  ) => void
) => {
  callBack(true, null);
  setAxiosToken();
  try {
    const res = await axios.post<{
      code: "401" | "200";
      description: string;
      body: string | null;
      status: "string";
    }>(`https://opay-api.oltranz.com/opay/paymentrequest`, {
      telephoneNumber: data.phone_number,
      amount: data.amount,
      organizationId: PAYMENT_ORGANIZATION_ID,
      description: "VMS Payments",
      callbackUrl: `${API_URL}/payments/online/callback`,
      transactionId: data.transactionId,
    });
    if (res.data.code.toString() === "200".toString()) {
      callBack(false, {
        type: "success",
        data: data,
        msg: res.data.description,
      });
    } else {
      callBack(false, {
        type: "error",
        data: data,
        msg: res.data.description,
      });
    }
  } catch (error: any) {
    callBack(false, {
      type: "error",
      data: data,
      msg: errorToText(error),
    });
    console.log("err: ", { ...error });
  }
};

export const OnlinePaymentRequest = async (
  data: {
    user_id: string;
    telephoneNumber: string;
    amount: number;
    transactionId: string;
  },
  callBack: (
    loading: boolean,
    res: {
      type: "success" | "error";
      msg: string;
      data: {
        user_id: string;
        telephoneNumber: string;
        amount: number;
        transactionId: string;
      };
    } | null
  ) => void
) => {
  callBack(true, null);
  setAxiosToken();
  try {
    await axios.post<{
      code: "401" | "200";
      description: string;
      body: string | null;
      status: "string";
    }>(`${API_URL}/payments/online/request`, data);
    callBack(false, {
      type: "success",
      data: data,
      msg: "Your payment request sent successfully!",
    });
  } catch (error: any) {
    callBack(false, {
      type: "error",
      data: data,
      msg: errorToText(error),
    });
    console.log("err: ", { ...error });
  }
};
