# GradientBlur Component

A flexible, configurable gradient blur component that creates beautiful backdrop blur effects with customizable positions, sizes, and intensities.

## Features

- 🎨 **Multiple Positions**: Top, bottom, left, right, absolute, relative
- 📏 **Flexible Sizing**: Predefined height/width variants or custom values
- 🌊 **Direction Control**: Gradient direction (to-bottom, to-top, to-left, to-right)
- 💪 **Intensity Levels**: Light, medium, heavy blur effects
- 🎯 **Custom Gradients**: Override default gradients with custom mask gradients
- 🔧 **Full Customization**: Custom height, width, z-index, and styles
- 🎪 **Shadcn Compatible**: Uses class-variance-authority for consistent theming

## Basic Usage

```tsx
import { GradientBlur } from "./gradient-blur";

// Basic top blur
<GradientBlur position="top" />

// Basic bottom blur
<GradientBlur position="bottom" />

// Multiple blurs for full coverage
<div className="relative">
  <GradientBlur position="top" />
  <GradientBlur position="bottom" />
</div>
```

## Props

| Prop           | Type                                                                 | Default       | Description                                |
| -------------- | -------------------------------------------------------------------- | ------------- | ------------------------------------------ |
| `position`     | `"top" \| "bottom" \| "left" \| "right" \| "absolute" \| "relative"` | `"top"`       | Position of the blur element               |
| `height`       | `"sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl" \| "full" \| "auto"` | `"md"`        | Height variant                             |
| `width`        | `"sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl" \| "full" \| "auto"` | `"full"`      | Width variant                              |
| `direction`    | `"to-bottom" \| "to-top" \| "to-left" \| "to-right"`                 | `"to-bottom"` | Gradient direction                         |
| `intensity`    | `"light" \| "medium" \| "heavy"`                                     | `"medium"`    | Blur intensity                             |
| `customHeight` | `string`                                                             | -             | Custom height (overrides height variant)   |
| `customWidth`  | `string`                                                             | -             | Custom width (overrides width variant)     |
| `maskGradient` | `string`                                                             | -             | Custom mask gradient (overrides direction) |
| `zIndex`       | `number`                                                             | -             | Custom z-index                             |
| `className`    | `string`                                                             | -             | Additional CSS classes                     |
| `style`        | `CSSProperties`                                                      | -             | Additional inline styles                   |
| `children`     | `ReactNode`                                                          | -             | Child elements                             |

## Position Variants

### Fixed Positions

- `top`: Fixed to top of viewport
- `bottom`: Fixed to bottom of viewport
- `left`: Fixed to left side of viewport
- `right`: Fixed to right side of viewport

### Relative Positions

- `absolute`: Absolutely positioned within parent
- `relative`: Relatively positioned within parent

## Size Variants

### Height Variants

- `sm`: 2rem (32px)
- `md`: 4rem (64px)
- `lg`: 6rem (96px)
- `xl`: 8rem (128px)
- `2xl`: 12rem (192px)
- `3xl`: 16rem (256px)
- `full`: 100% height
- `auto`: Auto height

### Width Variants

- `sm`: 2rem (32px)
- `md`: 4rem (64px)
- `lg`: 6rem (96px)
- `xl`: 8rem (128px)
- `2xl`: 12rem (192px)
- `3xl`: 16rem (256px)
- `full`: 100% width
- `auto`: Auto width

## Intensity Levels

- `light`: 8px blur
- `medium`: 16px blur (default)
- `heavy`: 24px blur

## Advanced Examples

### Custom Dimensions

```tsx
<GradientBlur position='top' customHeight='100px' customWidth='200px' style={{ left: "50%", transform: "translateX(-50%)" }} />
```

### Custom Gradient

```tsx
<GradientBlur position='top' maskGradient='linear-gradient(to top, rgba(255, 0, 0, 0), rgba(255, 0, 0, 0.8) 50%, rgba(255, 0, 0, 1) 100%)' />
```

### Multiple Blurs

```tsx
<div className='relative'>
  <GradientBlur position='top' height='lg' />
  <GradientBlur position='bottom' height='lg' />
  <GradientBlur position='left' width='lg' />
  <GradientBlur position='right' width='lg' />
</div>
```

### Card with Blur Edges

```tsx
<div className='relative bg-white/20 rounded-lg overflow-hidden'>
  <div className='p-6'>
    <h3>Card Content</h3>
    <p>Your content here...</p>
  </div>
  <GradientBlur position='top' height='md' />
  <GradientBlur position='bottom' height='md' />
</div>
```

### Sidebar with Blur

```tsx
<div className='relative h-screen'>
  <div className='absolute right-0 top-0 h-full w-64 bg-white/20'>
    <div className='p-4'>
      <h3>Sidebar Content</h3>
    </div>
    <GradientBlur position='left' width='lg' />
  </div>
</div>
```

## CSS Classes

The component uses Tailwind CSS classes and generates the following:

- `backdrop-blur-[8px]` / `backdrop-blur-[16px]` / `backdrop-blur-[24px]` for blur intensity
- `fixed` / `absolute` / `relative` for positioning
- `top-0` / `bottom-0` / `left-0` / `right-0` for positioning
- `w-full` / `h-full` / `w-16` / `h-16` etc. for sizing
- Custom mask gradients via inline styles

## Browser Support

- ✅ Chrome/Edge (backdrop-filter support)
- ✅ Safari (backdrop-filter support)
- ✅ Firefox (backdrop-filter support)
- ⚠️ Older browsers fall back gracefully

## Performance

- Uses CSS `backdrop-filter` for hardware acceleration
- Minimal DOM elements
- Efficient re-renders with React.memo pattern
- No JavaScript calculations during render

## Accessibility

- Non-interactive element
- Does not interfere with screen readers
- Maintains content visibility
- Respects reduced motion preferences

## Migration from CSS

If you were using the old CSS classes:

```css
/* Old CSS */
.gradient-blur-to-bottom {
  ...;
}
.gradient-blur-to-top {
  ...;
}
```

Replace with:

```tsx
// New Component
<GradientBlur position="top" />
<GradientBlur position="bottom" />
```
