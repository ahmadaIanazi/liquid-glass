// Main LiquidGlass component
export { LiquidGlass } from "./components/liquid-glass";

// Provider and Context
export { LiquidGlassProvider, useLiquidGlass } from "./components/liquid-glass-provider";

// Gradient Blur Component
export { GradientBlur, gradientBlurVariants } from "../blur-gradient/components/gradient-blur";
export type {
  GradientBlurProps,
  GradientBlurPosition,
  GradientBlurHeight,
  GradientBlurWidth,
  GradientBlurDirection,
  GradientBlurIntensity,
} from "../blur-gradient/components/gradient-blur.types";

// Hooks
export { useLiquidGlassSupport } from "./hooks/use-liquid-glass-support";
export { useLiquidGlassMultiSensor } from "./hooks/use-liquid-glass-multi-sensor";

// Types
export type { LiquidGlassProps } from "./components/liquid-glass";

// CSS imports (for global styles)
import "./styles/liquid-glass.css";
