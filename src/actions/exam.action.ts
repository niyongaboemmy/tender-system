import axios from "axios";
import { API_URL } from "../utils/api";
import { setAxiosToken } from "../utils/AxiosToken";
import { errorToText } from "../utils/functions";

export enum BooleanEnum {
  TRUE = "TRUE",
  FALSE = "FALSE",
}

export enum QuestionCategoryKey {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  SINGLE_CHOICE = "SINGLE_CHOICE",
  SHORT_ANSWER = "SHORT_ANSWER",
}

export interface QuestionCategory {
  category_id: string;
  key: QuestionCategoryKey;
  category_name: string;
}

export enum QuestionLanguages {
  ENG = "ENG",
  FR = "FR",
}

export interface QuestionAnswerInterface {
  answer_id: string;
  answer_value: string;
  item_id: string;
  question_id: string;
  is_correct: BooleanEnum;
}

export interface QuestionItemInterface {
  item_id: string;
  question_id: string;
  language: QuestionLanguages;
  question_title: string;
  question_description: string;
  question_answers: QuestionAnswerInterface[];
}

export interface QuestionInterface {
  question_id: string;
  category_id: string;
  category: string;
  key: QuestionCategoryKey;
  category_name: string;
  marks: string;
  question: QuestionItemInterface[];
  status: BooleanEnum;
  exam_id: string;
}

// Prepare exam

export interface ExamInterface {
  exam_id: string;
  exam_date: string;
  start_time: string;
  duration: number; // 2hrs
  is_open: BooleanEnum; // True/False
  title: string;
  exam_description: string; // Desc & Rules
  questions: QuestionInterface[];
  is_submitted: BooleanEnum;
}

//Do exam

export interface UserExam {
  user_id: string;
  exam_id: string;
  is_submitted: BooleanEnum;
}

export interface CandidateAnswerSubmittedInterface {
  user_id: string;
  exam_id: string;
  question_id: string;
  item_id: string;
  answers: {
    answer_id: string;
    answer_value: string;
    is_correct: string;
  }[];
}

export interface UserAnswer {
  user_id: string;
  exam_id: string;
  question_id: string;
  answer_id: string;
  question_item_id: string;
  marks: number;
}

export interface ExamMarksGetInterface {
  user_id: string;
  exam_id: string;
  quest_marks: number; // Total exam marks
  cand_marks: number; //Candidate marks
}

// Question languages
export const QuestionLanguagesList: {
  title: string;
  key: QuestionLanguages;
}[] = [
  {
    title: "English",
    key: QuestionLanguages.ENG,
  },
  {
    title: "French",
    key: QuestionLanguages.FR,
  },
];
export const GetLanguageTitle = (lang: QuestionLanguages): string => {
  const response = QuestionLanguagesList.find((itm) => itm.key === lang);
  if (response !== undefined) {
    return response.title;
  }
  return "Invalid language";
};
// Get Question by language

export const GetExamQuestionByLanguage = (
  question: QuestionInterface,
  lang: QuestionLanguages
) => {
  const response = question.question.find((itm) => itm.language === lang);
  if (response !== undefined) {
    return response;
  }
  return null;
};

export const FC_GetUserExams = async (
  callBack: (
    loading: boolean,
    res: {
      data: ExamInterface[];
      type: "error" | "success";
      msg: string;
    } | null
  ) => void
) => {
  callBack(true, null);
  try {
    setAxiosToken();
    const res = await axios.get<ExamInterface[]>(
      `${API_URL}/exams/candidate/${BooleanEnum.TRUE}`
    );
    console.log({ exams_list: res.data });
    callBack(false, {
      type: "success",
      data: res.data,
      msg: "",
    });
  } catch (error) {
    console.log("User not: ", { ...(error as any) });
    callBack(true, {
      type: "error",
      data: [],
      msg: errorToText(error),
    });
  }
};

// Get exam of a candidate loggedIn only
export const FC_GetExamById = async (
  exam_id: string,
  callBack: (
    loading: boolean,
    res: {
      data: ExamInterface[];
      type: "error" | "success";
      msg: string;
    } | null
  ) => void
) => {
  callBack(true, null);
  try {
    setAxiosToken();
    const res = await axios.get<ExamInterface[]>(
      `${API_URL}/exams/candidate/detail/${exam_id}`
    );
    console.log({ selected_exam: res.data });
    callBack(false, {
      type: "success",
      data: res.data,
      msg: "",
    });
  } catch (error) {
    console.log("User not: ", { ...(error as any) });
    callBack(true, {
      type: "error",
      data: [],
      msg: errorToText(error),
    });
  }
};

export const FC_GetCandidateExamAnswers = async (
  exam_id: string,
  callBack: (
    loading: boolean,
    res: {
      data: QuestionAnswerInterface[];
      type: "error" | "success";
      msg: string;
    } | null
  ) => void
) => {
  callBack(true, null);
  try {
    setAxiosToken();
    const res = await axios.get<QuestionAnswerInterface[]>(
      `${API_URL}/exams/candidate/answer/${exam_id}`
    );
    console.log({ exam_answers: res.data });
    callBack(false, {
      type: "success",
      data: res.data,
      msg: "",
    });
  } catch (error) {
    console.log("User not: ", { ...(error as any) });
    callBack(true, {
      type: "error",
      data: [],
      msg: errorToText(error),
    });
  }
};

export const FC_SubmitCandidateAnswer = async (
  data: CandidateAnswerSubmittedInterface,
  callBack: (
    loading: boolean,
    res: {
      type: "error" | "success";
      msg: string;
    } | null
  ) => void
) => {
  callBack(true, null);
  try {
    setAxiosToken();
    const res = await axios.post(`${API_URL}/exams/candidate/answer`, data);
    console.log({ submitted_answer: res.data });
    callBack(false, {
      type: "success",
      msg: "",
    });
  } catch (error) {
    console.log("User not: ", { ...(error as any) });
    callBack(true, {
      type: "error",
      msg: errorToText(error),
    });
  }
};

export const FC_SubmitCandidateExam = async (
  data: {
    exam_id: string;
    is_submitted: BooleanEnum.TRUE;
  },
  callBack: (
    loading: boolean,
    res: {
      type: "error" | "success";
      msg: string;
    } | null
  ) => void
) => {
  callBack(true, null);
  try {
    setAxiosToken();
    const res = await axios.post(`${API_URL}/exams/candidate/submit`, data);
    console.log({ submitted_exam_final: res.data });
    callBack(false, {
      type: "success",
      msg: "",
    });
  } catch (error) {
    console.log("User not: ", { ...(error as any) });
    callBack(true, {
      type: "error",
      msg: errorToText(error),
    });
  }
};

export const FC_GetUserTotalExamMarks = async (
  user_id: string,
  exam_id: string,
  callBack: (
    loading: boolean,
    res: {
      data: ExamMarksGetInterface[];
      type: "error" | "success";
      msg: string;
    } | null
  ) => void
) => {
  callBack(true, null);
  try {
    setAxiosToken();
    const res = await axios.get<ExamMarksGetInterface[]>(
      `${API_URL}/exams/candidate/marks/${user_id}/${exam_id}`
    );
    console.log({ candidate_marks: res.data });
    callBack(false, {
      type: "success",
      data: res.data,
      msg: "",
    });
  } catch (error) {
    console.log("Error: ", { ...(error as any) });
    callBack(true, {
      type: "error",
      data: [],
      msg: errorToText(error),
    });
  }
};
