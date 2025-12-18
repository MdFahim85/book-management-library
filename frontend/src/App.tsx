import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

import "./App.css";
import ErrorBoundaryWithRouter from "./components/ErrorBoundary";
import LoadingPage from "./components/Loading";

import { SidebarProvider } from "./components/ui/sidebar";
import RouteComponent from "./Routes";
import SideBar from "./components/SideBar";
import Navbar from "./components/Navbar";
import { UserContextProvider } from "./contexts/UserContext";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <ErrorBoundaryWithRouter>
          <Suspense fallback={<LoadingPage />}>
            <UserContextProvider>
              <div className="min-w-3/12">
                <SideBar />
              </div>
              <div className="w-full px-10">
                <Navbar />
                <RouteComponent />
              </div>
              <Toaster position="top-right" reverseOrder={false} />
            </UserContextProvider>
          </Suspense>
        </ErrorBoundaryWithRouter>
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export default App;
