import type { Book } from "@backend/models/Book";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
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
import type { editBook } from "@backend/controllers/books";
import type { GetReqBody, GetRes } from "@backend/types/req-res";

function EditBookModal({ book }: { book: Book }) {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState(book.name);
  const [authorId, setAuthorId] = useState(book.authorId);

  const { data: authors = EMPTY_ARRAY } = useSuspenseQuery({
    queryKey: [Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get],
    queryFn: () =>
      modifiedFetch<GetRes<typeof getAuthors>>(
        Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get
      ),
  });

  const { mutate: mutateEditBook, isPending: isEditing } = useMutation({
    mutationFn: () =>
      modifiedFetch<GetRes<typeof editBook>>(
        Server_ROUTEMAP.books.root +
          Server_ROUTEMAP.books.put.replace(
            Server_ROUTEMAP.books._params.id,
            book.id.toString()
          ),
        {
          method: "put",
          body: JSON.stringify({
            name,
            authorId,
          } satisfies GetReqBody<typeof editBook>),
        }
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [Server_ROUTEMAP.books.root + Server_ROUTEMAP.books.get],
      });
      if (data) toast.success(data.message);
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
          <Edit />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form
          onSubmit={() => {
            mutateEditBook();
          }}
        >
          <DialogHeader className="pb-4">
            <DialogTitle>Edit Book</DialogTitle>
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
            <div className="grid gap-3 mb-4">
              <Label htmlFor="author">Select an Author</Label>
              <Select
                value={authorId.toString()}
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
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!name || authorId === -1 || isEditing}
            >
              {isEditing ? "Editing..." : "Edit Book"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditBookModal;
