import { QueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";

import { Button } from "./ui/button";

import { useUserContext } from "../contexts/UserContext";
import { modifiedFetch } from "../misc/modifiedFetch";
import Server_ROUTEMAP from "../misc/Server_ROUTEMAP";
import LoadingPage from "./Loading";

import type { editUserLanguage } from "@backend/controllers/user";
import type { GetReqBody, GetRes } from "@backend/types/req-res";

type Language = "english" | "বাংলা";

export default function LanguageToggle() {
  const queryClient = new QueryClient();
  const { user, isLoading } = useUserContext();
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<Language>(
    user ? user.language : "english"
  );

  const { mutate: mutateUserLanguage } = useMutation({
    mutationFn: () =>
      modifiedFetch<GetRes<typeof editUserLanguage>>(
        Server_ROUTEMAP.users.root +
          Server_ROUTEMAP.users.language.replace(
            Server_ROUTEMAP.users._params.id,
            user!.id.toString()
          ),
        {
          method: "put",
          body: JSON.stringify({ language } satisfies GetReqBody<
            typeof editUserLanguage
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
    mutateUserLanguage();
    i18n.changeLanguage(language === "বাংলা" ? "bn" : "en");
  }, [language, mutateUserLanguage, i18n]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Button
      variant="outline"
      onClick={() =>
        setLanguage((val) => (val === "english" ? "বাংলা" : "english"))
      }
    >
      <span
        className="rounded-full overflow-hidden "
        style={{ width: 20, height: 20 }}
      >
        <ReactCountryFlag
          svg
          countryCode={language === "english" ? "BD" : "US"}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
      </span>

      <span className="font-semibold">
        {language === "english" ? "BN" : "EN"}
      </span>
    </Button>
  );
}
