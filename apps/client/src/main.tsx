// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClientProvider, queryClient } from "./utils/queryClient";
import "./index.css";
import App from "./App.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </ClerkProvider>
);
