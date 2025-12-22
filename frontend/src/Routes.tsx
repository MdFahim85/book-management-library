import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import ErrorBoundaryWithRouter from "./components/ErrorBoundary";
import LoadingPage from "./components/Loading";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Client_ROUTEMAP from "./misc/Client_ROUTEMAP";

const RegisterLazy = lazy(() => import("./pages/auth/register/index"));
const LoginLazy = lazy(() => import("./pages/auth/login/index"));

const AuthorsLazy = lazy(() => import("./pages/authors/index"));
const AuthorDetailsLazy = lazy(() => import("./pages/authors/authorDetails"));

const BooksLazy = lazy(() => import("./pages/books/index"));
const BookDetailsLazy = lazy(() => import("./pages/books/bookDetails"));
const BooksByAuthorLazy = lazy(() => import("./components/BooksByAuthor"));

const RouteComponent = () => (
  <ErrorBoundaryWithRouter>
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route
          path={Client_ROUTEMAP._}
          element={<Navigate to={Client_ROUTEMAP.books.root} />}
        />

        {/* Auth routes */}
        <Route path={Client_ROUTEMAP.auth.root}>
          <Route
            path={Client_ROUTEMAP.auth.register}
            element={
              <Suspense fallback={<LoadingPage />}>
                <ProtectedRoute allowLoggedOutOnly>
                  <RegisterLazy />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path={Client_ROUTEMAP.auth.login}
            element={
              <Suspense fallback={<LoadingPage />}>
                <ProtectedRoute allowLoggedOutOnly>
                  <LoginLazy />
                </ProtectedRoute>
              </Suspense>
            }
          />
        </Route>

        {/* Authors routes */}
        <Route path={Client_ROUTEMAP.authors.root}>
          <Route
            path={Client_ROUTEMAP.authors.index}
            element={
              <Suspense fallback={<LoadingPage />}>
                <ProtectedRoute allowLoggedInOnly>
                  <AuthorsLazy />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path={Client_ROUTEMAP.authors.authorDetails}
            element={
              <Suspense fallback={<LoadingPage />}>
                <ProtectedRoute allowLoggedInOnly>
                  <AuthorDetailsLazy />
                </ProtectedRoute>
              </Suspense>
            }
          />
        </Route>

        {/* Books routes */}
        <Route path={Client_ROUTEMAP.books.root}>
          <Route
            path={Client_ROUTEMAP.books.index}
            element={
              <Suspense fallback={<LoadingPage />}>
                <ProtectedRoute allowLoggedInOnly>
                  <BooksLazy />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path={Client_ROUTEMAP.books.bookDetails}
            element={
              <Suspense fallback={<LoadingPage />}>
                <ProtectedRoute allowLoggedInOnly>
                  <BookDetailsLazy />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path={Client_ROUTEMAP.books.authorBooks}
            element={
              <Suspense fallback={<LoadingPage />}>
                <ProtectedRoute>
                  <BooksByAuthorLazy />
                </ProtectedRoute>
              </Suspense>
            }
          />
        </Route>

        {/* Notfound route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </ErrorBoundaryWithRouter>
);

export default RouteComponent;
