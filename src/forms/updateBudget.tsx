import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import {
  updateBudgetSchema,
  type UpdateBudgetFormSchema,
} from "../schemas/budget";
import { usePostProjectUpdate } from "../hooks/budget.api";
import { Stack, TextField, Typography, Box, Divider } from "@mui/material";
import { formatToCurrency } from "../utils/formatToCurrency";
import { FormActions } from "../components/formActions";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { ProjectDTO } from "../types/api";

interface BudgetFormProps {
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<ProjectDTO, Error>>;
  projectId: string;
  estimatedCost: number;
  currentBudgetUsed: number;
}

export default function BudgetForm(props: BudgetFormProps) {
  const { refetch, projectId, estimatedCost, currentBudgetUsed } = props;
  const navigate = useNavigate();
  const { mutateAsync, isPending } = usePostProjectUpdate(() => {
    refetch();
    navigate({
      to: "/$projectId",
      params: { projectId: projectId },
      search: { updateBudget: false },
    });
  });
  const form = useForm({
    defaultValues: {
      budgetUsed: 0,
    } as UpdateBudgetFormSchema,
    validators: {
      onChange: updateBudgetSchema,
    },
    onSubmit: async ({ value }) => {
      mutateAsync({ projectId: projectId, form: value });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Stack
        gap={2}
        sx={{
          borderRadius: "8px",
        }}
      >
        <form.Field
          name="budgetUsed"
          children={(field) => {
            const newTotal = currentBudgetUsed + (field.state.value || 0);
            const newPercentage =
              estimatedCost > 0
                ? Math.round((newTotal / estimatedCost) * 100)
                : 0;

            return (
              <Stack spacing={2}>
                <TextField
                  autoFocus
                  type="number"
                  variant="filled"
                  label="Budget amount"
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  value={field.state.value}
                  error={
                    field.state.meta.isTouched && !!field.state.meta.errors[0]
                  }
                  helperText={
                    field.state.meta.isTouched &&
                    field.state.meta.errors[0]?.message
                  }
                  sx={{ maxWidth: "300px" }}
                />
                <Box sx={{ p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Budget Preview:
                  </Typography>
                  <Stack spacing={0.5}>
                    <Typography variant="body2">
                      New total used: {formatToCurrency(newTotal)}
                    </Typography>
                    <Typography variant="body2">
                      Remaining budget:{" "}
                      {formatToCurrency(estimatedCost - newTotal)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={
                        newPercentage >= 90
                          ? "error.main"
                          : newPercentage >= 75
                            ? "warning.main"
                            : "success.main"
                      }
                    >
                      Budget usage: {newPercentage}%
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            );
          }}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={() => (
            <FormActions
              onCancel={() =>
                navigate({
                  to: "/$projectId",
                  params: { projectId: projectId },
                  search: { updateBudget: false },
                })
              }
              isLoading={isPending}
            />
          )}
        />
      </Stack>
    </form>
  );
}
