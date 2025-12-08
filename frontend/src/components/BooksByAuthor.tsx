import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { EMPTY_ARRAY } from "../misc";
import type Client_ROUTEMAP from "../misc/Client_ROUTEMAP";
import { modifiedFetch } from "../misc/modifiedFetch";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";
import BookCard from "./BookCard";

import type { getAuthorById } from "@backend/controllers/authors";
import type { getBooksByAuthorId } from "@backend/controllers/books";
import type { GetRes } from "@backend/types/req-res";

function BooksByAuthor() {
  const { authorId } =
    useParams<(typeof Client_ROUTEMAP)["books"]["_params"]>();

  const { data: books = EMPTY_ARRAY } = useSuspenseQuery({
    queryKey: [
      Server_ROUTEMAP.books.root + Server_ROUTEMAP.books.getByAuthorId,
      authorId,
    ],
    queryFn: () =>
      modifiedFetch<GetRes<typeof getBooksByAuthorId>>(
        Server_ROUTEMAP.books.root +
          Server_ROUTEMAP.books.getByAuthorId.replace(
            Server_ROUTEMAP.books._params.authorId,
            (authorId || "-1")?.toString()
          )
      ),
  });
  const { data: author } = useSuspenseQuery({
    queryKey: [
      Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.getById,
      authorId,
    ],
    queryFn: () =>
      modifiedFetch<GetRes<typeof getAuthorById>>(
        Server_ROUTEMAP.authors.getById.replace(
          Server_ROUTEMAP.authors._params.id,
          (authorId || "-1")?.toString()
        )
      ),
  });

  return (
    <div>
      <div className="pb-4 text-2xl font-semibold">Books by {author?.name}</div>
      <div>
        {books.length ? (
          books.map((book) => {
            return (
              <div
                key={book.id}
                className="bg-white border border-neutral-200 shadow-sm rounded-lg 
                     p-4 transition-colors hover:bg-neutral-50"
              >
                <BookCard book={book} />
              </div>
            );
          })
        ) : (
          <div className="pt-4 text-2xl text-center text-red-400">
            No books found
          </div>
        )}
      </div>
    </div>
  );
}

export default BooksByAuthor;
