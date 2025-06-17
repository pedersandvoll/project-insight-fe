import { RouterProvider } from "@tanstack/react-router";
import { router } from "../main";

export const AppRouterProvider = () => {
  return <RouterProvider router={router} />;
};
