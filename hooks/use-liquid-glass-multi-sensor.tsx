"use client";

import React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";

interface SensorConfig {
  id: string;
  position: {
    top?: number | string;
    bottom?: number | string;
    left?: number | string;
    right?: number | string;
    width?: number | string;
    height?: number | string;
  };
  threshold?: number;
  debug?: boolean;
}

interface LiquidGlassMultiSensorOptions {
  sensors: SensorConfig[];
  globalThreshold?: number;
  globalDebug?: boolean;
}

interface SensorResult {
  id: string;
  isDark: boolean;
  brightness: number;
  isLight: boolean;
  SensorComponent: React.ComponentType<{ className?: string }>;
  debugInfo?: {
    sensorRect: DOMRect | null;
  };
}

interface LiquidGlassMultiSensorResult {
  sensors: SensorResult[];
  getSensorById: (id: string) => SensorResult | undefined;
}

// Brightness calculation remains the same
function calculateRgbBrightness(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function useLiquidGlassMultiSensor(options: LiquidGlassMultiSensorOptions): LiquidGlassMultiSensorResult {
  const [sensorStates, setSensorStates] = useState<Record<string, { brightness: number; rect: DOMRect | null }>>({});
  const sensorRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { sensors, globalThreshold = 0.55, globalDebug = false } = options;

  // Initialize sensor states
  useEffect(() => {
    const initialStates: Record<string, { brightness: number; rect: DOMRect | null }> = {};
    sensors.forEach((sensor) => {
      initialStates[sensor.id] = { brightness: 0.5, rect: null };
    });
    setSensorStates(initialStates);
  }, [sensors]);

  const analyzeSensor = useCallback(
    async (sensorId: string) => {
      const sensorRef = sensorRefs.current[sensorId];
      const sensorConfig = sensors.find((s) => s.id === sensorId);

      if (!sensorRef || !sensorConfig || typeof window === "undefined") {
        if (sensorConfig?.debug || globalDebug) console.log(`❌ Sensor ${sensorId} ref not available`);
        return;
      }

      try {
        const rect = sensorRef.getBoundingClientRect();

        if (rect.width === 0 || rect.height === 0) {
          if (sensorConfig?.debug || globalDebug) console.log(`❌ Sensor ${sensorId} not visible`);
          return;
        }

        // Capture the entire body using html2canvas
        const canvas = await html2canvas(document.body, {
          width: window.innerWidth,
          height: window.innerHeight,
          x: window.scrollX,
          y: window.scrollY,
          logging: false,
          useCORS: true,
        });

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        // Get the pixel data for the sensor's area
        const scale = window.devicePixelRatio || 1;
        const imageData = ctx.getImageData(rect.left * scale, rect.top * scale, rect.width * scale, rect.height * scale);
        const data = imageData.data;

        let totalBrightness = 0;
        let validSamples = 0;
        const pixelSkip = 4; // Sample every 4th pixel for performance

        // Loop through the pixels, calculate average brightness
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

          setSensorStates((prev) => ({
            ...prev,
            [sensorId]: { brightness: avgBrightness, rect },
          }));

          if (sensorConfig?.debug || globalDebug) {
            const threshold = sensorConfig.threshold ?? globalThreshold;
            console.log(`📊 Sensor ${sensorId} Analysis complete:`, {
              avgBrightness: avgBrightness.toFixed(3),
              isDark: avgBrightness <= threshold,
              validSamples,
            });
          }
        } else {
          if (sensorConfig?.debug || globalDebug) console.log(`🔄 No valid pixels found for sensor ${sensorId}, using fallback`);
          setSensorStates((prev) => ({
            ...prev,
            [sensorId]: { brightness: 0.5, rect },
          }));
        }
      } catch (error) {
        console.warn(`Liquid glass sensor ${sensorId} detection failed:`, error);
        setSensorStates((prev) => ({
          ...prev,
          [sensorId]: { brightness: 0.5, rect: null },
        }));
      }
    },
    [sensors, globalThreshold, globalDebug]
  );

  const analyzeAllSensors = useCallback(async () => {
    await Promise.all(sensors.map((sensor) => analyzeSensor(sensor.id)));
  }, [sensors, analyzeSensor]);

  useEffect(() => {
    // Debounced handler for scroll and resize events
    let debounceTimeout: NodeJS.Timeout | null = null;

    const debouncedAnalysis = () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        requestAnimationFrame(analyzeAllSensors);
      }, 100); // 100ms debounce delay
    };

    // Initial analysis
    const initialTimeout = setTimeout(analyzeAllSensors, 300);

    window.addEventListener("scroll", debouncedAnalysis, { passive: true });
    window.addEventListener("resize", debouncedAnalysis, { passive: true });

    return () => {
      clearTimeout(initialTimeout);
      if (debounceTimeout) clearTimeout(debounceTimeout);
      window.removeEventListener("scroll", debouncedAnalysis);
      window.removeEventListener("resize", debouncedAnalysis);
    };
  }, [analyzeAllSensors]);

  // Create sensor results
  const sensorResults: SensorResult[] = sensors.map((sensor) => {
    const state = sensorStates[sensor.id] || { brightness: 0.5, rect: null };
    const threshold = sensor.threshold ?? globalThreshold;
    const isDark = state.brightness <= threshold;

    const SensorComponent: React.ComponentType<{ className?: string }> = ({ className = "" }) => (
      <div
        ref={(el) => {
          sensorRefs.current[sensor.id] = el;
        }}
        className={`pointer-events-none ${className}`}
        style={{
          position: "fixed",
          top: sensor.position.top,
          bottom: sensor.position.bottom,
          left: sensor.position.left,
          right: sensor.position.right,
          width: sensor.position.width || "100%",
          height: sensor.position.height || "100px",
          zIndex: -1,
          borderRadius: "1rem",
        }}
      />
    );

    return {
      id: sensor.id,
      brightness: state.brightness,
      isDark,
      isLight: state.brightness > threshold,
      SensorComponent,
      ...((sensor.debug || globalDebug) && { debugInfo: { sensorRect: state.rect } }),
    };
  });

  const getSensorById = useCallback(
    (id: string) => {
      return sensorResults.find((sensor) => sensor.id === id);
    },
    [sensorResults]
  );

  return {
    sensors: sensorResults,
    getSensorById,
  };
}
