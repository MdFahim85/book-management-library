import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";
import { Trash } from "lucide-react";
import { AlertDialogHeader, AlertDialogFooter } from "./ui/alert-dialog";
import { Button } from "./ui/button";

import { modifiedFetch } from "../misc/modifiedFetch";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";

import type { deleteAuthor } from "@backend/controllers/authors";
import type { GetRes } from "@backend/types/req-res";

export default function DeleteAuthorModal({ id }: { id: number }) {
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get],
      });
      queryClient.invalidateQueries({
        queryKey: [Server_ROUTEMAP.books.root + Server_ROUTEMAP.books.get],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    throwOnError: true,
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will delete the author from database
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutateDeleteAuthor(id)}
            disabled={isDeleting}
            className="bg-red-400 hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
