export default {
  _: "/",
  authors: {
    _params: { id: ":id" },
    root: "/authors",
    index: "",
    authorDetails: ":id",
  },
  books: {
    _params: { id: ":id", authorId: ":authorId" },
    root: "books",
    index: "",
    bookDetails: ":id",
    authorBooks: "author/:authorId",
  },
  auth: {
    root: "/auth",
    login: "login",
    register: "register",
  },
  users: {
    _params: { id: ":id" },
    root: "/users",
    me: {
      root: "me",
      index: "",
    },
    user: "user/:userId",
  },
} as const;
