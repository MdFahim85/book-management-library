import z from "zod";
import zodCoerce from "./zodCoerce";

export const idValidator = z.object({
  id: zodCoerce.number().int().positive(),
});

export const authorIdValidator = z.object({
  authorId: zodCoerce.number().int().positive(),
});
