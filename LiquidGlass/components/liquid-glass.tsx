"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useLiquidGlassSupport } from "../hooks/use-liquid-glass-support";
import { useLiquidGlassSensor } from "../hooks/use-liquid-glass-sensor"; // New single sensor hook

export interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  contentClassName?: string;
  debug?: boolean;
  sensorId?: string;
  threshold?: number;
}

const LiquidGlass = React.forwardRef<HTMLDivElement, LiquidGlassProps>(({ className, children, contentClassName, debug = false, sensorId, threshold = 0.55, ...props }, ref) => {
  // const { fallbackGlass } = useLiquidGlassSupport();

  // Component refs
  const componentRef = React.useRef<HTMLDivElement | null>(null);
  const sensorRef = React.useRef<HTMLDivElement | null>(null);

  // Use the direct sensor hook
  const sensorResult = useLiquidGlassSensor({
    sensorRef,
    threshold,
    debug,
  });

  const { isDark, brightness, isAnalyzing, averageColor, lastCaptureTime } = sensorResult;

  // --- State for hover and click effects ---
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = React.useState(false);
  const [isClicked, setIsClicked] = React.useState(false);

  // ✨ Ref to manage the animation timeout
  const clickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  // ✨ State for the dynamic border shadow multipliers
  const [shadowMult, setShadowMult] = React.useState({ x1: 1, y1: 1, x2: -1, y2: -1 });

  React.useEffect(() => {
    return () => {
      // ✨ Clean up timeout on unmount
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  // ✨ Effect to handle the end of a click animation
  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isClicked) {
        clickTimeoutRef.current = setTimeout(() => {
          setIsClicked(false);
          clickTimeoutRef.current = null;
        }, 500);
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isClicked]);

  // ✨ Memoize the parsed RGB values from the averageColor string
  // Helper functions for color conversion
  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  }

  function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  function adjustHue(h, degrees) {
    return (h + degrees) % 360;
  }

  // React hook implementation
  const highlightRgbValues = React.useMemo(() => {
    const match = averageColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      let r = parseInt(match[1], 10);
      let g = parseInt(match[2], 10);
      let b = parseInt(match[3], 10);

      // Convert to HSL
      let [h, s, l] = rgbToHsl(r, g, b);

      // Handle near-black colors with hue shift
      if (l < 15) {
        h = adjustHue(h, 30);
        s = Math.max(s, 70);
      }

      // Handle near-white colors
      if (l > 90) {
        h = adjustHue(h, 180);
        s = Math.max(s, 30);
      }

      // Define target values
      const targetS = s < 15 ? 90 : 85; // Boost saturation for grays
      const targetL = 85; // Optimal lightness for vibrancy

      // Apply transformations
      const [newR, newG, newB] = hslToRgb(
        h,
        Math.min(95, targetS), // Cap saturation at 95%
        targetL
      );

      return `${newR}, ${newG}, ${newB}`;
    }
    return "240, 240, 240"; // Light blue fallback
  }, [averageColor]);

  const refCallback = React.useCallback(
    (element: HTMLDivElement | null) => {
      // Assign to forwarded ref
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
      // ✨ Assign to our local ref for dimension calculations
      componentRef.current = element;

      // Also update the sensor ref to match the component
      sensorRef.current = element;
    },
    [ref]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = componentRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update position for spotlight/ripple
    setMousePosition({ x, y });

    // Calculate and set multipliers for the dynamic border
    const { offsetWidth: width, offsetHeight: height } = el;
    if (width > 0 && height > 0) {
      const nx = x / width;
      const ny = y / height;
      const x1 = 1 - 2 * nx;
      const y1 = 1 - 2 * ny;
      setShadowMult({ x1, y1, x2: -x1, y2: -y1 });
    }
  };

  const handleMouseEnter = () => setIsHovering(true);

  const handleMouseLeave = () => {
    setIsHovering(false);
    setShadowMult({ x1: 1, y1: 1, x2: -1, y2: -1 });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsClicked(true);
  };

  if (debug) {
    // Only log when values actually change
    const debugKey = `${isDark}-${brightness.toFixed(3)}-${isAnalyzing}`;
    const lastDebugKey = React.useRef("");

    if (debugKey !== lastDebugKey.current) {
      lastDebugKey.current = debugKey;
      console.log("[LiquidGlass DEBUG]", {
        sensorId: sensorId || "auto-generated",
        isDark,
        brightness: brightness.toFixed(3),
        isAnalyzing,
        threshold,
        lastCaptureTime: lastCaptureTime ? new Date(lastCaptureTime).toLocaleTimeString() : "never",
      });
    }

    return (
      <div ref={refCallback} className={cn("relative border-4 border-dashed border-red-500", className)} {...props}>
        {/* Enhanced debug info overlay - EXCLUDED from capture */}
        <div className='debug-overlay absolute top-0 left-0 text-white text-xs p-2 rounded-br z-50 pointer-events-none font-mono' data-debug-element='true' style={{ zIndex: 50 }}>
          <div>🔍 ID: {sensorId || "auto"}</div>
          <div>
            🌙 Dark: <span className={isDark ? "text-yellow-300" : "text-red-300"}>{isDark ? "YES" : "NO"}</span>
          </div>
          <div>💡 Brightness: {brightness.toFixed(3)}</div>
          <div>🎯 Threshold: {threshold}</div>
          {isAnalyzing && <div className='text-yellow-300 animate-pulse'>⚡ ANALYZING...</div>}
          {lastCaptureTime && <div>🕒 Last: {new Date(lastCaptureTime).toLocaleTimeString()}</div>}
        </div>

        {/* Visual boundary indicator - EXCLUDED from capture */}
        <div className='capture-boundary absolute inset-0 border-2 border-green-400 border-dashed pointer-events-none' data-debug-element='true' style={{ zIndex: 30 }}>
          <div className='absolute -top-6 left-0 bg-green-500 text-white text-xs px-1 rounded' data-debug-element='true'>
            CAPTURE BOUNDARY
          </div>
        </div>

        {/* ONLY THIS CONTENT WILL BE CAPTURED */}
        <div className={contentClassName}>{children}</div>
      </div>
    );
  }

  return (
    <div
      ref={refCallback}
      className={cn("grid relative", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      {...props}
    >
      <div className={cn("liquid-glass-border col-start-1 row-start-1")} />
      <div className={cn("liquid-glass-border-1 col-start-1 row-start-1")} />
      <div className={cn("liquid-glass-border-2 col-start-1 row-start-1")} />
      <div className={cn("liquid-glass-border-3 col-start-1 row-start-1")} />

      <div className={cn("liquid-glass-edges-T col-start-1 row-start-1")} />
      <div className={cn("liquid-glass-edges-B col-start-1 row-start-1")} />

      <div className={cn("liquid-glass-blur col-start-1 row-start-1")} />

      <div
        className={cn(
          "liquid-glass-content col-start-1 row-start-1",
          {
            "is-hovering": isHovering,
            "is-clicked": isClicked,
          },
          isDark && "dark",
          contentClassName
        )}
        style={
          {
            // For spotlight and ripple
            "--mouse-x": `${mousePosition.x}px`,
            "--mouse-y": `${mousePosition.y}px`,
            // ✨ For dynamic border
            "--shadow-x1-mult": shadowMult.x1,
            "--shadow-y1-mult": shadowMult.y1,
            "--shadow-x2-mult": shadowMult.x2,
            "--shadow-y2-mult": shadowMult.y2,
            // ✨ INJECTED: The parsed RGB values for dynamic coloring
            "--highlight-color-rgb": highlightRgbValues,
            "--border-highlight-rgb": highlightRgbValues, // ✨ Add this line
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
});

LiquidGlass.displayName = "LiquidGlass";

export { LiquidGlass };
