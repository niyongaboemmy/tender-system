import React, { Component, Fragment } from "react";
import { BsFileMedicalFill } from "react-icons/bs";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Auth, System } from "../../actions";
import {
  FC_GetTendersOffers,
  GetTenderOfferInterface,
} from "../../actions/tender.action";
import LoadingComponent from "../../components/Loading/LoadingComponent";
import Modal, { ModalSize, Themes } from "../../components/Modal/Modal";
import { TenderDetails } from "../../components/TenderDetails/TenderDetails";
import { StoreState } from "../../reducers";

interface TendersListProps {
  auth: Auth;
  system: System;
}
interface TendersListState {
  loading: boolean;
  tenders: GetTenderOfferInterface[] | null;
  error: string;
  selectedTender: GetTenderOfferInterface | null;
}

class _TendersList extends Component<TendersListProps, TendersListState> {
  constructor(props: TendersListProps) {
    super(props);

    this.state = {
      loading: false,
      tenders: null,
      error: "",
      selectedTender: null,
    };
  }
  GetTenders = () => {
    if (
      this.props.auth.user !== null &&
      this.props.auth.user.company.length > 0
    ) {
      this.setState({ loading: true });
      const companyId = this.props.auth.user.company[0].company_id;
      FC_GetTendersOffers(
        companyId,
        (
          loading: boolean,
          res: {
            type: "success" | "error";
            msg: string;
            data: GetTenderOfferInterface[];
          } | null
        ) => {
          this.setState({ loading: loading });
          if (res?.type === "success") {
            this.setState({ tenders: res.data, error: "", loading: false });
          }
          if (res?.type === "error") {
            this.setState({ tenders: [], error: res.msg, loading: false });
          }
        }
      );
    }
  };
  componentDidMount = () => {
    this.GetTenders();
  };
  render() {
    return (
      <Fragment>
        <div className="mx-0 md:mx-2">
          <div>
            <div className="flex flex-row items-center justify-between gap-2 w-full my-3">
              <div className="flex flex-row items-center gap-2">
                <div>
                  <BsFileMedicalFill className="text-5xl font-bold text-primary-800" />
                </div>
                <div className="font-bold items-center text-2xl">
                  <div>List of tender offers</div>
                  <div className="text-sm text-gray-500">
                    List of provided tenders in different periods
                  </div>
                </div>
              </div>
              <div>
                <Link
                  to="/create-tender"
                  className="bg-white text-primary-800 font-bold px-3 py-2 rounded cursor-pointer hover:bg-primary-800 hover:text-white"
                >
                  Create tender
                </Link>
              </div>
            </div>
          </div>
          {/* Body */}
          <div className="">
            {this.state.loading === true || this.state.tenders === null ? (
              <LoadingComponent />
            ) : (
              <div className="bg-white rounded-md">
                {this.state.tenders.length === 0 ? (
                  <div>No tenders available</div>
                ) : (
                  <div>
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 border">#</th>
                          <th className="px-3 py-2 border">Tender name</th>
                          <th className="px-3 py-2 border">Category</th>
                          <th className="px-3 py-2 border">Level</th>
                          <th className="px-3 py-2 border">Publication date</th>
                          <th className="px-3 py-2 border">Closing date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.tenders.map((item, i) => (
                          <tr
                            onClick={() =>
                              this.setState({ selectedTender: item })
                            }
                            key={i + 1}
                            className={`cursor-pointer hover:text-primary-900`}
                          >
                            <td className="px-3 py-2 border">{i + 1}</td>
                            <td className="px-3 py-2 border">
                              {item.tender_name}
                            </td>
                            <td className="px-3 py-2 border">
                              {item.category}
                            </td>
                            <td className="px-3 py-2 border">{item.level}</td>
                            <td className="px-3 py-2 border">
                              {new Date(item.published_date).toLocaleString()}
                            </td>
                            <td className="px-3 py-2 border">
                              {new Date(item.closing_date).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {this.state.selectedTender !== null && (
          <Modal
            backDrop={true}
            theme={Themes.default}
            close={() => this.setState({ selectedTender: null })}
            backDropClose={true}
            widthSizeClass={ModalSize.extraLarge}
            displayClose={true}
            padding={{
              title: true,
              body: true,
              footer: undefined,
            }}
            title={<div>{this.state.selectedTender.tender_name}</div>}
          >
            <TenderDetails
              tender={this.state.selectedTender}
              system={this.props.system}
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

export const TendersList = connect(mapStateToProps, {})(_TendersList);
