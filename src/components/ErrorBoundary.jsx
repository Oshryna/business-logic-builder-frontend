import { Component } from "react";
import logger from "../utils/logger";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to our logging service
    logger.error("Error boundary caught an error", {
      error: error.toString(),
      componentStack: errorInfo.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div>
            <h2>Something went wrong.</h2>
            <p>The error has been logged and we're working on it.</p>
            <button onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
