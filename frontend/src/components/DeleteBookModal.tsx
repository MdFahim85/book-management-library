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

import type { deleteBook } from "@backend/controllers/books";
import type { GetRes } from "@backend/types/req-res";

export default function DeleteBookModal({ id }: { id: number }) {
  const queryClient = useQueryClient();
  const { mutate: mutateDeleteBook, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) =>
      modifiedFetch<GetRes<typeof deleteBook>>(
        Server_ROUTEMAP.books.root +
          Server_ROUTEMAP.books.delete.replace(
            Server_ROUTEMAP.books._params.id,
            id.toString()
          ),
        { method: "delete" }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [Server_ROUTEMAP.books.root + Server_ROUTEMAP.books.get],
      });
    },
    onError: (error) => toast.error(error.message),
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
            This action will delete the book from database
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutateDeleteBook(id)}
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
