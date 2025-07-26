import { useEffect, useState } from "react";

interface IOSVersion {
  major: number;
  minor: number;
  raw: string;
}

interface GlassSupport {
  isIOS: boolean;
  iosVersion: IOSVersion | null;
  isIOS26OrAbove: boolean;
  supportsSVGFilter: boolean;
  fallbackGlass: boolean;
  hideBottomBlur: boolean;
}

export function useLiquidGlassSupport(): GlassSupport {
  const [isIOS, setIsIOS] = useState(false);
  const [iosVersion, setIOSVersion] = useState<IOSVersion | null>(null);
  const [isIOS26OrAbove, setIsIOS26OrAbove] = useState(false);
  const [fallbackGlass, setFallbackGlass] = useState(false);
  const [hideBottomBlur, setHideBottomBlur] = useState(false);
  const [supportsSVGFilter, setSupportsSVGFilter] = useState(true); // keep it true unless explicitly tested

  useEffect(() => {
    if (typeof navigator === "undefined") return;

    const userAgent = navigator.userAgent.toLowerCase();

    // iOS Detection
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    let major = 0;
    let minor = 0;

    if (isIOSDevice) {
      const versionMatch = userAgent.match(/os (\d+)[._]?(\d+)?/);
      if (versionMatch) {
        major = parseInt(versionMatch[1], 10);
        minor = parseInt(versionMatch[2] || "0", 10);
        const raw = `${major}.${minor}`;
        setIOSVersion({ major, minor, raw });
        setIsIOS26OrAbove(major >= 26);
      }
    }

    // Detect Safari (exclude Chrome/Edge/Firefox on desktop or iOS)
    const isSafari =
      userAgent.includes("safari") &&
      !userAgent.includes("chrome") &&
      !userAgent.includes("crios") && // Chrome on iOS
      !userAgent.includes("fxios") && // Firefox on iOS
      !userAgent.includes("edgios"); // Edge on iOS

    // Detect Mobile Browsers (regardless of engine)
    const isMobileBrowser = /iphone|ipad|ipod|android|blackberry|windows phone|opera mini|mobile/.test(userAgent);

    // Fallback logic based on browser/device
    const shouldFallback = isSafari || isMobileBrowser;
    setFallbackGlass(shouldFallback);

    // Hide bottom blur logic
    if (isIOSDevice && major >= 26 && isSafari) {
      setHideBottomBlur(true);
    }
  }, []);

  return {
    isIOS,
    iosVersion,
    isIOS26OrAbove,
    supportsSVGFilter: !fallbackGlass, // in this approach, SVG = unsupported on fallback
    fallbackGlass,
    hideBottomBlur,
  };
}
