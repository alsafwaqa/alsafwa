import React from "react";

// Vector version of the plane in the logo, traced from
// public/brand/logo-original.png. The viewBox uses the logo's own pixel
// grid (box at x=600, y=128 of the 840x352 logo), so at scale 1 it lies
// exactly on top of the plane in the raster logo.
export const PLANE_VIEWBOX = { width: 112, height: 108 };
const STROKE = 4.85;

const OUTLINE = "M 109 3 L 3 57 L 55 57 L 73 104 Z";
const FOLD = "M 55 57 L 109 3";
const SPEED_LINES = [
  { x1: 15, y1: 85, x2: 38, y2: 71 },
  { x1: 1, y1: 101, x2: 24, y2: 88 },
];

export const Plane: React.FC<{
  readonly color: string;
  // Width in px of the plane's box (112 logo px * scale).
  readonly width: number;
  // 0..1, draws the strokes in like a pen.
  readonly draw?: number;
  // 0..1, stretches the two speed lines backwards when flying fast.
  readonly stretch?: number;
  readonly style?: React.CSSProperties;
}> = ({ color, width, draw = 1, stretch = 0, style }) => {
  const height = (width / PLANE_VIEWBOX.width) * PLANE_VIEWBOX.height;
  const part = (from: number, to: number) =>
    Math.min(1, Math.max(0, (draw - from) / (to - from)));
  const outline = part(0, 0.62);
  const fold = part(0.45, 0.8);
  const lines = [part(0.7, 0.9), part(0.8, 1)];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${PLANE_VIEWBOX.width} ${PLANE_VIEWBOX.height}`}
      style={{ overflow: "visible", ...style }}
    >
      {/* Sub-pixel offset measured against the raster logo. */}
      <g transform="translate(-0.47 -0.83)">
        <path
          d={OUTLINE}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinejoin="miter"
          strokeMiterlimit={1.6}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - outline}
        />
        <path
          d={FOLD}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - fold}
        />
        {SPEED_LINES.map((l, i) => {
          const k = 1 + stretch * 1.6;
          const x1 = l.x2 - (l.x2 - l.x1) * k;
          const y1 = l.y2 - (l.y2 - l.y1) * k;
          return (
            <path
              key={i}
              d={`M ${x1} ${y1} L ${l.x2} ${l.y2}`}
              fill="none"
              stroke={color}
              strokeWidth={STROKE}
              strokeLinecap="butt"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={-(1 - lines[i])}
              opacity={1 - stretch * 0.25}
            />
          );
        })}
      </g>
    </svg>
  );
};
