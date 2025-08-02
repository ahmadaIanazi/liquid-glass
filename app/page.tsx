"use client";

import { LiquidGlass, LiquidGlassProvider } from "@/LiquidGlass";
import { GradientBlur } from "@/blur-gradient";
import "@/blur-gradient/styles/gradient-blur.css";
import DemoPage from "@/demo";
import { Ellipsis, Menu } from "lucide-react";

export default function HomePage() {
  return (
    <div className='flex flex-col h-screen'>
      <LiquidGlassProvider debug={true} globalThreshold={0.75}>
        {/* Fixed LiquidGlass Components for Testing - Direct positioning */}
        {/* Header Component */}
        <LiquidGlass className='fixed top-4 start-4 rounded-full z-10' contentClassName='p-4'>
          <Menu className='w-8 h-8' />
        </LiquidGlass>
        {/* Header Component */}
        <LiquidGlass className='fixed top-4 end-4 rounded-full z-10' contentClassName='p-4'>
          <Ellipsis className='w-8 h-8' />
        </LiquidGlass>
        {/* Center Component */}
        <LiquidGlass contentClassName='p-10' className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full z-40'>
          <span className='font-medium'> Liquid Glass Done Right</span>
          <span className='font-medium'> NextJS TailwindCSS</span>
        </LiquidGlass>

        {/* Gradient Blur Effects */}
        <GradientBlur position='top' height='full' width='full' direction='to-bottom' intensity='light' />
        <div className='gradient-blur-to-bottom' />
        <GradientBlur position='bottom' height='full' width='full' direction='to-top' intensity='light' />
        <DemoPage />
      </LiquidGlassProvider>
    </div>
  );
}
