"use client";

import { BottomNavbar } from "@/components/BottomNavbar";
import { BottomSheet } from "@/components/BottomSheet";
import Demo from "@/components/demo";
import { LiquidGlassFilters } from "@/components/LiquidGlassFilters";
import { TopNavigationBar } from "@/components/TopNavigationBar";
import { useLiquidGlassMultiSensor } from "@/hooks/use-liquid-glass-multi-sensor";
import { useLiquidGlassSupport } from "@/hooks/useLiquidGlassSupport";
import "@/styles/gradient-blur.css";
import { Paperclip } from "lucide-react";
import { useMemo } from "react";

export default function HomePage() {
  // (Required) You can change the options to fit your needs
  const sensorOptions = useMemo(
    () => ({
      sensors: [
        {
          id: "top-nav",
          position: { top: 0, left: 0, right: 0, height: 60 },
          threshold: 0.75,
        },
        {
          id: "bottom-nav",
          position: { bottom: 0, left: 0, right: 0, height: 80 },
          threshold: 0.75,
        },
        {
          id: "center-element",
          position: { top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 200, height: 100 },
          threshold: 0.75,
        },
      ],
      globalDebug: false,
    }),
    []
  );

  // (Required) Use the multi-sensor liquid glass detector
  const { sensors, getSensorById } = useLiquidGlassMultiSensor(sensorOptions);
  const { hideBottomBlur, fallbackGlass } = useLiquidGlassSupport();

  // (Sample) Get specific sensors
  const topNavSensor = getSensorById("top-nav");
  const bottomNavSensor = getSensorById("bottom-nav");
  const centerElementSensor = getSensorById("center-element");

  return (
    <>
      {/* (Required) Liquid Glass Filters Place it ONE time in the project at the main content */}
      <LiquidGlassFilters />

      {/* (Required)Render all sensor components */}
      {sensors.map((sensor) => (
        <sensor.SensorComponent key={sensor.id} />
      ))}

      {/* (Sample) Liquid Glass Top Navigation Bar */}
      <TopNavigationBar isDark={topNavSensor?.isDark ?? false} />

      {/* (Sample) Simple liquid glass element - positioned in center */}
      <div className='fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 liquid-glass-wrapper rounded-2xl'>
        <div className='liquid-glass-background rounded-2xl'></div>

        <div className={`liquid-glass-content ${fallbackGlass ? "backdrop-blur-lg" : ""} ${centerElementSensor?.isDark ? "dark" : ""} px-10 py-2 rounded-2xl`}>
          <div className='flex items-center gap-2'>
            <Paperclip className='w-4 h-4 transition-colors duration-200' />
            <span className='text-2xl transition-colors duration-200'>Demo Liquid Glass</span>
          </div>
        </div>
      </div>

      {/* (Sample) Demo */}
      <Demo />

      {/* (Sample) Liquid Glass Bottom Navigation Bar */}
      <BottomNavbar isDark={bottomNavSensor?.isDark ?? false} />

      {/* (Sample) Hide The Bottom Blur for iOS 26 or Above and if its Safari because its handled by the browser */}
      {!hideBottomBlur && <div className='gradient-blur-to-top' />}

      {/* (Sample) Bottom Sheet */}
      <BottomSheet />
    </>
  );
}
