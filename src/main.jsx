import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GlobalStateProvider } from "./context/GlobalState";
import { ThemeProvider } from "@mui/material/styles";
import "./index.css";
import App from "./App";
import theme from "./theme";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStateProvider>
        <App />
      </GlobalStateProvider>
    </ThemeProvider>
  </StrictMode>
);
