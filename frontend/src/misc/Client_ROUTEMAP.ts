export default {
  _: "/",
  authors: {
    _params: { id: ":id" },
    root: "/authors",
    index: "",
    authorDetails: ":id",
  },
  books: {
    _params: { id: ":id" },
    root: "books",
    index: "",
    bookDetails: ":id",
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
