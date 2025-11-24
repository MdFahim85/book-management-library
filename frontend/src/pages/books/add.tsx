import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { EMPTY_ARRAY } from "../../misc";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import Server_ROUTEMAP from "../../misc/Server_ROUTEMAP";
import { modifiedFetch } from "../../misc/modifiedFetch";
import type { GetReqBody, GetRes } from "@backend/types/req-res";
import type { getAuthors } from "@backend/controllers/authors";
import type { addBook } from "@backend/controllers/books";
import Form from "../../components/Form";

function AddBook() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState<string>("");
  const [authorId, setAuthorId] = useState<number>(-1);

  const { data: authors = EMPTY_ARRAY } = useSuspenseQuery({
    queryKey: [Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get],
    queryFn: () =>
      modifiedFetch<GetRes<typeof getAuthors>>(
        Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get
      ),
  });
  const { mutate: addNewBook, isPending: isAdding } = useMutation({
    mutationFn: () =>
      modifiedFetch<GetRes<typeof addBook>>(
        Server_ROUTEMAP.books.root + Server_ROUTEMAP.books.post,
        {
          method: "post",
          body: JSON.stringify({ name, authorId } satisfies GetReqBody<
            typeof addBook
          >),
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [Server_ROUTEMAP.books.root + Server_ROUTEMAP.books.get],
      });
      alert("Book added");
      setName("");
      navigate("/books");
    },
    onError: (error) => {
      alert(error.message);
    },
    throwOnError: true,
  });

  return (
    <Form onSubmit={() => addNewBook()}>
      <div className="bg-white shadow-md border border-neutral-200 rounded-lg p-6 max-w-xl mx-auto mt-6 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-neutral-800">
          Add a New Book
        </h2>

        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="font-medium text-neutral-700">
            Book Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="bg-neutral-100 border border-neutral-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={name}
            onChange={({ target: { value } }) => setName(value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="author" className="font-medium text-neutral-700">
            Select Author
          </label>
          <select
            name="author"
            id="author"
            className="bg-neutral-100 border border-neutral-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onChange={(e) => setAuthorId(parseInt(e.target.value))}
          >
            <option value="">Select Author</option>
            {authors.map((author) => (
              <option value={author.id} key={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="w-full text-white font-semibold bg-emerald-600 px-4 py-2 rounded-md transition-colors hover:bg-emerald-500 disabled:bg-emerald-900 disabled:text-gray-400 disabled:cursor-not-allowed"
          type="submit"
          disabled={!name || !authorId || isAdding}
        >
          {isAdding ? "Adding..." : "Add Book"}
        </button>
      </div>
    </Form>
  );
}

export default AddBook;
