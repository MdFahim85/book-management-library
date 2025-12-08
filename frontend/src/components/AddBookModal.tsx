import { useState } from "react";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Plus } from "lucide-react";
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

import { EMPTY_ARRAY } from "../misc";
import { modifiedFetch } from "../misc/modifiedFetch";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";
import Form from "./Form";

import type { getAuthors } from "@backend/controllers/authors";
import type { addBook } from "@backend/controllers/books";
import type { GetRes } from "@backend/types/req-res";

export default function AddBookModal() {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [authorId, setAuthorId] = useState(-1);
  const [bookPdf, setBookPdf] = useState<File | null>(null);

  const { data: authors = EMPTY_ARRAY } = useSuspenseQuery({
    queryKey: [Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get],
    queryFn: () =>
      modifiedFetch<GetRes<typeof getAuthors>>(
        Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get
      ),
  });
  const { mutate: addNewBook, isPending: isAdding } = useMutation({
    mutationFn: () => {
      const form = new FormData();
      form.append("name", name);
      form.append("authorId", authorId.toString());
      if (bookPdf) form.append("bookPdf", bookPdf);

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
      setName("");
      setAuthorId(-1);
      setBookPdf(null);
      setModalOpen(false);
    },
    onError: (error) => {
      alert(error.message);
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
          <Plus />
          Add Book
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form
          onSubmit={() => {
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
                value={name}
                onChange={({ target: { value } }) => setName(value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="author">Select an Author</Label>
              <Select
                onValueChange={(value) => setAuthorId(parseInt(value))}
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
              disabled={!name || authorId === -1 || isAdding}
            >
              {isAdding ? "Adding..." : "Add Book"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
