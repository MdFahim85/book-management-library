  import { useLayoutEffect } from "react";
  import { useNavigate } from "react-router-dom";

  function Redirect({ to }: { to: string }) {
    const navigate = useNavigate();

    useLayoutEffect(() => {
      navigate(to);
    }, [navigate, to]);

    return <></>;
  }

  export default Redirect;
