import { lazy, Suspense } from "react";
import { redirect, useNavigate } from "@tanstack/react-router";
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  Stack,
} from "@mui/material";
import { useGetProjectDashboard } from "../hooks/project.api";
import { useGetCurrentUser } from "../hooks/auth.api";

const Dashboard = lazy(() =>
  import("../components/dashboard/dashboard").then((module) => ({
    default: module.Dashboard,
  })),
);

const DashboardTable = lazy(() =>
  import("../components/dashboard/dashboardTable").then((module) => ({
    default: module.DashboardTable,
  })),
);

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
        role="status"
        aria-label="Loading dashboard content"
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
      role="main"
      aria-label="Project dashboard"
    >
      <Box>
        <Suspense
          fallback={
            <Box
              display="flex"
              justifyContent="center"
              p={4}
              role="status"
              aria-label="Loading dashboard charts"
            >
              <CircularProgress />
            </Box>
          }
        >
          <Dashboard data={data} />
        </Suspense>
      </Box>
      <Box>
        <Suspense
          fallback={
            <Box
              display="flex"
              justifyContent="center"
              p={4}
              role="status"
              aria-label="Loading dashboard table"
            >
              <CircularProgress />
            </Box>
          }
        >
          <DashboardTable data={data} currentUser={currentUser} />
        </Suspense>
      </Box>
    </Stack>
  );
}
