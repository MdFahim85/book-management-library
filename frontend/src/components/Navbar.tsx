import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogInIcon, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { Button } from "./ui/button";

import { useUserContext } from "../contexts/UserContext";
import Client_ROUTEMAP from "../misc/Client_ROUTEMAP";
import { modifiedFetch } from "../misc/modifiedFetch";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";
import EditUserModal from "./EditUserModal";
import LoadingPage from "./Loading";

import type { userLogout } from "@backend/controllers/user";
import type { GetRes } from "@backend/types/req-res";


export default function Navbar() {
  const queryClient = useQueryClient();
  const { user, isLoading } = useUserContext();

  const { mutate: logOut, isPending: isLoggingOut } = useMutation({
    mutationFn: () =>
      modifiedFetch<GetRes<typeof userLogout>>(
        Server_ROUTEMAP.users.root + Server_ROUTEMAP.users.userLogout,
        { method: "post" }
      ),
    onSuccess: (data) => {
      if (data) toast.success(data.message);
      queryClient.setQueryData(
        [Server_ROUTEMAP.users.root + Server_ROUTEMAP.users.self],
        null
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
    throwOnError: true,
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <></>;
  }

  return (
    <nav className="py-2">
      <ul className="flex gap-4 justify-end items-center">
        {user ? (
          <>
            <li>
              <span className="font-bold flex items-center gap-2">
                <EditUserModal />
              </span>
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
