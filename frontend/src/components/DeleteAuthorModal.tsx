import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

import { modifiedFetch } from "../misc/modifiedFetch";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";
import { useT } from "../types/i18nTypes";

import type { deleteAuthor } from "@backend/controllers/authors";
import type { GetRes } from "@backend/types/req-res";

export default function DeleteAuthorModal({ id }: { id: number }) {
  const t = useT();

  const queryClient = useQueryClient();

  const { mutate: mutateDeleteAuthor, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) =>
      modifiedFetch<GetRes<typeof deleteAuthor>>(
        Server_ROUTEMAP.authors.root +
          Server_ROUTEMAP.authors.delete.replace(
            Server_ROUTEMAP.authors._params.id,
            id.toString()
          ),
        { method: "delete" }
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get],
      });
      queryClient.invalidateQueries({
        queryKey: [Server_ROUTEMAP.books.root + Server_ROUTEMAP.books.get],
      });
      if (data) {
        toast.success(t(data.message));
      }
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
    throwOnError: true,
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash />
          {t("actions.delete")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("dialogs.confirmation")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("dialogs.deleteAuthor")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("actions.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutateDeleteAuthor(id)}
            disabled={isDeleting}
            className="bg-red-400 hover:bg-red-600"
          >
            {t("actions.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
