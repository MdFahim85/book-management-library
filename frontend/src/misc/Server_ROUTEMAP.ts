import type ROUTEMAP from "@backend/routes/ROUTEMAP";

export default {
  uploads: "/uploads",
  authors: {
    _params: { id: ":id" },
    root: "/authors",
    get: "/",
    post: "/",
    getById: "/:id",
    put: "/:id",
    delete: "/:id",
  },
  books: {
    _params: { id: ":id", authorId: ":authorId" },
    root: "/books",
    get: "/",
    post: "/",
    getById: "/:id",
    getByAuthorId: "/author/:authorId",
    put: "/:id",
    delete: "/:id",
  },
  users: {
    _params: { id: ":id" },
    root: "/users",
    userLogin: "/login",
    userRegister: "/register",
    put: "/:id",
    delete: "/:id",
  },
} as const satisfies typeof ROUTEMAP;
