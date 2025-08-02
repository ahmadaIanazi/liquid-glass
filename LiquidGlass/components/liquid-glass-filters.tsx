export function LiquidGlassFilters() {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' version='1.1' style={{ display: "none" }}>
      <defs>
        <filter id='liquid-glass-border' x='-100%' y='-100%' width='300%' height='300%' filterUnits='userSpaceOnUse'>
          <feTurbulence type='turbulence' stitchTiles='noStitch' baseFrequency='0.001 0.001' numOctaves='0' seed='2' result='turbulence' />
          <feDisplacementMap in='SourceGraphic' in2='turbulence' scale='100' xChannelSelector='A' yChannelSelector='G' result='displacement' />
        </filter>

        {/* T - TOP */}
        <filter id='liquid-glass-edges-T' filterUnits='objectBoundingBox' primitiveUnits='objectBoundingBox' x='0' y='0' width='1' height='0.5'>
          <feTurbulence type='turbulence' baseFrequency='0.001' numOctaves='0' seed='2' stitchTiles='noStitch' result='turbulence' />

          <feDisplacementMap in='SourceGraphic' in2='turbulence' scale='8' xChannelSelector='R' yChannelSelector='G' result='displaced' />

          <feFlood floodColor='black' floodOpacity='1' result='black' />
          <feComposite in='displaced' in2='black' operator='in' result='clipped' />

          <feMerge>
            <feMergeNode in='clipped' />
          </feMerge>
        </filter>
        {/* B - BOTTOM */}
        <filter id='liquid-glass-edges-B' filterUnits='objectBoundingBox' primitiveUnits='objectBoundingBox' x='0' y='0.5' width='1' height='0.5'>
          <feTurbulence type='turbulence' baseFrequency='0.001' numOctaves='0' seed='2' stitchTiles='noStitch' result='turbulence' />

          <feDisplacementMap in='SourceGraphic' in2='turbulence' scale='-8' xChannelSelector='R' yChannelSelector='G' result='displaced' />

          <feFlood floodColor='black' floodOpacity='1' result='black' />
          <feComposite in='displaced' in2='black' operator='in' result='clipped' />

          <feMerge>
            <feMergeNode in='clipped' />
          </feMerge>
        </filter>

        <filter id='liquid-glass-edges-TR' filterUnits='objectBoundingBox' primitiveUnits='userSpaceOnUse' x='-100%' y='-100%' width='300%' height='300%'>
          <feTurbulence
            type='turbulence'
            baseFrequency='0.001 0.001'
            numOctaves='0'
            seed='2'
            stitchTiles='noStitch'
            x='0%'
            y='50%'
            width='100%'
            height='100%'
            result='turbulence'
          />
          <feDisplacementMap
            in='SourceGraphic'
            in2='turbulence'
            scale='10'
            xChannelSelector='R'
            yChannelSelector='B'
            x='50%'
            y='50%'
            width='200%'
            height='200%'
            result='displacementMap'
          />
        </filter>
      </defs>
    </svg>
  );
}
