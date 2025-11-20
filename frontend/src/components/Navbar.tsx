import { Link } from "react-router";

function Navbar() {
  return (
    <div className="flex justify-between items-center mb-10 pb-2 border-b border-neutral-600 ">
      <Link to={"/"} className="text-2xl text-blue-500">
        {" "}
        Book Library
      </Link>
      <div className="flex gap-6">
        <Link to={"/authors"} className="hover:underline">
          Authors
        </Link>
        <Link to={"/books"} className="hover:underline">
          Books
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
