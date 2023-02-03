import React from "react";
import { NavLink } from "react-router-dom";
import Container from "../Container/Container";
import LOGO from "../../assets/logo_for_ur.png";
import useScrollPosition from "../useScrollPosition/useScrollPosition";

interface PublicNavProps {
  blue?: boolean;
}

const PublicNav = (props: PublicNavProps) => {
  const scrollPosition = useScrollPosition();
  const blue =
    scrollPosition >= 153 ? false : props.blue === true ? true : false;
  const shadow =
    scrollPosition < 28 ? false : props.blue === true ? true : false;
  return (
    <nav
      className={`${
        blue === true ? "bg-primary-800 text-white" : "bg-white"
      } fixed top-0 left-0 right-0 ${shadow === true ? "shadow-lg" : ""}`}
      style={{ zIndex: 9 }}
    >
      <Container>
        <div className="flex flex-row items-center justify-between gap-3">
          <div
            className={`font-extrabold text-lg ${
              blue === true ? "text-white" : "text-primary-800"
            } `}
          >
            <div className="flex flex-row items-center gap-2 py-2">
              <div>
                <div className="flex items-center justify-center h-12 w-12 rounded text-white">
                  <img src={LOGO} alt="" />
                </div>
              </div>
              <div
                className={`${
                  blue === true ? "text-white" : "text-gray-800"
                } hidden md:flex flex-row items-center gap-2`}
              >
                <div>UR Holdings</div>
                <div
                  className={`${
                    blue === true ? "text-white" : "text-primary-800"
                  } `}
                >
                  Group Ltd
                </div>
              </div>
            </div>
          </div>
          <div className="flex fex-row items-center justify-end gap-2 my-2 text-sm">
            <NavLink
              to={"/tenders"}
              className={`flex flex-row items-center justify-center gap-1 px-4 py-2 rounded ${
                blue === true
                  ? "bg-primary-750 text-white hover:bg-primary-700"
                  : "bg-white hover:bg-primary-800 hover:text-white"
              } group`}
              activeClassName={`${
                blue === true
                  ? "bg-primary-700 text-white"
                  : "bg-primary-50 text-primary-800"
              } font-bold`}
            >
              Tenders
            </NavLink>
            <NavLink
              to={"/login"}
              className={`flex flex-row items-center justify-center gap-1 px-4 py-2 rounded ${
                blue === true
                  ? "bg-primary-800 text-white hover:bg-primary-700"
                  : "bg-white hover:bg-primary-800 hover:text-white"
              } group`}
              activeClassName={`${
                blue === true
                  ? "bg-primary-700 text-white"
                  : "bg-primary-50 text-primary-800"
              } font-bold`}
            >
              Login
            </NavLink>
            <NavLink
              to={"/register"}
              className={`flex flex-row items-center justify-center gap-1 px-4 py-2 rounded ${
                blue === true
                  ? "bg-primary-800 text-white hover:bg-primary-700"
                  : "bg-white hover:bg-primary-800 hover:text-white"
              } group`}
              activeClassName={`${
                blue === true
                  ? "bg-primary-700 text-white"
                  : "bg-primary-50 text-primary-800"
              } font-bold`}
            >
              Register
            </NavLink>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default PublicNav;
