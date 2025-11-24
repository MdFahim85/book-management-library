import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center gap-6 h-full mt-20">
      <h1 className="text-2xl text-red-400 font-semibold">
        ERROR 404 - Page not found
      </h1>
      <Link to={"/"}>
        <p className="pb border-b">Go to Homepage</p>
      </Link>
    </div>
  );
}

export default NotFound;
