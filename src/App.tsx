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
  UserType,
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

const Profile = lazy(() =>
  import("./containers/Profile/Profile").then(({ Profile }) => ({
    default: Profile,
  }))
);

const TendersList = lazy(() =>
  import("./containers/TendersList/TendersList").then(({ TendersList }) => ({
    default: TendersList,
  }))
);

const CreateTender = lazy(() =>
  import("./containers/CreateTender/CreateTender").then(({ CreateTender }) => ({
    default: CreateTender,
  }))
);
const BidderApplications = lazy(() =>
  import("./containers/BidderApplications/BidderApplications").then(
    ({ BidderApplications }) => ({
      default: BidderApplications,
    })
  )
);
const ValidateApplicationDocument = lazy(() =>
  import(
    "./containers/ValidateApplicationDocument/ValidateApplicationDocument"
  ).then(({ ValidateApplicationDocument }) => ({
    default: ValidateApplicationDocument,
  }))
);

const ChangePassword = lazy(() =>
  import("./containers/ChangePassword/ChangePassword").then(
    ({ ChangePassword }) => ({
      default: ChangePassword,
    })
  )
);

const TenderDocumentsValidation = lazy(() =>
  import(
    "./containers/TenderDocumentsValidation/TenderDocumentsValidation"
  ).then(({ TenderDocumentsValidation }) => ({
    default: TenderDocumentsValidation,
  }))
);

const TenderSubmissions = lazy(() =>
  import("./containers/TenderSubmissions/TenderSubmissions").then(
    ({ TenderSubmissions }) => ({
      default: TenderSubmissions,
    })
  )
);

const UsersByTenderVisibility = lazy(() =>
  import("./containers/UsersByTenderVisibility/UsersByTenderVisibility").then(
    ({ UsersByTenderVisibility }) => ({
      default: UsersByTenderVisibility,
    })
  )
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
    if (this.props.system.basic_info === null) {
      this.setState({ loading: true });
      this.props.FC_GetSystemInfo((loading: boolean) =>
        this.setState({ loading: loading })
      );
    }
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
                      {this.props.auth.user?.type === UserType.BIDER && (
                        <ProtectedRoute
                          path="/applications"
                          component={BidderApplications}
                          isAuthenticated={this.props.auth.isAuthenticated}
                          authenticationPath={authenticationPath}
                          loading={this.state.loading}
                          exact
                        />
                      )}
                      {this.props.auth.user?.type === UserType.BIDER && (
                        <ProtectedRoute
                          path="/applications/:application_id/:tender_id"
                          component={BidderApplications}
                          isAuthenticated={this.props.auth.isAuthenticated}
                          authenticationPath={authenticationPath}
                          loading={this.state.loading}
                          exact
                        />
                      )}
                      {this.props.auth.user?.type === UserType.HOLDER && (
                        <ProtectedRoute
                          path="/validate-application-document/:tender_id/:document_id/:opening_time/:document_title"
                          component={ValidateApplicationDocument}
                          isAuthenticated={this.props.auth.isAuthenticated}
                          authenticationPath={authenticationPath}
                          loading={this.state.loading}
                          exact
                        />
                      )}
                      {this.props.auth.user?.type === UserType.HOLDER && (
                        <ProtectedRoute
                          path="/tenders-list"
                          component={TendersList}
                          isAuthenticated={this.props.auth.isAuthenticated}
                          authenticationPath={authenticationPath}
                          loading={this.state.loading}
                          exact
                        />
                      )}
                      {this.props.auth.user?.type === UserType.HOLDER && (
                        <ProtectedRoute
                          path="/create-tender"
                          component={CreateTender}
                          isAuthenticated={this.props.auth.isAuthenticated}
                          authenticationPath={authenticationPath}
                          loading={this.state.loading}
                          exact
                        />
                      )}
                      {this.props.auth.user?.type === UserType.HOLDER && (
                        <ProtectedRoute
                          path="/tender-docs-validation"
                          component={TenderDocumentsValidation}
                          isAuthenticated={this.props.auth.isAuthenticated}
                          authenticationPath={authenticationPath}
                          loading={this.state.loading}
                          exact
                        />
                      )}
                      {this.props.auth.user?.type === UserType.HOLDER && (
                        <ProtectedRoute
                          path="/tender-docs-validation/:tender_id"
                          component={TenderDocumentsValidation}
                          isAuthenticated={this.props.auth.isAuthenticated}
                          authenticationPath={authenticationPath}
                          loading={this.state.loading}
                          exact
                        />
                      )}
                      {this.props.auth.user?.type === UserType.HOLDER && (
                        <ProtectedRoute
                          path="/tender-submissions-validation"
                          component={TenderSubmissions}
                          isAuthenticated={this.props.auth.isAuthenticated}
                          authenticationPath={authenticationPath}
                          loading={this.state.loading}
                          exact
                        />
                      )}
                      {this.props.auth.user?.type === UserType.HOLDER && (
                        <ProtectedRoute
                          path="/tender-submissions-validation/:tender_id"
                          component={TenderSubmissions}
                          isAuthenticated={this.props.auth.isAuthenticated}
                          authenticationPath={authenticationPath}
                          loading={this.state.loading}
                          exact
                        />
                      )}
                      {this.props.auth.user?.type === UserType.HOLDER && (
                        <ProtectedRoute
                          path="/users-by-tender-visibility"
                          component={UsersByTenderVisibility}
                          isAuthenticated={this.props.auth.isAuthenticated}
                          authenticationPath={authenticationPath}
                          loading={this.state.loading}
                          exact
                        />
                      )}
                      <ProtectedRoute
                        path="/change-password"
                        component={ChangePassword}
                        isAuthenticated={this.props.auth.isAuthenticated}
                        authenticationPath={authenticationPath}
                        loading={this.state.loading}
                        exact
                      />
                      <ProtectedRoute
                        path="/profile"
                        component={Profile}
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
