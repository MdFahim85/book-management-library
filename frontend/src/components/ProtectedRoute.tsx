import Cookies from "js-cookie";
import type { JSX } from "react";
import { Navigate } from "react-router-dom";

import Client_ROUTEMAP from "../misc/Client_ROUTEMAP";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const token = Cookies.get("token");
  if (!token)
    return (
      <Navigate
        to={Client_ROUTEMAP.auth.root + "/" + Client_ROUTEMAP.auth.login}
        replace
      />
    );
  return children;
}
