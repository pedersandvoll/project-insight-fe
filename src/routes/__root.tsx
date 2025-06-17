import {
  createRootRouteWithContext,
  Outlet,
  useMatchRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Box, CssBaseline } from "@mui/material";
import { Appbar } from "../components/appbar";
import type { ReactElement } from "react";
import type { RouterContext } from "../main";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

function RootLayout(): ReactElement {
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
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  );
}
