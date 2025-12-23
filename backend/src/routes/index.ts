import express from "express";

import config from "../config";
import { authMiddleware } from "../controllers/_middlewares";
import ROUTEMAP from "./ROUTEMAP";
import authorRouter from "./authors";
import booksRouter from "./books";
import statsRouter from "./stats";
import userRouter from "./user";

const router = express.Router();

router.use(ROUTEMAP.uploads, express.static(config.uploadDir));

router.use(ROUTEMAP.books.root, authMiddleware, booksRouter);
router.use(ROUTEMAP.authors.root, authMiddleware, authorRouter);
router.use(ROUTEMAP.users.root, userRouter);
router.use(ROUTEMAP.stats.root, statsRouter);

export default router;
