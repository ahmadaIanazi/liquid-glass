"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Ellipsis } from "lucide-react";
import "@/LiquidGlass/styles/gradient-blur.css";
import { useLiquidGlassSupport } from "@/LiquidGlass/hooks/use-liquid-glass-support";

export function TopNavigationBar({ isDark }: { isDark: boolean }) {
  const { fallbackGlass } = useLiquidGlassSupport();

  const textColor = isDark ? "white" : "black";

  return (
    <>
      {/* Top Navigation Bar */}
      <div className='fixed top-0 left-0 right-0 z-40 px-4 py-3'>
        <div className='gradient-blur-to-bottom' />
        <div className='flex z-50 items-center justify-between max-w-sm mx-auto'>
          <div className='liquid-glass-wrapper rounded-full'>
            <div className={`liquid-glass-background ${fallbackGlass ? "liquid-glass-background-fallback" : ""} rounded-full`}></div>
            <div className={`liquid-glass-content ${fallbackGlass ? "backdrop-blur-3xl" : ""} rounded-full`}>
              <Button variant='ghost' size='sm' className='rounded-full w-9 h-9 p-0' onClick={() => window.history.back()}>
                <ArrowLeft className='w-4 h-4' style={{ color: textColor }} />
              </Button>
            </div>
          </div>

          <div className='flex z-50 items-center'>
            <h1 className='text-lg font-semibold transition-colors duration-200' style={{ color: textColor }}>
              Liquid Glass Effect
            </h1>
          </div>

          <div className='liquid-glass-wrapper rounded-full'>
            <div className='liquid-glass-background rounded-full'></div>
            <div className='liquid-glass-content rounded-full'>
              <Button variant='ghost' size='sm' className='rounded-full w-9 h-9 p-0' onClick={() => window.history.back()}>
                <Ellipsis className='w-4 h-4' style={{ color: textColor }} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
