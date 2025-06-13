import { Button, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { loginSchema, type LoginFormSchema } from "../schemas/auth";
import { useLoginUser } from "../hooks/auth.api";

export default function LoginForm() {
  const navigate = useNavigate();
  const { mutateAsync } = useLoginUser(() => navigate({ to: "/" }));
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as LoginFormSchema,
    validators: {
      onChange: loginSchema,
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
          padding: "20px",
          backgroundColor: "#F5F5F5",
          width: "100%",
          minWidth: "300px",
          maxWidth: "600px",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h4">Logg inn</Typography>
        <form.Field
          name="email"
          children={(field) => (
            <TextField
              autoFocus
              fullWidth
              variant="filled"
              label="E-post"
              onChange={(e) => field.handleChange(e.target.value)}
              value={field.state.value}
              error={!!field.state.meta.errors[0]}
              helperText={field.state.meta.errors[0]?.message}
              type="email"
              sx={{ minWidth: "400px" }}
            />
          )}
        />
        <form.Field
          name="password"
          children={(field) => (
            <TextField
              fullWidth
              variant="filled"
              label="Passord"
              onChange={(e) => field.handleChange(e.target.value)}
              value={field.state.value}
              error={field.state.meta.isTouched && !!field.state.meta.errors[0]}
              helperText={
                field.state.meta.isTouched &&
                field.state.meta.errors[0]?.message
              }
              type="password"
              sx={{ minWidth: "400px" }}
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
            >
              {isSubmitting ? "..." : "Logg inn"}
            </Button>
          )}
        />
        <Stack direction="row" alignItems="center" justifyContent="center">
          <Typography>Har du ikke en konto?</Typography>
          <Button onClick={() => navigate({ to: "/register" })}>
            Registrer
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
