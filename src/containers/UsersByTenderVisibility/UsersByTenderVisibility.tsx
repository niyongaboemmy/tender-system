import React, { Component, Fragment } from "react";
import { FaUsers } from "react-icons/fa";
import { IoMdPersonAdd } from "react-icons/io";
import { connect } from "react-redux";
import {
  API_GetUsersDetails,
  Auth,
  FC_GetUserByKeyword,
  FC_GetUsersByTenderVisibility,
  FC_SetUserTendersVisibility,
  System,
  TenderVisibility,
} from "../../actions";
import Alert, { AlertType } from "../../components/Alert/Alert";
import LoadingComponent from "../../components/Loading/LoadingComponent";
import Modal, { ModalSize, Themes } from "../../components/Modal/Modal";
import { StoreState } from "../../reducers";
import { search } from "../../utils/functions";

interface UsersByTenderVisibilityProps {}
interface UsersByTenderVisibilityState {
  loading: boolean;
  success: string;
  error: string;
  users: API_GetUsersDetails[] | null;
  searchData: string;
  addNew: boolean;
  searchUserToAdd: string;
  searchingUser: boolean;
  searchResponse: API_GetUsersDetails | null;
}

class _UsersByTenderVisibility extends Component<
  UsersByTenderVisibilityProps,
  UsersByTenderVisibilityState
> {
  constructor(props: UsersByTenderVisibilityProps) {
    super(props);

    this.state = {
      loading: false,
      success: "",
      error: "",
      users: null,
      searchData: "",
      addNew: false,
      searchUserToAdd: "",
      searchingUser: false,
      searchResponse: null,
    };
  }
  GetUsersListByVisibility = () => {
    this.setState({ loading: true });
    FC_GetUsersByTenderVisibility(
      TenderVisibility.PRIVATE,
      (
        loading: boolean,
        res: {
          type: "success" | "error";
          msg: string;
          data: API_GetUsersDetails[];
        } | null
      ) => {
        this.setState({ loading: loading });
        if (res?.type === "success") {
          this.setState({
            users: res.data,
            success: "",
            error: "",
            loading: false,
          });
        }
        if (res?.type === "error") {
          this.setState({
            loading: false,
            users: [],
            // error: res.msg,
            success: "",
          });
        }
      }
    );
  };
  GetUserByKeyword = () => {
    if (this.state.searchUserToAdd === "") {
      return this.setState({
        error: "Please fill phone number or email for the user",
      });
    }
    this.setState({ searchingUser: true });
    FC_GetUserByKeyword(
      this.state.searchUserToAdd,
      (
        loading: boolean,
        res: {
          type: "success" | "error";
          msg: string;
          data: API_GetUsersDetails[];
        } | null
      ) => {
        this.setState({ searchingUser: loading });
        if (
          res?.type === "success" &&
          res.data !== null &&
          res.data.length > 0
        ) {
          this.setState({
            searchResponse: res.data[0],
            searchingUser: false,
            error: "",
          });
        }
        if (res?.type === "error") {
          this.setState({
            searchingUser: false,
            error: res.msg,
            searchResponse: null,
          });
        }
      }
    );
  };
  SetUserVisibility = (data: API_GetUsersDetails, status: TenderVisibility) => {
    this.setState({ loading: true, addNew: false });
    FC_SetUserTendersVisibility(
      {
        user_id: data.user_id,
        allowed_tender: status,
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
          if (
            status === TenderVisibility.PRIVATE &&
            this.state.users !== null
          ) {
            this.setState({
              users: [
                ...this.state.users.filter(
                  (itm) => itm.user_id !== data.user_id
                ),
                data,
              ],
            });
          }
          if (status === TenderVisibility.PUBLIC && this.state.users !== null) {
            this.setState({
              users: this.state.users.filter(
                (itm) => itm.user_id !== data.user_id
              ),
            });
          }
          this.setState({
            success: res.msg,
            error: "",
            searchResponse: null,
            searchUserToAdd: "",
            loading: false,
          });
        }
        if (res?.type === "error") {
          this.setState({
            addNew: true,
            error: res.msg,
            success: "",
            loading: false,
          });
        }
      }
    );
  };
  componentDidMount(): void {
    this.GetUsersListByVisibility();
  }
  render() {
    if (this.state.users === null || this.state.loading === true) {
      return <LoadingComponent />;
    }
    return (
      <Fragment>
        <div className="mx-0 md:mx-2">
          <div>
            <div className="flex flex-row items-center justify-between gap-2 w-full my-3">
              <div className="flex flex-row items-center gap-2">
                <div>
                  <div className="flex items-center justify-center bg-gray-50 rounded-md h-12 w-12">
                    <FaUsers className="text-4xl font-bold text-primary-800" />
                  </div>
                </div>
                <div className="font-bold items-center text-2xl">
                  <div>Users selected for private tenders</div>
                  <div className="text-sm text-gray-500 font-normal">
                    List of users who are allowed to submit their applications
                    on private tenders
                  </div>
                </div>
              </div>
              <div>
                {this.state.users.length > 0 && (
                  <div
                    onClick={() => this.setState({ addNew: true })}
                    className="bg-white text-primary-800 font-bold px-3 py-2 rounded cursor-pointer hover:bg-primary-800 hover:text-white flex flex-row items-center justify-center gap-2"
                  >
                    <div>
                      <IoMdPersonAdd className="text-xl" />
                    </div>
                    <span>Add new</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Body */}
          <div className="bg-white rounded-md p-3">
            <div className="mb-3">
              <input
                type="search"
                className="bg-gray-100 w-full px-4 py-3 text-sm rounded-md"
                placeholder="Search by name"
                value={this.state.searchData}
                onChange={(e) => this.setState({ searchData: e.target.value })}
              />
            </div>
            {this.state.error !== "" &&
              this.state.addNew === false &&
              this.state.searchingUser === false && (
                <div className="my-3">
                  <Alert
                    alertType={AlertType.DANGER}
                    title={this.state.error}
                    close={() => this.setState({ error: "", success: "" })}
                  />
                </div>
              )}
            {this.state.success !== "" &&
              this.state.addNew === false &&
              this.state.searchingUser === false && (
                <div className="my-3">
                  <Alert
                    alertType={AlertType.SUCCESS}
                    title={this.state.success}
                    close={() => this.setState({ error: "", success: "" })}
                  />
                </div>
              )}
            <div>
              {this.state.users.length === 0 ? (
                <div className="py-6 px-3 bg-gray-100 rounded-md">
                  <div className="font-bold text-2xl text-center">
                    No selected bidders
                  </div>
                  <div className="text-sm text-center">
                    No bidders selected for private tenders, click the following
                    button to add new bidders
                  </div>
                  <div className="flex flex-row items-center justify-center">
                    <div
                      onClick={() => this.setState({ addNew: true })}
                      className="bg-white border border-primary-700 text-primary-900 hover:bg-primary-800 hover:text-white hover:border-white font-bold px-3 py-2 text-sm cursor-pointer rounded-md mt-3"
                    >
                      Select bidders
                    </div>
                  </div>
                </div>
              ) : (
                  search(
                    this.state.users,
                    this.state.searchData
                  ) as API_GetUsersDetails[]
                ).length === 0 ? (
                <div className="py-6 px-3 bg-gray-100 rounded-md text-xl">
                  <div className="text-xl text-center">No result found!</div>
                </div>
              ) : (
                <div>
                  <table className="text-sm text-left min-w-full">
                    <thead>
                      <tr>
                        <th className="px-2 py-2 border text-center">#</th>
                        <th className="px-2 py-2 border">Full name</th>
                        <th className="px-2 py-2 border">Phone number</th>
                        <th className="px-2 py-2 border">Email</th>
                        <th className="px-2 py-2 border">Company name</th>
                        <th className="px-2 py-2 border">TIN</th>
                        <th className="px-2 py-2 border">Country</th>
                        <th className="px-2 py-2 border">Company phone</th>
                        <th className="px-2 py-2 border">Company Email</th>
                        {this.state.users.length > 0 && (
                          <th className="px-2 py-2 border"></th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {(
                        search(
                          this.state.users,
                          this.state.searchData
                        ) as API_GetUsersDetails[]
                      ).map((item, i) => (
                        <tr key={i + 1} className="">
                          <td className="px-2 py-2 border text-center">
                            {i + 1}
                          </td>
                          <td className="px-2 py-2 border">{item.names}</td>
                          <td className="px-2 py-2 border">
                            {item.user_phone}
                          </td>
                          <td className="px-2 py-2 border">
                            {item.user_email}
                          </td>
                          <td className="px-2 py-2 border">
                            {item.company.length > 0
                              ? item.company[0].compony_name
                              : ""}
                          </td>
                          <td className="px-2 py-2 border">
                            {item.company.length > 0
                              ? item.company[0].tin_number
                              : ""}
                          </td>
                          <td className="px-2 py-2 border">
                            {item.company.length > 0
                              ? item.company[0].country
                              : ""}
                          </td>
                          <td className="px-2 py-2 border">
                            {item.company.length > 0
                              ? item.company[0].company_phone
                              : ""}
                          </td>
                          <td className="px-2 py-2 border">
                            {item.company.length > 0
                              ? item.company[0].company_email
                              : ""}
                          </td>
                          <td className="px-1 py-1 border w-10">
                            <div
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure do you want to remove " +
                                      item.names +
                                      " from the list?"
                                  ) === true
                                ) {
                                  this.SetUserVisibility(
                                    item,
                                    TenderVisibility.PUBLIC
                                  );
                                }
                              }}
                              className="bg-red-50 text-red-700 px-3 py-2 rounded text-sm cursor-pointer hover:bg-red-600 hover:text-white"
                            >
                              Remove
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        {this.state.addNew === true && (
          <Modal
            backDrop={true}
            theme={Themes.default}
            close={() => this.setState({ addNew: false })}
            backDropClose={true}
            widthSizeClass={ModalSize.large}
            displayClose={true}
            padding={{
              title: true,
              body: true,
              footer: undefined,
            }}
            title="Add Users / Bidders"
          >
            <div className="-mt-6">
              <div className="font-bold mb-2">
                Search user by phone number or email
              </div>
              <div className="flex flex-row item-center gap-2">
                <input
                  type="search"
                  className="bg-white w-full px-4 py-2 text-sm rounded-md border-2 border-primary-800"
                  placeholder="Type phone or email"
                  value={this.state.searchUserToAdd}
                  onChange={(e) =>
                    this.setState({ searchUserToAdd: e.target.value })
                  }
                  disabled={this.state.searchingUser}
                />
                <div>
                  <div
                    onClick={() =>
                      this.state.searchingUser === false &&
                      this.GetUserByKeyword()
                    }
                    className="bg-primary-800 hover:bg-primary-900 text-white font-bold px-3 py-2 text-sm cursor-pointer rounded"
                  >
                    {this.state.searchingUser === true ? (
                      <span className="animate__animated animate__fadeIn animate__infinite animate__fast">
                        Searching...
                      </span>
                    ) : (
                      "Search"
                    )}
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
            </div>
            {this.state.searchResponse !== null ? (
              <div>
                {/* User details */}
                <div className="grid grid-cols-12 gap-3 mt-4">
                  <div className="col-span-12 lg:col-span-5">
                    <div className="bg-primary-50 rounded-md p-3 h-full">
                      <div className="text-base text-primary-900 font-bold mb-3">
                        Personal Info
                      </div>
                      <div className="flex flex-col mb-2 pb-2 border-b border-blue-200">
                        <span className="text-sm">Full names</span>
                        <span className="text-sm font-semibold">
                          {this.state.searchResponse.user_phone}
                        </span>
                      </div>
                      <div className="flex flex-col mb-2 pb-2 border-b border-blue-200">
                        <span className="text-sm">Phone number</span>
                        <span className="text-sm font-semibold">
                          {this.state.searchResponse.user_phone}
                        </span>
                      </div>
                      <div className="flex flex-col mb-2 pb-2">
                        <span className="text-sm">Email</span>
                        <span className="text-sm font-semibold">
                          {this.state.searchResponse.user_email}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Company details */}
                  {this.state.searchResponse.company.length > 0 && (
                    <div className="col-span-12 lg:col-span-7">
                      <div className="bg-primary-50 rounded-md p-3 h-full">
                        <div className="text-base text-primary-900 font-bold mb-3">
                          Company details
                        </div>
                        <div className="flex flex-col mb-2 pb-2 border-b border-blue-200">
                          <span className="text-sm">Company name</span>
                          <span className="text-sm font-semibold">
                            {this.state.searchResponse.company[0].compony_name}
                          </span>
                        </div>
                        <div className="flex flex-col mb-2 pb-2 border-b border-blue-200">
                          <span className="text-sm">TIN number</span>
                          <span className="text-sm font-semibold">
                            {this.state.searchResponse.company[0].tin_number}
                          </span>
                        </div>
                        <div className="flex flex-col mb-2 pb-2 border-b border-blue-200">
                          <span className="text-sm">Phone number</span>
                          <span className="text-sm font-semibold">
                            {this.state.searchResponse.company[0].company_phone}
                          </span>
                        </div>
                        <div className="flex flex-col mb-2 pb-2">
                          <span className="text-sm">Email</span>
                          <span className="text-sm font-semibold">
                            {this.state.searchResponse.company[0].company_email}
                          </span>
                        </div>
                        <div className="pt-3">
                          {this.state.searchResponse.allowed_tender ===
                            TenderVisibility.PRIVATE && (
                            <div className="bg-white rounded-md w-full p-3 text-sm font-bold animate__animated animate__shakeX my-3 text-primary-900">
                              <div className="">
                                This user is already added on the list, please
                                try another user!
                              </div>
                              <div className="mt-3">
                                <div
                                  onClick={() =>
                                    this.setState({
                                      searchResponse: null,
                                      searchUserToAdd: "",
                                    })
                                  }
                                  className="bg-primary-800 hover:bg-primary-900 text-white font-bold px-3 py-2 text-sm cursor-pointer rounded w-max"
                                >
                                  Yes, continue
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="flex flex-row items-center gap-2">
                            {this.state.searchResponse.allowed_tender ===
                              TenderVisibility.PUBLIC && (
                              <div
                                onClick={() =>
                                  this.setState({ searchResponse: null })
                                }
                                className="bg-white text-black hover:bg-gray-500 cursor-pointer hover:text-white w-max px-3 py-2 font-bold text-sm rounded"
                              >
                                Cancel
                              </div>
                            )}
                            {this.state.searchResponse.allowed_tender ===
                            TenderVisibility.PUBLIC ? (
                              <div
                                onClick={() =>
                                  this.state.searchResponse !== null &&
                                  this.SetUserVisibility(
                                    this.state.searchResponse,
                                    TenderVisibility.PRIVATE
                                  )
                                }
                                className="bg-green-600 hover:bg-green-700 cursor-pointer text-white w-max px-3 py-2 font-bold text-sm rounded"
                              >
                                Add user
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-6 bg-gray-100 rounded-md w-full text-center py-6 px-3 animate__animated animate__fadeIn">
                <div className="text-xl">Search for user</div>
                <div className="text-sm">
                  Fill phone number or email to get user info
                </div>
              </div>
            )}
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

export const UsersByTenderVisibility = connect(
  mapStateToProps,
  {}
)(_UsersByTenderVisibility);
