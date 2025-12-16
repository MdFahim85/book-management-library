import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import { Label } from "@radix-ui/react-label";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";

import Form from "../../components/Form";
import Client_ROUTEMAP from "../../misc/Client_ROUTEMAP";
import { initialUserLoginState } from "../../misc/initialStates";
import { modifiedFetch } from "../../misc/modifiedFetch";
import Server_ROUTEMAP from "../../misc/Server_ROUTEMAP";

import type { userLogin } from "@backend/controllers/user";
import type { GetReqBody, GetRes } from "@backend/types/req-res";

export default function Login() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [user, setUser] = useState(initialUserLoginState);
  const [showPass, setShowPass] = useState(false);

  const {
    mutate: loginUser,
    isPending: isLogginIn,
    isError,
    error,
  } = useMutation({
    mutationFn: () =>
      modifiedFetch<GetRes<typeof userLogin>>(
        Server_ROUTEMAP.users.root + Server_ROUTEMAP.users.userLogin,
        {
          method: "post",
          body: JSON.stringify(user satisfies GetReqBody<typeof userLogin>),
        }
      ),
    onSuccess: (data) => {
      if (data) toast.success(data.message);
      setUser(initialUserLoginState);
      queryClient.invalidateQueries({
        queryKey: [Server_ROUTEMAP.users.root + Server_ROUTEMAP.users.self],
      });
      navigate(
        Client_ROUTEMAP._ +
          Client_ROUTEMAP.books.root +
          Client_ROUTEMAP.books.index
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex justify-center items-center min-h-10/12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Login in to your account</CardTitle>
          <CardDescription>
            Enter your credentials below to Login
          </CardDescription>
          <CardAction>
            <Link
              to={
                Client_ROUTEMAP.auth.root + "/" + Client_ROUTEMAP.auth.register
              }
            >
              <Button variant="link">Register</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Form onSubmit={() => loginUser()}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
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
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
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
            </div>
            {isError && (
              <div className="text-center text-red-500 pt-4">
                {error.message}
              </div>
            )}
            <div className="mt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={initialUserLoginState === user || isLogginIn}
              >
                Login
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
