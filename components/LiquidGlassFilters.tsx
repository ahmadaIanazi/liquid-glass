// export function LiquidGlassFilters() {
//   return (
//     <svg style={{ display: "none" }}>
//       <filter id='lg-dist' x='-20%' y='-20%' width='140%' height='140%'>
//         {/*
//           STEP 1: Create the initial glass blur.
//           This replaces the CSS 'backdrop-filter' property.
//           It blurs the original content that's behind the element.
//         */}
//         <feGaussianBlur in='SourceGraphic' stdDeviation='5' result='initial-blur' />

//         {/* STEP 2: Generate the noise pattern for distortion */}
//         <feTurbulence type='fractalNoise' baseFrequency='0.02' numOctaves='1' seed='50' result='noise' />

//         {/* STEP 3: Create the edge mask to concentrate the effect */}
//         <feMorphology operator='erode' radius='4' in='SourceAlpha' result='eroded' />
//         <feGaussianBlur in='eroded' stdDeviation='5' result='edgeBlur' />
//         <feComposite operator='out' in='SourceAlpha' in2='edgeBlur' result='edgeGradient' />
//         <feComposite in='noise' in2='edgeGradient' operator='in' result='maskedNoise' />

//         {/* STEP 4: Displace the INITIALLY BLURRED image.
//           We use 'initial-blur' as the input, not 'SourceGraphic'.
//         */}
//         <feDisplacementMap in='initial-blur' in2='maskedNoise' scale='100' xChannelSelector='R' yChannelSelector='G' result='displaced' />

//         {/* STEP 5: Create lighting from the noise map */}
//         <feSpecularLighting in='maskedNoise' surfaceScale='5' specularConstant='0.75' specularExponent='20' lightingColor='#ffffff' result='specLight'>
//           <feDistantLight azimuth='45' elevation='60' />
//         </feSpecularLighting>

//         {/* STEP 6: Merge the displaced/distorted glass with the lighting */}
//         <feMerge>
//           <feMergeNode in='displaced' />
//           <feMergeNode in='specLight' />
//         </feMerge>
//       </filter>
//     </svg>
//   );
// }

export function LiquidGlassFilters() {
  return (
    <svg style={{ display: "none" }}>
      <filter id='lg-dist' x='-20%' y='-20%' width='140%' height='140%'>
        {/* 1. Generate the base noise pattern */}
        <feTurbulence type='fractalNoise' baseFrequency='0.008' numOctaves='1' seed='50' result='noise' />

        {/* 2. Create an edge mask. This is the key to the effect. */}
        {/* 'erode' shrinks the source shape. The radius controls how much it shrinks. */}
        <feMorphology operator='erode' radius='6' in='SourceAlpha' result='eroded' />
        {/* Blur the eroded shape to create a smooth gradient from the edge inwards. */}
        <feGaussianBlur in='eroded' stdDeviation='5' result='edgeBlur' />
        {/* 'out' operator cuts the blurred shape from the original, leaving only the blurred edge. */}
        <feComposite operator='out' in='SourceAlpha' in2='edgeBlur' result='edgeGradient' />

        {/* 3. Multiply the noise by the edge mask. */}
        {/* Where the mask is black (center), noise becomes 0. Where it's white (edge), noise is full strength. */}
        <feComposite in='noise' in2='edgeGradient' operator='arithmetic' k1='1' k2='0' k3='0' k4='0' result='maskedNoise' />

        {/* 4. Use the masked noise for displacement. */}
        {/* The distortion now only happens where the maskedNoise is not black. */}
        <feDisplacementMap in='SourceGraphic' in2='maskedNoise' scale='60' xChannelSelector='R' yChannelSelector='G' result='displaced' />

        {/* 5. Create the specular lighting effect from the masked noise */}
        <feSpecularLighting in='maskedNoise' surfaceScale='5' specularConstant='0.75' specularExponent='20' lightingColor='#ffffff' result='specLight'>
          <feDistantLight azimuth='45' elevation='60' />
        </feSpecularLighting>

        {/* 6. Merge the displaced graphic and the lighting effect */}
        {/* feMerge is the standard, most compatible way to layer filter results. */}
        <feMerge>
          <feMergeNode in='displaced' />
          <feMergeNode in='specLight' />
        </feMerge>
      </filter>
    </svg>
  );
}
