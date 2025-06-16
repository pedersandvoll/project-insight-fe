import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./context/AuthContext";
import { AppRouterProvider } from "./context/RouterContext";

export const queryClient = new QueryClient();
export const router = createRouter({ routeTree, context: { queryClient } });

export type RouterContext = {
  queryClient: QueryClient;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {/** <RouterProvider router={router} /> **/}
          <AppRouterProvider />
          <ReactQueryDevtools />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
