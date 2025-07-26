import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

// all in fixtures is set to tailwind v3 as interims solutions

const config: Config = {
  darkMode: ["class"],
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // ✅ Simple test plugin for .testing class
    plugin(function ({ addComponents, addUtilities }) {
      addUtilities({
        ".text-auto-contrast": {
          // 1. We set the base color to white.
          color: "white",
          // 2. This is the key property. 'difference' subtracts the background
          //    color from the text color.
          //    - White text on a dark background stays white.
          //    - White text on a light background becomes dark.
          mixBlendMode: "difference",
          // 3. This ensures the effect is applied sharply on text.
          isolation: "isolate",
        },
      });
      addComponents({
        // 1. The main positional wrapper.
        ".liquid-glass-wrapper": {
          position: "relative",
          width: "fit-content",
          transition: "all 400ms cubic-bezier(0.25, 1, 0.5, 1)",
        },

        // 2. The background layer with the distortion effect.
        // This sits BEHIND the content.
        ".liquid-glass-background": {
          position: "absolute",
          inset: "0",
          zIndex: "1",
          borderRadius: "inherit", // Inherits rounding from the content div
          backdropFilter: "blur(4px) saturate(150%)",
          WebkitBackdropFilter: "blur(4px) saturate(150%)",
          // The distortion filter ONLY applies to this layer.
          filter: "url(#lg-dist)",
          WebkitFilter: "url(#lg-dist)",
          pointerEvents: "none", // Allows clicks to pass through to the content
        },

        // 3. The content container with the visual glass styles.
        ".liquid-glass-content": {
          position: "relative",
          zIndex: "2",
          borderRadius: "var(--radius, 1rem)",
          transition: "all 400ms cubic-bezier(0.25, 1, 0.5, 1)",
          color: "rgba(0, 0, 0, 0.9)",
          textShadow: "0 1px 1px rgba(255, 255, 255, 0.2)",
          boxShadow: `
						inset -1px -1px 0 rgba(255, 255, 255, 0.9),
						inset 1px 1px 0 rgba(255, 255, 255, 0.9),
						0 4px 12px rgba(0, 0, 0, 0.15)
					`,
          transform: "scale(1)",
          willChange: "transform, box-shadow, background, border-color, color, border-width",

          // Glow Gradient Overlay (top-left + bottom-right)
          "&::before": {
            content: '""',
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            borderRadius: "inherit",
            pointerEvents: "none",
            background: `
							linear-gradient(
								135deg,
								rgba(255, 255, 255, 0.25) 0%,
								transparent 40%,
								transparent 60%,
								rgba(255, 255, 255, 0.25) 100%
							)
						`,
            opacity: "0.4",
            zIndex: "0",
            transition: "opacity 400ms ease",
          },

          "&:hover": {
            background: `
							linear-gradient(
								45deg,
								rgba(255, 255, 255, 0.9) 0%,
								transparent 40%,
								transparent 60%,
								rgba(255, 255, 255, 0.9) 100%
							)
						`,
            transform: "scale(1.015)",
            boxShadow: `
							inset 1px -1px 0 rgba(255, 255, 255, 0.9),
							inset -1px 1px 0 rgba(255, 255, 255, 0.9),
							0 8px 18px rgba(0, 0, 0, 0.2)
						`,
            "&::before": {
              opacity: "0.55",
            },
          },

          "&:active": {
            transition: "all 100ms ease-out",
            transform: "scale(1.025)",
            background: `
								linear-gradient(
									135deg,
									rgba(255, 255, 255, 0.05) 0%,
									rgba(255, 255, 255, 0.9) 40%,
									rgba(255, 255, 255, 0.9) 60%,
									rgba(255, 255, 255, 0.5) 100%
								)
							`,
            boxShadow: `
							inset -1px -1px 0 rgba(255, 255, 255, 1),
							inset 1px -1px 0 rgba(255, 255, 255, 1),
							inset -1px 1px 0 rgba(255, 255, 255, 1),
							inset 1px 1px 0 rgba(255, 255, 255, 1),
							0 10px 28px rgba(0, 0, 0, 0.3)
						`,
            "&::before": {
              opacity: "0.75",
            },
          },

          // --- Dark Mode ---
          "&.dark, .dark &": {
            color: "rgba(255, 255, 255, 1)",
            boxShadow: `
							inset -1px -1px 0 rgba(255, 255, 255, 0.4),
							inset 1px 1px 0 rgba(255, 255, 255, 0.4),
							0 4px 12px rgba(0, 0, 0, 0.2)
						`,

            "&::before": {
              background: `
								linear-gradient(
									135deg,
									rgba(255, 255, 255, 0.15) 0%,
									transparent 40%,
									transparent 60%,
									rgba(255, 255, 255, 0.15) 100%
								)
							`,
              opacity: "0.25",
            },

            "&:hover": {
              background: `
								linear-gradient(
									45deg,
									rgba(255, 255, 255, 0.9) 0%,
									transparent 40%,
									transparent 60%,
									rgba(255, 255, 255, 0.9) 100%
								)
							`,
              transform: "scale(1.015)",
              boxShadow: `
								inset 1px -1px 0 rgba(255, 255, 255, 0.25),
								inset -1px 1px 0 rgba(255, 255, 255, 0.25),
								0 8px 18px rgba(0, 0, 0, 0.25)
							`,
              "&::before": {
                opacity: "0.4",
              },
            },

            "&:active": {
              background: `
								linear-gradient(
									45deg,
									rgba(255, 255, 255, 0.05) 0%,
									rgba(255, 255, 255, 0.9) 40%,
									rgba(255, 255, 255, 0.9) 60%,
									rgba(255, 255, 255, 0.5) 100%
								)
							`,
              transform: "scale(1.025)",
              transition: "all 100ms ease-out",
              color: "rgba(0, 0, 0, 0.9)",
              boxShadow: `
								inset -1px -1px 0 rgba(255, 255, 255, 0.8),
								inset 1px -1px 0 rgba(255, 255, 255, 0.8),
								inset -1px 1px 0 rgba(255, 255, 255, 0.8),
								inset 1px 1px 0 rgba(255, 255, 255, 0.8),
								0 10px 28px rgba(0, 0, 0, 0.35)
							`,
              "&::before": {
                opacity: "0.6",
              },
            },
          },
        },
      });
    }),
  ],
};
export default config;
