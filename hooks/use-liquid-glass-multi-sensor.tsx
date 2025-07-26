"use client";

import React from "react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
  throttleInterval?: number; // Interval in milliseconds for throttling
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

  // Use refs to store stable references to avoid dependency issues
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Add refs for scroll handling
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollPositionRef = useRef({ x: 0, y: 0 });
  const isScrollingRef = useRef(false);

  const { sensors, globalThreshold = 0.55, globalDebug = false, throttleInterval = 50 } = options;

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
      const { sensors, globalThreshold, globalDebug } = optionsRef.current;
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
            const threshold = sensorConfig.threshold ?? globalThreshold ?? 0.55;
            console.log(`📊 Sensor ${sensorId} Analysis complete:`, {
              avgBrightness: avgBrightness.toFixed(3),
              isDark: avgBrightness <= threshold,
              validSamples,
              scrollPosition: { x: window.scrollX, y: window.scrollY },
              isScrolling: isScrollingRef.current,
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
    [] // No dependencies - using refs for stable access
  );

  const analyzeAllSensors = useCallback(async () => {
    const { sensors } = optionsRef.current;
    await Promise.all(sensors.map((sensor) => analyzeSensor(sensor.id)));
  }, [analyzeSensor]);

  // Store stable reference to analyzeAllSensors
  const analyzeAllSensorsRef = useRef(analyzeAllSensors);
  useEffect(() => {
    analyzeAllSensorsRef.current = analyzeAllSensors;
  }, [analyzeAllSensors]);

  // Improved scroll handling with end detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollX = window.scrollX;
      const currentScrollY = window.scrollY;

      // Check if scroll position actually changed
      const hasScrolled = currentScrollX !== lastScrollPositionRef.current.x || currentScrollY !== lastScrollPositionRef.current.y;

      if (hasScrolled) {
        isScrollingRef.current = true;
        lastScrollPositionRef.current = { x: currentScrollX, y: currentScrollY };

        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Set new timeout for scroll end detection
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;

          // Use requestIdleCallback for better performance, fallback to setTimeout
          if ("requestIdleCallback" in window) {
            (window as any).requestIdleCallback(
              () => {
                analyzeAllSensorsRef.current();
              },
              { timeout: 100 }
            );
          } else {
            // Fallback for browsers that don't support requestIdleCallback
            setTimeout(() => {
              analyzeAllSensorsRef.current();
            }, 16); // ~60fps
          }
        }, 150); // Wait 150ms after scroll stops
      }
    };

    const handleResize = () => {
      // For resize, we can analyze immediately since it's not continuous
      if ("requestIdleCallback" in window) {
        (window as any).requestIdleCallback(
          () => {
            analyzeAllSensorsRef.current();
          },
          { timeout: 100 }
        );
      } else {
        setTimeout(() => {
          analyzeAllSensorsRef.current();
        }, 16);
      }
    };

    // Initial analysis with delay to ensure DOM is ready
    const initialTimeout = setTimeout(() => {
      analyzeAllSensorsRef.current();
    }, 500);

    // Add event listeners
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      clearTimeout(initialTimeout);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array - runs only once

  // Create sensor results with useMemo to prevent unnecessary recreations
  const sensorResults = useMemo((): SensorResult[] => {
    return sensors.map((sensor: SensorConfig) => {
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
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            fontSize: "12px",
            color: "red",
            zIndex: sensor.debug || globalDebug ? 1000 : -1,
            backgroundColor: sensor.debug || globalDebug ? "rgba(255, 0, 0, 0.1)" : "transparent",
            border: sensor.debug || globalDebug ? "1px dashed red" : "none",
            borderRadius: "1rem",
            ...sensor.position,
          }}
        >
          {sensor.debug || globalDebug ? sensor.id : null}
        </div>
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
  }, [sensors, sensorStates, globalThreshold, globalDebug]);

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
