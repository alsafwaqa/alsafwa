import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {GREEN, LOGO_PLANE_CENTER} from '../brand';
import {Backdrop} from '../components/Backdrop';
import {LogoLayers} from '../components/LogoLayers';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const smooth = Easing.bezier(0.65, 0, 0.35, 1);

// Ending: the plane flies back and lands in its place in the logo
// (local frame 45, see flight.ts), the wordmarks write themselves in, and
// the complete, unaltered logo holds until the last frame.
export const LogoOutro: React.FC = () => {
	const frame = useCurrentFrame();
	const arabic = interpolate(frame, [32, 58], [0, 1], {...clamp, easing: smooth});
	const latin = interpolate(frame, [46, 66], [0, 1], {...clamp, easing: smooth});
	const plane = interpolate(frame, [45, 49], [0, 1], clamp);
	const ring = interpolate(frame, [45, 75], [0, 1], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});

	return (
		<AbsoluteFill>
			<Backdrop tone="white" dots={false} />
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<circle
					cx={LOGO_PLANE_CENTER.x}
					cy={LOGO_PLANE_CENTER.y}
					r={60 + 160 * ring}
					fill="none"
					stroke={GREEN}
					strokeWidth={3}
					opacity={ring > 0 ? (1 - ring) * 0.5 : 0}
				/>
			</svg>
			<LogoLayers arabic={arabic} latin={latin} plane={plane} />
		</AbsoluteFill>
	);
};
