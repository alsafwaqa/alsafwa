import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {GREEN, LOGO_PLANE_CENTER, LOGO_SCALE} from '../brand';
import {Backdrop} from '../components/Backdrop';
import {LogoLayers} from '../components/LogoLayers';
import {PLANE_VIEWBOX, Plane} from '../components/Plane';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const smooth = Easing.bezier(0.65, 0, 0.35, 1);

// Opening: the logo assembles itself. The plane is drawn like a pen
// stroke, then the wordmarks are revealed in their reading directions.
// After a clear hold on the complete logo, the plane takes off (see
// flight.ts) and the wordmark recedes into depth.
export const LogoIntro: React.FC = () => {
	const frame = useCurrentFrame();

	const draw = interpolate(frame, [0, 24], [0, 1], {...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1)});
	const arabic = interpolate(frame, [6, 34], [0, 1], {...clamp, easing: smooth});
	const latin = interpolate(frame, [22, 46], [0, 1], {...clamp, easing: smooth});
	// Raster plane fades in over the drawn vector, and hands over to the
	// flying vector plane at take-off (frame 90).
	const rasterPlane = interpolate(frame, [20, 28, 90, 92], [0, 1, 1, 0], clamp);
	const vectorPlane = interpolate(frame, [20, 28], [1, 0], clamp);

	const recede = interpolate(frame, [96, 128], [0, 1], {...clamp, easing: Easing.bezier(0.5, 0, 0.75, 0)});

	const w = PLANE_VIEWBOX.width * LOGO_SCALE;
	const h = PLANE_VIEWBOX.height * LOGO_SCALE;

	return (
		<AbsoluteFill>
			<Backdrop tone="white" dots={false} />
			<AbsoluteFill
				style={{
					scale: String(1 - 0.1 * recede),
					opacity: 1 - recede,
					filter: recede > 0 ? `blur(${recede * 10}px)` : undefined,
				}}
			>
				<LogoLayers arabic={arabic} latin={latin} plane={rasterPlane} />
			</AbsoluteFill>
			{vectorPlane > 0 ? (
				<div
					style={{
						position: 'absolute',
						left: LOGO_PLANE_CENTER.x - w / 2,
						top: LOGO_PLANE_CENTER.y - h / 2,
						opacity: vectorPlane,
					}}
				>
					<Plane color={GREEN} width={w} draw={draw} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};
