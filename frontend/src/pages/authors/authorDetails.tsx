import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import { ArrowLeft, Calendar, User } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import DeleteAuthorModal from "../../components/DeleteAuthorModal";
import EditAuthorModal from "../../components/EditAuthorModal";
import LoadingPage from "../../components/Loading";
import NotFound from "../../components/NotFound";
import { useUserContext } from "../../contexts/UserContext";
import Client_ROUTEMAP from "../../misc/Client_ROUTEMAP";
import Server_ROUTEMAP from "../../misc/Server_ROUTEMAP";
import { modifiedFetch } from "../../misc/modifiedFetch";
import { useT } from "../../types/i18nTypes";

import type { getAuthorDetailsById } from "@backend/controllers/authors";
import type { GetRes } from "@backend/types/req-res";
import BooksByAuthor from "../../components/BooksByAuthor";

export default function AuthorDetails() {
  const t = useT();

  const { id } = useParams<(typeof Client_ROUTEMAP)["authors"]["_params"]>();

  const { user, isLoading } = useUserContext();

  const { data: author, isLoading: isFetching } = useQuery({
    queryKey: [
      Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.getById,
      id,
    ],
    queryFn: () =>
      modifiedFetch<GetRes<typeof getAuthorDetailsById>>(
        Server_ROUTEMAP.authors.root +
          Server_ROUTEMAP.authors.getById.replace(
            Server_ROUTEMAP.authors._params.id,
            (id || "-1")?.toString()
          )
      ),
  });

  if (isLoading || isFetching) {
    return <LoadingPage />;
  }

  if (!author) {
    return <NotFound />;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="mx-auto">
        <Link to={Client_ROUTEMAP.authors.root}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("navigation.backToAuthors")}
          </Button>
        </Link>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
              {t("authors.details")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-500/10 p-3">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {t("authors.name")}
                  </p>
                  <p className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">
                    {author.name}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-purple-500/10 p-3">
                  <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {t("user.createdBy")}
                  </p>
                  <p className="text-lg text-neutral-700 dark:text-neutral-200">
                    {author.createdByName}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          {user!.id === author.createdBy && (
            <CardFooter className="border-t ">
              <div className="flex justify-center gap-4 w-full">
                <EditAuthorModal author={author} />{" "}
                <DeleteAuthorModal id={author.id} />
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
      <div>
        <BooksByAuthor author={author} />
      </div>
    </div>
  );
}
