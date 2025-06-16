import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { ProjectDTO, UserDTO } from "../types/api";
import { useNavigate } from "@tanstack/react-router";
import { Field, useForm } from "@tanstack/react-form";
import { usePostAssignUserToProject } from "../hooks/project.api";
import {
  assignUserToProjectSchema,
  type AssignUserToProjectFormSchema,
} from "../schemas/project";
import { UserRole } from "../enums/userRole";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { getRoleLabel } from "../utils/getRoleLabel";
import { FormActions } from "../components/formActions";

interface AssignUserFormProps {
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<ProjectDTO, Error>>;
  projectId: string;
  currentUser: UserDTO;
  usersData: UserDTO[];
}

export default function AssignUserForm(props: AssignUserFormProps) {
  const { refetch, projectId, currentUser, usersData } = props;
  const navigate = useNavigate();
  const { mutateAsync, isPending } = usePostAssignUserToProject(() => {
    refetch();
    navigate({
      to: "/$projectId",
      params: { projectId: projectId },
      search: { assignUser: false },
    });
  });
  const form = useForm({
    defaultValues: {
      role: UserRole.Contactperson,
      userId: currentUser.ID,
    } as AssignUserToProjectFormSchema,
    validators: {
      onChange: assignUserToProjectSchema,
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
          name="userId"
          children={(field) => (
            <Autocomplete
              autoFocus
              disablePortal
              value={usersData.find((user) => user.ID === field.state.value)}
              options={usersData}
              getOptionLabel={(option) =>
                option.FirstName + " " + option.LastName
              }
              onChange={(_, newValue) =>
                newValue && field.handleChange(newValue.ID)
              }
              renderInput={(params) => (
                <TextField {...params} label="Assign user" />
              )}
            />
          )}
        />
        <form.Field
          name="role"
          children={(field) => (
            <FormControl>
              <InputLabel>User role</InputLabel>
              <Select
                label="User role"
                size="medium"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              >
                {Object.values(UserRole)
                  .filter((value) => typeof value === "number")
                  .map((value) => (
                    <MenuItem key={value} value={value}>
                      {getRoleLabel(value)}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={() => (
            <FormActions
              onCancel={() =>
                navigate({
                  to: "/$projectId",
                  params: { projectId: projectId },
                  search: { assignUser: false },
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
