import { Link } from "react-router-dom";
import { Button } from "./ui/button";

import Client_ROUTEMAP from "../misc/Client_ROUTEMAP";

function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center gap-6 h-full w-full">
      <h1 className="text-2xl text-red-400 font-semibold">
        ERROR 404 - Page not found
      </h1>
      <div className="flex gap-4">
        <Link to={Client_ROUTEMAP._}>
          <Button>Go to Homepage</Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
