import { Link } from "react-router-dom";

import { useUserContext } from "../contexts/UserContext";
import Client_ROUTEMAP from "../misc/Client_ROUTEMAP";
import DeleteBookModal from "./DeleteBookModal";
import EditBookModal from "./EditBookModal";
import LoadingPage from "./Loading";

import type { Book } from "@backend/models/Book";

function BookCard({ book }: { book: Book }) {
  const { user, isLoading } = useUserContext();

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 w-full py-4 pe-2">
        <Link
          to={
            Client_ROUTEMAP._ +
            Client_ROUTEMAP.books.root +
            "/" +
            Client_ROUTEMAP.books.bookDetails.replace(
              Client_ROUTEMAP.books._params.id,
              book.id.toString()
            )
          }
        >
          <div className="font-semibold text-neutral-800 dark:text-neutral-100 tracking-wide flex gap-4">
            {book.name}
          </div>
        </Link>

        {user!.id === book.createdBy && (
          <div className="ms-auto flex gap-3 text-neutral-100">
            {/* Edit Modal */}

            <EditBookModal book={book} />
            {/* Delete Modal */}
            <DeleteBookModal id={book.id} />
          </div>
        )}
      </div>
    </div>
  );
}

export default BookCard;
