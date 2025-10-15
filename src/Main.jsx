import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext.jsx";          // ✅ fixed
import { ModalContextProvider } from "./contexts/ModalContext.jsx";   // ✅ fixed
import "./index.css";  // ✅ Import Tailwind + global styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ModalContextProvider>
          <App />
        </ModalContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
