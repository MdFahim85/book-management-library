import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Client_ROUTEMAP from "../misc/Client_ROUTEMAP";
import { modifiedFetch } from "../misc/modifiedFetch";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";

import type { getSelf } from "@backend/controllers/user";
import type { GetRes } from "@backend/types/req-res";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { data: user } = useQuery({
    queryKey: [Server_ROUTEMAP.users.root + Server_ROUTEMAP.users.self],
    queryFn: () =>
      modifiedFetch<GetRes<typeof getSelf>>(
        Server_ROUTEMAP.users.root + Server_ROUTEMAP.users.self
      ),
    retry: false,
  });
  if (!user)
    return (
      <Navigate
        to={Client_ROUTEMAP.auth.root + "/" + Client_ROUTEMAP.auth.login}
        replace
      />
    );

  return children;
}
