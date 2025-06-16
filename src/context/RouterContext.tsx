import { RouterProvider } from "@tanstack/react-router";
import { queryClient, router } from "../main";

export const AppRouterProvider = () => {
  return <RouterProvider router={router} />;
};
