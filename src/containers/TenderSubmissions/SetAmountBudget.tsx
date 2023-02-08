import React, { Component } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  FC_SetApplicationFinancialBudget,
  TenderSubmissionsListInterface,
} from "../../actions/validate-tender.action";
import Alert, { AlertType } from "../../components/Alert/Alert";
import { commaFy } from "../../utils/functions";

interface SetAmountBudgetProps {
  selectedTenderSubmission: TenderSubmissionsListInterface;
  onUpdateBudge: (application_id: string, amount: string) => void;
}
interface SetAmountBudgetState {
  application_id: string;
  amount: string;
  addingFinancial: boolean;
  addingFinancialError: string;
  addingFinancialSuccess: string;
  openEdit: boolean;
}

export class SetAmountBudget extends Component<
  SetAmountBudgetProps,
  SetAmountBudgetState
> {
  constructor(props: SetAmountBudgetProps) {
    super(props);

    this.state = {
      application_id: this.props.selectedTenderSubmission.application_id,
      amount:
        this.props.selectedTenderSubmission.financial_amount !== null
          ? this.props.selectedTenderSubmission.financial_amount === 0
            ? ""
            : this.props.selectedTenderSubmission.financial_amount.toString()
          : "",
      addingFinancial: false,
      addingFinancialError: "",
      addingFinancialSuccess: "",
      openEdit: false,
    };
  }
  SetApplicationFinancialBudget = () => {
    if (this.state.amount === "") {
      return this.setState({
        addingFinancialError: "Please add financial budget",
      });
    }
    this.setState({
      addingFinancial: true,
      addingFinancialSuccess: "",
      addingFinancialError: "",
    });
    FC_SetApplicationFinancialBudget(
      {
        application_id: this.state.application_id,
        financial_amount: this.state.amount,
      },
      (
        loading: boolean,
        res: {
          type: "success" | "error";
          msg: string;
        } | null
      ) => {
        this.setState({ addingFinancial: loading });
        if (res?.type === "success") {
          this.setState({
            addingFinancial: false,
            addingFinancialError: "",
            addingFinancialSuccess: res.msg,
            openEdit: false,
          });
          // Reload applications or add the financial in the list
          this.props.onUpdateBudge(
            this.state.application_id,
            this.state.amount
          );
        }
        if (res?.type === "error") {
          this.setState({
            addingFinancial: false,
            addingFinancialError: res.msg,
            addingFinancialSuccess: "",
          });
        }
      }
    );
  };
  componentDidMount = () => {
    if (
      this.props.selectedTenderSubmission.financial_amount === null ||
      this.props.selectedTenderSubmission.financial_amount === 0
    ) {
      this.setState({ openEdit: true });
    }
  };
  render() {
    if (this.state.openEdit === false) {
      return (
        <div
          onClick={() => this.setState({ openEdit: true })}
          className="flex flex-row items-center gap-2 px-3 py-2 bg-white hover:bg-primary-50 hover:text-primary-900 cursor-pointer w-max rounded-md font-bold"
        >
          <span>{commaFy(parseInt(this.state.amount))} RWF</span>
        </div>
      );
    }
    return (
      <div className="animate__animated animate__fadeIn">
        {this.state.addingFinancial === true ? (
          <div className="flex flex-row items-center gap-2 px-2 text-yellow-600">
            <div>
              <AiOutlineLoading3Quarters className="text-2xl animate-spin" />
            </div>
            <span className="animate__animated animate__fadeIn animate__infinite animate__faster text-sm truncate">
              Saving, please wait...
            </span>
          </div>
        ) : (
          <>
            <div className="flex flex-row items-center gap-1 w-full">
              <input
                type="number"
                placeholder="Amount (RWF)"
                className="bg-white text-black px-3 py-2 rounded w-44 text-sm border border-gray-400"
                value={this.state.amount}
                disabled={this.state.addingFinancial}
                onChange={(e) =>
                  this.setState({
                    amount: e.target.value,
                    addingFinancialError: "",
                    addingFinancialSuccess: "",
                  })
                }
              />
              <div
                className={`${
                  this.state.amount !== "" && this.state.amount !== "0"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-red-100 text-red-800 hover:bg-red-600 hover:text-white"
                } cursor-pointer px-3 py-2 rounded font-bold truncate`}
                onClick={() =>
                  this.state.addingFinancial === false &&
                  this.SetApplicationFinancialBudget()
                }
              >
                Save
              </div>
              {this.props.selectedTenderSubmission.financial_amount !== null &&
                this.props.selectedTenderSubmission.financial_amount !== 0 && (
                  <div
                    className={`bg-gray-100 text-black hover:bg-gray-500 hover:text-white cursor-pointer px-3 py-2 rounded font-bold truncate`}
                    onClick={() =>
                      this.state.addingFinancial === false &&
                      this.setState({
                        openEdit: false,
                        amount:
                          this.props.selectedTenderSubmission
                            .financial_amount === null ||
                          this.props.selectedTenderSubmission
                            .financial_amount === 0
                            ? ""
                            : this.props.selectedTenderSubmission.financial_amount.toString(),
                      })
                    }
                  >
                    Cancel
                  </div>
                )}
            </div>
            {this.state.addingFinancialError !== "" && (
              <div className="mt-2">
                <Alert
                  alertType={AlertType.DANGER}
                  title=""
                  description={this.state.addingFinancialError}
                  close={() =>
                    this.setState({
                      addingFinancialError: "",
                      addingFinancialSuccess: "",
                    })
                  }
                />
              </div>
            )}
            {/* {this.state.addingFinancialSuccess !== "" && (
              <div className="mt-2">
                <Alert
                  alertType={AlertType.SUCCESS}
                  title=""
                  description={this.state.addingFinancialSuccess}
                  close={() =>
                    this.setState({
                      addingFinancialError: "",
                      addingFinancialSuccess: "",
                    })
                  }
                />
              </div>
            )} */}
          </>
        )}
      </div>
    );
  }
}
