import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingPage from "./components/Loading";
import Navbar from "./components/Navbar";
import NotFound from "./components/NotFound";
import StatCards from "./components/StatCards";
import { SidebarProvider } from "./components/ui/sidebar";
import Client_ROUTEMAP from "./misc/Client_ROUTEMAP";

const AuthorsLazy = lazy(() => import("./pages/authors/index"));
const BooksLazy = lazy(() => import("./pages/books/index"));
const BooksByAuthorLazy = lazy(() => import("./components/BooksByAuthor"));

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
                <Routes>
                  <Route path={Client_ROUTEMAP.authors.root}>
                    <Route
                      path={Client_ROUTEMAP.authors.index}
                      element={
                        <Suspense fallback={<LoadingPage />}>
                          <AuthorsLazy />
                        </Suspense>
                      }
                    />
                  </Route>

                  <Route path={Client_ROUTEMAP.books.root}>
                    <Route
                      path={Client_ROUTEMAP.books.index}
                      element={
                        <Suspense fallback={<LoadingPage />}>
                          <BooksLazy />
                        </Suspense>
                      }
                    />
                    <Route
                      path={Client_ROUTEMAP.books.authorBooks}
                      element={
                        <Suspense fallback={<LoadingPage />}>
                          <BooksByAuthorLazy />
                        </Suspense>
                      }
                    />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
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
