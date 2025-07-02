export const colors = {
  light: {
    primary: "#3b82f6", // Tailwind blue-500
    secondary: "#f59e0b", // Tailwind amber-500
    background: "#ffffff",
    text: "#1f2937", // Tailwind gray-800
    error: "#ef4444", // Tailwind red-500
  },
  dark: {
    primary: "#60a5fa", // Tailwind blue-400 (lighter for dark mode)
    secondary: "#fbbf24", // Tailwind amber-400
    background: "#1f2937", // Tailwind gray-800
    text: "#f9fafb", // Tailwind gray-50
    error: "#f87171", // Tailwind red-400
  },
};

// Type for autocompletion
export type ColorKey = keyof typeof colors.light;
