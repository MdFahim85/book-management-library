import { useState } from "react";
import { Document, Page } from "react-pdf";

import { Download, Eye } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import i18n from "../misc/i18n";
import { API_URL } from "../misc/modifiedFetch";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";
import { useT } from "../types/i18nTypes";

import type { Book } from "@backend/models/Book";


export default function BookPdfReader({ book }: { book: Book }) {
  const t = useT();

  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function nextPage() {
    setPageNumber((prev) => (prev < numPages ? prev + 1 : prev));
  }

  function prevPage() {
    setPageNumber((prev) => (prev > 1 ? prev - 1 : prev));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button">
          <Eye className="mr-2 h-4 w-4" />
          {t("books.read")}
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
            min-w-[80vw]
            h-[80vh]
            flex
            flex-col
          "
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex justify-between items-center pt-6">
              <h1 className="text-xl">
                {t("books.title")} : {book.name}
              </h1>
              <Button type="button">
                <a
                  href={API_URL + Server_ROUTEMAP.uploads + "/" + book.fileUrl}
                  target="_blank"
                  download
                  className="flex items-center gap-4"
                >
                  <Download /> {t("books.download")}
                </a>
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto rounded-md border dark:invert dark:hue-rotate-180 ">
          <center>
            <Document
              file={API_URL + Server_ROUTEMAP.uploads + "/" + book.fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page
                key={`page_${pageNumber}`}
                pageNumber={pageNumber}
                width={1000}
                className="mx-auto my-1 h-full"
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </center>
        </div>
        <div className="flex justify-center items-center gap-4">
          <Button onClick={prevPage}>{t("table.prev")}</Button>
          <Button onClick={nextPage}>{t("table.next")}</Button>
        </div>
        <div className="text-center font-bold">
          {t("table.pages")} -{" "}
          {new Intl.NumberFormat(i18n.language).format(pageNumber)} /
          {new Intl.NumberFormat(i18n.language).format(numPages)}
        </div>
      </DialogContent>
    </Dialog>
  );
}
