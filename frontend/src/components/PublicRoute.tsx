// PublicRoute.tsx
import Cookies from "js-cookie";
import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import Client_ROUTEMAP from "../misc/Client_ROUTEMAP";

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const token = Cookies.get("token");

  if (token)
    return (
      <Navigate
        to={
          Client_ROUTEMAP._ +
          Client_ROUTEMAP.books.root +
          "/" +
          Client_ROUTEMAP.books.index
        }
        replace
      />
    );

  return children;
}
