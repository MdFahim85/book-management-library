import { Component, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

import Client_ROUTEMAP from "../misc/Client_ROUTEMAP";

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
    if (!this.state.hasError) return this.props.children;

    return (
      this.props.fallback ?? (
        <div className="flex justify-center items-center min-h-screen">
          <div className=" text-center p-6 flex flex-col grow">
            <h2 className="text-xl font-bold text-red-600">
              Something went wrong
            </h2>
            <p className="text-red-600">{this.state.error?.message}</p>
            <Link to={Client_ROUTEMAP._}>
              <Button variant={"default"}>Go back to homepage</Button>
            </Link>
          </div>
        </div>
      )
    );
  }
}
