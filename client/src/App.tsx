import React from "react";
import "./theme.scss";
import "./assets/styles/global/global.scss";
import Routes from "./routes";
import store from "./redux/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/atoms/ErrorBoundary";

const App: React.FC = () => {
  return (
    <>
      <ToastContainer />
      <Provider store={store}>
        <Routes />
      </Provider>
    </>
  );
};

export default App;
