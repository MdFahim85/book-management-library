import { EyeIcon } from "lucide-react";

import { useUserContext } from "../contexts/UserContext";
import { API_URL } from "../misc/modifiedFetch";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";
import EditBookModal from "./EditBookModal";
import LoadingPage from "./Loading";

import type { Book } from "@backend/models/Book";
import DeleteBookModal from "./DeleteBookModal";
import { Link } from "react-router-dom";
import Client_ROUTEMAP from "../misc/Client_ROUTEMAP";

function BookCard({ book }: { book: Book }) {
  const { user, isLoading } = useUserContext();

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 w-full p-4 ">
        <Link
          to={Client_ROUTEMAP.books.bookDetails.replace(
            Client_ROUTEMAP.books._params.id,
            book.id.toString()
          )}
        >
          <div className="font-semibold text-neutral-800 dark:text-neutral-100 tracking-wide flex gap-4">
            <a
              target="_blank"
              href={API_URL + Server_ROUTEMAP.uploads + "/" + book.fileUrl}
            >
              <EyeIcon
                size={20}
                className="hover:text-emerald-400 transition-colors"
              />
            </a>
            {book.name.toUpperCase()}
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
