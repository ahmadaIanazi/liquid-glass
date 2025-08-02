"use client";

import { useState } from "react";
import { Home, Gamepad2, Users, Library, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLiquidGlassSupport } from "@/LiquidGlass/hooks/use-liquid-glass-support";

export function BottomNavbar({ isDark }: { isDark: boolean }) {
  const { fallbackGlass } = useLiquidGlassSupport();

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className='fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-lg'>
      <div className='flex items-end justify-center gap-2'>
        {/* Navigation Items in a SINGLE Container */}
        <div className='liquid-glass-wrapper rounded-full'>
          <div className='liquid-glass-background rounded-full'></div>
          <div className={`liquid-glass-content ${isDark ? "dark" : ""} ${fallbackGlass ? "backdrop-blur-3xl" : ""} p-2 h-16 rounded-full w-full`}>
            <div className='flex items-center gap-1'>
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;

                // When search is expanded, hide non-active items to shrink the container
                if (isSearchExpanded && !isActive) {
                  return <div key={item.id} className='w-0 h-14 transition-all duration-500 ease-in-out' aria-hidden='true' />;
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (isSearchExpanded) {
                        setIsSearchExpanded(false);
                        setSearchQuery("");
                      }
                    }}
                    className={`flex flex-col items-center justify-center h-14 w-14 rounded-2xl gap-1 transition-all duration-500 ease-in-out ${
                      isActive ? "bg-white/20" : "hover:bg-white/10"
                    }`}
                  >
                    <IconComponent className='w-6 h-6 transition-all duration-300' style={{ color: isActive ? "white" : textColor }} />
                    <span
                      className={`text-xs font-medium whitespace-nowrap transition-all duration-300 ${isSearchExpanded ? "hidden" : "block"}`}
                      style={{ color: isActive ? "white" : textColor }}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Morphing Search Container (Unchanged) */}
        <div className={`liquid-glass-wrapper rounded-full transition-all duration-500 ease-in-out ${isSearchExpanded ? "w-full max-w-[280px]" : "w-16"}`}>
          <div className='liquid-glass-background rounded-full'></div>
          <form
            onSubmit={handleSearchSubmit}
            className={`liquid-glass-content ${isDark ? "dark" : ""} ${
              fallbackGlass ? "backdrop-blur-3xl" : ""
            } h-16 rounded-full flex items-center transition-all duration-500 ease-in-out ${isSearchExpanded ? "px-4 gap-2" : "px-0 justify-center"}`}
          >
            <Search
              className={`flex-shrink-0 transition-all duration-300 ease-in-out ${isSearchExpanded ? "w-5 h-5" : "size-8"} ${!isSearchExpanded ? "cursor-pointer" : ""}`}
              style={{ color: textColor }}
              onClick={() => !isSearchExpanded && setIsSearchExpanded(true)}
            />
            <Input
              type='text'
              placeholder='search'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full h-full bg-transparent border-none p-0 focus:ring-0 focus:outline-none transition-all duration-300 ease-in-out ${
                isSearchExpanded ? "opacity-100" : "opacity-0 w-0"
              }`}
              style={{ color: textColor }}
              onClick={(e) => e.stopPropagation()}
              autoFocus={isSearchExpanded}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
