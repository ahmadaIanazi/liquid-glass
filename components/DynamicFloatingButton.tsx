"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Home, Gamepad2, Users, Library, Search, X } from "lucide-react";

export function BottomNavbar({ isDark }: { isDark: boolean }) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  const textColor = isDark ? "white" : "black";

  const navigationItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "arcade", icon: Gamepad2, label: "Arcade" },
    { id: "play-together", icon: Users, label: "Play Together" },
    { id: "library", icon: Library, label: "Library" },
  ];

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (isSearchExpanded) {
      setSearchQuery("");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality here
    console.log("Searching for:", searchQuery);
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-md'>
        <div className='liquid-glass-wrapper rounded-2xl'>
          {/* Background layer (handles blur + distortion) */}
          <div className='liquid-glass-background rounded-2xl'></div>

          {/* Content layer */}
          <div className={`liquid-glass-content ${isDark ? "dark" : ""} p-2 rounded-2xl`}>
            <div className='flex items-center justify-between'>
              {/* Navigation Items */}
              <div className='flex items-center gap-1'>
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
                        isActive ? "bg-white/20 backdrop-blur-sm" : "hover:bg-white/10"
                      }`}
                    >
                      <IconComponent className={`w-5 h-5 transition-colors duration-200 ${isActive ? "text-white" : ""}`} style={{ color: isActive ? "white" : textColor }} />
                      <span className={`text-xs mt-1 transition-colors duration-200 ${isActive ? "text-white font-medium" : ""}`} style={{ color: isActive ? "white" : textColor }}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Button/Input */}
              <div className='flex items-center'>
                {isSearchExpanded ? (
                  <form onSubmit={handleSearchSubmit} className='flex items-center gap-2'>
                    <Input
                      type='text'
                      placeholder='Search...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-32 h-10 bg-white/20 backdrop-blur-sm border-white/20 text-white placeholder:text-white/70 focus:border-white/40'
                      autoFocus
                    />
                    <button
                      type='button'
                      onClick={handleSearchToggle}
                      className='w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors duration-200'
                    >
                      <X className='w-4 h-4' style={{ color: textColor }} />
                    </button>
                  </form>
                ) : (
                  <button onClick={handleSearchToggle} className='flex flex-col items-center justify-center w-12 h-12 rounded-xl hover:bg-white/10 transition-all duration-200'>
                    <Search className='w-5 h-5' style={{ color: textColor }} />
                    <span className='text-xs mt-1 transition-colors duration-200' style={{ color: textColor }}>
                      Search
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
