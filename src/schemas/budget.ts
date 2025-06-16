import { z } from "zod";

export const updateBudgetSchema = z.object({
  budgetUsed: z.number({
    required_error: "Budget amount is required.",
    invalid_type_error: "Budget amount must be a number.",
  }),
});

export type UpdateBudgetFormSchema = z.infer<typeof updateBudgetSchema>;
