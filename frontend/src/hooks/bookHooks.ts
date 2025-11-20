import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addBook, deleteBook, editBook, fetchBooks } from "../api";

export function useGetBooks() {
  const query = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });
  return query;
}

export function useAddBook() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
  return mutation;
}

export function useEditBook() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: editBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
  return mutation;
}

export function useDeleteBook() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
  return mutation;
}
