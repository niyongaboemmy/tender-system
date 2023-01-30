import React, { Component, Fragment } from "react";
import { IconType } from "react-icons";
import { FaChalkboardTeacher, FaUserCircle } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { Auth } from "../../actions";
import { menus_categories, MENU_TYPE } from "../../config/AppNavigations";

interface SideNavBarProps {
  auth: Auth;
  showSideNav: boolean;
  setShowSideNav: (showSideNav: boolean) => void;
}
interface SideNavBarState {}

export class SideNavBar extends Component<SideNavBarProps, SideNavBarState> {
  render() {
    const menus: {
      key: MENU_TYPE;
      title: string;
      path: string;
      icon: IconType;
    }[] = [
      {
        key: MENU_TYPE.PROFILE,
        title: "Profile",
        path: "/profile",
        icon: FaUserCircle,
      },
      {
        key: MENU_TYPE.PROFILE,
        title: "Change password",
        path: "/change-password",
        icon: RiLockPasswordLine,
      },
      {
        key: MENU_TYPE.ACTIVITIES,
        title: "My exams",
        path: "/dashboard",
        icon: FaChalkboardTeacher,
      },
    ];
    const baseClass =
      "flex flex-row items-center gap-2 px-5 py-2 text-sm hover:bg-primary-100 hover:text-primary-800 mr-3 rounded-r-full";
    return (
      <Fragment>
        <div
          className={`fixed ${
            this.props.showSideNav === true ? "w-64" : "w-0"
          } bg-white top-14 bottom-0 left-0 transition animate__animated animate__fadeInLeft shadow-xl md:shadow-lg lg:shadow-none`}
          style={{ transition: "0.5s", zIndex: 9 }}
        >
          <div className="flex flex-col">
            <div className="flex flex-row items-center justify-between gap-2 mx-4 mt-3 border-b border-gray-200 -mb-3 pb-3">
              <span className="font-semibold text-lg">Menus list</span>
              <div>
                <div
                  onClick={() => this.props.setShowSideNav(false)}
                  className="h-9 w-9 rounded-full bg-red-50 hover:bg-red-100 cursor-pointer text-red-900 flex items-center justify-center"
                >
                  <MdClose className="text-2xl" />
                </div>
              </div>
            </div>
            {menus_categories().map((item, k) => (
              <div key={k + 1} className="mt-5">
                <div className="text-gray-500 uppercase text-xs px-5 mb-1">
                  {item.title}
                </div>
                {menus
                  .filter((itm) => itm.key === item.key)
                  .map((nav, i) => (
                    <NavLink
                      key={i + 1}
                      to={nav.path}
                      className={(isActive) =>
                        isActive === true
                          ? `${baseClass} bg-primary-50 text-primary-900`
                          : `${baseClass}`
                      }
                    >
                      <div className="text-xl">{<nav.icon />}</div>
                      <span>{nav.title}</span>
                    </NavLink>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SideNavBar;
