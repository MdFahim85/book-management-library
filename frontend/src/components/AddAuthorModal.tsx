import { useMutation, useQueryClient } from "@tanstack/react-query";
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

import { modifiedFetch } from "../misc/modifiedFetch";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";
import Form from "./Form";

import type { addAuthor } from "@backend/controllers/authors";
import type { GetReqBody, GetRes } from "@backend/types/req-res";
import { initialAuthorState } from "../misc/initialStates";

export default function AddAuthorModal() {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [author, setAuthor] = useState(initialAuthorState);

  const { mutate: addNewAuthor, isPending: isAdding } = useMutation({
    mutationFn: () =>
      modifiedFetch<GetRes<typeof addAuthor>>(
        Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.post,
        {
          method: "post",
          body: JSON.stringify(author satisfies GetReqBody<typeof addAuthor>),
        }
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get],
      });
      if (data) toast.success(data.message);
      setAuthor(initialAuthorState);
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
          <Plus />
          Add Author
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form
          onSubmit={() => {
            addNewAuthor();
          }}
        >
          <DialogHeader className="pb-4">
            <DialogTitle>Add a New Author</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 pb-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={author.name}
                onChange={({ target: { value } }) =>
                  setAuthor(() => ({ ...author, name: value }))
                }
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
              disabled={initialAuthorState === author || isAdding}
            >
              {isAdding ? "Adding..." : "Add Author"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
