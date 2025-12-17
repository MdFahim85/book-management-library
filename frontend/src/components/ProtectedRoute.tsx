import { useQuery } from "@tanstack/react-query";
import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

import Client_ROUTEMAP from "../misc/Client_ROUTEMAP";
import { modifiedFetch } from "../misc/modifiedFetch";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";
import LoadingPage from "./Loading";

import type { getSelf } from "@backend/controllers/user";
import type { GetRes } from "@backend/types/req-res";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const location = useLocation();
  const { data: user, isLoading } = useQuery({
    queryKey: [Server_ROUTEMAP.users.root + Server_ROUTEMAP.users.self],
    queryFn: () =>
      modifiedFetch<GetRes<typeof getSelf>>(
        Server_ROUTEMAP.users.root + Server_ROUTEMAP.users.self
      ),
    retry: false,
  });

  if (isLoading) return <LoadingPage />;

  if (!user)
    return (
      <Navigate
        to={Client_ROUTEMAP.auth.root + "/" + Client_ROUTEMAP.auth.login}
        replace
        state={{ from: location.pathname }}
      />
    );

  return children;
}
