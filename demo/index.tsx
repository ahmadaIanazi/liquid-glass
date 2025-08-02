import { Heart, MessageCircle, Repeat, Play, MoreHorizontal, Bell, User, Search } from "lucide-react";
import React from "react";

export default function DemoPage() {
  // Data arrays remain the same as before
  // --- Data for Different App Sections ---
  const socialFeedPosts = [
    {
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=48&h=48&fit=crop&crop=face",
      name: "Alex Johnson",
      handle: "@alexj",
      time: "5m",
      content: "Just built a new demo page with a focus on snappy UI and clean transitions. It feels so much more responsive! 🚀 #uidev #tailwindcss",
      likes: 42,
      comments: 11,
      reposts: 5,
    },
    {
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e3c100?w=48&h=48&fit=crop&crop=face",
      name: "Samantha Bee",
      handle: "@sambee",
      time: "30m",
      content: "Working on a new dashboard design. The goal is to make data beautiful and intuitive. What are your favorite design principles for data-heavy UIs?",
      likes: 152,
      comments: 23,
      reposts: 14,
    },
    {
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face",
      name: "Mike Chen",
      handle: "@mikec",
      time: "1h",
      content: "Finally shipped the new feature! The user feedback has been incredible. Sometimes the simplest solutions are the best ones. ✨",
      likes: 89,
      comments: 17,
      reposts: 8,
    },
    {
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=48&h=48&fit=crop&crop=face",
      name: "Taylor Reynolds",
      handle: "@tayrey",
      time: "2h",
      content: "Just discovered the power of scroll-snap in CSS. Game changer for mobile experiences! Anyone else using this in production?",
      likes: 210,
      comments: 42,
      reposts: 29,
    },
  ];

  const musicPlaylist = [
    {
      albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=56&h=56&fit=crop",
      title: "Midnight Drive",
      artist: "Synthwave Kid",
      duration: "3:45",
    },
    {
      albumArt: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=56&h=56&fit=crop",
      title: "Lost in the Echoes",
      artist: "The Voids",
      duration: "4:12",
    },
    {
      albumArt: "https://images.unsplash.com/photo-1459749411904-86b709158819?w=56&h=56&fit=crop",
      title: "Coastal Breeze",
      artist: "Summer Haze",
      duration: "2:58",
    },
    {
      albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=56&h=56&fit=crop",
      title: "Neon Dreams",
      artist: "Electric Pulse",
      duration: "3:27",
    },
  ];

  const dashboardWidgets = [
    { title: "Monthly Revenue", value: "$45,231.89", change: "+20.1%", changeType: "positive" },
    { title: "New Subscribers", value: "+1,200", change: "+15%", changeType: "positive" },
    { title: "Active Users", value: "2,300", change: "-2.5%", changeType: "negative" },
    { title: "Avg. Session Time", value: "24m 50s", change: "+5.1%", changeType: "positive" },
    { title: "Conversion Rate", value: "8.3%", change: "+3.2%", changeType: "positive" },
    { title: "Bounce Rate", value: "32.7%", change: "-1.8%", changeType: "positive" },
  ];

  const articles = [
    {
      title: "The Future of UI Design",
      excerpt:
        "How scroll-based interfaces are changing user engagement patterns across platforms. Discover why TikTok-style navigation is becoming the new standard for mobile experiences.",
      readTime: "5 min read",
    },
    {
      title: "Dark Mode vs Light Mode",
      excerpt:
        "Research shows 78% of users prefer dark interfaces for media consumption apps. We explore the science behind color scheme preferences and accessibility considerations.",
      readTime: "4 min read",
    },
    {
      title: "Microinteractions Matter",
      excerpt:
        "Small animations can increase perceived performance by up to 40% according to new studies. Learn how to implement subtle but effective UI animations that delight users.",
      readTime: "6 min read",
    },
    {
      title: "Psychology of Scrolling",
      excerpt: "Why do users engage more with vertically scrolling content? We examine the neuroscience behind infinite scroll patterns and how to leverage them effectively.",
      readTime: "7 min read",
    },
  ];

  const features = [
    {
      title: "Instant Loading",
      description: "Near-zero latency transitions between sections thanks to optimized asset loading and GPU acceleration",
    },
    {
      title: "Adaptive Theming",
      description: "Automatic dark/light mode switching based on content and time of day with seamless transitions",
    },
    {
      title: "GPU Optimized",
      description: "Hardware-accelerated animations for butter-smooth scrolling even on low-end devices",
    },
    {
      title: "Responsive Scaling",
      description: "Perfectly crafted layouts that adapt from mobile to 4K displays without media queries",
    },
    {
      title: "Accessibility First",
      description: "WCAG 2.1 compliant with proper contrast ratios and screen reader support",
    },
    {
      title: "SEO Friendly",
      description: "All content remains fully indexable despite the dynamic loading experience",
    },
  ];
  return (
    <div className='h-screen overflow-y-scroll snap-y snap-mandatory'>
      {/* ======================================= */}
      {/* 1. Mountain Hero (Dark)                */}
      {/* ======================================= */}
      <section className='h-screen w-full snap-start relative flex items-center justify-center'>
        <div
          className='absolute inset-0 bg-cover bg-center bg-no-repeat'
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-b from-black/70 to-black/30' />

        <div className='relative z-20 text-center text-white px-6 max-w-3xl'>
          <h1 className='text-5xl md:text-7xl font-bold mb-6 tracking-tight'>
            Experience the <span className='text-cyan-300'>Scroll Revolution</span>
          </h1>
          <p className='text-xl md:text-2xl opacity-90 mb-8'>Fluid section snapping with contextual theming and immersive backgrounds</p>
          <div className='mt-8 animate-bounce'>
            <div className='w-6 h-10 border-2 border-white rounded-full flex justify-center'>
              <div className='w-1 h-3 bg-white rounded-full mt-2 animate-pulse' />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================= */}
      {/* 2. Minimal Text Section (Light)        */}
      {/* ======================================= */}
      <section className='h-screen w-full snap-start bg-white flex items-center justify-center'>
        <div className='max-w-2xl px-8 text-center'>
          <h2 className='text-4xl md:text-6xl font-bold mb-8 text-gray-800'>
            Less is <span className='text-indigo-600'>More</span>
          </h2>
          <p className='text-lg md:text-xl text-gray-600 leading-relaxed mb-6'>
            In a world of constant digital noise, intentional whitespace creates breathing room for content to shine.
          </p>
          <p className='text-lg md:text-xl text-gray-600 leading-relaxed'>Strategic minimalism enhances focus and improves information retention by up to 38%.</p>
        </div>
      </section>

      {/* ======================================= */}
      {/* 3. Colorful Gradient (Dark)            */}
      {/* ======================================= */}
      <section className='h-screen w-full snap-start relative flex items-center justify-center'>
        <div className='absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-800 to-cyan-900' style={{ backgroundSize: "cover" }} />

        <div className='relative z-20 text-center text-white px-6 max-w-4xl'>
          <h2 className='text-4xl md:text-6xl font-bold mb-8'>
            Dynamic <span className='text-yellow-300'>Color Transitions</span>
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-12'>
            {features.map((feature, index) => (
              <div key={index} className='bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 transform transition-transform hover:scale-105'>
                <h3 className='text-2xl font-bold mb-3 text-cyan-200'>{feature.title}</h3>
                <p className='text-gray-200'>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================= */}
      {/* 4. Urban Landscape (Light)             */}
      {/* ======================================= */}
      <section className='h-screen w-full snap-start relative flex items-center justify-center'>
        <div
          className='absolute inset-0 bg-cover bg-center bg-no-repeat'
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-white to-transparent' />

        <div className='relative z-20 text-center px-6 max-w-3xl'>
          <h2 className='text-4xl md:text-6xl font-bold mb-6 text-gray-800'>
            Urban <span className='text-orange-500'>Aesthetics</span>
          </h2>
          <p className='text-xl text-gray-700 bg-white/80 backdrop-blur-sm p-6 rounded-xl'>Text overlays on complex backgrounds require careful contrast management.</p>

          <div className='mt-12 bg-black/80 backdrop-blur-md p-6 rounded-xl inline-block max-w-md'>
            <h3 className='text-xl font-bold text-white mb-3'>Contrast Principle</h3>
            <p className='text-gray-300'>Dark overlays with light text ensure accessibility compliance.</p>
          </div>
        </div>
      </section>

      {/* ======================================= */}
      {/* 5. Article Showcase (Dark)             */}
      {/* ======================================= */}
      <section className='h-screen w-full snap-start bg-gray-900 overflow-hidden flex items-center justify-center'>
        <div
          className='absolute inset-0 bg-cover bg-center bg-no-repeat'
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-b from-black/80 to-gray-900/90' />

        <div className='relative z-20 max-w-4xl w-full px-6'>
          <h2 className='text-4xl font-bold text-white mb-12 text-center'>
            Featured <span className='text-emerald-400'>Content</span>
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {articles.map((article, index) => (
              <div key={index} className='bg-gray-800/60 backdrop-blur-lg p-6 rounded-xl border border-gray-700 hover:border-emerald-400 transition-all duration-300'>
                <div className='bg-gray-700 border border-gray-600 w-full h-48 rounded-lg mb-4' />
                <h3 className='text-xl font-bold text-white mb-2'>{article.title}</h3>
                <p className='text-gray-300 mb-4'>{article.excerpt}</p>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-emerald-400'>{article.readTime}</span>
                  <button className='text-white hover:text-emerald-400 transition-colors'>Read more →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================= */}
      {/* 6. Desert Sunset (Light)               */}
      {/* ======================================= */}
      <section className='h-screen w-full snap-start relative flex items-center justify-center'>
        <div
          className='absolute inset-0 bg-cover bg-center bg-no-repeat'
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-b from-amber-50/80 to-orange-100/50' />

        <div className='relative z-20 text-center px-6 max-w-3xl'>
          <h2 className='text-4xl md:text-6xl font-bold mb-6 text-gray-800'>
            Warm <span className='text-orange-600'>Tones</span>
          </h2>
          <p className='text-xl text-gray-700 bg-orange-50/90 backdrop-blur-sm p-6 rounded-xl border border-orange-200'>
            Warm color schemes create emotional connections with your audience.
          </p>

          <div className='mt-12 max-w-md mx-auto bg-orange-500/90 backdrop-blur-md p-6 rounded-xl'>
            <h3 className='text-xl font-bold text-white mb-3'>Color Psychology</h3>
            <p className='text-orange-100'>Orange tones evoke feelings of energy and enthusiasm.</p>
          </div>
        </div>
      </section>

      {/* ======================================= */}
      {/* 7. Final CTA (Dark)                    */}
      {/* ======================================= */}
      <section className='h-screen w-full snap-start relative flex items-center justify-center'>
        <div
          className='absolute inset-0 bg-cover bg-center bg-no-repeat'
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1505506874110-6a7a69069a08?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-gray-900 to-purple-900/50' />

        <div className='relative z-20 text-center text-white px-6 max-w-3xl'>
          <h2 className='text-4xl md:text-7xl font-bold mb-6'>
            Ready to <span className='text-cyan-300'>Transform</span> Your UI?
          </h2>
          <p className='text-xl md:text-2xl opacity-90 mb-10 max-w-2xl mx-auto'>Implement this scroll experience in your projects today</p>

          <div className='flex flex-col sm:flex-row justify-center gap-4'>
            <button className='px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full font-bold text-lg transition-colors shadow-lg shadow-cyan-500/30'>
              Get Started
            </button>
            <button className='px-8 py-4 bg-transparent hover:bg-white/10 text-white rounded-full font-bold text-lg transition-colors border border-white'>
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* ======================================= */}
      {/* Existing Sections                      */}
      {/* ======================================= */}
      {/* Your existing social, music, and dashboard sections go here */}
    </div>
  );
}
