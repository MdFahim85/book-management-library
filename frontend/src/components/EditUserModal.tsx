import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

import { Label } from "@radix-ui/react-label";
import { Edit } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

import { useUserContext } from "../contexts/UserContext";
import { modifiedFetch } from "../misc/modifiedFetch";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";
import { useT } from "../types/i18nTypes";
import Form from "./Form";
import LoadingPage from "./Loading";

import type { editUser } from "@backend/controllers/user";
import type { GetReqBody, GetRes } from "@backend/types/req-res";

export default function EditUserModal() {
  const t = useT();

  const queryClient = useQueryClient();
  const { user, isLoading } = useUserContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    ...user,
  });
  const { mutate: mutateEditUser, isPending: isEditing } = useMutation({
    mutationFn: () =>
      modifiedFetch<GetRes<typeof editUser>>(
        Server_ROUTEMAP.users.root +
          Server_ROUTEMAP.users.put.replace(
            Server_ROUTEMAP.users._params.id,
            user!.id.toString()
          ),
        {
          method: "put",
          body: JSON.stringify(
            updatedUser satisfies GetReqBody<typeof editUser>
          ),
        }
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [Server_ROUTEMAP.users.root + Server_ROUTEMAP.users.self],
      });
      if (data) toast.success(data.message);
      setModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    throwOnError: true,
  });

  if (isLoading) return <LoadingPage />;

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setModalOpen(true)}
        >
          <Edit className="w-5 h-5" /> <p className="font-bold">{user?.name}</p>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form
          onSubmit={() => {
            mutateEditUser();
          }}
        >
          <DialogHeader className="pb-4">
            <DialogTitle>{t("user.edit")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 pb-4">
            <div className="grid gap-3">
              <Label htmlFor="name">{t("forms.name")}</Label>
              <Input
                id="name"
                name="name"
                value={updatedUser.name}
                onChange={({ target: { value } }) =>
                  setUpdatedUser(() => ({ ...updatedUser, name: value }))
                }
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">{t("forms.email")}</Label>
              <Input
                id="email"
                name="email"
                value={updatedUser.email}
                onChange={({ target: { value } }) =>
                  setUpdatedUser(() => ({ ...updatedUser, email: value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {t("actions.cancel")}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isEditing}>
              {isEditing ? `${t("actions.editing")}` : `${t("actions.edit")}`}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
