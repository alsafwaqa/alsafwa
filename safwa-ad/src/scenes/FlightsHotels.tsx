import React from 'react';
import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {GREEN, MINT, MINT_PALE, NAVY, NAVY_SOFT, WHITE} from '../brand';
import {SceneFrame} from '../components/SceneFrame';
import {Words} from '../components/Words';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const HORIZON = 1180;
const VANISH = {x: 540, y: HORIZON};

// [left, width, height, rise frame]
const TOWERS: [number, number, number, number][] = [
	[70, 110, 250, 34],
	[190, 130, 340, 40],
	[330, 90, 200, 46],
	[650, 100, 190, 52],
	[760, 140, 260, 44],
	[910, 100, 210, 58],
];

const Tower: React.FC<{readonly left: number; readonly w: number; readonly h: number; readonly at: number}> = ({
	left,
	w,
	h,
	at,
}) => {
	const frame = useCurrentFrame();
	const rise = interpolate(frame, [at, at + 26], [0, 1], {...clamp, easing: Easing.spring({damping: 14})});
	const cols = Math.max(2, Math.floor(w / 34));
	const rows = Math.floor((h - 40) / 40);
	return (
		<div
			style={{
				position: 'absolute',
				left,
				bottom: 0,
				width: w,
				height: h,
				translate: `0 ${(1 - rise) * (h + 10)}px`,
				background: `linear-gradient(180deg, ${NAVY_SOFT} 0%, ${NAVY} 100%)`,
				borderTopLeftRadius: 10,
				borderTopRightRadius: 10,
			}}
		>
			{Array.from({length: rows * cols}, (_, i) => {
				const r = Math.floor(i / cols);
				const c = i % cols;
				const on = interpolate(frame, [at + 24 + ((i * 7) % 23), at + 30 + ((i * 7) % 23)], [0, 1], clamp);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: 14 + c * ((w - 28) / cols) + 4,
							top: 26 + r * 40,
							width: (w - 28) / cols - 8,
							height: 18,
							borderRadius: 3,
							background: (r + c) % 3 === 0 ? MINT : WHITE,
							opacity: on * 0.75,
						}}
					/>
				);
			})}
		</div>
	);
};

// Flight and hotel bookings.
export const FlightsHotels: React.FC = () => {
	const frame = useCurrentFrame();
	const horizonLine = interpolate(frame, [0, 22], [0, 1], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});
	const ground = interpolate(frame, [4, 30], [0, 1], clamp);

	// Centre-line dashes stream towards the viewer (perspective).
	const dashes = Array.from({length: 9}, (_, i) => {
		const t = (i / 9 + frame * 0.012) % 1;
		const y = HORIZON + (1920 - HORIZON) * t * t;
		const len = 8 + 120 * t * t;
		const wid = 2 + 16 * t;
		return {y, len, wid};
	});

	return (
		<SceneFrame tone="paper" foreground={false}>
			<AbsoluteFill
				style={{
					top: HORIZON,
					background: `linear-gradient(180deg, ${MINT_PALE} 0%, #D2E9E0 100%)`,
					opacity: ground,
				}}
			/>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: ground}}>
				<polygon
					points={`${VANISH.x - 22},${HORIZON} ${VANISH.x + 22},${HORIZON} 820,1920 260,1920`}
					fill={NAVY}
					opacity={0.09}
				/>
				<line x1={VANISH.x - 22} y1={HORIZON} x2={260} y2={1920} stroke={NAVY} strokeWidth={4} opacity={0.3} />
				<line x1={VANISH.x + 22} y1={HORIZON} x2={820} y2={1920} stroke={NAVY} strokeWidth={4} opacity={0.3} />
				{dashes.map((d, i) => (
					<rect key={i} x={VANISH.x - d.wid / 2} y={d.y} width={d.wid} height={d.len} fill={WHITE} opacity={0.9} />
				))}
			</svg>
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: HORIZON, overflow: 'hidden'}}>
				{TOWERS.map(([left, w, h, at]) => (
					<Tower key={left} left={left} w={w} h={h} at={at} />
				))}
			</div>
			<div
				style={{
					position: 'absolute',
					top: HORIZON - 2,
					left: 540 - 540 * horizonLine,
					width: 1080 * horizonLine,
					height: 4,
					background: NAVY,
				}}
			/>
			<AbsoluteFill style={{alignItems: 'center'}}>
				<Interactive.Div
					name="Flights and hotels text"
					style={{position: 'absolute', top: 360, width: 940, display: 'flex', flexDirection: 'column', alignItems: 'center'}}
				>
					<Words text="حُجُوزَاتُ" start={20} exit={152} style={{fontSize: 132, fontWeight: 900, color: NAVY}} />
					<Words
						text="الطَّيَرَانِ وَالْفَنَادِقِ"
						start={32}
						stagger={9}
						exit={154}
						colors={{0: GREEN}}
						style={{fontSize: 90, fontWeight: 800, color: NAVY, marginTop: 0}}
					/>
				</Interactive.Div>
			</AbsoluteFill>
		</SceneFrame>
	);
};
