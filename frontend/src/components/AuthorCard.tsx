import { Link } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

import Client_ROUTEMAP from "../misc/Client_ROUTEMAP";
import DeleteAuthorModal from "./DeleteAuthorModal";
import EditAuthorModal from "./EditAuthorModal";
import LoadingPage from "./Loading";

import type { Author } from "@backend/models/Author";

function AuthorCard({ author }: { author: Author }) {
  const { user, isLoading } = useUserContext();

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 w-full py-4 pe-2">
        <Link
          to={
            Client_ROUTEMAP.authors.root +
            "/" +
            Client_ROUTEMAP.authors.authorDetails.replace(
              Client_ROUTEMAP.authors._params.id,
              author.id.toString()
            )
          }
        >
          <div>
            <p className="font-semibold text-neutral-800 dark:text-neutral-100 tracking-wide flex gap-4 items-center">
              {author.name}
            </p>
          </div>
        </Link>

        {user!.id === author.createdBy && (
          <div className="ms-auto flex gap-3 text-neutral-100">
            {/* Edit author modal */}
            <EditAuthorModal author={author} />
            {/* Delete author */}
            <DeleteAuthorModal id={author.id} />
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthorCard;
