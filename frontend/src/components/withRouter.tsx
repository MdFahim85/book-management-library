import type { ComponentType } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

type WithRouterProps = {
  navigate?: ReturnType<typeof useNavigate>;
  location?: ReturnType<typeof useLocation>;
  params?: ReturnType<typeof useParams>;
};

export function withRouter<P extends object>(
  WrappedComponent: ComponentType<P & WithRouterProps>
) {
  const ComponentWithRouter = (props: P) => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    return (
      <WrappedComponent
        {...props}
        navigate={navigate}
        location={location}
        params={params}
      />
    );
  };

  const wrappedName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  ComponentWithRouter.displayName = `withRouter(${wrappedName})`;

  return ComponentWithRouter;
}
