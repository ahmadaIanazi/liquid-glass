"use client"

import { useEffect, useState } from "react"
import type { GlobalSettings } from "@/lib/types"

export function useTheme(globalSettings: GlobalSettings) {
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const updateTheme = () => {
      if (globalSettings.theme === "system") {
        // Detect system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        setResolvedTheme(prefersDark ? "dark" : "light")
      } else {
        setResolvedTheme(globalSettings.theme as "light" | "dark")
      }
    }

    // Initial theme detection
    updateTheme()

    // Listen for system theme changes only if theme is set to "system"
    if (globalSettings.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => updateTheme()

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [globalSettings.theme])

  return resolvedTheme
}
