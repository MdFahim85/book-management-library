import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { Book, BookA, LogOut, User } from "lucide-react";
import { Button } from "./ui/button";

import { useUserContext } from "../contexts/UserContext";
import { modifiedFetch } from "../misc/modifiedFetch";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";
import { useT } from "../types/i18nTypes";
import EditUserModal from "./EditUserModal";
import LanguageToggle from "./LanguageToggle";
import { ModeToggle } from "./ModeToggle";

import type { userLogout } from "@backend/controllers/user";
import type { GetRes } from "@backend/types/req-res";

export default function SideBar() {
  const t = useT();
  const queryClient = useQueryClient();

  const { user } = useUserContext();

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

  if (!user) {
    return <></>;
  }
  return (
    <aside className="h-full bg-background border-r border-border flex flex-col justify-between pb-4">
      <div>
        <div className="p-6 flex justify-between">
          <Link
            to="/books"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <BookA className="w-6 h-6" />
            <h1 className="text-lg font-semibold">{t("app.title")}</h1>
          </Link>
          <div className="flex gap-2 items-center">
            <ModeToggle />
            <LanguageToggle />
          </div>
        </div>

        <nav className="px-3 mt-8">
          <ul className="space-y-2">
            <li>
              <Link
                to="/books"
                className="flex items-center gap-4 px-4 py-3 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Book className="w-5 h-5" />
                <span className="text-base font-medium">
                  {" "}
                  {t("navigation.books")}
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/authors"
                className="flex items-center gap-4 px-4 py-3 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-base font-medium">
                  {" "}
                  {t("navigation.authors")}
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {user && (
        <>
          <div className="flex justify-between items-center px-3">
            <div>
              <EditUserModal />
            </div>
            <div>
              <Button
                variant={"destructive"}
                onClick={() => logOut()}
                disabled={isLoggingOut}
              >
                <LogOut />
                {t("actions.logout")}
              </Button>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
