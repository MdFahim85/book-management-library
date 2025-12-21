import express from "express";

import {
  addAuthor,
  deleteAuthor,
  editAuthor,
  getAuthorDetailsById,
  getAuthors,
} from "../controllers/authors";
import ROUTEMAP from "./ROUTEMAP";

const authorRouter = express.Router();

authorRouter.get(ROUTEMAP.authors.get, getAuthors);
authorRouter.get(ROUTEMAP.authors.getById, getAuthorDetailsById);
authorRouter.post(ROUTEMAP.authors.post, addAuthor);
authorRouter.put(ROUTEMAP.authors.put, editAuthor);
authorRouter.delete(ROUTEMAP.authors.delete, deleteAuthor);

export default authorRouter;
