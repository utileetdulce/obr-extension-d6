import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
// import App from "./components/App.jsx"
import { GlobalStyles } from "./components/GlobalStyles.jsx"
import OBR from "@owlbear-rodeo/sdk"
import { mockObr } from "./obrMock.js"
import "./styles.css"
import App from "./components/App.jsx"

if (!OBR.isAvailable) {
  mockObr()
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <GlobalStyles />
  </StrictMode>,
)
