import { GradientBlur } from "./gradient-blur";

export default function GradientBlurDemo() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8'>
      <div className='max-w-4xl mx-auto space-y-8'>
        <h1 className='text-4xl font-bold text-white text-center mb-8'>GradientBlur Component Demo</h1>

        {/* Basic Usage */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold text-white'>Basic Usage</h2>
          <div className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
            <div className='p-4 text-white'>
              <p>Content with gradient blur overlay</p>
            </div>
            <GradientBlur position='top' />
            <GradientBlur position='bottom' />
          </div>
        </section>

        {/* Position Variants */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold text-white'>Position Variants</h2>
          <div className='grid grid-cols-2 gap-4'>
            <div className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
              <div className='p-4 text-white'>
                <p>Top Position</p>
              </div>
              <GradientBlur position='top' />
            </div>
            <div className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
              <div className='p-4 text-white'>
                <p>Bottom Position</p>
              </div>
              <GradientBlur position='bottom' />
            </div>
            <div className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
              <div className='p-4 text-white'>
                <p>Left Position</p>
              </div>
              <GradientBlur position='left' />
            </div>
            <div className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
              <div className='p-4 text-white'>
                <p>Right Position</p>
              </div>
              <GradientBlur position='right' />
            </div>
          </div>
        </section>

        {/* Height Variants */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold text-white'>Height Variants</h2>
          <div className='space-y-2'>
            {["sm", "md", "lg", "xl", "2xl", "3xl"].map((height) => (
              <div key={height} className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
                <div className='p-4 text-white'>
                  <p>Height: {height}</p>
                </div>
                <GradientBlur position='top' height={height} />
              </div>
            ))}
          </div>
        </section>

        {/* Intensity Variants */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold text-white'>Intensity Variants</h2>
          <div className='grid grid-cols-3 gap-4'>
            <div className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
              <div className='p-4 text-white'>
                <p>Light Intensity</p>
              </div>
              <GradientBlur position='top' intensity='light' />
            </div>
            <div className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
              <div className='p-4 text-white'>
                <p>Medium Intensity</p>
              </div>
              <GradientBlur position='top' intensity='medium' />
            </div>
            <div className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
              <div className='p-4 text-white'>
                <p>Heavy Intensity</p>
              </div>
              <GradientBlur position='top' intensity='heavy' />
            </div>
          </div>
        </section>

        {/* Direction Variants */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold text-white'>Direction Variants</h2>
          <div className='grid grid-cols-2 gap-4'>
            <div className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
              <div className='p-4 text-white'>
                <p>To Bottom</p>
              </div>
              <GradientBlur position='top' direction='to-bottom' />
            </div>
            <div className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
              <div className='p-4 text-white'>
                <p>To Top</p>
              </div>
              <GradientBlur position='bottom' direction='to-top' />
            </div>
            <div className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
              <div className='p-4 text-white'>
                <p>To Left</p>
              </div>
              <GradientBlur position='right' direction='to-left' />
            </div>
            <div className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
              <div className='p-4 text-white'>
                <p>To Right</p>
              </div>
              <GradientBlur position='left' direction='to-right' />
            </div>
          </div>
        </section>

        {/* Custom Props */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold text-white'>Custom Props</h2>
          <div className='space-y-4'>
            <div className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
              <div className='p-4 text-white'>
                <p>Custom Height & Width</p>
              </div>
              <GradientBlur position='top' customHeight='100px' customWidth='200px' style={{ left: "50%", transform: "translateX(-50%)" }} />
            </div>
            <div className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
              <div className='p-4 text-white'>
                <p>Custom Mask Gradient</p>
              </div>
              <GradientBlur position='top' maskGradient='linear-gradient(to top, rgba(255, 0, 0, 0), rgba(255, 0, 0, 0.8) 50%, rgba(255, 0, 0, 1) 100%)' />
            </div>
            <div className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
              <div className='p-4 text-white'>
                <p>Custom Z-Index</p>
              </div>
              <GradientBlur position='top' zIndex={100} />
            </div>
          </div>
        </section>

        {/* Multiple Blurs */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold text-white'>Multiple Blurs</h2>
          <div className='relative h-32 bg-white/20 rounded-lg overflow-hidden'>
            <div className='p-4 text-white'>
              <p>Multiple gradient blurs working together</p>
            </div>
            <GradientBlur position='top' height='lg' />
            <GradientBlur position='bottom' height='lg' />
            <GradientBlur position='left' width='lg' />
            <GradientBlur position='right' width='lg' />
          </div>
        </section>
      </div>
    </div>
  );
}
