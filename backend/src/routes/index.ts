import express from "express";

import ROUTEMAP from "./ROUTEMAP";
import booksRouter from "./books";
import authorRouter from "./authors";

const router = express.Router();

router.use(ROUTEMAP.books.root, booksRouter);
router.use(ROUTEMAP.authors.root, authorRouter);

export default router;
