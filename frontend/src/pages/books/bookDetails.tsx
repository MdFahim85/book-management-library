import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import { ArrowLeft, BookOpen, Calendar, User } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import BookPdfReader from "../../components/BookPdfReader";
import DeleteBookModal from "../../components/DeleteBookModal";
import EditBookModal from "../../components/EditBookModal";
import LoadingPage from "../../components/Loading";
import NotFound from "../../components/NotFound";
import { useUserContext } from "../../contexts/UserContext";
import Client_ROUTEMAP from "../../misc/Client_ROUTEMAP";
import Server_ROUTEMAP from "../../misc/Server_ROUTEMAP";
import { modifiedFetch } from "../../misc/modifiedFetch";
import { useT } from "../../types/i18nTypes";

import type { getBookDetails } from "@backend/controllers/books";
import type { GetRes } from "@backend/types/req-res";

export default function BookDetails() {
  const t = useT();
  const { id } = useParams<(typeof Client_ROUTEMAP)["books"]["_params"]>();

  const { user, isLoading } = useUserContext();

  const { data: book, isLoading: isFetching } = useQuery({
    queryKey: [Server_ROUTEMAP.books.root + Server_ROUTEMAP.books.getById, id],
    queryFn: () =>
      modifiedFetch<GetRes<typeof getBookDetails>>(
        Server_ROUTEMAP.books.root +
          Server_ROUTEMAP.books.getById.replace(
            Server_ROUTEMAP.books._params.id,
            (id || "-1")?.toString()
          )
      ),
  });

  if (isLoading || isFetching) {
    return <LoadingPage />;
  }

  if (!book) {
    return <NotFound />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto">
        <Link to={Client_ROUTEMAP._ + Client_ROUTEMAP.books.root}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("navigation.backToBooks")}
          </Button>
        </Link>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
              {t("books.details")}
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-8 space-y-8">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="flex items-start gap-4 flex-1">
                <div className="rounded-full bg-primary/10 p-4 shrink-0">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {t("books.title")}
                  </p>
                  <CardTitle className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
                    {book.name}
                  </CardTitle>
                </div>
              </div>
              <BookPdfReader book={book} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 shadow-sm">
                <div className="rounded-full bg-blue-500/10 p-3 shrink-0">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {t("authors.name")}
                  </p>
                  <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {book.authorName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 shadow-sm">
                <div className="rounded-full bg-purple-500/10 p-3 shrink-0">
                  <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {t("user.createdBy")}
                  </p>
                  <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {book.createdByName}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          {user!.id === book.createdBy && (
            <CardFooter className="border-t">
              <div className="flex justify-center gap-4 w-full py-2">
                <EditBookModal book={book} />
                <DeleteBookModal id={book.id} />
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
