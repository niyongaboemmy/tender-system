import React, { Component } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import UR_LOGO from "../../assets/logo_for_ur.png";
import { FaUserCircle } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Auth } from "../../actions";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { CgMenuGridO } from "react-icons/cg";

interface NavBarProps {
  auth: Auth;
  FC_Logout: () => void;
  showSideNav: boolean;
  setShowSideNav: (showSideNav: boolean) => void;
  CheckIfDoingExam: boolean;
}
interface NavBarState {
  view_user: boolean;
  loading: boolean;
}

export class NavBar extends Component<NavBarProps, NavBarState> {
  constructor(props: NavBarProps) {
    super(props);

    this.state = {
      loading: false,
      view_user: false,
    };
  }
  componentDidMount(): void {}
  render() {
    return (
      <div>
        <div
          className="bg-primary-800 py-1 pl-3 fixed top-0 right-0 left-0 shadow-xl"
          style={{ zIndex: 9 }}
        >
          <div className="flex flex-row items-center justify-between gap-3">
            <div className="flex flex-row items-center gap-2">
              {this.props.showSideNav === false &&
                this.props.CheckIfDoingExam === false && (
                  <div>
                    <div
                      onClick={() =>
                        this.props.setShowSideNav(!this.props.showSideNav)
                      }
                      className="bg-primary-700 h-10 w-10 rounded-full flex items-center justify-center cursor-pointer animate__animated animate__bounceIn"
                    >
                      {<CgMenuGridO className="text-3xl text-white" />}
                    </div>
                  </div>
                )}
              <div className="my-1">
                <img
                  className="h-10 w-auto"
                  src={UR_LOGO}
                  alt="Valuation Management System"
                />
              </div>
              <div className="hidden text-white font-extrabold text-lg md:flex flex-row items-center gap-2">
                <div className="">Candidate</div>
                <div className="text-yellow-300">
                  (CODE:{" "}
                  {this.props.auth.user !== null &&
                    this.props.auth.user.user_code}
                  )
                </div>
              </div>
            </div>
            {this.props.CheckIfDoingExam === false && (
              <div className="flex flex-row items-center gap-2 justify-end mr-2">
                {/* User icon */}
                <div className="relative">
                  <div
                    onClick={() =>
                      this.setState({ view_user: !this.state.view_user })
                    }
                    className="bg-primary-700 rounded-full flex items-center justify-center hover:bg-primary-900 h-10 w-10 text-white  cursor-pointer"
                  >
                    {this.state.view_user === false ? (
                      <FaUserCircle className="text-4xl animate__animated animate__fadeIn" />
                    ) : (
                      <IoMdClose className="text-3xl animate__animated animate__fadeIn" />
                    )}
                  </div>
                  {this.state.view_user === true && (
                    <div className="absolute right-0 pt-4">
                      <div className="border border-gray-400 bg-white p-3 rounded-md w-64 shadow-xl animate__animated animate__zoomInDown animate_fast">
                        <div className="flex flex-col items-center justify-center w-full gap-0">
                          <div className="mt-3">
                            <div className="rounded-full text-gray-400 flex items-center justify-center h-24 w-24 overflow-hidden">
                              <FaUserCircle className="text-8xl" />
                            </div>
                          </div>
                          <div className="font-bold text-center text-sm text-gray-400">
                            <span>CANDIDATE CODE</span>
                          </div>
                          <div className="font-bold text-center mb-2 text-primary-800">
                            <span>({this.props.auth.user?.user_code})</span>
                          </div>
                        </div>

                        <div className="mt-5">
                          <div className="text-sm text-gray-600 mt-5">
                            Action menu
                          </div>
                          <Link
                            onClick={() => this.setState({ view_user: false })}
                            to={"/profile"}
                            className="flex flex-row items-center gap-2 bg-gray-200 rounded-md px-2 py-1 cursor-pointer hover:bg-primary-800 hover:text-white group mb-2"
                          >
                            <div>
                              <FaUserCircle className="text-xl text-gray-500 group-hover:text-white" />
                            </div>
                            <div>User Profile</div>
                          </Link>
                          <Link
                            onClick={() => this.setState({ view_user: false })}
                            to={"/change-password"}
                            className="flex flex-row items-center gap-2 bg-gray-200 rounded-md px-2 py-1 cursor-pointer hover:bg-primary-800 hover:text-white group"
                          >
                            <div>
                              <RiLockPasswordLine className="text-xl text-gray-500 group-hover:text-white" />
                            </div>
                            <div>Change password</div>
                          </Link>
                          <div
                            onClick={() => {
                              this.setState({ view_user: false });
                              this.props.FC_Logout();
                            }}
                            className="flex flex-row items-center gap-2 border border-yellow-700 rounded-md px-2 py-1 cursor-pointer hover:bg-yellow-700 hover:text-white group mt-2"
                          >
                            <div>
                              <AiOutlineLogout className="text-xl text-gray-500 group-hover:text-white" />
                            </div>
                            <div>Sign out</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
