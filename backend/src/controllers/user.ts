import { RequestHandler } from "express";
import status from "http-status";

import UserModel, {
  addUserSchema,
  updateUserSchema,
  User,
} from "../models/User";
import ROUTEMAP from "../routes/ROUTEMAP";
import ResponseError from "../utils/ResponseError";
import { idValidator, userValidator } from "../utils/validators";
import { generateAccessToken, passwordChecker, passwordHash } from "../utils";
import { jwtToken } from "../config";

// User Login
export const userLogin: RequestHandler<
  {},
  { message: string; data: string },
  Partial<User>
> = async (req, res) => {
  const { email, password } = await userValidator.parseAsync(req.body);

  const user = await UserModel.getUserByEmail(email);
  if (!user) throw new ResponseError("No user found", status.NOT_FOUND);

  const match = await passwordChecker(password, user.password);
  if (!match) throw new ResponseError("Wrong credentials", status.UNAUTHORIZED);

  const token = generateAccessToken(user.id);
  res.cookie(jwtToken, token, { maxAge: 7 * 24 * 60 * 60 * 1000 });

  res.json({ message: "Logged in successfully", data: token });
};

// User registration
export const userRegister: RequestHandler<
  {},
  { message: string },
  User
> = async (req, res) => {
  const { password } = req.body;
  const hashedPassword = await passwordHash(password);
  req.body.password = hashedPassword;

  const user = await UserModel.addUser(
    await addUserSchema.parseAsync(req.body)
  );

  if (!user) throw new ResponseError("User not added", status.BAD_REQUEST);

  const token = generateAccessToken(user.id);
  res.cookie(jwtToken, token, { maxAge: 7 * 24 * 60 * 60 * 1000 });

  res.status(201).json({ message: "Registration Successfull" });
};

// Update user
export const editUser: RequestHandler<
  Partial<typeof ROUTEMAP.users._params>,
  { message: string; data: User },
  Partial<User> & { oldPassword: string }
> = async (req, res) => {
  const { id } = await idValidator.parseAsync(req.params);

  const { oldPassword, ...userDetails } = req.body;

  if (!oldPassword) {
    throw new ResponseError("Provide old password", status.UNAUTHORIZED);
  }

  const dbUser = await UserModel.getUserById(id);

  if (dbUser) {
    const match = await passwordChecker(oldPassword, dbUser.password);
    if (!match) throw new ResponseError("Password doesnt match");
    if (oldPassword === userDetails.password)
      throw new ResponseError(
        "New password cannot be same as old password",
        status.CONFLICT
      );
  }

  const user = await UserModel.editUser(
    id,
    await updateUserSchema.parseAsync(userDetails)
  );
  if (!user)
    throw new ResponseError("Failed to update the user", status.BAD_REQUEST);

  res.json({ message: "User details has been updated", data: user });
};

// Delete user
export const deleteUser: RequestHandler<
  Partial<typeof ROUTEMAP.users._params>,
  { message: string },
  Pick<User, "password">
> = async (req, res) => {
  const { id } = await idValidator.parseAsync(req.params);

  const { password } = req.body;
  if (!password) {
    throw new ResponseError("Please provide password", status.UNAUTHORIZED);
  }

  const dbUser = await UserModel.getUserById(id);
  if (dbUser) {
    const match = await passwordChecker(password, dbUser.password);
    if (!match) throw new ResponseError("Password doesnt match");
  }

  const result = await UserModel.deleteUser(id);
  if (!result) {
    throw new ResponseError("Failed to delete user", status.BAD_REQUEST);
  }

  res.json({ message: result });
};
