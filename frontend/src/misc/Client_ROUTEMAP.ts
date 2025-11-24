export default {
  root: "/",
  authors: {
    _params: { id: ":id" },
    root: "/authors",
    index: "",
    add: "add",
  },
  books: {
    _params: { id: ":id", authorId: ":authorId" },
    root: "/books",
    add: "/add",
  },
} as const;
