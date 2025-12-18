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

// Get self
export const getSelf: RequestHandler<{}, User> = (req, res) => {
  res.send(req.user);
};

// User Logout
export const userLogout: RequestHandler<{}, { message: string }> = async (
  _,
  res
) => {
  // Clear token from cookies
  res.clearCookie(jwtToken);

  res.json({ message: "Logged out successfully" });
};

// User Login
export const userLogin: RequestHandler<
  {},
  { message: string },
  Partial<User>
> = async (req, res) => {
  // Validate email and password
  const { email, password } = await userValidator.parseAsync(req.body);

  // User lookup and throw on failed query
  const user = await UserModel.getUserByEmail(email);
  if (!user) throw new ResponseError("No user found", status.NOT_FOUND);

  // Password checker
  const match = await passwordChecker(password, user.password);
  if (!match) throw new ResponseError("Wrong credentials", status.UNAUTHORIZED);

  // JWT token generation and setting cookie
  const token = generateAccessToken(user.id);
  res.cookie(jwtToken, token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    secure: true,
  });

  res.json({ message: "Logged in successfully" });
};

// User registration
export const userRegister: RequestHandler<
  {},
  { message: string },
  User
> = async (req, res) => {
  // Hashing the password
  const { password } = req.body;
  const hashedPassword = await passwordHash(password);
  req.body.password = hashedPassword;

  // Adding new user to db after validation
  const user = await UserModel.addUser(
    await addUserSchema.parseAsync(req.body)
  );

  // Throw on failed query
  if (!user) throw new ResponseError("User not added", status.BAD_REQUEST);

  // JWT token generation and setting cookie
  const token = generateAccessToken(user.id);
  res.cookie(jwtToken, token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    secure: true,
  });

  res.status(201).json({ message: "Registration Successfull" });
};

// Update user
export const editUser: RequestHandler<
  Partial<typeof ROUTEMAP.users._params>,
  { message: string },
  Partial<User> & { oldPassword?: string }
> = async (req, res) => {
  // Id validation
  const { id } = await idValidator.parseAsync(req.params);

  // Separating old password and new details
  const { oldPassword, ...userDetails } = req.body;

  // User lookup and throw on failed query
  const dbUser = await UserModel.getUserById(id);
  if (!dbUser) throw new ResponseError("User not found", status.NOT_FOUND);

  // If old and new password is provided
  if (oldPassword && userDetails.password) {
    const match = await passwordChecker(oldPassword, dbUser.password);
    if (!match) throw new ResponseError("Password doesnt match");
    if (oldPassword === userDetails.password)
      throw new ResponseError(
        "New password cannot be same as old password",
        status.CONFLICT
      );
  }

  // if new password not provided
  if (!userDetails.password) {
    userDetails.password = dbUser.password;
  } else {
    userDetails.password = await passwordHash(userDetails.password);
  }

  // User update
  const user = await UserModel.editUser(
    id,
    await updateUserSchema.parseAsync(userDetails)
  );

  // Throw on failed query
  if (!user)
    throw new ResponseError("Failed to update the user", status.BAD_REQUEST);

  res.json({ message: "User details has been updated" });
};

// Delete user
export const deleteUser: RequestHandler<
  Partial<typeof ROUTEMAP.users._params>,
  { message: string },
  Pick<User, "password">
> = async (req, res) => {
  // Id validation
  const { id } = await idValidator.parseAsync(req.params);

  const { password } = req.body;
  if (!password) {
    throw new ResponseError("Please provide password", status.UNAUTHORIZED);
  }

  // User lookup, password check and throw on failed query
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
