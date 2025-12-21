import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import { ArrowLeft, BookOpen, Calendar, Download, User } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import DeleteBookModal from "../../components/DeleteBookModal";
import EditBookModal from "../../components/EditBookModal";
import LoadingPage from "../../components/Loading";
import { useUserContext } from "../../contexts/UserContext";
import Client_ROUTEMAP from "../../misc/Client_ROUTEMAP";
import Server_ROUTEMAP from "../../misc/Server_ROUTEMAP";
import { API_URL, modifiedFetch } from "../../misc/modifiedFetch";

import type { getBookDetails } from "@backend/controllers/books";
import type { GetRes } from "@backend/types/req-res";

export default function BookDetails() {
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
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <p className="text-center text-red-500">Book not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link to={Client_ROUTEMAP._ + Client_ROUTEMAP.books.root}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Button>
        </Link>

        <Card>
          <CardHeader className="border-b">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="rounded-full bg-primary/10 p-3 mt-1">
                  <BookOpen className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Book Title
                  </p>
                  <CardTitle className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 leading-tight">
                    {book.name}
                  </CardTitle>
                </div>
              </div>
              <Button asChild className="mt-1 shrink-0">
                <a
                  href={API_URL + Server_ROUTEMAP.uploads + "/" + book.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-500/10 p-3">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Author Name
                  </p>
                  <p className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">
                    {book.authorName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-purple-500/10 p-3">
                  <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Created By
                  </p>
                  <p className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">
                    {book.createdByName}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          {user!.id === book.createdBy && (
            <CardFooter className="border-t bg-muted/30">
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
