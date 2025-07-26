"use client";

import { Book, Camera, Coffee, Eye, Github, Heart, Music, Star, Zap } from "lucide-react";
import Image from "next/image";

export default function Demo() {
  return (
    <div className='pt-20 pb-32 px-4 space-y-8'>
      {/* Section 1: Light Background (Original) */}
      <section className='min-h-[400px] bg-gradient-to-r from-blue-100 to-cyan-100 rounded-3xl p-8 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-4xl font-bold text-blue-900 mb-4'>Light Section</h2>
          <p className='text-blue-700 text-lg'>Perfect for testing light text on liquid glass</p>
        </div>
      </section>

      {/* Section 2: Dark Background */}
      <section className='min-h-[400px] bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-8 flex items-center justify-center relative overflow-hidden'>
        <div className='text-center relative z-10'>
          <h2 className='text-4xl font-bold text-white mb-4'>Image Card 1</h2>
          <p className='text-gray-300 text-lg'>Testing with real image background</p>
        </div>
      </section>

      {/* Section 3: Colorful Background (Original) */}
      <section className='min-h-[400px] bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl p-8 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-4xl font-bold text-white mb-4'>Colorful Section</h2>
          <p className='text-purple-100 text-lg'>Vibrant gradient background testing</p>
        </div>
      </section>

      {/* Section 4: Pure Image Background */}
      <section className='min-h-[400px] rounded-3xl p-8 flex items-center justify-center relative overflow-hidden'>
        <div className='absolute inset-0'>
          <Image src='/2.jpg' alt='Background image 2' fill className='object-cover' />
        </div>
        <div className='text-center relative z-10'>
          <h2 className='text-4xl font-bold text-white mb-4'>Pure Image</h2>
          <p className='text-white text-lg'>Full image background with overlay text</p>
        </div>
      </section>

      {/* Section 5: Pattern Background (Original) */}
      <section className='min-h-[400px] bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-3xl p-8 flex items-center justify-center relative overflow-hidden'>
        <div className='absolute inset-0 opacity-20'>
          <div className='absolute top-4 left-4 w-20 h-20 bg-white rounded-full'></div>
          <div className='absolute top-20 right-8 w-16 h-16 bg-white rounded-full'></div>
          <div className='absolute bottom-8 left-1/3 w-12 h-12 bg-white rounded-full'></div>
        </div>
        <div className='text-center relative z-10'>
          <h2 className='text-4xl font-bold text-white mb-4'>Pattern Section</h2>
          <p className='text-blue-100 text-lg'>Complex background with shapes</p>
        </div>
      </section>

      {/* Section 6: Image Card with Gradient Overlay */}
      <section className='min-h-[400px] bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl p-8 flex items-center justify-center relative overflow-hidden'>
        <div className='absolute inset-0 opacity-35'>
          <Image src='/3.jpg' alt='Background image 3' fill className='object-cover' />
        </div>
        <div className='text-center relative z-10'>
          <h2 className='text-4xl font-bold text-white mb-4'>Image Card 2</h2>
          <p className='text-orange-100 text-lg'>Image with gradient overlay</p>
        </div>
      </section>

      {/* Section 7: Cool Background (Original) */}
      <section className='min-h-[400px] bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 rounded-3xl p-8 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-4xl font-bold text-white mb-4'>Cool Section</h2>
          <p className='text-cyan-100 text-lg'>Cool gradient background</p>
        </div>
      </section>

      {/* Section 8: Icons Grid with Image */}
      <section className='min-h-[400px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 relative overflow-hidden'>
        <div className='absolute inset-0 opacity-25'>
          <Image src='/4.jpg' alt='Background image 4' fill className='object-cover' />
        </div>
        <div className='text-center mb-8 relative z-10'>
          <h2 className='text-4xl font-bold text-white mb-4'>Icons Section</h2>
          <p className='text-purple-100 text-lg'>Testing with various icons</p>
        </div>
        <div className='grid grid-cols-4 gap-8 relative z-10'>
          <div className='text-center'>
            <Star className='w-12 h-12 text-yellow-300 mx-auto mb-2' />
            <p className='text-white text-sm'>Star</p>
          </div>
          <div className='text-center'>
            <Heart className='w-12 h-12 text-red-300 mx-auto mb-2' />
            <p className='text-white text-sm'>Heart</p>
          </div>
          <div className='text-center'>
            <Zap className='w-12 h-12 text-yellow-300 mx-auto mb-2' />
            <p className='text-white text-sm'>Zap</p>
          </div>
          <div className='text-center'>
            <Music className='w-12 h-12 text-green-300 mx-auto mb-2' />
            <p className='text-white text-sm'>Music</p>
          </div>
          <div className='text-center'>
            <Camera className='w-12 h-12 text-blue-300 mx-auto mb-2' />
            <p className='text-white text-sm'>Camera</p>
          </div>
          <div className='text-center'>
            <Coffee className='w-12 h-12 text-amber-300 mx-auto mb-2' />
            <p className='text-white text-sm'>Coffee</p>
          </div>
          <div className='text-center'>
            <Book className='w-12 h-12 text-purple-300 mx-auto mb-2' />
            <p className='text-white text-sm'>Book</p>
          </div>
          <div className='text-center'>
            <Eye className='w-12 h-12 text-cyan-300 mx-auto mb-2' />
            <p className='text-white text-sm'>Eye</p>
          </div>
        </div>
      </section>

      {/* Section 9: Pure Image Background 2 */}
      <section className='min-h-[400px] rounded-3xl p-8 flex items-center justify-center relative overflow-hidden'>
        <div className='absolute inset-0'>
          <Image src='/5.jpg' alt='Background image 5' fill className='object-cover' />
        </div>
        <div className='text-center relative z-10'>
          <h2 className='text-4xl font-bold text-white mb-4'>Pure Image 2</h2>
          <p className='text-white text-lg'>Another full image background</p>
        </div>
      </section>

      {/* Section 10: Final Section (Original) */}
      <section className='min-h-[400px] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded-3xl p-8 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-4xl font-bold text-gray-800 mb-4'>Final Section</h2>
          <p className='text-gray-600 text-lg'>Neutral gradient background for testing</p>
        </div>
      </section>

      {/* Section 11: Dark Gradient */}
      <section className='min-h-[400px] bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 rounded-3xl p-8 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-4xl font-bold text-gray-100 mb-4'>Dark Gradient</h2>
          <p className='text-gray-300 text-lg'>Testing with dark gradient</p>
        </div>
      </section>

      {/* Section 12: Light Gradient */}
      <section className='min-h-[400px] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded-3xl p-8 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-4xl font-bold text-gray-800 mb-4'>Light Gradient</h2>
          <p className='text-gray-600 text-lg'>Testing with light gradient</p>
        </div>
      </section>

      {/* Footer and Github link to Repo */}
      <div className='flex items-center justify-center mt-10'>
        <p className='text-muted-foreground text-sm'>Code created by: Ahmad Alanazi </p>
        <p className='text-muted-foreground text-sm'>Github: </p>
        <a href='https://github.com/ahmadaIanazi/liquid-glass' target='_blank' rel='noopener noreferrer' className='text-muted-foreground hover:text-gray-900'>
          <Github className='w-6 h-6' />
        </a>
      </div>
      <div className='h-96' />
    </div>
  );
}
