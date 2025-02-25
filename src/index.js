import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.js";
import { UserContextProvider } from "./UserContext.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <App />
    </UserContextProvider>
  </React.StrictMode>,
);
