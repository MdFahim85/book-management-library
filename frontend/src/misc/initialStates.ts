import type { Author } from "@backend/models/Author";
import type { Book } from "@backend/models/Book";

export const initialBookState: Book = {
  id: -1,
  name: "",
  authorId: -1,
  fileUrl: "",
};

export const initialAuthorState: Author = {
  id: -1,
  name: "",
};
