import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import type { GradientBlurProps, GradientBlurDirection } from "./gradient-blur.types";

const gradientBlurVariants = cva("backdrop-blur-[16px] -webkit-backdrop-blur-[16px]", {
  variants: {
    position: {
      top: "fixed top-0 left-0 right-0 w-full",
      bottom: "fixed bottom-0 left-0 right-0 w-full",
      left: "fixed top-0 left-0 bottom-0 w-16",
      right: "fixed top-0 right-0 bottom-0 w-16",
      absolute: "absolute inset-0 w-full h-full",
      relative: "relative w-full",
    },
    height: {
      sm: "h-8",
      md: "h-16",
      lg: "h-24",
      xl: "h-32",
      "2xl": "h-48",
      "3xl": "h-64",
      full: "h-full",
      auto: "h-auto",
    },
    width: {
      sm: "w-8",
      md: "w-16",
      lg: "w-24",
      xl: "w-32",
      "2xl": "w-48",
      "3xl": "w-64",
      full: "w-full",
      auto: "w-auto",
    },
    direction: {
      "to-bottom": "mask-gradient-to-bottom",
      "to-top": "mask-gradient-to-top",
      "to-left": "mask-gradient-to-left",
      "to-right": "mask-gradient-to-right",
    },
    intensity: {
      light: "backdrop-blur-[8px] -webkit-backdrop-blur-[8px]",
      medium: "backdrop-blur-[16px] -webkit-backdrop-blur-[16px]",
      heavy: "backdrop-blur-[24px] -webkit-backdrop-blur-[24px]",
    },
  },
  defaultVariants: {
    position: "top",
    height: "md",
    width: "full",
    direction: "to-bottom",
    intensity: "medium",
  },
});

const DEFAULT_GRADIENTS: Record<GradientBlurDirection, string> = {
  "to-bottom": "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 1) 100%)",
  "to-top": "linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 1) 100%)",
  "to-left": "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 1) 100%)",
  "to-right": "linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 1) 100%)",
};

const GradientBlur = forwardRef<HTMLDivElement, GradientBlurProps>(
  (
    {
      className,
      position = "top",
      height = "md",
      width = "full",
      direction = "to-bottom",
      intensity = "medium",
      children,
      style,
      maskGradient,
      customHeight,
      customWidth,
      zIndex,
      ...props
    },
    ref
  ) => {
    const getMaskGradient = (): string => {
      if (maskGradient) return maskGradient;

      return DEFAULT_GRADIENTS[direction as GradientBlurDirection] || DEFAULT_GRADIENTS["to-bottom"];
    };

    const customStyles: React.CSSProperties = {
      maskImage: getMaskGradient(),
      WebkitMaskImage: getMaskGradient(),
      height: customHeight,
      width: customWidth,
      zIndex,
      ...style,
    };

    return (
      <div ref={ref} className={cn(gradientBlurVariants({ position, height, width, direction, intensity }), className)} style={customStyles} {...props}>
        {children}
      </div>
    );
  }
);

GradientBlur.displayName = "GradientBlur";

export { GradientBlur, gradientBlurVariants };
export type { GradientBlurProps, GradientBlurPosition, GradientBlurHeight, GradientBlurWidth, GradientBlurDirection, GradientBlurIntensity } from "./gradient-blur.types";
