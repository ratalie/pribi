import { z } from "zod";

export const optionalDateSchema = (message: string) =>
  z.string().refine((value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value), message);

export const optionalStringSchema = (message: string, minLength = 2) =>
  z.string().refine((value) => value === "" || value.trim().length >= minLength, message);
