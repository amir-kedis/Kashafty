import React, { ReactNode, ErrorInfo } from "react";
import { toast } from "react-toastify";
import SignOutButton from "./signoutButton";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    this.setState({ error, errorInfo });
    console.log(error, errorInfo);

    const error_message = error.message;
    toast.error("حدث خطأ يرجى العودة للصحفة الرئيسية");
    toast.error(error_message);
    toast.error(errorInfo?.digest);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            minHeight: "100dvh",
          }}
        >
          <h1
            style={{
              margin: "0",
              textAlign: "center",
              lineHeight: "6rem",
            }}
          >
            حدث خطأ يرجى العودة للصحفة الرئيسية
            <br />
            اذا استمر الخطأ يرجى التواصل مع الدعم الفني
          </h1>

          <p style={{ textAlign: "center", margin: "1rem" }}>
            {this.state.error?.message}
            <br />
            {this.state.errorInfo?.digest}
            <br />
          </p>
          <pre>{this.state.errorInfo?.componentStack}</pre>

          <button
            style={{
              margin: "1rem",
              padding: "1rem",
              backgroundColor: "#fff",
              cursor: "pointer",
              fontSize: "1.5rem",
            }}
            onClick={this.handleRetry}
          >
            إعادة المحاولة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
