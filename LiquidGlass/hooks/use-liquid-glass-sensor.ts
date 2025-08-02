"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";

interface UseLiquidGlassSensorOptions {
  sensorRef: React.RefObject<HTMLElement>;
  threshold?: number;
  debug?: boolean;
}

// Added 'averageColor' to the return type
interface LiquidGlassSensorResult {
  isDark: boolean;
  brightness: number;
  isLight: boolean;
  isAnalyzing: boolean;
  averageColor: string;
}

// Brightness calculation remains the same
function calculateRgbBrightness(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function useLiquidGlassSensor({ sensorRef, threshold = 0.55, debug = false }: UseLiquidGlassSensorOptions): LiquidGlassSensorResult {
  const [brightness, setBrightness] = useState(0.5);
  // Add state for the average color
  const [averageColor, setAverageColor] = useState<string>("rgb(128, 128, 128)");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastAnalysisTime = useRef(0);
  const mountedRef = useRef(true);

  const thresholdRef = useRef(threshold);
  const debugRef = useRef(debug);

  useEffect(() => {
    thresholdRef.current = threshold;
    debugRef.current = debug;
  }, [threshold, debug]);

  const analyzeSensor = useCallback(async () => {
    const element = sensorRef.current;

    if (!element || !mountedRef.current) {
      if (debugRef.current) console.log("GlassSensor: ❌ Analysis skipped - no element or unmounted.");
      return;
    }

    const now = Date.now();
    if (now - lastAnalysisTime.current < 100) {
      return;
    }
    lastAnalysisTime.current = now;

    setIsAnalyzing(true);

    try {
      const rect = element.getBoundingClientRect();

      if (rect.width === 0 || rect.height === 0 || rect.top > window.innerHeight || rect.bottom < 0) {
        if (debugRef.current) console.log("GlassSensor: ⚠️ Element off-screen or zero-sized, skipping analysis.");
        setIsAnalyzing(false);
        return;
      }

      if (debugRef.current) {
        console.log(`GlassSensor: 🔍 Starting analysis at ${new Date().toLocaleTimeString()}`);
      }

      const viewportCanvas = await html2canvas(document.body, {
        useCORS: true,
        backgroundColor: null,
        logging: false,
        scale: window.devicePixelRatio,
        x: window.scrollX,
        y: window.scrollY,
        width: window.innerWidth,
        height: window.innerHeight,
        ignoreElements: (el) => element.contains(el),
      });

      const dpr = window.devicePixelRatio;
      const croppedCanvas = document.createElement("canvas");
      const croppedCtx = croppedCanvas.getContext("2d", { willReadFrequently: true });

      if (!croppedCtx) {
        throw new Error("Failed to get 2D context for cropping.");
      }

      croppedCanvas.width = Math.round(rect.width * dpr);
      croppedCanvas.height = Math.round(rect.height * dpr);

      croppedCtx.drawImage(viewportCanvas, rect.left * dpr, rect.top * dpr, rect.width * dpr, rect.height * dpr, 0, 0, croppedCanvas.width, croppedCanvas.height);

      const imageData = croppedCtx.getImageData(0, 0, croppedCanvas.width, croppedCanvas.height);
      const data = imageData.data;

      // Variables to sum color channels and brightness
      let totalR = 0,
        totalG = 0,
        totalB = 0,
        totalBrightness = 0;
      let validSamples = 0;
      const sampleRate = Math.max(1, Math.floor((croppedCanvas.width * croppedCanvas.height) / 5000));

      for (let i = 0; i < data.length; i += 4 * sampleRate) {
        const alpha = data[i + 3];
        if (alpha > 200) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Sum R, G, and B channels
          totalR += r;
          totalG += g;
          totalB += b;

          totalBrightness += calculateRgbBrightness(r, g, b);
          validSamples++;
        }
      }

      if (validSamples > 0) {
        const avgBrightness = totalBrightness / validSamples;
        setBrightness(avgBrightness);

        // Calculate average for each color channel
        const avgR = Math.round(totalR / validSamples);
        const avgG = Math.round(totalG / validSamples);
        const avgB = Math.round(totalB / validSamples);
        const avgColorString = `rgb(${avgR}, ${avgG}, ${avgB})`;
        setAverageColor(avgColorString);

        if (debugRef.current) {
          const isCurrentlyDark = avgBrightness <= thresholdRef.current;
          console.log(
            `%cGlassSensor Result: %c${isCurrentlyDark ? "DARK ⚫" : "LIGHT ⚪"}`,
            "font-weight: bold;",
            `font-weight: normal; color: ${isCurrentlyDark ? "#ff9999" : "#90ee90"};`
          );
          const brightnessBar = "█".repeat(Math.round(avgBrightness * 20));
          const emptyBar = "░".repeat(20 - Math.round(avgBrightness * 20));
          console.log(`💡 Brightness: [${brightnessBar}${emptyBar}] | Value: ${avgBrightness.toFixed(3)}`);
          // Log the average color with a swatch
          console.log(`🎨 Average Color: %c         %c ${avgColorString}`, `background-color: ${avgColorString}; border: 1px solid #888;`, "font-weight: normal;");
        }
      } else {
        if (debugRef.current) console.log("GlassSensor: 🔄 No valid pixels, using fallback values.");
        setBrightness(0.5);
        setAverageColor("rgb(128, 128, 128)");
      }
    } catch (error) {
      console.warn("GlassSensor: 🚨 Analysis failed:", error);
      setBrightness(0.5);
      setAverageColor("rgb(128, 128, 128)");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (sensorRef.current) {
      const timeoutId = setTimeout(analyzeSensor, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [sensorRef, analyzeSensor]);

  useEffect(() => {
    const handleEvents = () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
      analysisTimeoutRef.current = setTimeout(analyzeSensor, 150);
    };

    window.addEventListener("scroll", handleEvents, { passive: true });
    window.addEventListener("resize", handleEvents, { passive: true });

    return () => {
      if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
      window.removeEventListener("scroll", handleEvents);
      window.removeEventListener("resize", handleEvents);
    };
  }, [analyzeSensor]);

  const isDark = brightness <= threshold;

  // Return the result object including the averageColor
  return {
    isDark,
    brightness,
    isLight: !isDark,
    isAnalyzing,
    averageColor,
  };
}
