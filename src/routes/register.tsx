import { Grid } from "@mui/material";
import RegisterForm from "../forms/register";

export const Route = createFileRoute({
  component: Register,
});

function Register() {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ 
        minHeight: "100vh", 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"50\" cy=\"50\" r=\"1\" fill=\"rgba(255,255,255,0.1)\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>')",
          opacity: 0.3,
          pointerEvents: "none"
        }
      }}
    >
      <RegisterForm />
    </Grid>
  );
}
