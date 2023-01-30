import { Redirect, Route, RouteProps } from "react-router";
import LazyLoading from "../LazyLoading/LazyLoading";

export type ProtectedRouteProps = {
  isAuthenticated: boolean;
  authenticationPath: string;
  loading: boolean;
} & RouteProps;

export default function ProtectedRoute({
  isAuthenticated,
  authenticationPath,
  loading,
  ...routeProps
}: ProtectedRouteProps) {
  if (loading === true) {
    return <LazyLoading />;
  } else {
    if (isAuthenticated === true) {
      return <Route {...routeProps} />;
    } else {
      return <Redirect to={{ pathname: authenticationPath }} />;
    }
  }
}
