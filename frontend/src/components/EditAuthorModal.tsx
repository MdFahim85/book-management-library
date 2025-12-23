import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

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

import { modifiedFetch } from "../misc/modifiedFetch";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";
import { useT } from "../types/i18nTypes";
import Form from "./Form";

import type { editAuthor } from "@backend/controllers/authors";
import type { Author } from "@backend/models/Author";
import type { GetReqBody, GetRes } from "@backend/types/req-res";

function EditAuthorModal({ author }: { author: Author }) {
  const t = useT();

  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [updatedAuthor, setUpdatedAuthor] = useState(author);

  const { mutate: mutateEditAuthor, isPending: isEditing } = useMutation({
    mutationFn: () =>
      modifiedFetch<GetRes<typeof editAuthor>>(
        Server_ROUTEMAP.authors.root +
          Server_ROUTEMAP.authors.put.replace(
            Server_ROUTEMAP.authors._params.id,
            author.id.toString()
          ),
        {
          method: "put",
          body: JSON.stringify(
            updatedAuthor satisfies GetReqBody<typeof editAuthor>
          ),
        }
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get],
      });
      if (data) toast.success(t(data.message));
      setModalOpen(false);
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
    throwOnError: true,
  });
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="default"
          onClick={() => setModalOpen(true)}
        >
          <Edit />
          {t("actions.edit")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form
          onSubmit={() => {
            mutateEditAuthor();
          }}
        >
          <DialogHeader className="pb-4">
            <DialogTitle> {t("authors.edit")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 pb-4">
            <div className="grid gap-3">
              <Label htmlFor="name">{t("authors.name")}</Label>
              <Input
                id="name"
                name="name"
                value={updatedAuthor.name}
                onChange={({ target: { value } }) =>
                  setUpdatedAuthor(() => ({ ...updatedAuthor, name: value }))
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
              disabled={updatedAuthor === author || isEditing}
            >
              {isEditing ? `${t("actions.editing")}` : `${t("actions.edit")}`}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditAuthorModal;
