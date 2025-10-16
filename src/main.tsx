import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log('main.tsx loaded');
console.log('Root element:', document.getElementById("root"));

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found!');
} else {
  console.log('Creating React root...');
  createRoot(rootElement).render(<App />);
  console.log('React app rendered');
}
