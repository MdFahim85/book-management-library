import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addAuthor,
  deleteAuthor,
  editAuthor,
  fetchAuthors,
  fetchBooksByAuthor,
} from "../api";

export function useGetAuthors() {
  const query = useQuery({
    queryKey: ["authors"],
    queryFn: fetchAuthors,
  });
  return query;
}

export function useGetBooksByAuthor({ authorId }: { authorId: number }) {
  const query = useQuery({
    queryKey: ["authors"],
    queryFn: () => fetchBooksByAuthor({ authorId }),
  });
  return query;
}

export function useAddAuthor() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addAuthor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
  return mutation;
}

export function useEditAuthor() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: editAuthor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
  return mutation;
}

export function useDeleteAuthor() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteAuthor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
  return mutation;
}
