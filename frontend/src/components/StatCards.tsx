import { useSuspenseQuery } from "@tanstack/react-query";
import { BookCopy, UserRoundPen } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { EMPTY_ARRAY } from "../misc";
import Client_ROUTEMAP from "../misc/Client_ROUTEMAP";
import { modifiedFetch } from "../misc/modifiedFetch";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";

import type { getAuthors } from "@backend/controllers/authors";
import type { getBooks } from "@backend/controllers/books";
import type { GetRes } from "@backend/types/req-res";

function StatCards() {
  const { data: authors = EMPTY_ARRAY } = useSuspenseQuery({
    queryKey: [Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get],
    queryFn: () =>
      modifiedFetch<GetRes<typeof getAuthors>>(
        Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get
      ),
  });

  const { data: books = EMPTY_ARRAY } = useSuspenseQuery({
    queryKey: [Server_ROUTEMAP.books.root + Server_ROUTEMAP.books.get],
    queryFn: () =>
      modifiedFetch<GetRes<typeof getBooks>>(
        Server_ROUTEMAP.books.root + Server_ROUTEMAP.books.get
      ),
  });

  return (
    <div className="grid grid-cols-12 gap-4 mt-4">
      <Card className="col-span-6 text-center hover:bg-emerald-100 transition-colors">
        <Link to={Client_ROUTEMAP.books.root}>
          <CardHeader>
            <CardTitle className="flex justify-center items-center gap-4">
              <BookCopy />
              Total Books
            </CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {books.length}
          </CardContent>
        </Link>
      </Card>
      <Card className="col-span-6 text-center hover:bg-emerald-100 transition-colors">
        <Link to={Client_ROUTEMAP.authors.root}>
          <CardHeader>
            <CardTitle className="flex justify-center items-center gap-4">
              <UserRoundPen />
              Total Author
            </CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {authors.length}
          </CardContent>
        </Link>
      </Card>
    </div>
  );
}

export default StatCards;
