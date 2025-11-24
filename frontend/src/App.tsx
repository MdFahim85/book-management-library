import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { Link, Route, Routes } from "react-router-dom";

import "./App.css";
import AddAuthor from "./pages/authors/add";
import Books from "./pages/books";
import BooksByAuthor from "./components/BooksByAuthor";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingPage from "./components/Loading";
import NotFound from "./components/NotFound";
import Client_ROUTEMAP from "./misc/Client_ROUTEMAP";
import AddBook from "./pages/books/add";

const AuthorsLazy = lazy(() => import("./pages/authors/index"));

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Suspense fallback={<LoadingPage />}>
          <div className="mx-10 py-4 min-h-screen">
            <Navbar />
            <Routes>
              <Route
                path={Client_ROUTEMAP.root}
                element={
                  <div className="flex flex-col justify-center items-center grow gap-4">
                    <span className="text-5xl font-semibold">
                      Welcome to Book Library
                    </span>
                    <Link to={"/books"} className="text-2xl border-b pb">
                      Check our collection
                    </Link>
                  </div>
                }
              />
              <Route path={Client_ROUTEMAP.authors.root}>
                <Route
                  path={Client_ROUTEMAP.authors.index}
                  element={<AuthorsLazy />}
                />
                <Route
                  path={Client_ROUTEMAP.authors.add}
                  element={<AddAuthor />}
                />
              </Route>

              <Route path="books">
                <Route path="/books" element={<Books />} />
                <Route path="author/:authorId" element={<BooksByAuthor />} />
                <Route path="add" element={<AddBook />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
