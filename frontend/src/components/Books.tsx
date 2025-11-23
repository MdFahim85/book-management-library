import { useMemo, useState } from "react";
import type { Author, Book } from "../types/types";
import BookCard from "./BookCard";
import { useGetAuthors } from "../hooks/authorHooks";
import { useGetBooks } from "../hooks/bookHooks";
import { Link } from "react-router-dom";

function Books() {
  const [selectedAuthor, setSelectedAuthor] = useState<number | null>(null);

  const {
    data: authorsData,
    isPending: isAuthors,
    isError: isAuthorsError,
    error: authorsError,
  } = useGetAuthors();
  const {
    data: booksData,
    isPending: isBooks,
    isError: isBooksError,
    error: booksError,
  } = useGetBooks();

  const books = useMemo(() => {
    if (!booksData) return [];

    if (!selectedAuthor) return booksData.books;

    return booksData?.books?.filter(
      (book: Book) => book.author_id === selectedAuthor
    );
  }, [booksData, selectedAuthor]);

  if (isAuthors || isBooks) {
    return <div>Loading...</div>;
  }

  if (isAuthorsError) {
    return <div>{authorsError.message}</div>;
  }

  if (isBooksError) {
    return <div>{booksError.message}</div>;
  }

  return (
    <div className="w-full flex flex-col py-6">
      <div className="text-4xl text-center font-bold text-neutral-800 mb-6">
        Book List
      </div>
      <div className="flex items-center gap-4 mb-6 justify-between  ">
        <div>
          <Link
            to={"/books/add"}
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
            onChange={(e) => setSelectedAuthor(parseInt(e.target.value))}
            disabled={!authorsData.authors.length || !books.length}
          >
            <option value="">Filter by author</option>
            {authorsData.authors?.map((author: Author) => {
              return (
                <option value={author.id} key={author.id}>
                  {author.name}
                </option>
              );
            })}
          </select>

          <button
            onClick={() => setSelectedAuthor(null)}
            className="px-4 py-2 rounded-md bg-neutral-300 text-neutral-700 
                   hover:bg-neutral-400 transition-colors font-medium disabled:bg-neutral-400"
            disabled={!authorsData.authors.length}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-10">
        {books?.length ? (
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
