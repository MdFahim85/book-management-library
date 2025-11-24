import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import BookCard from "../../components/BookCard";
import { EMPTY_ARRAY } from "../../misc";
import Client_ROUTEMAP from "../../misc/Client_ROUTEMAP";
import Server_ROUTEMAP from "../../misc/Server_ROUTEMAP";
import { modifiedFetch } from "../../misc/modifiedFetch";

import type { getAuthors } from "@backend/controllers/authors";
import type { getBooks } from "@backend/controllers/books";
import type Book from "@backend/models/Book";
import type { GetRes } from "@backend/types/req-res";

function Books() {
  const [selectedAuthorId, setSelectedAuthorId] = useState<number>();

  const { data: authors = EMPTY_ARRAY } = useSuspenseQuery({
    queryKey: [Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get],
    queryFn: () =>
      modifiedFetch<GetRes<typeof getAuthors>>(
        Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get
      ),
  });
  const { data: _books = EMPTY_ARRAY } = useSuspenseQuery({
    queryKey: [Server_ROUTEMAP.books.root + Server_ROUTEMAP.books.get],
    queryFn: () =>
      modifiedFetch<GetRes<typeof getBooks>>(
        Server_ROUTEMAP.books.root + Server_ROUTEMAP.books.get
      ),
  });

  const books = useMemo(
    () =>
      _books.filter(
        ({ authorId }) => !selectedAuthorId || authorId === selectedAuthorId
      ),
    [_books, selectedAuthorId]
  );

  return (
    <div className="w-full flex flex-col py-6">
      <div className="text-4xl text-center font-bold text-neutral-800 mb-6">
        Book List
      </div>
      <div className="flex items-center gap-4 mb-6 justify-between  ">
        <div>
          <Link
            to={Client_ROUTEMAP.books.root + Client_ROUTEMAP.books.add}
            className="bg-emerald-500 px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors text-white text-sm font-medium"
          >
            Add Book
          </Link>
        </div>
        <div className="flex gap-4">
          <select
            name="author"
            id="author"
            className="bg-white border border-neutral-300 px-4 py-2 rounded-md 
                   shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-neutral-400"
            onChange={({ target: { value } }) =>
              setSelectedAuthorId(parseInt(value))
            }
            disabled={!authors.length}
          >
            <option value="">Filter by author</option>
            {authors.map((author) => (
              <option value={author.id} key={author.id}>
                {author.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setSelectedAuthorId(undefined)}
            className="px-4 py-2 rounded-md bg-neutral-300 text-neutral-700 
                   hover:bg-neutral-400 transition-colors font-medium disabled:bg-neutral-400"
            disabled={!authors.length}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-10">
        {books.length ? (
          books.map((book: Book) => (
            <div
              key={book.id}
              className="bg-white border border-neutral-200 shadow-sm rounded-lg 
                     p-4 transition-colors hover:bg-neutral-50"
            >
              <BookCard book={book} />
            </div>
          ))
        ) : (
          <div className="pt-10 text-center text-2xl text-red-400">
            No books found
          </div>
        )}
      </div>
    </div>
  );
}

export default Books;
