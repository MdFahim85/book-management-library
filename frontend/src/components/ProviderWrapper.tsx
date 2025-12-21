import { type FC, type PropsWithChildren } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

import { ThemeProvider } from "../contexts/ThemeContext";
import { UserContextProvider } from "../contexts/UserContext";
import ErrorBoundaryWithRouter from "./ErrorBoundary";
import LoadingPage from "./Loading";

const ProviderWrapper: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundaryWithRouter>
        <Suspense fallback={<LoadingPage />}>
          <UserContextProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              {children}
              <Toaster position="top-right" reverseOrder={false} />
            </ThemeProvider>
          </UserContextProvider>
        </Suspense>
      </ErrorBoundaryWithRouter>
    </QueryClientProvider>
  );
};

export default ProviderWrapper;
