import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import PublicApp from "./PublicApp.tsx";
import "./applications/css/index.css";
import { BrowserRouter } from "react-router-dom";
import SSECleanupService from "./services/sse-cleanup.service";

// Initialiser le service de nettoyage SSE
SSECleanupService.getInstance().initialize();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

// Fonction pour déterminer quelle app utiliser basée sur la route
const AppRouter = () => {
  const isCustomerRoute = window.location.pathname.startsWith("/customer/");

  return (
    <BrowserRouter>{isCustomerRoute ? <PublicApp /> : <App />}</BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
