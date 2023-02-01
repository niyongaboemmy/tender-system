import React, { Component } from "react";
import { StoreState } from "../../reducers";
import { Auth, FC_GetSystemInfo, FC_Login, System } from "../../actions";
import { connect } from "react-redux";
import Container from "../../components/Container/Container";
import PublicNav from "../../components/PublicNav/PublicNav";

interface AppProps {
  auth: Auth;
  system: System;
  FC_Login: (
    data: {
      username: string;
      password: string;
    },
    CallbackFunc: Function
  ) => void;
  FC_GetSystemInfo: (callback: (loading: boolean) => void) => void;
}

interface AppState {}

class _App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {};
  render() {
    return (
      <div>
        <div className="bg-gray-200 min-h-screen pt-10 md:pt-20">
          <PublicNav />
          <Container>
            <div className="flex flex-col items-center justify-center mt-10 w-full">
              <div className="text-3xl font-bold">Tendering platform</div>
              <div className="mt-8 w-full flex flex-row items-center justify-center">
                {/* <Login /> */}
              </div>
            </div>
          </Container>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  auth,
  system,
}: StoreState): { auth: Auth; system: System } => {
  return { auth, system };
};

export const Homepage = connect(mapStateToProps, {
  FC_Login,
  FC_GetSystemInfo,
})(_App);
