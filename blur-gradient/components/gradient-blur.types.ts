import { type VariantProps } from "class-variance-authority";

/**
 * Position variants for the GradientBlur component
 */
export type GradientBlurPosition = "top" | "bottom" | "left" | "right" | "absolute" | "relative";

/**
 * Height variants for the GradientBlur component
 */
export type GradientBlurHeight = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full" | "auto";

/**
 * Width variants for the GradientBlur component
 */
export type GradientBlurWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full" | "auto";

/**
 * Direction variants for the gradient mask
 */
export type GradientBlurDirection = "to-bottom" | "to-top" | "to-left" | "to-right";

/**
 * Intensity variants for the blur effect
 */
export type GradientBlurIntensity = "light" | "medium" | "heavy";

/**
 * Props interface for the GradientBlur component
 */
export interface GradientBlurProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Position of the blur element */
  position?: GradientBlurPosition;
  /** Height variant or custom height */
  height?: GradientBlurHeight;
  /** Width variant or custom width */
  width?: GradientBlurWidth;
  /** Direction of the gradient mask */
  direction?: GradientBlurDirection;
  /** Intensity of the blur effect */
  intensity?: GradientBlurIntensity;
  /** Custom height value that overrides the height variant */
  customHeight?: string;
  /** Custom width value that overrides the width variant */
  customWidth?: string;
  /** Custom mask gradient that overrides the direction variant */
  maskGradient?: string;
  /** Custom z-index value */
  zIndex?: number;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Child elements */
  children?: React.ReactNode;
}

/**
 * Gradient mapping for different directions
 */
export type GradientMap = Record<GradientBlurDirection, string>;

/**
 * Default gradient values for each direction
 */
export const DEFAULT_GRADIENTS: GradientMap = {
  "to-bottom": "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 1) 100%)",
  "to-top": "linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 1) 100%)",
  "to-left": "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 1) 100%)",
  "to-right": "linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 1) 100%)",
} as const;
