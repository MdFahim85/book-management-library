import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

import { useT } from "../types/i18nTypes";
import Client_ROUTEMAP from "../misc/Client_ROUTEMAP";

function NotFound() {
  const t = useT();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center gap-6 h-full w-full">
      <h1 className="text-2xl text-red-400 font-semibold">
        {t("error.notFound")}
      </h1>
      <div className="flex gap-4">
        <Link to={Client_ROUTEMAP._}>
          <Button>{t("navigation.backToHome")}</Button>
        </Link>

        <Button onClick={() => navigate(-1)}>{t("navigation.goBack")}</Button>
      </div>
    </div>
  );
}

export default NotFound;
