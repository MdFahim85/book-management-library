import "./App.css";
import Authors from "./components/Authors";
import Books from "./components/Books";
import Navbar from "./components/Navbar";
import { Link, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AddBook from "./components/AddBook";
import AddAuthor from "./components/AddAuthor";
import BooksByAuthor from "./components/BooksByAuthor";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="mx-10 py-4 min-h-screen">
        <Navbar />
        <Routes>
          <Route
            path="/"
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
          <Route path="authors">
            <Route path="/authors" element={<Authors />} />
            <Route path=":authorId" element={<BooksByAuthor />} />
            <Route path="add" element={<AddAuthor />} />
          </Route>

          <Route path="books">
            <Route path="/books" element={<Books />} />
            <Route path="add" element={<AddBook />} />
          </Route>
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
