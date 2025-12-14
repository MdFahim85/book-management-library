import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

import "./App.css";
import LoadingPage from "./components/Loading";
import NotFound from "./components/NotFound";
import Client_ROUTEMAP from "./misc/Client_ROUTEMAP";
import Redirect from "./components/Redirect";
import ErrorBoundary from "./components/ErrorBoundary";

const AuthorsLazy = lazy(() => import("./pages/authors/index"));
const BooksLazy = lazy(() => import("./pages/books/index"));
const BooksByAuthorLazy = lazy(() => import("./components/BooksByAuthor"));

const RouteComponent = () => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route
          path={Client_ROUTEMAP._}
          element={<Redirect to={Client_ROUTEMAP.books.root} />}
        />
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
    </Suspense>
  </ErrorBoundary>
);

export default RouteComponent;
