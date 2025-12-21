import express from "express";

import { authMiddleware } from "../controllers/_middlewares";
import {
  deleteUser,
  editUser,
  editUserLanguage,
  editUserTheme,
  getSelf,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/user";
import ROUTEMAP from "./ROUTEMAP";

const userRouter = express.Router();

userRouter.get(ROUTEMAP.users.self, authMiddleware, getSelf);
userRouter.post(ROUTEMAP.users.userLogout, userLogout);
userRouter.post(ROUTEMAP.users.userLogin, userLogin);
userRouter.post(ROUTEMAP.users.userRegister, userRegister);
userRouter.put(ROUTEMAP.users.put, editUser);
userRouter.put(ROUTEMAP.users.theme, editUserTheme);
userRouter.put(ROUTEMAP.users.language, editUserLanguage);
userRouter.delete(ROUTEMAP.users.delete, deleteUser);

export default userRouter;
