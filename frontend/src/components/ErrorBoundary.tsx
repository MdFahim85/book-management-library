// ErrorBoundary.tsx
import { Component, type ReactNode } from "react";
import { Button } from "./ui/button";
import type { NavigateFunction, Location } from "react-router-dom";
import { withRouter } from "./withRouter";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  navigate?: NavigateFunction;
  location?: Location;
  params?: Record<string, string | undefined>;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error("Error Boundary Caught:", error, info);
  }

  resetAndRedirect = () => {
    this.setState({ hasError: false, error: null });
    this.props.navigate?.("/"); 
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      this.props.fallback ?? (
        <div className="flex justify-center items-center min-h-10/12 w-full">
          <div className="text-center p-6 flex flex-col grow gap-2">
            <p className="font-bold text-xl text-red-600">
              {this.state.error?.name}
            </p>
            <p className="font-bold text-xl text-red-600">
              {this.state.error?.message}
            </p>
            <div>
              <Button variant="default" onClick={this.resetAndRedirect}>
                Go back to homepage
              </Button>
            </div>
          </div>
        </div>
      )
    );
  }
}

const ErrorBoundaryWithRouter = withRouter(ErrorBoundary);
export default ErrorBoundaryWithRouter;
