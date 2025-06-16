import { useGetProjectDashboard } from "../hooks/project.api";
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  Stack,
} from "@mui/material";
import { Dashboard } from "../components/dashboard/dashboard";
import { DashboardTable } from "../components/dashboard/dashboardTable";
import { redirect, useNavigate } from "@tanstack/react-router";
import { useGetCurrentUser } from "../hooks/auth.api";

export const Route = createFileRoute({
  beforeLoad: async ({ location }) => {
    const token = localStorage.getItem("token");
    const isAuthenticated = !!token;

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Index,
});

function Index() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { data, isLoading } = useGetProjectDashboard();
  const { data: currentUser, isLoading: currentUserLoading } =
    useGetCurrentUser();

  if (isLoading || currentUserLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={3}>
        <Typography variant="h6" color="text.secondary">
          No dashboard data available.
        </Typography>
      </Box>
    );
  }

  if (!currentUser) {
    return navigate({ to: "/login" });
  }

  return (
    <Stack
      gap={3}
      sx={{
        flexGrow: 1,
        p: { xs: 2, sm: 3 },
        minHeight: "100vh",
        backgroundColor: theme.palette.grey[50],
      }}
    >
      <Box>
        <Dashboard data={data} />
      </Box>
      <Box>
        <DashboardTable data={data} currentUser={currentUser} />
      </Box>
    </Stack>
  );
}
