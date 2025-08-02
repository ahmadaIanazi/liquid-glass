export function LiquidGlassFiltersSecond() {
  return (
    <svg style={{ display: "none" }}>
      <filter id='liquid-glass-filters-2' x='-10%' y='-10%' width='120%' height='120%'>
        {/* 1. Generate the base noise pattern */}
        <feTurbulence type='fractalNoise' baseFrequency='0.2' numOctaves='1' seed='50' result='noise' />

        {/* 2. Create TOP edge mask */}
        <feMorphology operator='erode' radius='10' in='SourceAlpha' result='eroded' />
        <feGaussianBlur in='eroded' stdDeviation='10' result='edgeBlur' />
        <feComposite operator='out' in='SourceAlpha' in2='edgeBlur' result='topEdgeGradient' />

        {/* 3. Create BOTTOM edge mask by using a different approach */}
        {/* Create a dilated version for bottom edge detection */}
        <feMorphology operator='dilate' radius='10' in='SourceAlpha' result='dilated' />
        <feGaussianBlur in='dilated' stdDeviation='10' result='dilatedBlur' />
        {/* Subtract original from dilated to get outer edge */}
        <feComposite operator='out' in='dilatedBlur' in2='SourceAlpha' result='outerEdge' />
        {/* Create bottom-focused gradient by combining with original shape */}
        <feComposite operator='in' in='outerEdge' in2='SourceAlpha' result='bottomEdgeGradient' />

        {/* 4. Alternative method: Create dual-edge mask using offset technique */}
        {/* Offset the source up to create top-heavy mask */}
        <feOffset in='SourceAlpha' dx='0' dy='-5' result='offsetUp' />
        {/* Offset the source down to create bottom-heavy mask */}
        <feOffset in='SourceAlpha' dx='0' dy='5' result='offsetDown' />

        {/* Combine offsets with original to create edge detection */}
        <feComposite operator='xor' in='offsetUp' in2='SourceAlpha' result='topEdgeDetect' />
        <feComposite operator='xor' in='offsetDown' in2='SourceAlpha' result='bottomEdgeDetect' />

        {/* Blur the edge detections for smooth gradients */}
        <feGaussianBlur in='topEdgeDetect' stdDeviation='8' result='topEdgeSmooth' />
        <feGaussianBlur in='bottomEdgeDetect' stdDeviation='8' result='bottomEdgeSmooth' />

        {/* Combine both edge masks */}
        <feComposite operator='screen' in='topEdgeSmooth' in2='bottomEdgeSmooth' result='dualEdgeMask' />

        {/* 5. Multiply the noise by the dual edge mask */}
        <feComposite in='noise' in2='dualEdgeMask' operator='arithmetic' k1='1' k2='0' k3='0' k4='0' result='maskedNoise' />

        {/* 6. Use the masked noise for displacement */}
        <feDisplacementMap in='SourceGraphic' in2='maskedNoise' scale='16' xChannelSelector='R' yChannelSelector='G' result='displaced' />

        {/* 7. Merge the displaced graphic and the lighting effect */}
        <feMerge>
          <feMergeNode in='displaced' />
          <feMergeNode in='maskedNoise' />
        </feMerge>
      </filter>
    </svg>
  );
}
