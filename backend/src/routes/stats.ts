import express from "express";

import {
    addBookByUserStats,
    getBookByUserStats,
    getBookStats,
} from "../controllers/stats";
import ROUTEMAP from "./ROUTEMAP";

const statsRouter = express.Router();

statsRouter.get(ROUTEMAP.stats.getBookStats, getBookStats);
statsRouter.get(ROUTEMAP.stats.getBookByUserStats, getBookByUserStats);
statsRouter.post(ROUTEMAP.stats.post, addBookByUserStats);

export default statsRouter;
