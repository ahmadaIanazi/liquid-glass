import { useEffect, useState } from "react";

interface LiquidGlassSupport {
  supportsBackdropFilter: boolean;
  supportsSVGFilter: boolean;
  isMobile: boolean;
  fallbackGlass: boolean;
}

export function useLiquidGlassSupport(): LiquidGlassSupport {
  const [support, setSupport] = useState<LiquidGlassSupport>({
    supportsBackdropFilter: false,
    supportsSVGFilter: false,
    isMobile: false,
    fallbackGlass: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check for backdrop-filter support
    const supportsBackdropFilter = CSS.supports("backdrop-filter", "blur(1px)") || CSS.supports("-webkit-backdrop-filter", "blur(1px)");

    // Check for SVG filter support
    const supportsSVGFilter = CSS.supports("filter", "url(#test)");

    // Check if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

    // Determine if we need fallback glass
    const fallbackGlass = !supportsBackdropFilter || isMobile;

    setSupport({
      supportsBackdropFilter,
      supportsSVGFilter,
      isMobile,
      fallbackGlass,
    });
  }, []);

  return support;
}
