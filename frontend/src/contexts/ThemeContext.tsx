import { createContext, useContext, useEffect, useState } from "react";
import { useUserContext } from "./UserContext";
import LoadingPage from "../components/Loading";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { modifiedFetch } from "../misc/modifiedFetch";
import type { GetReqBody, GetRes } from "@backend/types/req-res";
import type { editUserTheme } from "@backend/controllers/user";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";
import toast from "react-hot-toast";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  ...props
}: ThemeProviderProps) {
  const queryClient = new QueryClient();
  const { user, isLoading } = useUserContext();
  const [localTheme, setLocalTheme] = useState<Theme | null>(null);
  const theme = localTheme ?? (user?.theme || defaultTheme);

  const { mutate: mutateUserTheme } = useMutation({
    mutationFn: () =>
      modifiedFetch<GetRes<typeof editUserTheme>>(
        Server_ROUTEMAP.users.root +
          Server_ROUTEMAP.users.theme.replace(
            Server_ROUTEMAP.users._params.id,
            user!.id.toString()
          ),
        {
          method: "put",
          body: JSON.stringify({ theme } satisfies GetReqBody<
            typeof editUserTheme
          >),
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [Server_ROUTEMAP.users.root + Server_ROUTEMAP.users.self],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    throwOnError: true,
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setLocalTheme(theme);
      mutateUserTheme();
    },
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
