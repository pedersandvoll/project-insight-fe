import { z } from "zod";

export const projectNameSearchSchema = z.object({
  name: z.string(),
});

export type ProjectNameSearchFormSchema = z.infer<
  typeof projectNameSearchSchema
>;
