import { createRootRoute, Outlet, useMatchRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Box, CssBaseline } from "@mui/material";
import { Appbar } from "../components/appbar";

export const Route = createRootRoute({
  component: () => {
    const matchRoute = useMatchRoute();
    const isAuthRoute =
      matchRoute({ to: "/login" }) || matchRoute({ to: "/register" });

    return (
      <>
        <CssBaseline />
        {!isAuthRoute && (
          <Box sx={{ flexGrow: 1 }}>
            <Appbar />
          </Box>
        )}
        <Outlet />
        <TanStackRouterDevtools />
      </>
    );
  },
});
