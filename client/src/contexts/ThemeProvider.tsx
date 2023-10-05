import { THEME_OPTIONS } from "@/constants/constants";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ReactElement, createContext } from "react";

type ThemeType = (typeof THEME_OPTIONS)[number];

type ThemeProviderPropsType = {
  children?: ReactElement | ReactElement[];
};

type ThemeContextType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isDark: boolean;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: ThemeProviderPropsType) {
  const [theme, setTheme] = useLocalStorage<ThemeType>("THEME", "system");

  function changeTheme(theme: ThemeType) {
    const isDark =
      theme === "dark" ||
      (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", isDark);
    setTheme(theme);
  }

  const contextValue = {
    theme,
    setTheme: changeTheme,
    isDark: document.documentElement.classList.contains("dark"),
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}
