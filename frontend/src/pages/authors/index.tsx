import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { modifiedFetch } from "../../misc/modifiedFetch";
import AuthorCard from "../../components/AuthorCard";
import { EMPTY_ARRAY } from "../../misc";

import type { getAuthors } from "@backend/controllers/authors";
import type { GetRes } from "@backend/types/req-res";
import Server_ROUTEMAP from "../../misc/Server_ROUTEMAP";

function Authors() {
  const { data: authors = EMPTY_ARRAY } = useSuspenseQuery({
    queryKey: [Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get],
    queryFn: () =>
      modifiedFetch<GetRes<typeof getAuthors>>(
        Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get
      ),
  });

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
        {authors.length ? (
          authors.map((author) => (
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
