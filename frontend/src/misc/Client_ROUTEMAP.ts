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
