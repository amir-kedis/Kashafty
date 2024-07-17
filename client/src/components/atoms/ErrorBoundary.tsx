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
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
    toast.error("حدث خطأ يرجل تسجيل الدخول");
  }

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
            }}
          >
            حدث خطأ يرجى العودة للصحفة الرئيسية
          </h1>
          <SignOutButton />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
