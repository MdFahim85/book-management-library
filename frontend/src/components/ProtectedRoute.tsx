import { type FC, type PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";

import Client_ROUTEMAP from "../misc/Client_ROUTEMAP";
import { useUserContext } from "../contexts/UserContext";
import LoadingPage from "./Loading";

const ProtectedRoute: FC<
  PropsWithChildren<{
    allowLoggedInOnly?: boolean;
    allowLoggedOutOnly?: boolean;
  }>
> = ({ children, allowLoggedInOnly, allowLoggedOutOnly }) => {
  const location = useLocation();

  const { user, isLoading } = useUserContext();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!user && allowLoggedInOnly)
    return (
      <Navigate
        to={Client_ROUTEMAP.auth.root + "/" + Client_ROUTEMAP.auth.login}
        state={{ from: location.pathname + location.search }}
        replace
      />
    );

  if (user && allowLoggedOutOnly) {
    return <Navigate to={location.state?.from ?? Client_ROUTEMAP._} replace />;
  }

  return children;
};

export default ProtectedRoute;

/**
 * Protected Route -> allowLoggedInOnly, allowLoggedOutOnly
 *
 * if already logged in, current route is for logged out only, redirect
 * if not logged in, current route is for logged in only, redirect with prev location
 * if currently being logged in, wait
 */
