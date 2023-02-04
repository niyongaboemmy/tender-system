import React, { Component, Fragment } from "react";
import { BsCheckCircleFill, BsFileEarmarkPdf } from "react-icons/bs";
import { HiArrowSmLeft } from "react-icons/hi";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import {
  ApplicationDocIsCorrect,
  Auth,
  BooleanEnum,
  System,
} from "../../actions";
import {
  DocumentValidatedInterface,
  FC_GetTenderApplicationsToBeValidated,
  GetApplicationForValidation,
  TenderApplicationsListInterface,
} from "../../actions/validate-tender.action";
import Alert, { AlertType } from "../../components/Alert/Alert";
import LoadingComponent from "../../components/Loading/LoadingComponent";
import MainContainer from "../../components/MainContainer/MainContainer";
import Modal, { ModalSize, Themes } from "../../components/Modal/Modal";
import { StoreState } from "../../reducers";
import { search } from "../../utils/functions";
import { DocumentValidation } from "./DocumentValidation";

interface ValidateApplicationDocumentProps
  extends RouteComponentProps<{
    tender_id: string | undefined;
    document_id: string | undefined;
  }> {}
interface ValidateApplicationDocumentState {
  loading: boolean;
  success: string;
  error: string;
  data: TenderApplicationsListInterface | null;
  selectedApplication: GetApplicationForValidation | null;
  searchData: string;
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
      data: null,
      selectedApplication: null,
      searchData: "",
    };
  }
  GetApplicantsList = () => {
    this.setState({ loading: true });
    if (
      this.props.match.params.tender_id !== undefined &&
      this.props.match.params.document_id !== undefined
    ) {
      FC_GetTenderApplicationsToBeValidated(
        this.props.match.params.document_id,
        this.props.match.params.tender_id,
        (
          loading: boolean,
          res: {
            type: "success" | "error";
            msg: string;
            data: TenderApplicationsListInterface | null;
          } | null
        ) => {
          this.setState({ loading: loading });
          if (res?.type === "success") {
            this.setState({
              data: res.data,
              loading: false,
              error: "",
              success: "",
            });
          }
          if (res?.type === "error") {
            this.setState({
              data: null,
              loading: false,
              error: res.msg,
              success: "",
            });
          }
        }
      );
    }
  };
  GetSelectedDocument = () => {
    if (
      this.props.match.params.document_id !== undefined &&
      this.state.data !== null
    ) {
      const selectedDoc = this.state.data.required_document.find(
        (itm) => itm.document_id === this.props.match.params.document_id
      );
      if (selectedDoc !== undefined) {
        return selectedDoc;
      }
    }
    return null;
  };
  SelectedDocument = (documents: DocumentValidatedInterface[]) => {
    if (this.state.data !== null) {
      const response = documents.find(
        (itm) => itm.document_id === this.GetSelectedDocument()?.document_id
      );
      if (response !== undefined) {
        return response;
      }
    }
    return null;
  };
  FilteredData = (): GetApplicationForValidation[] => {
    if (this.state.data === null) {
      return [];
    }
    return search(
      this.state.data.application,
      this.state.searchData
    ) as GetApplicationForValidation[];
  };
  componentDidMount(): void {
    this.GetApplicantsList();
  }
  GetValidatedDocuments = () => {
    var iteration = 0;
    if (this.state.data !== null) {
      for (const item of this.state.data.application) {
        const selectedDoc = item.documents.find(
          (itm) => itm.document_id === this.props.match.params.document_id
        );
        if (
          selectedDoc !== undefined &&
          selectedDoc.is_validated === BooleanEnum.TRUE
        ) {
          iteration += 1;
        }
      }
    }
    return iteration;
  };
  GetNotValidatedDocuments = () => {
    var iteration = 0;
    if (this.state.data !== null) {
      for (const item of this.state.data.application) {
        const selectedDoc = item.documents.find(
          (itm) => itm.document_id === this.props.match.params.document_id
        );
        if (
          selectedDoc !== undefined &&
          selectedDoc.is_validated === BooleanEnum.FALSE
        ) {
          iteration += 1;
        }
      }
    }
    return iteration;
  };
  render() {
    if (this.state.data === null || this.state.loading === true) {
      return (
        <MainContainer className="py-4">
          <LoadingComponent />
        </MainContainer>
      );
    }

    return (
      <Fragment>
        <div className="mx-0 md:mx-2 mt-2">
          <div>
            <div className="flex flex-row items-center justify-between gap-2 w-full mb-3">
              <div className="flex flex-row items-center gap-3">
                <div>
                  <Link to={"/tenders-list"}>
                    <div className="px-3 pl-1 py-1 border border-primary-700 text-primary-900 rounded bg-white hover:bg-primary-50 hover:text-primary-900 w-max cursor-pointer flex flex-row items-center justify-center gap-1">
                      <div>
                        <HiArrowSmLeft className="text-primary-800 text-2xl" />
                      </div>
                      <span>Back</span>
                    </div>
                  </Link>
                </div>
                <div className="font-bold items-center text-lg">
                  <div>Tender: {this.state.data.tender_name}</div>
                </div>
              </div>
              <div>
                {this.state.data === null && this.state.error !== "" && (
                  <div
                    onClick={() => this.GetApplicantsList()}
                    className="bg-yellow-100 hover:bg-yellow-600 hover:text-white rounded-md px-3 py-2 text-sm font-bold cursor-pointer w-max"
                  >
                    Reload page
                  </div>
                )}
              </div>
            </div>
            <div className="bg-primary-800 rounded-md p-2 flex flex-row items-center justify-between gap-2 w-full">
              <div className="flex flex-row items-center gap-2">
                <div className="pl-1">
                  <div className="w-12 h-12 rounded-md flex items-center justify-center bg-primary-50">
                    <BsFileEarmarkPdf className="text-3xl text-primary-750" />
                  </div>
                </div>
                <div className="flex flex-col text-white">
                  <span className="text-sm text-yellow-300 uppercase">
                    Selected document
                  </span>
                  <div className="font-bold text-white">
                    {this.GetSelectedDocument()?.title}
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center justify-end gap-2">
                <div className="border border-primary-100 bg-primary-800 text-white rounded p-1 px-4 text-center">
                  <div className="text-sm font-light">Validated</div>
                  <div className="text-xl font-bold -mt-1">
                    {this.state.data.application.length}
                  </div>
                </div>
                <div className="border border-primary-100 bg-primary-800 text-white rounded p-1 px-4 text-center">
                  <div className="text-sm font-light">Waiting</div>
                  <div className="text-xl font-bold -mt-1">
                    {this.GetNotValidatedDocuments()}
                  </div>
                </div>
                <div className="border border-primary-100 bg-primary-800 text-white rounded p-1 px-4 text-center">
                  <div className="text-sm font-light">Total</div>
                  <div className="text-xl font-bold -mt-1">
                    {this.GetValidatedDocuments()}
                  </div>
                </div>
              </div>
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
            {this.state.data.application.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 px-3">
                <div></div>
                <div className="text-xl font-bold">No applications found!</div>
                {this.state.error === "" ? (
                  <div className="text-sm text-gray-500 mt-1">
                    No applicants have submitted their applications found!
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 mt-1">
                    {this.state.error}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <input
                    type={"search"}
                    className="px-4 py-3 text-sm font-light rounded-md bg-gray-100 w-full"
                    placeholder="Search company"
                    value={this.state.searchData}
                    onChange={(e) =>
                      this.setState({ searchData: e.target.value })
                    }
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="text-sm text-left min-w-full">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 border">#</th>
                        <th className="px-3 py-2 border">Company</th>
                        <th className="px-3 py-2 border">TIN number</th>
                        <th className="px-3 py-2 border">Country</th>
                        <th className="px-3 py-2 border truncate">
                          Validation status
                        </th>
                        <th className="px-3 py-2 border"></th>
                      </tr>
                    </thead>

                    <tbody>
                      {this.FilteredData().length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center font-bold text-gray-400 pt-2 text-xl"
                          >
                            <div className="w-full p-5 text-center bg-gray-100 rounded-md">
                              No result found!
                            </div>
                          </td>
                        </tr>
                      ) : (
                        this.FilteredData().map((item, i) => (
                          <tr
                            key={i + 1}
                            className={`group hover:bg-primary-50 hover:text-primary-900 cursor-pointer`}
                            onClick={() =>
                              this.setState({ selectedApplication: item })
                            }
                          >
                            <td className="px-2 py-1 border w-10">
                              <div>
                                <BsCheckCircleFill className="text-3xl text-primary-800" />
                              </div>
                            </td>
                            <td className="px-3 py-2 border">
                              {item.compony_name}
                            </td>
                            <td className="px-3 py-2 border">
                              {item.tin_number}
                            </td>
                            <td className="px-3 py-2 border">{item.country}</td>
                            <td className="px-3 py-2 border w-10 truncate">
                              {this.SelectedDocument(item.documents) ===
                              null ? (
                                <div className="bg-yellow-100 rounded-md px-2 w-max text-yellow-50">
                                  Not added
                                </div>
                              ) : this.SelectedDocument(item.documents)
                                  ?.is_validated === BooleanEnum.FALSE ? (
                                <div className="text-gray-500">
                                  Not Validated
                                </div>
                              ) : this.SelectedDocument(item.documents)
                                  ?.is_correct ===
                                ApplicationDocIsCorrect.VALID ? (
                                <div className="bg-green-100 rounded-md px-2 w-max text-green-700">
                                  Accepted
                                </div>
                              ) : (
                                <div className="bg-red-100 rounded-md px-2 w-max text-red-800">
                                  Rejected
                                </div>
                              )}
                            </td>
                            <td className="px-1 py-1 border w-12">
                              <div className="bg-primary-50 text-primary-900 group-hover:bg-primary-800 group-hover:text-white px-3 py-2 rounded-md text-sm font-bold cursor-pointer w-max">
                                Open Doc
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </MainContainer>
        </div>
        {this.state.selectedApplication !== null && (
          <Modal
            backDrop={true}
            theme={Themes.default}
            close={() => this.setState({ selectedApplication: null })}
            backDropClose={true}
            widthSizeClass={ModalSize.maxWidth}
            displayClose={false}
            padding={{
              title: false,
              body: undefined,
              footer: undefined,
            }}
          >
            <DocumentValidation
              data={this.state.selectedApplication}
              selectedDocument={this.GetSelectedDocument()}
              onGoBack={() => this.setState({ selectedApplication: null })}
              onSubmitUpdate={() => {
                this.setState({ selectedApplication: null });
                this.GetApplicantsList();
              }}
            />
          </Modal>
        )}
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
