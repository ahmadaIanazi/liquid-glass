"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function TopNavigationBar({ isDark }: { isDark: boolean }) {
  const textColor = isDark ? "white" : "black";

  return (
    <>
      {/* Top Navigation Bar */}
      <div className='fixed top-0 left-0 right-0 z-40 px-4 py-3'>
        <div className={`fixed top-0 left-0 right-0 w-full h-12 backdrop-blur-xl [mask-image:linear-gradient(to_top,_rgba(0,0,0,0),_rgba(0,0,0,0.8)_30%,_rgba(0,0,0,1)_100%)]`} />
        <div className='flex z-50 items-center justify-between max-w-sm mx-auto'>
          <div className='flex z-50 items-center gap-2'>
            <Button variant='ghost' size='sm' className='rounded-full w-9 h-9 p-0' onClick={() => window.history.back()}>
              <ArrowLeft className='w-4 h-4' style={{ color: textColor }} />
            </Button>
          </div>

          <div className='flex z-50 items-center'>
            <h1 className='text-lg font-semibold transition-colors duration-200' style={{ color: textColor }}>
              Liquid Glass Demo
            </h1>
          </div>

          <div className='flex z-50 items-center'>
            {/* Empty div to maintain centering */}
            <div className='w-9 h-9'></div>
          </div>
        </div>
      </div>
    </>
  );
}
