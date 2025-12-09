import { title } from "process";
import { z } from "zod";
import { id } from "zod/locales";

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  thumbnail: z.url(),
  images: z.array(z.string()),
});
