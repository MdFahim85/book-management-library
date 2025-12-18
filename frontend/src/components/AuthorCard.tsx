import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
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
import EditAuthorModal from "./EditAuthorModal";

import type { deleteAuthor } from "@backend/controllers/authors";
import type { Author } from "@backend/models/Author";
import type { GetRes } from "@backend/types/req-res";

function AuthorCard({ author }: { author: Author }) {
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
    <div className="w-full">
      <div className="flex items-center gap-4 w-full p-4">
        <div>
          <p className="font-semibold text-neutral-800 dark:text-neutral-100 tracking-wide">
            {author.name}
          </p>
        </div>

        <div className="ms-auto flex gap-3 text-neutral-100">
          <EditAuthorModal author={author} />

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
                  onClick={() => mutateDeleteAuthor(author.id)}
                  disabled={isDeleting}
                  className="bg-red-400 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

export default AuthorCard;
