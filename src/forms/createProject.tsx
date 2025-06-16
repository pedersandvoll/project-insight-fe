import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import {
  newProjectSchema,
  type NewProjectFormSchema,
} from "../schemas/project";
import { ProjectStatus } from "../enums/projectStatus";
import { usePostProject } from "../hooks/project.api";
import { FormActions } from "../components/formActions";
import { getStatusLabel } from "../utils/getStatusLabel";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { ProjectDTO } from "../types/api";

interface CreateProjectFormProps {
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<ProjectDTO[], Error>>;
}

export default function CreateProjectForm(props: CreateProjectFormProps) {
  const { refetch } = props;
  const navigate = useNavigate();
  const { mutateAsync, isPending } = usePostProject(() => {
    refetch();
    navigate({ to: "/projects", search: { newProject: false } });
  });
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      status: ProjectStatus.Concept,
      estimatedCost: 0,
    } as NewProjectFormSchema,
    validators: {
      onChange: newProjectSchema,
    },
    onSubmit: async ({ value }) => {
      mutateAsync(value);
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
          name="name"
          children={(field) => (
            <TextField
              autoFocus
              fullWidth
              variant="filled"
              label="Name"
              onChange={(e) => field.handleChange(e.target.value)}
              value={field.state.value}
              error={field.state.meta.isTouched && !!field.state.meta.errors[0]}
              helperText={
                field.state.meta.isTouched &&
                field.state.meta.errors[0]?.message
              }
              sx={{ minWidth: "400px" }}
            />
          )}
        />
        <form.Field
          name="description"
          children={(field) => (
            <TextField
              autoFocus
              fullWidth
              variant="filled"
              label="Description"
              onChange={(e) => field.handleChange(e.target.value)}
              value={field.state.value}
              error={field.state.meta.isTouched && !!field.state.meta.errors[0]}
              helperText={
                field.state.meta.isTouched &&
                field.state.meta.errors[0]?.message
              }
              sx={{ minWidth: "400px" }}
            />
          )}
        />
        <form.Field
          name="status"
          children={(field) => (
            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                size="medium"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              >
                {Object.values(ProjectStatus)
                  .filter((value) => typeof value === "number")
                  .map((value) => (
                    <MenuItem key={value} value={value}>
                      {getStatusLabel(value)}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        />
        <form.Field
          name="estimatedCost"
          children={(field) => (
            <TextField
              autoFocus
              fullWidth
              variant="filled"
              label="Estimated cost"
              onChange={(e) => field.handleChange(Number(e.target.value))}
              value={field.state.value}
              error={field.state.meta.isTouched && !!field.state.meta.errors[0]}
              helperText={
                field.state.meta.isTouched &&
                field.state.meta.errors[0]?.message
              }
              type="number"
              sx={{ minWidth: "400px" }}
            />
          )}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={() => (
            <FormActions
              onCancel={() =>
                navigate({
                  to: "/projects",
                  search: { newProject: false },
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
