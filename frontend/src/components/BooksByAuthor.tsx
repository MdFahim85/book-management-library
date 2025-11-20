import { useParams } from "react-router-dom";
import { useGetBooksByAuthor } from "../hooks/authorHooks";

function BooksByAuthor() {
  const { id } = useParams();
  const authorId = parseInt(id as string);
  const { data, isPending, isError, error } = useGetBooksByAuthor({ authorId });
  if (isPending) {
    return <div>Loading</div>;
  }
  if (isError) {
    return <div>{error.message}</div>;
  }
  console.log(data);
  return <div>hello</div>;
}

export default BooksByAuthor;
