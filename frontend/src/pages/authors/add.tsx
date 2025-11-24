import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Form from "../../components/Form";
import { modifiedFetch } from "../../misc/modifiedFetch";
import Server_ROUTEMAP from "../../misc/Server_ROUTEMAP";

import type { addAuthor } from "@backend/controllers/authors";
import type { GetReqBody, GetRes } from "@backend/types/req-res";

function AddAuthor() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const { mutate: addNewAuthor, isPending } = useMutation({
    mutationFn: () =>
      modifiedFetch<GetRes<typeof addAuthor>>(
        Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.post,
        {
          method: "post",
          body: JSON.stringify({ name } satisfies GetReqBody<typeof addAuthor>),
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get],
      });
      alert("Author added");
      setName("");
      navigate("/authors");
    },
    onError: (error) => {
      alert(error.message);
    },
    throwOnError: true,
  });

  return (
    <Form onSubmit={() => addNewAuthor()}>
      <div className="bg-white shadow-md border border-neutral-200 rounded-lg p-6 max-w-xl mx-auto mt-6 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-neutral-800">Add Author</h2>

        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="font-medium text-neutral-700">
            Author Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="bg-neutral-100 border border-neutral-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button
          className="w-full text-white font-semibold bg-emerald-600 px-4 py-2 rounded-md transition-colors hover:bg-emerald-500 disabled:bg-emerald-900 disabled:text-gray-400 disabled:cursor-not-allowed"
          type="submit"
          disabled={!name || isPending}
        >
          Add Author
        </button>
      </div>
    </Form>
  );
}

export default AddAuthor;
