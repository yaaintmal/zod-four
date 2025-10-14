import { z } from "zod";

const CatFactSchema = z.object({
  // refac again: back to fact from text, oc!

  fact: z.string().min(1, "fact can't be empty 😿"),
  length: z.number().int().nonnegative().optional(),
});
// api gives array but we want an obj with data prop
// code expects: validatedResponse.data

export const CatFactsApiResponseSchema = z.object({
  data: z.array(CatFactSchema).min(1, "array shouldn't be empty 🙀"),
  meta: z
    .object({
      current_page: z.number().int().nonnegative().optional(),
    })
    // .passthrough() / does the method still exist?
    .optional(),
});
// .passthrough();

export type CatFactsApiResponse = z.infer<typeof CatFactsApiResponseSchema>;
export type CatFact = z.infer<typeof CatFactSchema>;
