import React, { Component, Fragment } from "react";
import { BsJournalCheck } from "react-icons/bs";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Auth, System } from "../../actions";
import Alert, { AlertType } from "../../components/Alert/Alert";
import MainContainer from "../../components/MainContainer/MainContainer";
import { StoreState } from "../../reducers";

interface ValidateApplicationDocumentProps
  extends RouteComponentProps<{
    tender_id: string | undefined;
    document_id: string | undefined;
  }> {}
interface ValidateApplicationDocumentState {
  loading: boolean;
  success: string;
  error: string;
}

class _ValidateApplicationDocument extends Component<
  ValidateApplicationDocumentProps,
  ValidateApplicationDocumentState
> {
  constructor(props: ValidateApplicationDocumentProps) {
    super(props);

    this.state = {
      loading: false,
      success: "",
      error: "",
    };
  }
  GetApplicantsList = () => {};
  componentDidMount(): void {
    this.GetApplicantsList();
  }
  render() {
    return (
      <Fragment>
        <div className="mx-0 md:mx-2 -mt-2">
          <div>
            <div className="flex flex-row items-center justify-between gap-2 w-full mb-3">
              <div className="flex flex-row items-center gap-3">
                <div>
                  <BsJournalCheck className="text-5xl font-bold text-primary-800" />
                </div>
                <div className="font-bold items-center text-2xl">
                  <div>Selected tender</div>
                  <div className="text-sm text-black font-normal">
                    Selected document and date open
                  </div>
                </div>
              </div>
              <div>{/* Right side */}</div>
            </div>
          </div>
          {this.state.error !== "" && (
            <div className="my-3">
              <Alert
                alertType={AlertType.DANGER}
                title={this.state.error}
                close={() => this.setState({ error: "" })}
              />
            </div>
          )}
          {/* Body */}
          <MainContainer className="mt-3 bg-white rounded-md p-3">
            <div className="">
              <div>TenderID: {this.props.match.params.tender_id}</div>
              <div>DocumentID: {this.props.match.params.document_id}</div>
            </div>
          </MainContainer>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({
  auth,
  system,
}: StoreState): { auth: Auth; system: System } => {
  return { auth, system };
};

export const ValidateApplicationDocument = connect(
  mapStateToProps,
  {}
)(_ValidateApplicationDocument);
