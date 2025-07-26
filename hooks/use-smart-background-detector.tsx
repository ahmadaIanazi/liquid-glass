"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";

interface LiquidGlassDetectorOptions {
  threshold?: number;
  debug?: boolean;
  sensorSize?: { width: number | string; height: number | string };
}

interface LiquidGlassDetectorResult {
  isDark: boolean;
  brightness: number;
  isLight: boolean;
  SensorComponent: React.ComponentType<{ className?: string }>;
  debugInfo?: {
    sensorRect: DOMRect | null;
  };
}

// Brightness calculation remains the same, but simplified as we get raw RGB values
function calculateRgbBrightness(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function useLiquidGlassDetector(options: LiquidGlassDetectorOptions = {}): LiquidGlassDetectorResult {
  const [brightness, setBrightness] = useState(0.5);
  const sensorRef = useRef<HTMLDivElement>(null);

  const { threshold = 0.55, debug = false, sensorSize = { width: 200, height: 100 } } = options;

  const analyzeBackground = useCallback(async () => {
    if (!sensorRef.current || typeof window === "undefined") {
      if (debug) console.log("❌ Sensor ref not available");
      return;
    }

    try {
      const sensor = sensorRef.current;
      const rect = sensor.getBoundingClientRect();

      if (rect.width === 0 || rect.height === 0) {
        if (debug) console.log("❌ Sensor not visible");
        return;
      }

      // 1. Capture the entire body using html2canvas
      const canvas = await html2canvas(document.body, {
        // We only need the portion visible in the viewport
        width: window.innerWidth,
        height: window.innerHeight,
        x: window.scrollX,
        y: window.scrollY,
        logging: false, // Turn off html2canvas console logs
        useCORS: true, // Important for external images
      });

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      // 2. Get the pixel data for the sensor's area
      const scale = window.devicePixelRatio || 1;
      const imageData = ctx.getImageData(rect.left * scale, rect.top * scale, rect.width * scale, rect.height * scale);
      const data = imageData.data;

      let totalBrightness = 0;
      let validSamples = 0;
      const pixelSkip = 4; // Sample every 4th pixel for performance

      // 3. Loop through the pixels, calculate average brightness
      for (let i = 0; i < data.length; i += 4 * pixelSkip) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];

        // Only consider fully opaque pixels
        if (alpha > 200) {
          totalBrightness += calculateRgbBrightness(r, g, b);
          validSamples++;
        }
      }

      if (validSamples > 0) {
        const avgBrightness = totalBrightness / validSamples;
        setBrightness(avgBrightness);

        if (debug) {
          console.log("📊 Pixel Analysis complete:", {
            avgBrightness: avgBrightness.toFixed(3),
            isDark: avgBrightness <= threshold,
            validSamples,
          });
        }
      } else {
        if (debug) console.log("🔄 No valid pixels found, using fallback");
        setBrightness(0.5); // Fallback
      }
    } catch (error) {
      console.warn("Liquid glass background detection failed:", error);
      setBrightness(0.5); // Fallback on error
    }
  }, [threshold, debug]);

  useEffect(() => {
    // Debounced handler for scroll and resize events
    let debounceTimeout: NodeJS.Timeout | null = null;

    const debouncedAnalysis = () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        requestAnimationFrame(analyzeBackground);
      }, 100); // 100ms debounce delay
    };

    // Initial analysis
    const initialTimeout = setTimeout(analyzeBackground, 300);

    window.addEventListener("scroll", debouncedAnalysis, { passive: true });
    window.addEventListener("resize", debouncedAnalysis, { passive: true });

    return () => {
      clearTimeout(initialTimeout);
      if (debounceTimeout) clearTimeout(debounceTimeout);
      window.removeEventListener("scroll", debouncedAnalysis);
      window.removeEventListener("resize", debouncedAnalysis);
    };
  }, [analyzeBackground]);

  // Derive isDark from brightness state
  const isDark = brightness <= threshold;

  // The SensorComponent remains mostly the same
  const SensorComponent: React.ComponentType<{ className?: string }> = ({ className = "" }) => (
    <div
      ref={sensorRef}
      className={`pointer-events-none ${className}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        // transform: "translate(-50%, -50%)",
        // width: sensorSize.width,
        height: sensorSize.height,

        zIndex: -1, // Send it to the very back so it doesn't interfere

        // backgroundColor: debug ? "rgba(12, 255, 0, 0.4)" : "transparent",
        // border: debug ? "1px dashed red" : "none",
        borderRadius: "1rem",
      }}
    />
  );

  return {
    brightness,
    isDark,
    isLight: brightness > threshold,
    SensorComponent,
    ...(debug && { debugInfo: { sensorRect: sensorRef.current?.getBoundingClientRect() ?? null } }),
  };
}
