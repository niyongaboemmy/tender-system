import React, { Component } from "react";
import { StoreState } from "../../reducers";
import { Auth, FC_GetSystemInfo, FC_Login, System } from "../../actions";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import Container from "../../components/Container/Container";
import PublicNav from "../../components/PublicNav/PublicNav";
import { Register } from "../../components/Register/Register";

interface LoginProps {
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

interface LoginState {
  redirect: boolean;
  username: string;
  password: string;
  loading: boolean;
  error: {
    target: string | null;
    msg: string;
  };
  passwordDisplay: boolean;
}

class _Login extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);

    this.state = {
      redirect: false,
      username: "",
      password: "",
      loading: false,
      error: {
        target: null,
        msg: "",
      },
      passwordDisplay: false,
    };
  }
  LoginFn = async (e: any) => {
    e.preventDefault();
    if (this.state.username === "") {
      return this.setState({
        error: {
          target: "username",
          msg: "Please fill phone number or email",
        },
      });
    }
    if (this.state.password === "") {
      return this.setState({
        error: {
          target: "password",
          msg: "Please fill password",
        },
      });
    }
    if (this.state.username !== "" && this.state.password !== "") {
      this.setState({ loading: true });
      this.props.FC_Login(
        { username: this.state.username, password: this.state.password },
        (status: boolean, msg: string) => {
          status === false &&
            this.setState({
              error: {
                target: "main",
                msg: msg,
              },
            });
          if (status === true) {
            this.props.system.basic_info === null &&
              this.props.FC_GetSystemInfo((loading_status: boolean) => {
                this.setState({ loading: loading_status });
                loading_status === true &&
                  this.props.system.basic_info !== null &&
                  this.setState({ redirect: true });
              });
          } else {
            this.setState({ loading: false });
          }
        }
      );
    }
  };
  componentDidMount = () => {};
  render() {
    if (
      this.props.auth.isAuthenticated === true ||
      this.state.redirect === true
    ) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <div>
        <div className="bg-gray-200 min-h-screen pt-10 md:pt-10 pb-10">
          <PublicNav />
          <Container>
            <div className="flex flex-col items-center justify-center mt-10 w-full">
              <div className="mt-8 w-full flex flex-row items-center justify-center">
                <Register />
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

export const RegisterUser = connect(mapStateToProps, {
  FC_Login,
  FC_GetSystemInfo,
})(_Login);
