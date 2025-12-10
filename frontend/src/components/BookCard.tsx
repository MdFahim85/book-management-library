import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, Trash } from "lucide-react";
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
import EditBookModal from "./EditBookModal";

import type { deleteBook } from "@backend/controllers/books";
import type { Book } from "@backend/models/Book";
import type { GetRes } from "@backend/types/req-res";

function BookCard({ book }: { book: Book }) {
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
    onError: (error) => {
      alert(error.message);
    },
    throwOnError: true,
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 w-full p-4 ">
        <div className="font-semibold text-neutral-800 tracking-wide flex gap-4">
          <Download
            size={20}
            className="hover:text-emerald-400 transition-colors"
          />
          {book.name.toUpperCase()}
        </div>

        <div className="ms-auto flex gap-3 text-neutral-100">
          {/* Edit Modal */}
          <EditBookModal book={book} />
          {/* Delete Modal */}
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
                  onClick={() => mutateDeleteBook(book.id)}
                  disabled={isDeleting}
                  className="bg-red-400 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          ;
        </div>
      </div>
    </div>
  );
}

export default BookCard;
