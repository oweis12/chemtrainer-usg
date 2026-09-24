import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrivacyProvider } from "./components/PrivacyConsent";
import { App } from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrivacyProvider><App /></PrivacyProvider>
  </StrictMode>,
);
