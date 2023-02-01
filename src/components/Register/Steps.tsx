import React from "react";
import { IconType } from "react-icons";
import { BsCheckCircleFill } from "react-icons/bs";
import { FaRegUser, FaRegUserCircle, FaUserCircle } from "react-icons/fa";
import { HiBriefcase, HiOutlineBriefcase } from "react-icons/hi";

export enum StepItem {
  STEP1 = "STEP1",
  STEP2 = "STEP2",
}

export const Steps = (props: {
  selected: StepItem;
  selectStep: (step: StepItem) => void;
  isValidated: (step: StepItem) => boolean;
}) => {
  const StepElement = (
    title: string,
    step: StepItem,
    FirstIcon: IconType, // Valid not selected
    SecondIcon: IconType, // Valid selected
    ThirdIcon: IconType // Invalid
  ) => {
    return (
      <div
        onClick={() => props.selectStep(step)}
        className="flex flex-row items-center gap-3 w-full cursor-pointer"
      >
        <div>
          {props.isValidated(step) === true ? (
            props.selected === step ? (
              <FirstIcon className={`text-3xl text-primary-800`} />
            ) : (
              <SecondIcon className={`text-3xl text-green-600`} />
            )
          ) : (
            <ThirdIcon
              className={`text-2xl ${
                props.selected === step ? "text-primary-800" : "text-gray-300"
              }`}
            />
          )}
        </div>
        <div>
          <div
            className={
              props.isValidated(step) === true
                ? props.selected === step
                  ? "text-primary-800"
                  : "text-gray-800"
                : props.selected === step
                ? "text-gray-800"
                : "text-gray-400"
            }
          >
            {title}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="border-b pb-5 mt-5">
      <div className="flex flex-row items-center gap-3">
        {StepElement(
          "Personal info",
          StepItem.STEP1,
          FaUserCircle,
          BsCheckCircleFill,
          FaRegUser
        )}
        {StepElement(
          "Company info",
          StepItem.STEP2,
          HiBriefcase,
          BsCheckCircleFill,
          HiOutlineBriefcase
        )}
      </div>
    </div>
  );
};
