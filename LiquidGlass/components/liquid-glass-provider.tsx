"use client";

import React, { createContext, useContext } from "react";
import { LiquidGlassFilters } from "@/LiquidGlass/components/liquid-glass-filters";

interface LiquidGlassContextType {
  debug: boolean;
  globalThreshold: number;
}

const LiquidGlassContext = createContext<LiquidGlassContextType | null>(null);

interface LiquidGlassProviderProps {
  children: React.ReactNode;
  debug?: boolean;
  globalThreshold?: number;
}

export function LiquidGlassProvider({ children, debug = false, globalThreshold = 0.55 }: LiquidGlassProviderProps) {
  const contextValue: LiquidGlassContextType = {
    debug,
    globalThreshold,
  };

  return (
    <LiquidGlassContext.Provider value={contextValue}>
      {/* Render filters only once */}
      <LiquidGlassFilters />
      {children}
    </LiquidGlassContext.Provider>
  );
}

// Hook to use the LiquidGlass context
export function useLiquidGlass() {
  const context = useContext(LiquidGlassContext);
  if (!context) {
    throw new Error("useLiquidGlass must be used within a LiquidGlassProvider");
  }
  return context;
}
