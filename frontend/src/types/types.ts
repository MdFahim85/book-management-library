export type Book = {
  id: number;
  name: string;
  author_id: number;
};

export type Author = {
  id: number;
  name: string;
};

declare global {
  interface ImportMetaEnv {
    VITE_BACKEND_ROOT: string;
  }
}
