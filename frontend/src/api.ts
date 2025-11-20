// Authors

export const fetchAuthors = async () => {
  const res = await fetch("http://localhost:3000/authors");
  if (res.ok) {
    return res.json();
  }
};

export const addAuthor = async ({ name }: { name: string }) => {
  const res = await fetch("http://localhost:3000/authors", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res;
};

export const editAuthor = async ({
  authorId,
  name,
}: {
  authorId: number;
  name: string;
}) => {
  const res = await fetch(`http://localhost:3000/authors/${authorId}`, {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res;
};

export const deleteAuthor = async ({ authorId }: { authorId: number }) => {
  const res = await fetch(`http://localhost:3000/authors/${authorId}`, {
    method: "delete",
  });
  return res;
};

export const fetchBooksByAuthor = async ({
  authorId,
}: {
  authorId: number;
}) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_ROOT}/authors/${authorId}`
  );
  if (res.ok) {
    return res.json();
  }
};

// Books

export const fetchBooks = async () => {
  const res = await fetch("http://localhost:3000/books");
  if (res.ok) {
    return res.json();
  }
};

export const addBook = async ({
  name,
  authorId,
}: {
  name: string;
  authorId: number;
}) => {
  const res = await fetch("http://localhost:3000/books", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, authorId }),
  });
  return res;
};

export const editBook = async ({
  bookId,
  name,
}: {
  bookId: number;
  name: string;
}) => {
  const res = await fetch(`http://localhost:3000/books/${bookId}`, {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res;
};

export const deleteBook = async ({ bookId }: { bookId: number }) => {
  const res = await fetch(`http://localhost:3000/books/${bookId}`, {
    method: "delete",
  });
  return res;
};
