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
  throttleInterval?: number;
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
  const analysisInProgressRef = useRef(false);

  const { sensors, globalThreshold = 0.55, globalDebug = false, throttleInterval = 50 } = options;

  // Initialize sensor states when sensors change
  useEffect(() => {
    const initialStates: Record<string, { brightness: number; rect: DOMRect | null }> = {};
    sensors.forEach((sensor) => {
      // Keep existing state if sensor already exists, otherwise initialize
      initialStates[sensor.id] = sensorStates[sensor.id] || { brightness: 0.5, rect: null };
    });

    // Only update if there are actual changes
    const hasChanges = sensors.some((sensor) => !sensorStates[sensor.id]) || Object.keys(sensorStates).some((id) => !sensors.find((s) => s.id === id));

    if (hasChanges) {
      setSensorStates(initialStates);
    }
  }, [sensors]);

  const analyzeSensor = useCallback(async (sensorId: string) => {
    if (analysisInProgressRef.current) {
      return; // Skip if analysis is already in progress
    }

    const sensorRef = sensorRefs.current[sensorId];
    const { sensors, globalThreshold, globalDebug } = optionsRef.current;
    const sensorConfig = sensors.find((s) => s.id === sensorId);

    if (!sensorRef || !sensorConfig || typeof window === "undefined") {
      if (sensorConfig?.debug || globalDebug) console.log(`❌ Sensor ${sensorId} ref not available`);
      return;
    }

    try {
      analysisInProgressRef.current = true;

      // Get the current position and size
      const rect = sensorRef.getBoundingClientRect();

      // Skip analysis if element is not visible
      if (rect.width === 0 || rect.height === 0) {
        if (sensorConfig?.debug || globalDebug) console.log(`⚠️ Sensor ${sensorId} has zero dimensions`);
        return;
      }

      // Capture only the sensor element itself
      const canvas = await html2canvas(sensorRef, {
        useCORS: true,
        scale: Math.min(window.devicePixelRatio, 2), // Limit scale for performance
        backgroundColor: null,
        logging: false,
        // Add these options for better performance and accuracy
        allowTaint: true,
        removeContainer: true,
        imageTimeout: 1000,
      });

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      // Get image data from the entire canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let totalBrightness = 0;
      let validSamples = 0;
      const pixelSkip = Math.max(1, Math.floor((canvas.width * canvas.height) / 10000)); // Adaptive sampling

      for (let i = 0; i < data.length; i += 4 * pixelSkip) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];

        if (alpha > 200) {
          totalBrightness += calculateRgbBrightness(r, g, b);
          validSamples++;
        }
      }

      if (validSamples > 0) {
        const avgBrightness = totalBrightness / validSamples;

        setSensorStates((prev) => {
          // Only update if brightness changed significantly
          const existing = prev[sensorId];
          if (existing && Math.abs(existing.brightness - avgBrightness) < 0.01) {
            return prev;
          }

          return {
            ...prev,
            [sensorId]: { brightness: avgBrightness, rect },
          };
        });

        if (sensorConfig?.debug || globalDebug) {
          const threshold = sensorConfig.threshold ?? globalThreshold ?? 0.55;
          console.log(`📊 Sensor ${sensorId} Analysis complete:`, {
            avgBrightness: avgBrightness.toFixed(3),
            isDark: avgBrightness <= threshold,
            validSamples,
            rect: {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            },
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
      const rect = sensorRef.getBoundingClientRect();
      setSensorStates((prev) => ({
        ...prev,
        [sensorId]: { brightness: 0.5, rect },
      }));
    } finally {
      analysisInProgressRef.current = false;
    }
  }, []);

  const analyzeAllSensors = useCallback(async () => {
    if (analysisInProgressRef.current) {
      return; // Skip if analysis is already in progress
    }

    const { sensors } = optionsRef.current;

    // Analyze sensors sequentially to avoid overwhelming the browser
    for (const sensor of sensors) {
      await analyzeSensor(sensor.id);
      // Small delay between analyses
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }, [analyzeSensor]);

  // Store stable reference to analyzeAllSensors
  const analyzeAllSensorsRef = useRef(analyzeAllSensors);
  useEffect(() => {
    analyzeAllSensorsRef.current = analyzeAllSensors;
  }, [analyzeAllSensors]);

  // Improved scroll handling with better debouncing
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollX = window.scrollX;
      const currentScrollY = window.scrollY;

      // Check if scroll position actually changed significantly
      const deltaX = Math.abs(currentScrollX - lastScrollPositionRef.current.x);
      const deltaY = Math.abs(currentScrollY - lastScrollPositionRef.current.y);
      const hasScrolled = deltaX > 5 || deltaY > 5; // Minimum threshold to avoid micro-scrolls

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

          // Use requestAnimationFrame for better timing
          requestAnimationFrame(() => {
            if ("requestIdleCallback" in window) {
              (window as any).requestIdleCallback(
                () => {
                  analyzeAllSensorsRef.current();
                },
                { timeout: 200 }
              );
            } else {
              setTimeout(() => {
                analyzeAllSensorsRef.current();
              }, 16);
            }
          });
        }, 100); // Reduced timeout for more responsive updates
      }
    };

    const handleResize = () => {
      // Clear scroll timeout to avoid conflicts
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      requestAnimationFrame(() => {
        if ("requestIdleCallback" in window) {
          (window as any).requestIdleCallback(
            () => {
              analyzeAllSensorsRef.current();
            },
            { timeout: 200 }
          );
        } else {
          setTimeout(() => {
            analyzeAllSensorsRef.current();
          }, 16);
        }
      });
    };

    // Initial analysis with proper delay
    const initialTimeout = setTimeout(() => {
      analyzeAllSensorsRef.current();
    }, 300); // Reduced initial delay

    // Add event listeners
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      clearTimeout(initialTimeout);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Re-analyze when sensor configurations change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      analyzeAllSensorsRef.current();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [sensors]);

  // Create sensor results with better memoization
  const sensorResults = useMemo((): SensorResult[] => {
    return sensors.map((sensor: SensorConfig) => {
      const state = sensorStates[sensor.id] || { brightness: 0.5, rect: null };
      const threshold = sensor.threshold ?? globalThreshold;
      const isDark = state.brightness <= threshold;

      const SensorComponent: React.ComponentType<{ className?: string }> = ({ className = "" }) => (
        <div
          ref={(el) => {
            const prevEl = sensorRefs.current[sensor.id];
            if (prevEl !== el) {
              sensorRefs.current[sensor.id] = el;
              // Trigger analysis when ref changes
              if (el) {
                setTimeout(() => analyzeSensor(sensor.id), 50);
              }
            }
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
          data-sensor-id={sensor.id} // Add data attribute for debugging
        >
          {sensor.debug || globalDebug ? `${sensor.id} (${state.brightness.toFixed(2)})` : null}
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
  }, [sensors, sensorStates, globalThreshold, globalDebug, analyzeSensor]);

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
