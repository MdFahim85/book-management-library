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

import { API_URL } from "../misc/modifiedFetch";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";
import { useT } from "../types/i18nTypes";

import type { Book } from "@backend/models/Book";

export default function BookPdfReader({ book }: { book: Book }) {
  const t = useT();

  const [numPages, setNumPages] = useState(0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
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
            min-w-[50vw]
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

        <div className="flex-1 overflow-y-auto rounded-md border dark:invert dark:hue-rotate-180 bg-neutral-300">
          <center>
            <Document
              file={API_URL + Server_ROUTEMAP.uploads + "/" + book.fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              {Array.from(new Array(numPages), (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={800}
                  className="mx-auto my-1"
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              ))}
            </Document>
          </center>
        </div>
      </DialogContent>
    </Dialog>
  );
}
