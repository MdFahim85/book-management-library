import { useState } from "react";
import type { Author } from "../types/types";

import { useAddBook } from "../hooks/bookHooks";
import { useGetAuthors } from "../hooks/authorHooks";
import { useNavigate } from "react-router-dom";

function AddBook() {
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [authorId, setAuthorId] = useState<number | null>(null);

  const { data, isPending, isError, error } = useGetAuthors();
  const { mutate: addBook, isPending: isAdding } = useAddBook();

  const handleAdd = async () => {
    addBook(
      { name, authorId: authorId as number },
      {
        onSuccess: () => {
          alert("Book added");
          setName("");
          navigate("/books");
        },
        onError: (error) => {
          alert(error.message);
        },
      }
    );
  };

  if (isPending) {
    return <div>loading</div>;
  }
  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleAdd();
      }}
    >
      <div className="bg-white shadow-md border border-neutral-200 rounded-lg p-6 max-w-xl mx-auto mt-6 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-neutral-800">
          Add a New Book
        </h2>

        <div className="flex flex-col gap-1">
          <label htmlFor="add" className="font-medium text-neutral-700">
            Book Name
          </label>
          <input
            type="text"
            name="add"
            id="add"
            className="bg-neutral-100 border border-neutral-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
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
            {data.authors.map((author: Author) => {
              return (
                <option value={author.id} key={author.id}>
                  {author.name}
                </option>
              );
            })}
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
    </form>
  );
}

export default AddBook;
