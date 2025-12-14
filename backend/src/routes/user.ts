import express from "express";

import {
  deleteUser,
  editUser,
  userLogin,
  userRegister,
} from "../controllers/user";
import ROUTEMAP from "./ROUTEMAP";

const userRouter = express.Router();

userRouter.post(ROUTEMAP.users.userLogin, userLogin);
userRouter.post(ROUTEMAP.users.userRegister, userRegister);
userRouter.put(ROUTEMAP.users.put, editUser);
userRouter.delete(ROUTEMAP.users.delete, deleteUser);

export default userRouter;
