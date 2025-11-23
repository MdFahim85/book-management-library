import { useParams } from "react-router-dom";
import { useGetBooksByAuthor } from "../hooks/authorHooks";
import type { Book } from "../types/types";
import BookCard from "./BookCard";

function BooksByAuthor() {
  const { authorId } = useParams();
  const { data, isPending, isError, error } = useGetBooksByAuthor({
    authorId: parseInt(authorId as string),
  });
  if (isPending) {
    return <div>Loading</div>;
  }
  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div>
      {data.booksByAuthor?.length ? (
        data.booksByAuthor.map((book: Book) => {
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
  );
}

export default BooksByAuthor;
