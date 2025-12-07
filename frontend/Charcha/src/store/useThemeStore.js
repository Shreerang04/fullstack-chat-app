import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: (theme) => {
    console.log("🎨 Setting theme to:", theme);
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));