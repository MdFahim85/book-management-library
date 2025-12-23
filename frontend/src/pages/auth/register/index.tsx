import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { Label } from "@radix-ui/react-label";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";

import Form from "../../../components/Form";
import Client_ROUTEMAP from "../../../misc/Client_ROUTEMAP";
import { initialUserRegisterState } from "../../../misc/initialStates";
import { modifiedFetch } from "../../../misc/modifiedFetch";
import Server_ROUTEMAP from "../../../misc/Server_ROUTEMAP";
import { useT } from "../../../types/i18nTypes";

import type { userRegister } from "@backend/controllers/user";
import type { GetReqBody, GetRes } from "@backend/types/req-res";

export default function Register() {
  const t = useT();

  const queryClient = useQueryClient();
  const [user, setUser] = useState(initialUserRegisterState);
  const [showPass, setShowPass] = useState(false);

  const {
    mutate: registerUser,
    isPending: isRegistering,
    isError,
    error,
  } = useMutation({
    mutationFn: () =>
      modifiedFetch<GetRes<typeof userRegister>>(
        Server_ROUTEMAP.users.root + Server_ROUTEMAP.users.userRegister,
        {
          method: "post",
          body: JSON.stringify(user satisfies GetReqBody<typeof userRegister>),
        }
      ),
    onSuccess: (data) => {
      if (data) toast.success(t(data.message));
      queryClient.invalidateQueries({
        queryKey: [Server_ROUTEMAP.users.root + Server_ROUTEMAP.users.self],
      });
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  return (
    <div className="flex justify-center items-center h-full w-full">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{t("auth.registerTitle")}</CardTitle>
          <CardDescription>{t("auth.registerSubtitle")}</CardDescription>
          <CardAction>
            <Link
              to={Client_ROUTEMAP.auth.root + "/" + Client_ROUTEMAP.auth.login}
            >
              <Button variant="link">{t("actions.login")}</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Form
            onSubmit={() => {
              if (user.password !== user.confirmPassword) {
                toast.error("Passwords dont match");
                return;
              }
              registerUser();
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{t("forms.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={user.email}
                  onChange={({ target: { value } }) =>
                    setUser(() => ({ ...user, email: value }))
                  }
                  className={`${isError ? "  border-red-500" : ""} `}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">{t("forms.name")}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="john doe"
                  value={user.name}
                  onChange={({ target: { value } }) =>
                    setUser(() => ({ ...user, name: value }))
                  }
                  className={`${isError ? "  border-red-500" : ""} `}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t("forms.password")}</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPass ? "text" : "password"}
                    placeholder="********"
                    required
                    value={user.password}
                    onChange={({ target: { value } }) =>
                      setUser(() => ({ ...user, password: value }))
                    }
                    className={`${isError ? "  border-red-500" : ""} `}
                  />
                  <Button
                    variant={"ghost"}
                    type="button"
                    className="absolute right-0 hover:bg-transparent cursor-progress"
                    onClick={() => setShowPass((val) => !val)}
                  >
                    {showPass ? <Eye /> : <EyeClosed />}
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="confirmPassword">
                    {t("forms.confirmPassword")}
                  </Label>
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="********"
                  required
                  value={user.confirmPassword}
                  onChange={({ target: { value } }) =>
                    setUser(() => ({ ...user, confirmPassword: value }))
                  }
                  className={`${isError ? "  border-red-500" : ""} `}
                />
              </div>
            </div>
            {isError && (
              <div className="text-center text-red-500 pt-4">
                {error.message}
              </div>
            )}
            <div className="mt-8">
              <Button
                type="submit"
                className="w-full"
                disabled={initialUserRegisterState === user || isRegistering}
              >
                {t("actions.register")}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
