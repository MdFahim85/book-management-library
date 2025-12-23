import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";

import { BookCopy, UserRoundPen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { EMPTY_ARRAY } from "../misc";
import Client_ROUTEMAP from "../misc/Client_ROUTEMAP";
import i18n from "../misc/i18n";
import { modifiedFetch } from "../misc/modifiedFetch";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";
import { useT } from "../types/i18nTypes";

import type { getAuthors } from "@backend/controllers/authors";
import type { getBooks } from "@backend/controllers/books";
import type { GetRes } from "@backend/types/req-res";

function StatCards() {
  const t = useT();

  const location = useLocation();

  const active: "books" | "authors" = location.pathname.startsWith(
    Client_ROUTEMAP.authors.root
  )
    ? "authors"
    : "books";

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
    <Card className="mt-2 ">
      <CardHeader>
        <CardTitle>
          <p className="text-2xl">{t("navigation.overview")}</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-12 gap-4">
          <Link
            to={
              Client_ROUTEMAP._ +
              Client_ROUTEMAP.books.root +
              Client_ROUTEMAP.books.index
            }
            className="col-span-6"
          >
            <Card
              className={`text-center bg-blue-200   hover:bg-blue-400 dark:bg-blue-400 dark:hover:bg-blue-500 transition-colors ${
                active == "books" && "bg-blue-400 dark:bg-blue-500"
              }`}
            >
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="grid gap-4 ">
                    <p className="text-xl text-neutral-800 dark:text-neutral-100">
                      {t("dashboard.totalBooks")}
                    </p>
                    <p className="text-4xl font-bold">
                      {new Intl.NumberFormat(i18n.language).format(
                        books.length
                      )}
                    </p>
                  </div>

                  <BookCopy size={50} />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link
            to={Client_ROUTEMAP.authors.root + Client_ROUTEMAP.authors.index}
            className="col-span-6"
          >
            <Card
              className={`text-center bg-emerald-200 hover:bg-emerald-400 dark:bg-emerald-400 dark:hover:bg-emerald-500 transition-colors ${
                active == "authors" && "bg-emerald-400 dark:bg-emerald-500"
              }`}
            >
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="grid gap-4 ">
                    <p className="text-xl text-neutral-800 dark:text-neutral-100">
                      {t("dashboard.totalAuthors")}
                    </p>
                    <p className="text-4xl font-bold">
                      {" "}
                      {new Intl.NumberFormat(i18n.language).format(
                        authors.length
                      )}
                    </p>
                  </div>

                  <UserRoundPen size={50} />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default StatCards;
