import { useSuspenseQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import AddBookModal from "../../components/AddBookModal";
import BookCard from "../../components/BookCard";
import { EMPTY_ARRAY } from "../../misc";
import Server_ROUTEMAP from "../../misc/Server_ROUTEMAP";
import { modifiedFetch } from "../../misc/modifiedFetch";

import type { getAuthors } from "@backend/controllers/authors";
import type { getBooks } from "@backend/controllers/books";
import type { Book } from "@backend/models/Book";
import type { GetRes } from "@backend/types/req-res";

const columns: ColumnDef<Book>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
];

function Books() {
  const [selectedAuthorId, setSelectedAuthorId] = useState<number>();

  const { data: authors = EMPTY_ARRAY } = useSuspenseQuery({
    queryKey: [Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get],
    queryFn: () =>
      modifiedFetch<GetRes<typeof getAuthors>>(
        Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get
      ),
  });
  const { data: _books = EMPTY_ARRAY } = useSuspenseQuery({
    queryKey: [Server_ROUTEMAP.books.root + Server_ROUTEMAP.books.get],
    queryFn: () =>
      modifiedFetch<GetRes<typeof getBooks>>(
        Server_ROUTEMAP.books.root + Server_ROUTEMAP.books.get
      ),
  });

  const books = useMemo(
    () =>
      _books.filter(
        ({ authorId }) => !selectedAuthorId || authorId === selectedAuthorId
      ),
    [_books, selectedAuthorId]
  );

  const table = useReactTable({
    data: useMemo(() => books, [books]),
    columns,
    autoResetAll: true,
    debugRows: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle className="text-4xl font-bold text-neutral-800 mb-6">
          Books Management
        </CardTitle>
        <div className="flex items-center gap-4 justify-between me-4">
          <div className="flex gap-4">
            <Select
              value={selectedAuthorId?.toString() || "NaN"}
              onValueChange={(value) => setSelectedAuthorId(parseInt(value))}
              disabled={!authors.length}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by author" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Author</SelectLabel>
                  {[<SelectItem value="NaN">All</SelectItem>].concat(
                    authors.map((author) => (
                      <SelectItem value={author.id.toString()} key={author.id}>
                        {author.name}
                      </SelectItem>
                    ))
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              onClick={() => setSelectedAuthorId(undefined)}
              disabled={!authors.length}
            >
              Clear
            </Button>
          </div>
          <AddBookModal />
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((book) => (
                    <TableCell key={book.id}>
                      <BookCard book={row.original} />
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}

export default Books;
