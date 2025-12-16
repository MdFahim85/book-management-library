import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

import "./App.css";
import LoadingPage from "./components/Loading";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import { SidebarProvider } from "./components/ui/sidebar";
import RouteComponent from "./Routes";
import ErrorBoundaryWithRouter from "./components/ErrorBoundary";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <ErrorBoundaryWithRouter>
          <Suspense fallback={<LoadingPage />}>
            <div className="min-w-3/12">
              <SideBar />
            </div>
            <div className="px-10 w-full min-h-screen bg-neutral-100">
              <Navbar />
              <RouteComponent />
            </div>
            <Toaster position="top-right" reverseOrder={false} />
          </Suspense>
        </ErrorBoundaryWithRouter>
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export default App;
