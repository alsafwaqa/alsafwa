import React from 'react';
import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {GREEN, MINT_PALE, NAVY, WHITE} from '../brand';
import {SceneFrame} from '../components/SceneFrame';
import {Words} from '../components/Words';
import {ORBIT} from '../flight';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const G = {x: 540, y: 1180, r: 300};

// Destination dots on the globe: [x offset, y offset, appear frame].
const DOTS: [number, number, number][] = [
	[-150, -120, 34],
	[90, -170, 42],
	[180, -20, 50],
	[-60, 40, 58],
	[-200, 90, 66],
	[110, 150, 74],
	[20, -60, 82],
];

// "Other destinations: we help with the visa requirements". A turning
// globe with the plane in orbit around it (orbit synced with flight.ts).
export const OtherDestinations: React.FC = () => {
	const frame = useCurrentFrame();
	const outline = interpolate(frame, [4, 30], [0, 1], {...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1)});
	const grid = interpolate(frame, [16, 40], [0, 1], clamp);
	const spin = frame * 1.6;

	return (
		<SceneFrame tone="paper">
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<defs>
					<radialGradient id="globe-fill" cx="38%" cy="32%" r="75%">
						<stop offset="0%" stopColor={WHITE} />
						<stop offset="100%" stopColor={MINT_PALE} />
					</radialGradient>
					<clipPath id="globe-clip">
						<circle cx={G.x} cy={G.y} r={G.r} />
					</clipPath>
				</defs>
				<ellipse
					cx={G.x}
					cy={G.y + G.r + 40}
					rx={G.r * 0.8}
					ry={26}
					fill={NAVY}
					opacity={0.08 * grid}
				/>
				<circle cx={G.x} cy={G.y} r={G.r} fill="url(#globe-fill)" opacity={grid} />
				<g clipPath="url(#globe-clip)" opacity={grid}>
					{[-60, -30, 0, 30, 60].map((lat) => {
						const k = Math.cos((lat * Math.PI) / 180);
						return (
							<ellipse
								key={lat}
								cx={G.x}
								cy={G.y - G.r * Math.sin((lat * Math.PI) / 180)}
								rx={G.r * k}
								ry={G.r * k * 0.16}
								fill="none"
								stroke={NAVY}
								strokeWidth={2}
								opacity={0.22}
							/>
						);
					})}
					{[0, 30, 60, 90, 120, 150].map((lon) => {
						const a = ((lon + spin) % 180) * (Math.PI / 180);
						return (
							<ellipse
								key={lon}
								cx={G.x}
								cy={G.y}
								rx={Math.abs(G.r * Math.cos(a))}
								ry={G.r}
								fill="none"
								stroke={NAVY}
								strokeWidth={2}
								opacity={0.22}
							/>
						);
					})}
				</g>
				<circle
					cx={G.x}
					cy={G.y}
					r={G.r}
					fill="none"
					stroke={NAVY}
					strokeWidth={5}
					pathLength={1}
					strokeDasharray={1}
					strokeDashoffset={1 - outline}
					transform={`rotate(-90 ${G.x} ${G.y})`}
				/>
				{DOTS.map(([dx, dy, at]) => {
					const p = interpolate(frame, [at, at + 14], [0, 1], {...clamp, easing: Easing.spring({damping: 10})});
					const ring = interpolate(frame, [at + 4, at + 34], [0, 1], clamp);
					return (
						<g key={`${dx}-${dy}`}>
							<circle cx={G.x + dx} cy={G.y + dy} r={14 * p} fill={GREEN} />
							<circle
								cx={G.x + dx}
								cy={G.y + dy}
								r={14 + 30 * ring}
								fill="none"
								stroke={GREEN}
								strokeWidth={3}
								opacity={ring > 0 ? (1 - ring) * 0.8 : 0}
							/>
						</g>
					);
				})}
				<ellipse
					cx={ORBIT.cx}
					cy={ORBIT.cy}
					rx={ORBIT.rx}
					ry={ORBIT.ry}
					transform={`rotate(${(ORBIT.tilt * 180) / Math.PI} ${ORBIT.cx} ${ORBIT.cy})`}
					fill="none"
					stroke={GREEN}
					strokeWidth={3}
					strokeDasharray="3 16"
					strokeLinecap="round"
					opacity={0.5 * grid}
				/>
			</svg>
			<AbsoluteFill style={{alignItems: 'center'}}>
				<Interactive.Div
					name="Other destinations text"
					style={{position: 'absolute', top: 430, width: 940, display: 'flex', flexDirection: 'column', alignItems: 'center'}}
				>
					<Words text="وَلِوِجْهَاتٍ أُخْرَى" start={14} exit={134} style={{fontSize: 108, fontWeight: 900, color: NAVY}} />
					<Words
						text="نُسَاعِدُكَ فِي مُتَطَلَّبَاتِ التَّأْشِيرَةِ"
						start={30}
						stagger={6}
						exit={136}
						style={{fontSize: 54, fontWeight: 700, color: GREEN, marginTop: 6}}
					/>
				</Interactive.Div>
			</AbsoluteFill>
		</SceneFrame>
	);
};
