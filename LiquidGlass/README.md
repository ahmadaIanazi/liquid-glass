# LiquidGlass Component

A modern, accessible, and customizable liquid glass effect component built with React and TypeScript. Inspired by Apple's design language and built with ShadCN-style architecture.

## Features

- 🎨 **Multiple Variants**: Default, popup, button, card, pill, and input variants
- 📱 **Responsive Design**: Works seamlessly across all devices
- 🔧 **Customizable**: Easy to override with TailwindCSS classes
- ♿ **Accessible**: Built with accessibility in mind
- 🚀 **Performance Optimized**: Efficient rendering and animations
- 🌐 **Browser Support**: Automatic fallbacks for unsupported browsers

## Installation

```bash
# Copy the LiquidGlass folder to your project
# Import the component and provider
import { LiquidGlass, LiquidGlassProvider } from "@/LiquidGlass";
```

## Setup

Wrap your app with the `LiquidGlassProvider` to enable automatic sensor management:

```tsx
// In your root layout or app component
import { LiquidGlassProvider } from "@/LiquidGlass";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LiquidGlassProvider debug={false} globalThreshold={0.55}>
          {children}
        </LiquidGlassProvider>
      </body>
    </html>
  );
}
```

## Basic Usage

```tsx
import { LiquidGlass } from "@/LiquidGlass";

function MyComponent() {
  return (
    <LiquidGlass>
      <span>Hello, Liquid Glass!</span>
    </LiquidGlass>
  );
}
```

## Variants

### Default

```tsx
<LiquidGlass variant='default'>
  <span>Default liquid glass effect</span>
</LiquidGlass>
```

### Popup

```tsx
<LiquidGlass variant='popup' size='lg'>
  <div className='text-center'>
    <h3 className='text-xl font-bold mb-2'>Popup Title</h3>
    <p>This is a popup with enhanced shadow and larger border radius.</p>
  </div>
</LiquidGlass>
```

### Button

```tsx
<LiquidGlass variant='button' size='md'>
  <span>Click me!</span>
</LiquidGlass>
```

### Card

```tsx
<LiquidGlass variant='card' size='lg'>
  <div className='p-6'>
    <h2 className='text-2xl font-bold mb-4'>Card Title</h2>
    <p className='text-gray-600'>Card content goes here...</p>
  </div>
</LiquidGlass>
```

### Pill

```tsx
<LiquidGlass variant='pill' size='sm'>
  <span>Pill Badge</span>
</LiquidGlass>
```

### Input

```tsx
<LiquidGlass variant='input' size='md'>
  <input type='text' placeholder='Type something...' className='bg-transparent border-none outline-none w-full' />
</LiquidGlass>
```

## Sizes

- `sm`: Small (px-3 py-2 text-sm)
- `md`: Medium (px-4 py-3 text-base) - Default
- `lg`: Large (px-6 py-4 text-lg)
- `xl`: Extra Large (px-8 py-6 text-xl)
- `2xl`: 2X Large (px-10 py-8 text-2xl)

## LiquidGlassProvider Props

| Prop              | Type        | Default | Description                                 |
| ----------------- | ----------- | ------- | ------------------------------------------- |
| `debug`           | `boolean`   | `false` | Enable global debug mode for all components |
| `globalThreshold` | `number`    | `0.55`  | Global brightness threshold for dark mode   |
| `children`        | `ReactNode` | -       | The app content to wrap                     |

## LiquidGlass Component Props

| Prop        | Type                                                              | Default     | Description                                               |
| ----------- | ----------------------------------------------------------------- | ----------- | --------------------------------------------------------- |
| `variant`   | `'default' \| 'popup' \| 'button' \| 'card' \| 'pill' \| 'input'` | `'default'` | The visual variant of the component                       |
| `size`      | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'`                           | `'md'`      | The size of the component                                 |
| `intent`    | `'primary' \| 'secondary' \| 'ghost' \| 'outline'`                | `'primary'` | The intent/color scheme                                   |
| `disabled`  | `boolean`                                                         | `false`     | Whether the component is disabled                         |
| `loading`   | `boolean`                                                         | `false`     | Shows a loading spinner                                   |
| `asChild`   | `boolean`                                                         | `false`     | Whether to render as a child component                    |
| `debug`     | `boolean`                                                         | `false`     | Shows debug indicator and enables sensor debugging        |
| `fixed`     | `boolean`                                                         | `true`      | Whether to use fixed positioning (disable for containers) |
| `isDark`    | `boolean`                                                         | `false`     | Manual dark mode override                                 |
| `sensorId`  | `string`                                                          | -           | Custom sensor ID for this component                       |
| `className` | `string`                                                          | -           | Additional CSS classes                                    |
| `children`  | `ReactNode`                                                       | -           | The content to render inside                              |

## Advanced Usage

### Custom Styling

```tsx
<LiquidGlass variant='card' size='lg' className='w-96 h-64 bg-gradient-to-br from-blue-500 to-purple-600'>
  <div className='text-center'>
    <h2 className='text-3xl font-bold text-white mb-4'>Custom Styled</h2>
    <p className='text-white/80'>With custom background and dimensions</p>
  </div>
</LiquidGlass>
```

### Loading State

```tsx
<LiquidGlass variant='button' loading={true}>
  <span>Loading...</span>
</LiquidGlass>
```

### Disabled State

```tsx
<LiquidGlass variant='button' disabled={true}>
  <span>Disabled Button</span>
</LiquidGlass>
```

### As Child Component

```tsx
<LiquidGlass asChild>
  <button onClick={() => console.log("clicked")}>
    <span>Click me!</span>
  </button>
</LiquidGlass>
```

### Debug Mode

```tsx
<LiquidGlass debug={true} variant='card' size='lg'>
  <div className='p-4'>
    <h4 className='text-lg font-semibold mb-2'>Debug Enabled</h4>
    <p className='text-sm'>This component has sensor debugging enabled</p>
  </div>
</LiquidGlass>
```

### Fixed vs Static Positioning

```tsx
// Fixed positioning (default) - good for overlays, modals, floating elements
<LiquidGlass fixed={true} className="top-4 right-4">
  <span>Fixed positioned</span>
</LiquidGlass>

// Static positioning - good for containers, cards, inline elements
<LiquidGlass fixed={false} className="w-full">
  <span>Static positioned</span>
</LiquidGlass>
```

### Manual Dark Mode Override

```tsx
<LiquidGlass isDark={true} variant='button'>
  <span>Always dark mode</span>
</LiquidGlass>
```

## Browser Support

The component automatically detects browser capabilities and provides appropriate fallbacks:

- **Modern Browsers**: Full liquid glass effect with backdrop-filter and SVG filters
- **Mobile Devices**: Optimized fallback with enhanced backdrop-blur
- **Older Browsers**: Graceful degradation to basic glass effect

## CSS Classes

The component uses these CSS classes that you can customize:

- `.liquid-glass-wrapper`: Main container
- `.liquid-glass-background`: Background layer with blur effect
- `.liquid-glass-background-fallback`: Fallback background for unsupported browsers
- `.liquid-glass-content`: Content layer with styling

## Customization

### Override Default Styles

```css
/* In your global CSS */
.liquid-glass-content {
  /* Your custom styles */
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: 2px solid rgba(255, 255, 255, 0.2);
}
```

### TailwindCSS Override

```tsx
<LiquidGlass className='!bg-gradient-to-r !from-pink-500 !to-violet-500 !border-2 !border-white/20'>
  <span>Custom styled</span>
</LiquidGlass>
```

## Accessibility

- Proper ARIA attributes
- Keyboard navigation support
- Screen reader friendly
- Focus management
- High contrast support

## Performance

- Optimized re-renders with React.memo
- Efficient CSS transitions
- Minimal JavaScript overhead
- Automatic cleanup of event listeners

## Examples

### Navigation Bar

```tsx
<div className='flex gap-4 p-4'>
  <LiquidGlass variant='button' size='sm'>
    <span>Home</span>
  </LiquidGlass>
  <LiquidGlass variant='button' size='sm'>
    <span>About</span>
  </LiquidGlass>
  <LiquidGlass variant='button' size='sm'>
    <span>Contact</span>
  </LiquidGlass>
</div>
```

### Modal/Popup

```tsx
<LiquidGlass variant='popup' size='xl' className='w-96'>
  <div className='p-8 text-center'>
    <h2 className='text-2xl font-bold mb-4'>Welcome!</h2>
    <p className='mb-6'>This is a beautiful liquid glass popup.</p>
    <LiquidGlass variant='button' size='md'>
      <span>Get Started</span>
    </LiquidGlass>
  </div>
</LiquidGlass>
```

### Form Input

```tsx
<div className='space-y-4'>
  <LiquidGlass variant='input' size='md'>
    <input type='email' placeholder='Enter your email' className='bg-transparent border-none outline-none w-full' />
  </LiquidGlass>

  <LiquidGlass variant='input' size='md'>
    <input type='password' placeholder='Enter your password' className='bg-transparent border-none outline-none w-full' />
  </LiquidGlass>
</div>
```

## Contributing

Feel free to contribute to this component by:

- Reporting bugs
- Suggesting new features
- Submitting pull requests
- Improving documentation

## License

MIT License - feel free to use this component in your projects!
