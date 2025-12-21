import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { useUserContext } from "../contexts/UserContext";
import { EMPTY_ARRAY } from "../misc";
import { initialBookState } from "../misc/initialStates";
import { modifiedFetch } from "../misc/modifiedFetch";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";
import Form from "./Form";
import LoadingPage from "./Loading";

import type { getAuthors } from "@backend/controllers/authors";
import type { addBook } from "@backend/controllers/books";
import type { Book } from "@backend/models/Book";
import type { GetReqBody, GetRes } from "@backend/types/req-res";

export default function AddBookModal() {
  const queryClient = useQueryClient();
  const { user, isLoading } = useUserContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [book, setBook] = useState(initialBookState);
  const [bookPdf, setBookPdf] = useState<File | null>(null);

  const { data: authors = EMPTY_ARRAY } = useSuspenseQuery({
    queryKey: [Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get],
    queryFn: () =>
      modifiedFetch<GetRes<typeof getAuthors>>(
        Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get
      ),
  });

  const { mutate: addNewBook, isPending: isAdding } = useMutation({
    mutationFn: async () => {
      if (!bookPdf) {
        toast.error("Please select a pdf");
        return;
      }

      const form = new FormData();
      form.append("fileUrl" satisfies keyof Book, bookPdf);
      form.append(
        "json",
        JSON.stringify(book satisfies GetReqBody<typeof addBook>)
      );

      return modifiedFetch<GetRes<typeof addBook>>(
        Server_ROUTEMAP.books.root + Server_ROUTEMAP.books.post,
        {
          method: "post",
          body: form,
        }
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [Server_ROUTEMAP.books.root + Server_ROUTEMAP.books.get],
      });
      if (data) toast.success(data.message);
      setBook(initialBookState);
      setModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    throwOnError: true,
  });

  // const onInputChange: ChangeEventHandler<HTMLInputElement> = ({
  //   target: { id, value, valueAsNumber },
  // }) =>
  //   setBook(() => ({ ...book, [id]: id === "date" ? valueAsNumber : value }));

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
          Add Book
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form
          onSubmit={() => {
            setBook(() => ({ ...book, createdBy: user!.id }));
            addNewBook();
          }}
        >
          <DialogHeader className="pb-4">
            <DialogTitle>Add a New Book</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={book.name}
                onChange={({ target: { value } }) =>
                  setBook(() => ({ ...book, name: value }))
                }
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="author">Select an Author</Label>
              <Select
                onValueChange={(value) =>
                  setBook(() => ({ ...book, authorId: parseInt(value) }))
                }
                disabled={!authors.length}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an author" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Authors</SelectLabel>
                    {authors.map((author) => (
                      <SelectItem value={author.id.toString()} key={author.id}>
                        {author.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3 mb-4">
              <Label htmlFor="name">Upload a PDF</Label>
              <Input
                id="bookPdf"
                name="bookPdf"
                type="file"
                accept="application/pdf"
                onChange={({ target }) => {
                  if (target.files?.[0]) setBookPdf(target.files[0]);
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={
                initialBookState === book || isAdding || !authors.length
              }
            >
              {isAdding ? "Adding..." : "Add Book"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
