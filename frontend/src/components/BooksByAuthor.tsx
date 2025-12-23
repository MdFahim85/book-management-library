import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import { EMPTY_ARRAY } from "../misc";
import { modifiedFetch } from "../misc/modifiedFetch";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";
import { useT } from "../types/i18nTypes";
import BookCard from "./BookCard";

import type { getBooksByAuthorId } from "@backend/controllers/books";
import type { Book } from "@backend/models/Book";
import type { GetRes } from "@backend/types/req-res";

import type { Author } from "@backend/models/Author";
import i18n from "../misc/i18n";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const getColumns = (
  t: ReturnType<typeof useT>,
  locale: string
): ColumnDef<Book>[] => [
  {
    id: "serial",
    header: t("table.serialNumber"),
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      const value = pageIndex * pageSize + row.index + 1;

      return (
        <div className="w-10 font-bold text-center">
          {new Intl.NumberFormat(locale).format(value)}
        </div>
      );
    },
    size: 50,
  },
  {
    accessorKey: "name",
    header: t("forms.name"),
    cell: ({ row }) => <BookCard book={row.original} />,
  },
];

function BooksByAuthor({ author }: { author: Author }) {
  const t = useT();

  const columns = useMemo(() => getColumns(t, i18n.language), [t]);

  const { data: books = EMPTY_ARRAY } = useSuspenseQuery({
    queryKey: [
      Server_ROUTEMAP.books.root + Server_ROUTEMAP.books.getByAuthorId,
      author.id,
    ],
    queryFn: () =>
      modifiedFetch<GetRes<typeof getBooksByAuthorId>>(
        Server_ROUTEMAP.books.root +
          Server_ROUTEMAP.books.getByAuthorId.replace(
            Server_ROUTEMAP.books._params.authorId,
            (author.id || "-1")?.toString()
          )
      ),
  });

  const table = useReactTable({
    data: useMemo(() => books, [books]),
    columns,
    autoResetAll: true,
    debugRows: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Card className="pb-0">
      <CardHeader className="border-b">
        <CardTitle>
          <div className="text-2xl font-semibold">
            {author?.name} {t("navigation.books")}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.id === "serial" ? "w-16" : ""}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-red-400 text-xl"
                >
                  {t("table.noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t("table.prev")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t("table.next")}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default BooksByAuthor;
