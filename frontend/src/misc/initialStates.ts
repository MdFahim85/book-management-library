import type { Author } from "@backend/models/Author";
import type { Book } from "@backend/models/Book";
import type { User } from "@backend/models/User";

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

export const initialUserRegisterState: User = {
  id: -1,
  name: "",
  email: "",
  password: "",
};

export const initialUserLoginState: Pick<User, "email" | "password"> = {
  email: "",
  password: "",
};
