import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";
import NotificationListener from "./components/NotificationListener.jsx";
import "./index.css";
import { store } from "./redux/store.js";
import ga4Service from "./services/analytics/ga4.service";

// Initialiser Google Analytics 4
const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;

if (GA4_MEASUREMENT_ID) {
  ga4Service.initialize(GA4_MEASUREMENT_ID, {
    // Configuration supplémentaire si nécessaire
    // testMode: import.meta.env.DEV, // Déjà géré par défaut dans le service
  });
} else {
  console.warn(
    "GA4: VITE_GA4_MEASUREMENT_ID n'est pas défini dans les variables d'environnement. " +
    "Le tracking GA4 est désactivé."
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <NotificationListener />
      <ToastContainer />
      <App />
    </Provider>
  </StrictMode>
);
