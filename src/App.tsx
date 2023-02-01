import React, { Fragment, lazy, ReactNode, Suspense } from "react";
import { connect } from "react-redux";
import {
  Auth,
  FC_CheckLoggedIn,
  FC_GetSystemInfo,
  FC_Logout,
  System,
  FC_SetError,
  FC_SetShowNavigationStatus,
} from "./actions";
import { StoreState } from "./reducers";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LazyLoading from "./components/LazyLoading/LazyLoading";
import { Homepage } from "./containers/Homepage/Homepage";
import MainLoading from "./components/MainLoading/MainLoading";
import { NavBar } from "./components/NavBar/NavBar";
import SideNavBar from "./components/SideNavBar/SideNavBar";
import AppLoading from "./components/AppLoading/AppLoading";
import Alert, { AlertType } from "./components/Alert/Alert";
import NetworkError from "./components/NetworkError/NetworkError";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { LoginPage } from "./containers/LoginPage/LoginPage";
import { RegisterUser } from "./containers/RegisterUser/RegisterUser";

export const Container = (props: {
  isAuthenticated: boolean;
  children: ReactNode;
}) => {
  return (
    <div
      className={`${
        props.isAuthenticated === true
          ? "p-1 md:p-2 h-full container mx-auto"
          : ""
      }`}
    >
      {props.children}
    </div>
  );
};

//* Components

const Dashboard = lazy(() =>
  import("./containers/Dashboard/Dashboard").then(({ Dashboard }) => ({
    default: Dashboard,
  }))
);

const DoExam = lazy(() =>
  import("./containers/DoExam/DoExam").then(({ DoExam }) => ({
    default: DoExam,
  }))
);

const DoExamNoExam = lazy(() =>
  import("./containers/DoExam/DoExamNoExam").then(({ DoExamNoExam }) => ({
    default: DoExamNoExam,
  }))
);

//* Interfaces
// props for the component
interface AppProps {
  auth: Auth;
  system: System;
  FC_CheckLoggedIn: (callBack: (status: boolean) => void) => void;
  FC_Logout: () => void;
  FC_GetSystemInfo: (callback: (loading: boolean) => void) => void;
  FC_SetError: (msg: string) => void;
  FC_SetShowNavigationStatus: (status: boolean) => void;
}

interface AppState {
  loading: boolean;
  showSideNav: boolean;
}

class _App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      loading: false,
      showSideNav: true,
    };
  }

  componentDidMount() {
    //* check if the user is logged in
    this.props.FC_CheckLoggedIn((status: boolean) => {
      if (status === true) {
        this.setState({ loading: false });
      }
    });
    setTimeout(
      () => {
        this.setState({ showSideNav: false });
      },
      this.props.system.showNavigation === false ? 3000 : 10
    );
  }

  render() {
    // constants
    const authenticationPath = "/login";

    if (this.props.auth.loading === true) {
      return <MainLoading />;
    }

    if (this.state.loading === true) {
      return <AppLoading />;
    }
    return (
      <Fragment>
        <Router>
          <div className="h-screen">
            {this.props.system.error !== "" && (
              <div className="fixed right-3 top-3 z-50 animate__animated animate__zoomInUp animate__fast">
                <Alert
                  alertType={AlertType.DANGER}
                  title={"Error occurred!"}
                  description={this.props.system.error}
                  close={() => this.props.FC_SetError("")}
                />
              </div>
            )}
            {/* Check connectivity */}
            {navigator.onLine === false && <NetworkError />}
            {this.props.auth.isAuthenticated === true && (
              <NavBar
                auth={this.props.auth}
                FC_Logout={this.props.FC_Logout}
                showSideNav={this.state.showSideNav}
                setShowSideNav={(showSideNav: boolean) =>
                  this.setState({ showSideNav: showSideNav })
                }
                CheckIfDoingExam={!this.props.system.showNavigation}
              />
            )}
            <div
              className={`${
                this.props.auth.isAuthenticated === true
                  ? `bg-gray-200 h-full ${
                      this.state.showSideNav === true ? "lg:pl-64" : ""
                    } pt-14 overflow-y-auto`
                  : ""
              }`}
              style={{ transition: "0.7s" }}
            >
              {this.props.auth.isAuthenticated === true &&
                this.state.showSideNav === true && (
                  <SideNavBar
                    auth={this.props.auth}
                    showSideNav={this.props.system.showNavigation}
                    setShowSideNav={(showSideNav: boolean) =>
                      this.setState({ showSideNav: showSideNav })
                    }
                  />
                )}
              <div>
                <Switch>
                  <Route exact path="/" component={Homepage} />
                  <Route exact path="/tenders" component={Homepage} />
                  <Route exact path="/login" component={LoginPage} />
                  <Route exact path="/register" component={RegisterUser} />
                  <Suspense fallback={<LazyLoading />}>
                    <Container
                      isAuthenticated={this.props.auth.isAuthenticated}
                    >
                      <ProtectedRoute
                        path="/dashboard"
                        component={Dashboard}
                        isAuthenticated={this.props.auth.isAuthenticated}
                        authenticationPath={authenticationPath}
                        loading={this.state.loading}
                        exact
                      />
                    </Container>
                    <ProtectedRoute
                      path="/do-exam/:exam_id"
                      component={DoExam}
                      isAuthenticated={this.props.auth.isAuthenticated}
                      authenticationPath={authenticationPath}
                      loading={this.state.loading}
                      exact
                    />
                    <Container
                      isAuthenticated={this.props.auth.isAuthenticated}
                    >
                      <ProtectedRoute
                        path="/do-exam"
                        component={DoExamNoExam}
                        isAuthenticated={this.props.auth.isAuthenticated}
                        authenticationPath={authenticationPath}
                        loading={this.state.loading}
                        exact
                      />
                    </Container>
                  </Suspense>
                </Switch>
              </div>
            </div>
          </div>
        </Router>
      </Fragment>
    );
  }
}

const mapStateToProps = ({
  auth,
  system,
}: StoreState): {
  auth: Auth;
  system: System;
} => {
  return {
    auth,
    system,
  };
};

export const App = connect(mapStateToProps, {
  FC_CheckLoggedIn,
  FC_Logout,
  FC_GetSystemInfo,
  FC_SetError,
  FC_SetShowNavigationStatus,
})(_App);
