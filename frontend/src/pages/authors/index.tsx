import { useSuspenseQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import AddAuthorModal from "../../components/AddAuthorModal";
import AuthorCard from "../../components/AuthorCard";
import StatCards from "../../components/StatCards";
import { EMPTY_ARRAY } from "../../misc";
import i18n from "../../misc/i18n";
import { modifiedFetch } from "../../misc/modifiedFetch";
import Server_ROUTEMAP from "../../misc/Server_ROUTEMAP";
import { useT } from "../../types/i18nTypes";


import type { getAuthors } from "@backend/controllers/authors";
import type { Author } from "@backend/models/Author";
import type { GetRes } from "@backend/types/req-res";

const getColumns = (
  t: ReturnType<typeof useT>,
  locale: string
): ColumnDef<Author>[] => [
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
    cell: ({ row }) => <AuthorCard author={row.original} />,
  },
];

function Authors() {
  const t = useT();

  const columns = useMemo(() => getColumns(t, i18n.language), [t]);

  const { data: authors = EMPTY_ARRAY } = useSuspenseQuery({
    queryKey: [Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get],
    queryFn: () =>
      modifiedFetch<GetRes<typeof getAuthors>>(
        Server_ROUTEMAP.authors.root + Server_ROUTEMAP.authors.get
      ),
  });

  const table = useReactTable({
    data: authors,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <StatCards />
      <Card className="my-4">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">
            {t("authors.management")}
          </CardTitle>
          <div className="flex items-center gap-4 justify-end me-4">
            <AddAuthorModal />
          </div>

          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
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
                    );
                  })}
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
        </CardHeader>
      </Card>
    </>
  );
}

export default Authors;
