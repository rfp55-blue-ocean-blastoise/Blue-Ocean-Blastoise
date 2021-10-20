import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";
import GlobalContextProvider from "./components/GlobalContextProvider.jsx";

ReactDOM.render(
    <GlobalContextProvider>
      <App />
    </GlobalContextProvider>,
  document.getElementById("app")
);
