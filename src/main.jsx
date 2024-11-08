import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./components/App.jsx"
import { GlobalStyles } from "./components/GlobalStyles.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <GlobalStyles />
  </StrictMode>,
)
