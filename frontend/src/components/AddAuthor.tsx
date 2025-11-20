import { useState } from "react";
import { useAddAuthor } from "../hooks/authorHooks";
import { useNavigate } from "react-router-dom";

function AddAuthor() {
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");

  const { mutate: addAuthor, isPending } = useAddAuthor();

  const handleAdd = async () => {
    addAuthor(
      { name },
      {
        onSuccess: () => {
          alert("Author added");
          setName("");
          navigate("/authors");
        },
        onError: (error) => {
          alert(error.message);
        },
      }
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleAdd();
      }}
    >
      <div className="bg-white shadow-md border border-neutral-200 rounded-lg p-6 max-w-xl mx-auto mt-6 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-neutral-800">Add Author</h2>

        <div className="flex flex-col gap-1">
          <label htmlFor="add" className="font-medium text-neutral-700">
            Author Name
          </label>
          <input
            type="text"
            name="add"
            id="add"
            className="bg-neutral-100 border border-neutral-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button
          className="w-full text-white font-semibold bg-emerald-600 px-4 py-2 rounded-md transition-colors hover:bg-emerald-500 disabled:bg-emerald-900 disabled:text-gray-400 disabled:cursor-not-allowed"
          type="submit"
          disabled={!name || isPending}
        >
          Add Author
        </button>
      </div>
    </form>
  );
}

export default AddAuthor;
