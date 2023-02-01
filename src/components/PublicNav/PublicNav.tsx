import React, { Component } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import Container from "../Container/Container";
import LOGO from "../../assets/logo_for_ur.png";

interface PublicNavProps {}
interface PublicNavState {}

export class PublicNav extends Component<PublicNavProps, PublicNavState> {
  render() {
    return (
      <nav className="bg-white fixed top-0 left-0 right-0">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3">
            <div className="font-extrabold text-lg text-primary-800">
              <div className="flex flex-row items-center gap-2 py-2">
                <div>
                  <div className="flex items-center justify-center h-12 w-12 rounded text-white">
                    <img src={LOGO} alt="" />
                  </div>
                </div>
                <div className="text-gray-800 hidden md:flex flex-row items-center gap-2">
                  <div>UR Holdings</div>
                  <div className="text-primary-800">Group Ltd</div>
                </div>
              </div>
            </div>
            <div className="flex fex-row items-center justify-end gap-2 my-2">
              <NavLink
                to={"/tenders"}
                className="flex flex-row items-center justify-center gap-1 px-4 py-2 rounded bg-white hover:bg-primary-800 hover:text-white group"
                activeClassName="bg-primary-50 text-primary-800 font-bold"
              >
                Tenders
              </NavLink>
              <NavLink
                to={"/login"}
                className="flex flex-row items-center justify-center gap-1 px-4 py-2 rounded bg-white hover:bg-primary-800 hover:text-white group"
                activeClassName="bg-primary-50 text-primary-800 font-bold"
              >
                Login
              </NavLink>
              <NavLink
                to={"/register"}
                className="flex flex-row items-center justify-center gap-1 px-4 py-2 rounded bg-white hover:bg-primary-800 hover:text-white group"
                activeClassName="bg-primary-50 text-primary-800 font-bold"
              >
                Register
              </NavLink>

              <NavLink
                to={"/support"}
                className="flex flex-row items-center justify-center gap-1 px-3 py-2 rounded bg-white hover:bg-primary-800 hover:text-white group pl-2"
                activeClassName="bg-primary-50 text-primary-800 font-bold"
              >
                <div>
                  <AiFillQuestionCircle className="text-2xl text-gray-400 group-hover:text-white" />
                </div>
                Support
              </NavLink>
            </div>
          </div>
        </Container>
      </nav>
    );
  }
}

export default PublicNav;
