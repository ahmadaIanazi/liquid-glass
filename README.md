# Liquid Glass Demo

A minimal, focused demo showcasing Apple's new Liquid Glass material effect using TailwindCSS and SVG filters.

## ✨ Features

- **Liquid Glass Effect**: Dynamic glass material with backdrop blur and SVG filters
- **Smart Background Detection**: Automatic text color adaptation based on background brightness
- **Gradient Blur Effects**: iOS 26/macOS 26 style blur gradients
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Cross-browser Compatibility**: Optimized for Chrome, Safari, and mobile browsers

## 🎨 Demo Structure

```
┌─────────────────────┐
│     ActionBar       │ ← Top navigation
├─────────────────────┤
│                     │
│   Scrollable        │ ← Main content area
│   Content Area      │   (diverse backgrounds)
│                     │
├─────────────────────┤
│  DynamicFloating    │ ← Bottom navigation
│     Button          │
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

## 🧪 Testing the Liquid Glass Effect

The demo includes 8 different sections with varying backgrounds:

1. **Light Section**: Blue gradient for testing light text
2. **Dark Section**: Dark gradient for testing white text
3. **Colorful Section**: Vibrant purple-pink-red gradient
4. **Pattern Section**: Complex background with geometric shapes
5. **Warm Section**: Yellow-orange-red gradient
6. **Cool Section**: Teal-cyan-blue gradient
7. **Icons Section**: Grid of icons with indigo-purple-pink background
8. **Final Section**: Neutral gray gradient

Scroll through these sections to see the liquid glass element dynamically adapt its text color and appearance based on the background.

## 🔧 Technical Implementation

- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS with custom liquid glass classes
- **UI Components**: Shadcn/ui
- **Effects**: SVG filters, backdrop-filter, CSS gradients
- **State Management**: React hooks for background detection

## 📱 Browser Support

- ✅ Chrome (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Firefox (with fallbacks)
- ✅ Edge (with fallbacks)

## 🎯 Core Components

- `LiquidGlassFilters.tsx`: SVG filters and CSS classes for the glass effect
- `useSmartBackgroundDetector.tsx`: Hook for detecting background brightness
- `DynamicFloatingButton.tsx`: Bottom navigation with liquid glass styling
- `ActionBar.tsx`: Top navigation bar
- `BottomSheet.tsx`: Settings and controls panel

## 🎨 Customization

The liquid glass effect can be customized by modifying the CSS classes in `LiquidGlassFilters.tsx`:

- Blur intensity
- Transparency levels
- Border styling
- Shadow effects
- Color adaptation thresholds
