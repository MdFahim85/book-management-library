export default {
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
} as const;
