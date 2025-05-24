"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Force light mode by setting defaultTheme and forcedTheme to "light"
  return (
    <NextThemesProvider defaultTheme="light" forcedTheme="light" {...props}>
      {children}
    </NextThemesProvider>
  )
}

