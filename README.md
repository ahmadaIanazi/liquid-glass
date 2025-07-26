# Liquid Glass Demo

A minimal, focused demo showcasing Apple's new Liquid Glass material effect using TailwindCSS and SVG filters with advanced multi-sensor background detection.

## Demo

liquid-glass-demo.vercel.app [https://liquid-glass-demo.vercel.app]

## ✨ Features

- **Liquid Glass Effect**: Dynamic glass material with backdrop blur and SVG filters
- **Multi-Sensor Background Detection**: Advanced pixel-based rendering for accurate background analysis
- **Smart Color Adaptation**: Automatic text and icon color adaptation based on background brightness
- **Gradient Blur Effects**: iOS 26/macOS 26 style blur gradients
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Cross-browser Compatibility**: Optimized for Chrome, Safari, and mobile browsers
- **Performance Optimized**: Throttled analysis with configurable intervals

## 🎨 Demo Structure

```
┌─────────────────────┐
│   TopNavigationBar  │ ← Top navigation with adaptive colors
├─────────────────────┤
│                     │
│   Scrollable        │ ← Main content area
│   Content Area      │   (diverse backgrounds for testing)
│                     │
├─────────────────────┤
│   BottomNavbar      │ ← Bottom navigation with search
└─────────────────────┘
│   BottomSheet       │ ← Settings/controls
└─────────────────────┘
```

## 🚀 Getting Started

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Run the development server**:

   ```bash
   pnpm dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## 🔍 Multi-Sensor System

### Overview

The Liquid Glass Demo uses an advanced multi-sensor system that captures pixel data from specific areas of the screen to determine background brightness. This approach provides the most accurate results for images, gradients, and complex backgrounds.

### Why Pixel Rendering?

We use `html2canvas` for pixel-based analysis because:

- **Image Compatibility**: Works with any image format (JPG, PNG, WebP, etc.)
- **Gradient Accuracy**: Captures actual rendered gradients, not just CSS values
- **Complex Backgrounds**: Handles overlays, patterns, and mixed content
- **Cross-browser Support**: Consistent results across different browsers
- **Real-time Analysis**: Sees the final rendered output, not just CSS properties

### Sensor Configuration

Each sensor can be configured with specific positioning, thresholds, and debug options:

```typescript
interface SensorConfig {
  id: string; // Unique identifier for the sensor
  position: {
    top?: number | string; // Distance from top (px or %)
    bottom?: number | string; // Distance from bottom (px or %)
    left?: number | string; // Distance from left (px or %)
    right?: number | string; // Distance from right (px or %)
    width?: number | string; // Sensor width (px or %)
    height?: number | string; // Sensor height (px or %)
  };
  threshold?: number; // Brightness threshold (0-1, default: 0.55)
  debug?: boolean; // Enable debug visualization
}
```

### Usage Example

```typescript
import { useLiquidGlassMultiSensor } from "@/hooks/use-liquid-glass-multi-sensor";

export default function MyComponent() {
  // Configure multiple sensors
  const sensorOptions = useMemo(
    () => ({
      sensors: [
        {
          id: "top-nav",
          position: { top: 0, left: 0, right: 0, height: 60 },
          threshold: 0.55,
          debug: true, // Shows red border and sensor ID
        },
        {
          id: "bottom-nav",
          position: { bottom: 0, left: 0, right: 0, height: 80 },
          threshold: 0.75, // Higher threshold for bottom area
        },
        {
          id: "center-element",
          position: { top: "50%", left: "50%", width: 200, height: 100 },
          threshold: 0.6,
        },
      ],
      globalThreshold: 0.55, // Default threshold for all sensors
      globalDebug: false, // Global debug mode
      throttleInterval: 50, // Analysis interval in milliseconds
    }),
    []
  );

  // Initialize the multi-sensor system
  const { sensors, getSensorById } = useLiquidGlassMultiSensor(sensorOptions);

  // Get specific sensor results
  const topNavSensor = getSensorById("top-nav");
  const bottomNavSensor = getSensorById("bottom-nav");
  const centerElementSensor = getSensorById("center-element");

  return (
    <div>
      {/* Render all sensor components (invisible by default) */}
      {sensors.map((sensor) => (
        <sensor.SensorComponent key={sensor.id} />
      ))}

      {/* Use sensor results for adaptive UI */}
      <TopNavigationBar isDark={topNavSensor?.isDark ?? false} />
      <BottomNavbar isDark={bottomNavSensor?.isDark ?? false} />

      {/* Adaptive content */}
      <div className={`liquid-glass ${centerElementSensor?.isDark ? "dark" : ""}`}>
        <span style={{ color: centerElementSensor?.isDark ? "#ffffff" : "#000000" }}>Adaptive Text</span>
      </div>
    </div>
  );
}
```

### Sensor Results

Each sensor provides the following data:

```typescript
interface SensorResult {
  id: string; // Sensor identifier
  isDark: boolean; // Whether background is dark (below threshold)
  isLight: boolean; // Whether background is light (above threshold)
  brightness: number; // Calculated brightness (0-1)
  SensorComponent: React.ComponentType<{ className?: string }>; // Invisible sensor element
  debugInfo?: {
    // Available when debug is enabled
    sensorRect: DOMRect | null; // Sensor position and size
  };
}
```

### Performance Optimization

The system includes several performance optimizations:

- **Throttling**: Analysis is throttled to prevent excessive calculations
- **Pixel Sampling**: Only samples every 4th pixel for performance
- **Alpha Filtering**: Only considers fully opaque pixels (alpha > 200)
- **Stable References**: Uses React refs to prevent unnecessary re-renders
- **Configurable Intervals**: Adjustable throttle interval (default: 50ms)

### Debug Mode

Enable debug mode to visualize sensors:

```typescript
// Individual sensor debug
{
  id: "my-sensor",
  position: { top: 0, left: 0, width: 100, height: 50 },
  debug: true, // Shows red border and sensor ID
}

// Global debug for all sensors
{
  sensors: [...],
  globalDebug: true,
}
```

Debug mode displays:

- Red dashed border around sensor area
- Semi-transparent red background
- Sensor ID text in the center
- Console logs with analysis results

## 🧪 Testing the Liquid Glass Effect

The demo includes 10 diverse sections for comprehensive testing:

1. **Light Section**: Blue gradient for testing light text adaptation
2. **Image Card 1**: Dark gradient with image overlay
3. **Colorful Section**: Vibrant purple-pink-red gradient
4. **Pure Image**: Full image background without overlays
5. **Pattern Section**: Complex background with geometric shapes
6. **Image Card 2**: Image with gradient overlay
7. **Cool Section**: Teal-cyan-blue gradient
8. **Icons Section**: Grid of icons with image background
9. **Pure Image 2**: Another full image background
10. **Final Section**: Neutral gray gradient

Scroll through these sections to see the liquid glass elements dynamically adapt their colors based on the detected background brightness.

## 🔧 Technical Implementation

### Core Technologies

- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS with custom liquid glass classes
- **UI Components**: Shadcn/ui
- **Effects**: SVG filters, backdrop-filter, CSS gradients
- **Background Analysis**: html2canvas for pixel-based detection
- **State Management**: React hooks with optimized re-renders

### Key Components

- `LiquidGlassFilters.tsx`: SVG filters and CSS classes for the glass effect
- `use-liquid-glass-multi-sensor.tsx`: Advanced multi-sensor hook
- `TopNavigationBar.tsx`: Adaptive top navigation
- `BottomNavbar.tsx`: Bottom navigation with search functionality
- `BottomSheet.tsx`: Settings and controls panel

### CSS Classes

The liquid glass effect uses these TailwindCSS classes:

```css
.liquid-glass-wrapper {
  @apply relative overflow-hidden;
}

.liquid-glass-background {
  @apply absolute inset-0 backdrop-blur-xl bg-white/10 dark:bg-black/10;
  filter: url(#liquid-glass);
}

.liquid-glass-content {
  @apply relative z-10 flex items-center gap-2;
}

.liquid-glass-content.dark {
  @apply text-white;
}
```

## 📱 Browser Support

- ✅ **Chrome** (Desktop & Mobile) - Full support
- ✅ **Safari** (Desktop & Mobile) - Full support with fallbacks
- ✅ **Firefox** - Full support with fallbacks
- ✅ **Edge** - Full support with fallbacks

### Fallback Behavior

When `html2canvas` is not available or fails:

- Uses default brightness value (0.5)
- Maintains UI functionality
- Gracefully degrades without breaking

## 🎨 Customization

### Liquid Glass Effect

Customize the glass effect by modifying `LiquidGlassFilters.tsx`:

```css
/* Adjust blur intensity */
backdrop-blur-xl  /* Change to backdrop-blur-md, backdrop-blur-2xl, etc. */

/* Modify transparency */
bg-white/10       /* Change opacity (10, 20, 30, etc.) */

/* Customize thresholds */
threshold: 0.55   /* Adjust sensitivity (0.3-0.8 recommended) */
```

### Sensor Positioning

Use flexible positioning for any layout:

```typescript
// Fixed positioning
position: { top: 0, left: 0, width: 100, height: 50 }

// Percentage positioning
position: { top: "50%", left: "50%", width: "200px", height: "100px" }

// Mixed positioning
position: { top: 0, bottom: 0, left: 0, right: 0 } // Full screen
```

### Performance Tuning

Adjust performance settings:

```typescript
{
  throttleInterval: 100,  // Slower but more performant
  // or
  throttleInterval: 25,   // Faster but more CPU intensive
}
```

## 🚀 Deployment

The demo is optimized for deployment on Vercel, Netlify, or any static hosting platform:

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
