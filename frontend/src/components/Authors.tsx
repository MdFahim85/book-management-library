import type { Author } from "../types/types";
import AuthorCard from "./AuthorCard";

import { useGetAuthors } from "../hooks/authorHooks";
import { Link } from "react-router-dom";

function Authors() {
  const { data, isPending, isError, error } = useGetAuthors();

  if (isPending) {
    return <div>loading</div>;
  }
  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="w-full flex flex-col py-6 ">
      <div className="text-4xl text-center font-bold text-neutral-800 mb-6">
        Author List
      </div>

      <div className="me-auto">
        <Link
          to={"/authors/add"}
          className="bg-emerald-500  px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors text-white text-sm font-medium"
        >
          Add Author
        </Link>
      </div>

      <div className="flex flex-col gap-3 mb-10 mt-4">
        {data?.authors?.length ? (
          data.authors.map((author: Author) => (
            <div
              key={author.id}
              className="bg-white border border-neutral-200 shadow-sm rounded-lg p-4 
                     transition-colors hover:bg-neutral-50"
            >
              <AuthorCard author={author} />
            </div>
          ))
        ) : (
          <div className="pt-10 text-center text-2xl text-red-400">
            No authors found
          </div>
        )}
      </div>
    </div>
  );
}

export default Authors;
