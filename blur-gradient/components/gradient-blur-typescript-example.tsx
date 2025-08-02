import React from "react";
import { GradientBlur } from "./gradient-blur";
import type { GradientBlurProps, GradientBlurPosition, GradientBlurHeight, GradientBlurWidth, GradientBlurDirection, GradientBlurIntensity } from "./gradient-blur.types";

/**
 * Example component demonstrating TypeScript usage of GradientBlur
 */
export default function GradientBlurTypeScriptExample() {
  // Type-safe props with explicit typing
  const topBlurProps: Partial<GradientBlurProps> = {
    position: "top",
    height: "md",
    intensity: "medium",
  };

  const bottomBlurProps: Partial<GradientBlurProps> = {
    position: "bottom",
    height: "lg",
    intensity: "heavy",
  };

  // Function with type-safe parameters
  const createGradientBlur = (position: GradientBlurPosition, height: GradientBlurHeight = "md", intensity: GradientBlurIntensity = "medium"): JSX.Element => {
    return <GradientBlur position={position} height={height} intensity={intensity} className='custom-blur' />;
  };

  // Type-safe event handler
  const handleBlurClick = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log("Gradient blur clicked:", event.currentTarget);
  };

  // Type-safe style object
  const customStyles: React.CSSProperties = {
    zIndex: 1000,
    opacity: 0.8,
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8'>
      <div className='max-w-4xl mx-auto space-y-8'>
        <h1 className='text-4xl font-bold text-white text-center mb-8'>GradientBlur TypeScript Examples</h1>

        {/* Type-safe basic usage */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold text-white'>Type-Safe Basic Usage</h2>
          <div className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
            <div className='p-4 text-white'>
              <p>Type-safe props with explicit typing</p>
            </div>
            <GradientBlur {...topBlurProps} />
            <GradientBlur {...bottomBlurProps} />
          </div>
        </section>

        {/* Type-safe function usage */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold text-white'>Type-Safe Function Usage</h2>
          <div className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
            <div className='p-4 text-white'>
              <p>Created via type-safe function</p>
            </div>
            {createGradientBlur("top", "lg", "heavy")}
            {createGradientBlur("bottom", "md", "light")}
          </div>
        </section>

        {/* Type-safe event handlers */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold text-white'>Type-Safe Event Handlers</h2>
          <div className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
            <div className='p-4 text-white'>
              <p>Click the blur elements to see type-safe events</p>
            </div>
            <GradientBlur
              position='top'
              height='md'
              onClick={handleBlurClick}
              onMouseEnter={(e) => console.log("Mouse enter:", e.currentTarget)}
              onMouseLeave={(e) => console.log("Mouse leave:", e.currentTarget)}
            />
          </div>
        </section>

        {/* Type-safe custom styles */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold text-white'>Type-Safe Custom Styles</h2>
          <div className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
            <div className='p-4 text-white'>
              <p>Custom styles with type safety</p>
            </div>
            <GradientBlur position='top' height='md' style={customStyles} customHeight='80px' customWidth='300px' zIndex={999} />
          </div>
        </section>

        {/* Type-safe variants */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold text-white'>Type-Safe Variants</h2>
          <div className='grid grid-cols-2 gap-4'>
            {(["top", "bottom", "left", "right"] as const).map((position) => (
              <div key={position} className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
                <div className='p-4 text-white'>
                  <p>Position: {position}</p>
                </div>
                <GradientBlur position={position} height='md' intensity='medium' />
              </div>
            ))}
          </div>
        </section>

        {/* Type-safe intensity variants */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold text-white'>Type-Safe Intensity Variants</h2>
          <div className='grid grid-cols-3 gap-4'>
            {(["light", "medium", "heavy"] as const).map((intensity) => (
              <div key={intensity} className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
                <div className='p-4 text-white'>
                  <p>Intensity: {intensity}</p>
                </div>
                <GradientBlur position='top' height='md' intensity={intensity} />
              </div>
            ))}
          </div>
        </section>

        {/* Type-safe direction variants */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold text-white'>Type-Safe Direction Variants</h2>
          <div className='grid grid-cols-2 gap-4'>
            {(["to-bottom", "to-top", "to-left", "to-right"] as const).map((direction) => (
              <div key={direction} className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
                <div className='p-4 text-white'>
                  <p>Direction: {direction}</p>
                </div>
                <GradientBlur position='top' height='md' direction={direction} />
              </div>
            ))}
          </div>
        </section>

        {/* Type-safe custom gradients */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold text-white'>Type-Safe Custom Gradients</h2>
          <div className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
            <div className='p-4 text-white'>
              <p>Custom mask gradient with type safety</p>
            </div>
            <GradientBlur position='top' height='md' maskGradient='linear-gradient(to top, rgba(255, 0, 0, 0), rgba(255, 0, 0, 0.8) 50%, rgba(255, 0, 0, 1) 100%)' />
          </div>
        </section>

        {/* Type-safe ref usage */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold text-white'>Type-Safe Ref Usage</h2>
          <div className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
            <div className='p-4 text-white'>
              <p>Type-safe ref forwarding</p>
            </div>
            <GradientBlur
              ref={(el) => {
                if (el) {
                  console.log("Gradient blur element:", el);
                }
              }}
              position='top'
              height='md'
            />
          </div>
        </section>
      </div>
    </div>
  );
}
