import { ThemeContext } from "@/contexts/ThemeProvider";
import { useContext } from "react";

export function useTheme() {
  const theme = useContext(ThemeContext);

  if (theme == null) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return theme;
}
