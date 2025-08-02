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
