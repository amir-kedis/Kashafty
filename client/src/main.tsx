import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const isStrict = import.meta.env.VITE_REACT_STRICT_MODE as string;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    {isStrict == "true" ? (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    ) : (
      <App />
    )}
  </>,
);
