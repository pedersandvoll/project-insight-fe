import { Button, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { registerSchema, type RegisterFormSchema } from "../schemas/auth";
import { useRegisterUser } from "../hooks/auth.api";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { mutateAsync } = useRegisterUser(() => navigate({ to: "/login" }));
  const form = useForm({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    } as RegisterFormSchema,
    validators: {
      onChange: registerSchema,
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
      aria-label="Registration form"
    >
      <Stack
        gap={2}
        sx={{
          padding: "20px",
          backgroundColor: "#F5F5F5",
          width: "100%",
          minWidth: "300px",
          maxWidth: "600px",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h4">Register</Typography>
        <form.Field
          name="email"
          children={(field) => (
            <>
              <TextField
                autoFocus
                fullWidth
                variant="filled"
                label="Email"
                onChange={(e) => field.handleChange(e.target.value)}
                value={field.state.value}
                error={
                  field.state.meta.isTouched && !!field.state.meta.errors[0]
                }
                helperText={
                  field.state.meta.isTouched &&
                  field.state.meta.errors[0]?.message
                }
                type="email"
                sx={{ minWidth: "400px" }}
                inputProps={{ "aria-label": "Enter your email address" }}
              />
            </>
          )}
        />
        <form.Field
          name="firstName"
          children={(field) => (
            <TextField
              fullWidth
              variant="filled"
              label="First name"
              onChange={(e) => field.handleChange(e.target.value)}
              value={field.state.value}
              error={field.state.meta.isTouched && !!field.state.meta.errors[0]}
              helperText={
                field.state.meta.isTouched &&
                field.state.meta.errors[0]?.message
              }
              sx={{ minWidth: "400px" }}
              inputProps={{ "aria-label": "Enter your first name" }}
            />
          )}
        />
        <form.Field
          name="lastName"
          children={(field) => (
            <TextField
              fullWidth
              variant="filled"
              label="Last name"
              onChange={(e) => field.handleChange(e.target.value)}
              value={field.state.value}
              error={field.state.meta.isTouched && !!field.state.meta.errors[0]}
              helperText={
                field.state.meta.isTouched &&
                field.state.meta.errors[0]?.message
              }
              sx={{ minWidth: "400px" }}
              inputProps={{ "aria-label": "Enter your last name" }}
            />
          )}
        />
        <form.Field
          name="password"
          children={(field) => (
            <TextField
              fullWidth
              variant="filled"
              label="Password"
              onChange={(e) => field.handleChange(e.target.value)}
              value={field.state.value}
              error={field.state.meta.isTouched && !!field.state.meta.errors[0]}
              helperText={
                field.state.meta.isTouched &&
                field.state.meta.errors[0]?.message
              }
              type="password"
              sx={{ minWidth: "400px" }}
              inputProps={{ "aria-label": "Enter your password" }}
            />
          )}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit}
              variant="contained"
              fullWidth
              sx={{ textTransform: "none" }}
              aria-label={
                isSubmitting ? "Creating account" : "Create your account"
              }
            >
              {isSubmitting ? "..." : "Register"}
            </Button>
          )}
        />
        <Stack direction="row" alignItems="center" justifyContent="center">
          <Typography>Already have an account?</Typography>
          <Button
            sx={{ textTransform: "none" }}
            onClick={() => navigate({ to: "/login" })}
            aria-label="Navigate to login page"
          >
            Login
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
