import { useMutation } from "@tanstack/react-query";
import { postProjectBudget } from "../api/budget";
import type { UpdateBudgetFormSchema } from "../schemas/budget";

export const usePostProjectUpdate = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: (model: {
      projectId: string;
      form: UpdateBudgetFormSchema;
    }): Promise<{ message: string; budgetId: string }> =>
      postProjectBudget(model.projectId, model.form),
    onSuccess: () => onSuccess(),
  });
};
