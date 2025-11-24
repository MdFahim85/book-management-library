import type { IncomingHttpHeaders } from "http";

import type { GetRes } from "@backend/types/req-res";
import type { getAuthorById } from "@backend/controllers/authors";

const API_URL = import.meta.env.VITE_BACKEND_ROOT || "http://localhost:3000";

export async function modifiedFetch<T>(
  input: string | URL | Request,
  init: RequestInit & {
    headers?: IncomingHttpHeaders & RequestInit["headers"];
    method?: "get" | "post" | "put" | "delete";
    customBaseUrl?: string;
  } = {}
) {
  init.headers = Object.assign<HeadersInit, IncomingHttpHeaders>(
    init.headers || {},
    {
      authorization: "Bearer ",
      accept: "application/json",
      "content-type": init.headers?.["content-type"] || "application/json",
    }
  );

  // if (init.headers['content-type'] === 'multipart/form-data' || init.body instanceof FormData)
  //   delete init.headers["content-type"]

  const { customBaseUrl } = init;
  delete init.customBaseUrl;

  const res = await fetch((customBaseUrl || API_URL) + input, init);
  const text = await res.text();

  const json: T = await JSON.parse(text, (_, value) => {
    if (
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)
    )
      return new Date(value);

    return value;
  });

  if (!res.ok) throw { status: res.status, headers: res.headers, data: json };

  return json;
}

export const fetchAuthorDetails = async ({ id }: { id: number }) => {
  const res = await fetch(`${API_URL}/authors/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch author details");
  }
  return (await res.json()) as GetRes<typeof getAuthorById>;
};

export const addAuthor = async ({ name }: { name: string }) => {
  const res = await fetch(`${API_URL}/authors`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    throw new Error("Failed to add author");
  }
  return res.json();
};

export const editAuthor = async ({
  id,
  name,
}: {
  id: number;
  name: string;
}) => {
  const res = await fetch(`${API_URL}/authors/${id}`, {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    throw new Error("Failed to edit author details");
  }
  return res.json();
};

export const deleteAuthor = async ({ id }: { id: number }) => {
  const res = await fetch(`${API_URL}/authors/${id}`, {
    method: "delete",
  });
  if (!res.ok) {
    throw new Error("Failed to delete author");
  }
  return res.json();
};

// Books

export const fetchBooks = async () => {
  const res = await fetch(`${API_URL}/books`);
  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }
  return res.json();
};

export const fetchBookDetails = async ({ id }: { id: number }) => {
  const res = await fetch(`${API_URL}/books/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch book details");
  }
  return res.json();
};

export const fetchBooksByAuthor = async ({
  authorId,
}: {
  authorId: number;
}) => {
  const res = await fetch(`${API_URL}/books/author/${authorId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch books by author");
  }
  return res.json();
};

export const addBook = async ({
  name,
  authorId,
}: {
  name: string;
  authorId: number;
}) => {
  const res = await fetch(`${API_URL}/books`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, authorId }),
  });
  if (!res.ok) {
    throw new Error("Failed to add book");
  }
  return res.json();
};

export const editBook = async ({ id, name }: { id: number; name: string }) => {
  const res = await fetch(`${API_URL}/books/${id}`, {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    throw new Error("Failed to edit book details");
  }
  return res.json();
};

export const deleteBook = async ({ id }: { id: number }) => {
  const res = await fetch(`${API_URL}/books/${id}`, {
    method: "delete",
  });
  if (!res.ok) {
    throw new Error("Failed to delete book");
  }
  return res.json();
};
