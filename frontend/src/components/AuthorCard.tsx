import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";

import { modifiedFetch } from "../misc/modifiedFetch";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";
import Form from "./Form";

import type Author from "@backend/models/Author";
import type { deleteAuthor, editAuthor } from "@backend/controllers/authors";
import type { GetReqBody, GetRes } from "@backend/types/req-res";

function AuthorCard({ author }: { author: Author }) {
  const queryClient = useQueryClient();

  const [editActive, setEditActive] = useState(false);
  const [name, setName] = useState<string>(author.name);

  const { mutate: mutateEditAuthor, isPending: isEditing } = useMutation({
    mutationFn: () =>
      modifiedFetch<GetRes<typeof editAuthor>>(
        Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.put,
        {
          method: "put",
          body: JSON.stringify({ name } satisfies GetReqBody<
            typeof editAuthor
          >),
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get],
      });
      setEditActive(false);
    },
    onError: (error) => {
      alert(error.message);
    },
    throwOnError: true,
  });

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
    },
    onError: (error) => {
      alert(error.message);
    },
    throwOnError: true,
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 w-full p-4">
        <div>
          <Link to={`/books/author/${author.id}`}>
            <p className="font-semibold text-neutral-800 tracking-wide">
              {author.name}
            </p>
          </Link>
        </div>

        <div className="ms-auto flex gap-3 text-neutral-100">
          <button
            onClick={() => setEditActive(true)}
            className="bg-emerald-500 px-4 py-1.5 rounded-md hover:bg-emerald-600 transition-colors text-white text-sm font-medium"
          >
            Edit
          </button>

          <button
            onClick={() => mutateDeleteAuthor(author.id)}
            disabled={isDeleting}
            className="bg-red-500 px-4 py-1.5 rounded-md hover:bg-red-600 transition-colors text-white text-sm font-medium disabled:bg-red-900 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        </div>
      </div>

      {editActive && (
        <>
          <div className="fixed inset-0 bg-neutral-300/75 z-20"></div>

          <Form
            onSubmit={() => mutateEditAuthor()}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     z-30 bg-white w-full max-w-md shadow-lg rounded-xl p-6 
                     flex flex-col gap-4 border border-neutral-200"
          >
            <h3 className="text-lg font-semibold text-neutral-800">
              Edit Author
            </h3>

            <div className="flex flex-col gap-1">
              <label htmlFor="edit" className="text-neutral-700 font-medium">
                Author Name
              </label>
              <input
                type="text"
                name="edit"
                id="edit"
                className="bg-neutral-100 border border-neutral-300 px-4 py-2 rounded 
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                className="bg-emerald-600 text-white px-4 py-2 rounded-md 
                         hover:bg-emerald-700 transition-colors font-medium
                         disabled:bg-emerald-900"
                type="submit"
                disabled={isEditing}
              >
                Save
              </button>

              <button
                className="bg-neutral-300 text-neutral-700 px-4 py-2 rounded-md 
                         hover:bg-neutral-400 transition-colors font-medium"
                type="button"
                onClick={() => setEditActive(false)}
              >
                Cancel
              </button>
            </div>
          </Form>
        </>
      )}
    </div>
  );
}

export default AuthorCard;
