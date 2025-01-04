import { useEffect, useState } from "react";

export function useMediaQuery() {
  const [device, setDevice] = useState<"mobile" | "sm" | "tablet" | "desktop" | null>(
    null
  );
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const checkDevice = () => {
      if (typeof window === 'undefined') return;
      
      if (window.matchMedia("(max-width: 640px)").matches) {
        setDevice("mobile");
      } else if (window.matchMedia("(max-width: 768px)").matches) {
        setDevice("sm");
      } else if (
        window.matchMedia("(min-width: 641px) and (max-width: 1024px)").matches
      ) {
        setDevice("tablet");
      } else {
        setDevice("desktop");
      }
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    // Initial detection
    checkDevice();

    // Debounced resize handler
    let timeoutId: NodeJS.Timeout;
    const debouncedCheckDevice = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkDevice, 100);
    };

    // Listener for window resize with debounce
    window.addEventListener("resize", debouncedCheckDevice);

    // Cleanup listener and timeout
    return () => {
      window.removeEventListener("resize", debouncedCheckDevice);
      clearTimeout(timeoutId);
    };
  }, []);

  return {
    device,
    width: dimensions?.width,
    height: dimensions?.height,
    isMobile: device === "mobile",
    isSm: device === "sm",
    isTablet: device === "tablet",
    isDesktop: device === "desktop",
  };
}
