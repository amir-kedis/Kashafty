import React from "react";
import "./theme.scss";
import "./assets/styles/global/global.scss";
import Routes from "./routes";
import store from "./redux/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit";
import "react-toastify/dist/ReactToastify.css";

const AuthStore = createStore({
  authName: "token",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});

const App: React.FC = () => {
  return (
    <>
      <ToastContainer />
      <Provider store={store}>
        <AuthProvider store={AuthStore}>
          <Routes />
        </AuthProvider>
      </Provider>
    </>
  );
};

export default App;
