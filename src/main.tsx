import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { keepPreviousData, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import App from "./App";
import "./index.css";
import { AuthProvider } from "@/context/AuthContext";

const THEME_KEY = "app_theme_mode";
const root = document.documentElement;
const storedTheme = localStorage.getItem(THEME_KEY);
const initialTheme =
  storedTheme === "light" || storedTheme === "dark" || storedTheme === "colorblind"
    ? storedTheme
    : root.classList.contains("dark")
    ? "dark"
    : root.classList.contains("colorblind")
    ? "colorblind"
    : "light";
root.classList.remove("light", "dark", "colorblind");
root.classList.add(initialTheme);
localStorage.setItem(THEME_KEY, initialTheme);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
