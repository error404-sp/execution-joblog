import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppProvider } from "./context/AppProvider.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import JobDetails from "./components/JobDetails.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/jobs/:jobId" element={<JobDetails />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  </StrictMode>
);
