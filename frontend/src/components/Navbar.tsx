import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { modifiedFetch } from "../misc/modifiedFetch";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";

import type { getSelf, userLogout } from "@backend/controllers/user";
import type { GetRes } from "@backend/types/req-res";
import { LogInIcon, LogOut } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import Client_ROUTEMAP from "../misc/Client_ROUTEMAP";

export default function Navbar() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: [Server_ROUTEMAP.users.root + Server_ROUTEMAP.users.self],
    queryFn: () =>
      modifiedFetch<GetRes<typeof getSelf>>(
        Server_ROUTEMAP.users.root + Server_ROUTEMAP.users.self
      ),
    retry: false,
  });

  const { mutate: logOut, isPending: isLoggingOut } = useMutation({
    mutationFn: () =>
      modifiedFetch<GetRes<typeof userLogout>>(
        Server_ROUTEMAP.users.root + Server_ROUTEMAP.users.userLogout,
        {
          method: "post",
        }
      ),
    onSuccess: (data) => {
      if (data) toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: [Server_ROUTEMAP.users.root + Server_ROUTEMAP.users.self],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    throwOnError: true,
  });

  return (
    <nav className="py-4">
      <ul className="flex gap-4 justify-end items-center">
        {user ? (
          <>
            <li>
              <span className="font-bold">{user.name}</span>
            </li>
            <li>
              <Button
                variant={"destructive"}
                onClick={() => logOut()}
                disabled={isLoggingOut}
              >
                <LogOut />
                Logout
              </Button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to={
                  Client_ROUTEMAP.auth.root + "/" + Client_ROUTEMAP.auth.login
                }
              >
                <Button variant={"default"}>Login</Button>
              </Link>
            </li>
            <li>
              <Link
                to={
                  Client_ROUTEMAP.auth.root +
                  "/" +
                  Client_ROUTEMAP.auth.register
                }
              >
                <Button variant={"outline"}>
                  {" "}
                  <LogInIcon />
                  Register
                </Button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
