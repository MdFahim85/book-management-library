import fs from "fs/promises";
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

export const pdfValidator = async (filePath: string): Promise<boolean> => {
  const file = await fs.open(filePath, "r");

  try {
    const header = Buffer.alloc(5);
    await file.read(header, 0, 5, 0);

    return header.toString("utf8") === "%PDF-";
  } finally {
    await file.close();
  }
};
