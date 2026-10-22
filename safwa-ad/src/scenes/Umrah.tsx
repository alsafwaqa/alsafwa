import React from 'react';
import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {GREEN, MINT, NAVY_SOFT, WHITE} from '../brand';
import {Plane} from '../components/Plane';
import {SceneFrame} from '../components/SceneFrame';
import {Words} from '../components/Words';
import {starPoints} from '../transitions/geometry';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const STAR = {x: 540, y: 720};
const ICON_X = 900;

const BusIcon = () => (
	<g fill="none" stroke={WHITE} strokeWidth={4.5} strokeLinejoin="round" strokeLinecap="round">
		<rect x={8} y={8} width={48} height={38} rx={8} />
		<path d="M 8 26 H 56" />
		<path d="M 18 16 H 46" />
		<circle cx={20} cy={50} r={5} fill={GREEN} />
		<circle cx={44} cy={50} r={5} fill={GREEN} />
	</g>
);

const PageIcon = () => (
	<g fill="none" stroke={WHITE} strokeWidth={4.5} strokeLinejoin="round" strokeLinecap="round">
		<path d="M 14 6 H 38 L 50 18 V 58 H 14 Z" />
		<path d="M 38 6 V 18 H 50" />
		<path d="M 22 30 H 42 M 22 39 H 42 M 22 48 H 34" />
	</g>
);

const Item: React.FC<{readonly y: number; readonly at: number; readonly text: string; readonly icon: React.ReactNode}> = ({
	y,
	at,
	text,
	icon,
}) => {
	const frame = useCurrentFrame();
	const pop = interpolate(frame, [at - 4, at + 14], [0, 1], {...clamp, easing: Easing.spring({damping: 11})});
	const out = interpolate(frame, [196, 210], [0, 1], clamp);
	return (
		<>
			<div
				style={{
					position: 'absolute',
					left: ICON_X - 56,
					top: y - 56,
					width: 112,
					height: 112,
					borderRadius: '50%',
					background: GREEN,
					boxShadow: '0 18px 40px rgba(0, 0, 0, 0.3)',
					scale: String(pop * (1 - out)),
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<svg width={64} height={64} viewBox="0 0 64 64" style={{overflow: 'visible'}}>
					{icon}
				</svg>
			</div>
			<div style={{position: 'absolute', right: 1080 - (ICON_X - 86), top: y - 62, width: 720, display: 'flex', justifyContent: 'flex-end'}}>
				<Words text={text} start={at} stagger={6} exit={196} style={{fontSize: 64, fontWeight: 800, color: WHITE, justifyContent: 'flex-start'}} />
			</div>
		</>
	);
};

// Umrah from Qatar: land convoys, flights and visas.
export const Umrah: React.FC = () => {
	const frame = useCurrentFrame();
	const draw = interpolate(frame, [8, 54], [0, 1], {...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1)});
	const rot = interpolate(frame, [0, 225], [0, 22]);
	const line = interpolate(frame, [80, 150], [0, 1], clamp);
	const out = interpolate(frame, [194, 210], [0, 1], clamp);

	return (
		<SceneFrame tone="navy">
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<defs>
					<radialGradient id="star-glow">
						<stop offset="0%" stopColor={MINT} stopOpacity={0.22} />
						<stop offset="100%" stopColor={MINT} stopOpacity={0} />
					</radialGradient>
				</defs>
				<g opacity={1 - out}>
					<circle cx={STAR.x} cy={STAR.y} r={460} fill="url(#star-glow)" opacity={draw} />
					<polygon
						points={starPoints(STAR.x, STAR.y, 400, -rot * 0.6)}
						fill="none"
						stroke={MINT}
						strokeWidth={2}
						opacity={0.25 * draw}
					/>
					<polygon points={starPoints(STAR.x, STAR.y, 300, rot)} fill={NAVY_SOFT} opacity={0.7 * draw} />
					<polygon
						points={starPoints(STAR.x, STAR.y, 300, rot)}
						fill="none"
						stroke={GREEN}
						strokeWidth={7}
						strokeLinejoin="miter"
						pathLength={1}
						strokeDasharray={1}
						strokeDashoffset={1 - draw}
					/>
					<polygon
						points={starPoints(STAR.x, STAR.y, 245, rot + 22.5)}
						fill="none"
						stroke={MINT}
						strokeWidth={2}
						opacity={0.35 * draw}
					/>
				</g>
				<line
					x1={ICON_X}
					y1={1090}
					x2={ICON_X}
					y2={1090 + 520 * line}
					stroke={MINT}
					strokeWidth={4}
					strokeDasharray="4 16"
					strokeLinecap="round"
					opacity={0.6 * (1 - out)}
				/>
			</svg>
			<AbsoluteFill style={{alignItems: 'center'}}>
				<Interactive.Div
					name="Umrah title"
					style={{position: 'absolute', top: 560, width: 900, display: 'flex', flexDirection: 'column', alignItems: 'center'}}
				>
					<Words text="الْعُمْرَةُ" start={16} exit={194} style={{fontSize: 118, fontWeight: 900, color: WHITE}} />
					<Words text="مِنْ قَطَرَ" start={28} stagger={7} exit={196} style={{fontSize: 78, fontWeight: 800, color: MINT, marginTop: -6}} />
				</Interactive.Div>
			</AbsoluteFill>
			<Item y={1170} at={99} text="حَمَلَاتٌ بَرِّيَّةٌ" icon={<BusIcon />} />
			<Item
				y={1350}
				at={121}
				text="رِحْلَاتُ طَيَرَانٍ"
				icon={
					<foreignObject x={0} y={2} width={64} height={62}>
						<Plane color={WHITE} width={64} />
					</foreignObject>
				}
			/>
			<Item y={1530} at={143} text="تَأْشِيرَاتٌ" icon={<PageIcon />} />
		</SceneFrame>
	);
};
