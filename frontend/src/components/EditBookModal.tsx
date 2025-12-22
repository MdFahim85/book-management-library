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
import { useT } from "../types/i18nTypes";
import Form from "./Form";

import type { getAuthors } from "@backend/controllers/authors";
import type { editBook } from "@backend/controllers/books";
import type { Book } from "@backend/models/Book";
import type { GetReqBody, GetRes } from "@backend/types/req-res";

function EditBookModal({ book }: { book: Book }) {
  const t = useT();

  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [updatedBook, setUpdatedBook] = useState(book);
  const [bookPdf, setBookPdf] = useState<File | null>(null);

  const { data: authors = EMPTY_ARRAY } = useSuspenseQuery({
    queryKey: [Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get],
    queryFn: () =>
      modifiedFetch<GetRes<typeof getAuthors>>(
        Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get
      ),
  });

  const { mutate: mutateEditBook, isPending: isEditing } = useMutation({
    mutationFn: async () => {
      const form = new FormData();
      if (bookPdf) {
        form.append("fileUrl", bookPdf);
      }
      form.append(
        "json",
        JSON.stringify(updatedBook satisfies GetReqBody<typeof editBook>)
      );

      return modifiedFetch<GetRes<typeof editBook>>(
        Server_ROUTEMAP.books.root +
          Server_ROUTEMAP.books.put.replace(
            Server_ROUTEMAP.books._params.id,
            book.id.toString()
          ),
        {
          method: "put",
          body: form,
        }
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [Server_ROUTEMAP.books.root + Server_ROUTEMAP.books.get],
      });
      if (data) toast.success(data.message);
      setUpdatedBook(data!.data);
      setModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
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
            mutateEditBook();
          }}
        >
          <DialogHeader className="pb-4">
            <DialogTitle>{t("books.edit")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">{t("books.title")}</Label>
              <Input
                id="name"
                name="name"
                value={updatedBook.name}
                onChange={({ target: { value } }) =>
                  setUpdatedBook(() => ({ ...updatedBook, name: value }))
                }
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="author">{t("authors.name")}</Label>
              <Select
                value={updatedBook.authorId?.toString()}
                onValueChange={(value) =>
                  setUpdatedBook(() => ({
                    ...updatedBook,
                    authorId: parseInt(value),
                  }))
                }
                disabled={!authors.length}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("authors.name")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("forms.name")}</SelectLabel>
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
              <Label htmlFor="name">{t("forms.uploadPdf")}</Label>
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
                {t("actions.cancel")}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={updatedBook === book || isEditing || !authors.length}
            >
              {isEditing ? `${t("actions.editing")}` : `${t("actions.edit")}`}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditBookModal;
