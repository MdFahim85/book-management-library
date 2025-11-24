import { Component, type ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
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

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex justify-center items-center min-h-screen">
            <div className=" text-center p-6 flex flex-col grow">
              <h2 className="text-xl font-bold text-red-600">
                Something went wrong
              </h2>
              <p className="text-red-600">{this.state.error?.message}</p>
              <Link
                to="/"
                className="px-2 py-1 bg-emerald-400 self-center w-48 mt-4 text-white rounded hover:bg-emerald-500"
              >
                Go back to homepage
              </Link>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
