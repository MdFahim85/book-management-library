export default {
  _: "/",
  authors: {
    _params: { id: ":id" },
    root: "/authors",
    index: "",
  },
  books: {
    _params: { id: ":id", authorId: ":authorId" },
    root: "books",
    index: "",
    authorBooks: "author/:authorId",
  },
  auth: {
    root: "/auth",
    login: "login",
    register: "register",
  },
} as const;
