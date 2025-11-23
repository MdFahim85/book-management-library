import express from "express";

import {
  addAuthor,
  deleteAuthor,
  editAuthor,
  getAuthorById,
  getAuthors,
} from "../controllers/authors";
import ROUTEMAP from "./ROUTEMAP";

const authorRouter = express.Router();

authorRouter.get(ROUTEMAP.authors.get, getAuthors);
authorRouter.get(ROUTEMAP.authors.getById, getAuthorById);
authorRouter.post(ROUTEMAP.authors.post, addAuthor);
authorRouter.put(ROUTEMAP.authors.put, editAuthor);
authorRouter.delete(ROUTEMAP.authors.delete, deleteAuthor);

export default authorRouter;
