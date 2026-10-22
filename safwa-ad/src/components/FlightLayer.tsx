import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {LOGO_SCALE} from '../brand';
import {
	LOGO_HEADING,
	isCutBetween,
	planeColor,
	planeHeading,
	planeOpacity,
	planePosition,
	planeScale,
	planeSpeed,
} from '../flight';
import {PLANE_VIEWBOX, Plane} from './Plane';

const TRAIL_LENGTH = 16;

// The flying plane and its trail, drawn above every scene so it can carry
// the eye from one scene into the next.
export const FlightLayer: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();

	const opacity = planeOpacity(frame);
	if (opacity <= 0) return null;

	const pos = planePosition(frame);
	const heading = planeHeading(frame);
	const scale = planeScale(frame);
	const color = planeColor(frame);
	const speed = planeSpeed(frame);
	const stretch = Math.min(1, Math.max(0, (speed - 8) / 30));

	// Gentle float while hovering; fades out as the plane picks up speed.
	const bob = Math.sin(frame / 13) * 4 * Math.max(0, 1 - speed / 3);

	// No shadow while docked in the logo, so the hand-over to the raster
	// logo is invisible.
	const shadow = interpolate(frame, [92, 104, 1244, 1256], [0, 0.18, 0.18, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const w = PLANE_VIEWBOX.width * LOGO_SCALE * scale;
	const h = PLANE_VIEWBOX.height * LOGO_SCALE * scale;

	const trail: React.ReactNode[] = [];
	for (let d = 1; d <= TRAIL_LENGTH; d++) {
		if (isCutBetween(frame - d, frame)) break;
		const a = planePosition(frame - d + 1);
		const b = planePosition(frame - d);
		if (Math.hypot(a.x - b.x, a.y - b.y) < 0.5) continue;
		const fade = 1 - d / (TRAIL_LENGTH + 1);
		trail.push(
			<line
				key={d}
				x1={a.x}
				y1={a.y}
				x2={b.x}
				y2={b.y}
				stroke={color}
				strokeWidth={(2 + 7 * fade) * scale}
				strokeLinecap="round"
				opacity={0.55 * fade * fade}
			/>,
		);
	}

	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity}}>
			<svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
				{trail}
			</svg>
			<div
				style={{
					position: 'absolute',
					left: pos.x - w / 2,
					top: pos.y + bob - h / 2,
					width: w,
					height: h,
					rotate: `${heading - LOGO_HEADING}deg`,
					filter: `drop-shadow(0 ${10 * scale}px ${14 * scale}px rgba(16, 59, 71, ${shadow}))`,
				}}
			>
				<Plane color={color} width={w} stretch={stretch} />
			</div>
		</AbsoluteFill>
	);
};
