import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from './App'
import App from "./App";
import { Toaster } from "react-hot-toast";
import Tawk from "./Components/Tawk";

createRoot(document.getElementById("root")).render(
  <>
    <Toaster position="top-right" reverseOrder={false} />
    <App />
    {/* <Tawk /> */}
  </>
);
