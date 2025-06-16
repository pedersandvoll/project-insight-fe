import type { UpdateBudgetFormSchema } from "../schemas/budget";
import { apiFetch, createHeaders } from "./client";

export async function postProjectBudget(
  projectId: string,
  model: UpdateBudgetFormSchema,
) {
  const responseData = await apiFetch<{ message: string; budgetId: string }>(
    `budget/create/${projectId}`,
    {
      method: "POST",
      body: JSON.stringify(model),
      headers: createHeaders(),
    },
  );

  return responseData;
}
