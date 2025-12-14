import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingPage from "./components/Loading";
import Navbar from "./components/Navbar";
import StatCards from "./components/StatCards";
import { SidebarProvider } from "./components/ui/sidebar";
import RouteComponent from "./Routes";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <ErrorBoundary>
          <Suspense fallback={<LoadingPage />}>
            <Navbar />
            <div className="mx-10 w-full min-h-screen ">
              <StatCards />
              <div className="min-w-9/12">
                <RouteComponent />
              </div>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
          </Suspense>
        </ErrorBoundary>
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export default App;
