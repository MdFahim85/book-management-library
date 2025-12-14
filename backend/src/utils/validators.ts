import z from "zod";
import zodCoerce from "./zodCoerce";

export const idValidator = z.object({
  id: zodCoerce.number().int().positive(),
});

export const authorIdValidator = z.object({
  authorId: zodCoerce.number().int().positive(),
});

export const userValidator = z.object({
  email: z.email().max(255),
  password: z.string().min(6).max(255),
});
