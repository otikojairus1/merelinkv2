// src/theme/useTheme.ts
import { useEffect, useState } from "react";
import { Appearance } from "react-native";
import { colors } from "./colors";

export const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">(
    Appearance.getColorScheme() || "light"
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme || "light");
    });
    return () => subscription.remove();
  }, []);

  return {
    colors: colors[theme],
    theme,
    isDark: theme === "dark",
    setTheme,
  };
};
