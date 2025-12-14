import express from "express";

import config from "../config";
import { authMiddleware } from "../controllers/_middlewares";
import ROUTEMAP from "./ROUTEMAP";
import authorRouter from "./authors";
import booksRouter from "./books";
import userRouter from "./user";

const router = express.Router();

router.use(ROUTEMAP.uploads, express.static(config.uploadDir));

router.use(ROUTEMAP.books.root, authMiddleware, booksRouter);
router.use(ROUTEMAP.authors.root, authMiddleware, authorRouter);
router.use(ROUTEMAP.users.root, userRouter);

export default router;
