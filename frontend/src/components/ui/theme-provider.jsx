import * as React from "react";
import { useTheme as useNextTheme, ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider attribute="class" {...props}>{children}</NextThemesProvider>;
}

export function useTheme() {
  return useNextTheme();
}
