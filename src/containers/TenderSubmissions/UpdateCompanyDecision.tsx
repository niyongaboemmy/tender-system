import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsCheckCircle, BsCheckCircleFill, BsInfoCircle } from "react-icons/bs";
import { ImRadioUnchecked } from "react-icons/im";
import { MdClose } from "react-icons/md";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { ApplicationDecisionEnum, BooleanEnum } from "../../actions";
import {
  FC_SaveApplicationDecision,
  TenderDocumentsSubmissionsListInterface,
  TenderSubmissionsListInterface,
} from "../../actions/validate-tender.action";
import Alert, { AlertType } from "../../components/Alert/Alert";

interface UpdateCompanyDecisionProps {
  selectedTenderSubmission: TenderSubmissionsListInterface;
  onUpdateDecision: (
    application_id: string,
    status: ApplicationDecisionEnum
  ) => void;
}
interface UpdateCompanyDecisionState {
  loading: boolean;
  error: string;
  success: string;
  openSelect: boolean;
  selectedApplicationStatus: ApplicationDecisionEnum | null;
}

export class UpdateCompanyDecision extends Component<
  UpdateCompanyDecisionProps,
  UpdateCompanyDecisionState
> {
  constructor(props: UpdateCompanyDecisionProps) {
    super(props);

    this.state = {
      loading: false,
      error: "",
      success: "",
      openSelect: false,
      selectedApplicationStatus: this.props.selectedTenderSubmission.decision,
    };
  }
  GetNotValidateDocuments = (
    data: TenderDocumentsSubmissionsListInterface[]
  ) => {
    return data.filter(
      (itm) =>
        itm.is_validated === null || itm.is_validated === BooleanEnum.FALSE
    );
  };
  UpdateDecision = (decision: ApplicationDecisionEnum) => {
    this.setState({ loading: true });
    FC_SaveApplicationDecision(
      {
        application_id: this.props.selectedTenderSubmission.application_id,
        decision: decision,
      },
      (
        loading: boolean,
        res: {
          type: "success" | "error";
          msg: string;
        } | null
      ) => {
        this.setState({ loading: loading });
        if (res?.type === "success") {
          this.setState({ loading: false, success: res.msg, error: "" });
          this.setState({
            selectedApplicationStatus: decision,
            openSelect: false,
          });
          this.props.onUpdateDecision(
            this.props.selectedTenderSubmission.application_id,
            decision
          );
        }
        if (res?.type === "error") {
          this.setState({ success: "", error: res.msg, loading: false });
        }
      }
    );
  };
  render() {
    if (this.state.loading === true) {
      return (
        <div className="flex flex-row items-center gap-2 px-2 text-yellow-600">
          <div>
            <AiOutlineLoading3Quarters className="text-2xl animate-spin" />
          </div>
          <span className="animate__animated animate__fadeIn animate__infinite animate__faster text-sm truncate">
            Saving, please wait...
          </span>
        </div>
      );
    }
    return (
      <div className="relative">
        {this.GetNotValidateDocuments(
          this.props.selectedTenderSubmission.documents
        ).length === 0 ? (
          <>
            {this.state.openSelect === true ? (
              <div className="flex flex-row items-center justify-between gap-2 w-full">
                <div className="font-bold mt-2">Choose status</div>
                <div
                  onClick={() => this.setState({ openSelect: false })}
                  className="px-2 py-1 rounded-md bg-red-50 hover:bg-red-100 text-red-800 w-max text-sm cursor-pointer"
                >
                  Close
                </div>
              </div>
            ) : this.state.selectedApplicationStatus !== null ? (
              <>
                <div
                  className={`flex flex-row items-center gap-2 cursor-pointer ${
                    this.state.selectedApplicationStatus ===
                    ApplicationDecisionEnum.PASS
                      ? "hover:bg-green-50"
                      : "hover:bg-red-100"
                  } px-3 py-2 pl-2 rounded-md w-full`}
                  onClick={() => this.setState({ openSelect: true })}
                >
                  <div>
                    {this.state.selectedApplicationStatus ===
                    ApplicationDecisionEnum.PASS ? (
                      <div>
                        <BsCheckCircle className="text-2xl text-green-600" />
                      </div>
                    ) : (
                      <div>
                        <MdClose className="text-2xl text-red-700" />
                      </div>
                    )}
                  </div>
                  <div className="truncate">
                    {this.state.selectedApplicationStatus ===
                    ApplicationDecisionEnum.PASS
                      ? "Recommended"
                      : "Not Recommended"}
                  </div>
                </div>
                {/* {this.state.success !== "" && (
                  <div className="mt-2">
                    <Alert
                      alertType={AlertType.SUCCESS}
                      title=""
                      description={this.state.success}
                      close={() => this.setState({ error: "", success: "" })}
                    />
                  </div>
                )} */}
              </>
            ) : (
              <div
                onClick={() =>
                  this.setState({ openSelect: !this.state.openSelect })
                }
                className="bg-primary-800 hover:bg-primary-900 text-white px-3 py-1 pr-2 text-sm font-bold rounded w-max flex flex-row items-center justify-center gap-2 cursor-pointer"
              >
                <span>Validate</span>
                <div>
                  {this.state.openSelect === false ? (
                    <RiArrowDropDownLine className="text-2xl" />
                  ) : (
                    <RiArrowDropUpLine className="text-2xl" />
                  )}
                </div>
              </div>
            )}
            {this.state.openSelect === true && (
              <div className="mt-2">
                {[
                  ApplicationDecisionEnum.PASS,
                  ApplicationDecisionEnum.FAIL,
                ].map((item, i) => (
                  <div
                    key={i + 1}
                    className={`flex flex-row items-center gap-2 ${
                      this.state.selectedApplicationStatus === item
                        ? "bg-green-50 text-green-700 cursor-pointer"
                        : "bg-gray-100 hover:bg-green-600 hover:text-white cursor-pointer"
                    } w-full rounded-md p-2 pr-3 mb-2`}
                    onClick={() => this.UpdateDecision(item)}
                  >
                    <div>
                      {this.state.selectedApplicationStatus === item ? (
                        <div>
                          <BsCheckCircleFill className="text-2xl" />
                        </div>
                      ) : (
                        <div>
                          <ImRadioUnchecked className="text-2xl" />
                        </div>
                      )}
                    </div>
                    <div className="truncate">
                      {item === ApplicationDecisionEnum.PASS
                        ? "Recommended"
                        : "Not Recommended"}
                    </div>
                  </div>
                ))}
                {this.state.error !== "" && (
                  <div className="mt-2">
                    <Alert
                      alertType={AlertType.DANGER}
                      title=""
                      description={this.state.error}
                      close={() => this.setState({ error: "", success: "" })}
                    />
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-yellow-600 flex flex-row items-center gap-1 py-1">
            <div>
              <BsInfoCircle className="text-xl" />
            </div>
            <span className="text-black truncate">Validate all docs</span>
          </div>
        )}
      </div>
    );
  }
}
