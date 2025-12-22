import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

import { Plus } from "lucide-react";
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
import { Label } from "./ui/label";

import { useUserContext } from "../contexts/UserContext";
import { initialAuthorState } from "../misc/initialStates";
import { modifiedFetch } from "../misc/modifiedFetch";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";
import Form from "./Form";
import LoadingPage from "./Loading";
import { useT } from "../types/i18nTypes";

import type { addAuthor } from "@backend/controllers/authors";
import type { GetReqBody, GetRes } from "@backend/types/req-res";

export default function AddAuthorModal() {
  const t = useT();
  const queryClient = useQueryClient();
  const { user, isLoading } = useUserContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [author, setAuthor] = useState(initialAuthorState);

  const { mutate: addNewAuthor, isPending: isAdding } = useMutation({
    mutationFn: () =>
      modifiedFetch<GetRes<typeof addAuthor>>(
        Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.post,
        {
          method: "post",
          body: JSON.stringify(author satisfies GetReqBody<typeof addAuthor>),
        }
      ),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get],
      });
      if (data) toast.success(data.message);
      setAuthor(initialAuthorState);
      setModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    throwOnError: true,
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="default"
          onClick={() => setModalOpen(true)}
        >
          <Plus />
          {t("authors.add")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form
          onSubmit={() => {
            setAuthor(() => ({ ...author, createdBy: user!.id }));
            addNewAuthor();
          }}
        >
          <DialogHeader className="pb-4">
            <DialogTitle> {t("authors.add")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 pb-4">
            <div className="grid gap-3">
              <Label htmlFor="name"> {t("authors.name")}</Label>
              <Input
                id="name"
                name="name"
                value={author.name}
                onChange={({ target: { value } }) =>
                  setAuthor(() => ({ ...author, name: value }))
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
            <Button
              type="submit"
              disabled={initialAuthorState === author || isAdding}
            >
              {isAdding ? `${t("actions.adding")}` : `${t("actions.add")}`}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
