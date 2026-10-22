import React from 'react';
import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {GREEN, NAVY} from '../brand';
import {SceneFrame} from '../components/SceneFrame';
import {Words} from '../components/Words';
import {HOOK_MARKER} from '../flight';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// "Your destination starts here": the plane circles a point and draws a
// ring around it (frames synced with flight.ts); the point becomes the
// portal into the next scene.
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const {x, y, r} = HOOK_MARKER;

	// The plane circles from local frame 48 to 108 (global 158-218).
	const ring = interpolate(frame, [48, 96], [0, 1], clamp);
	const dot = interpolate(frame, [98, 116], [0, 1], {...clamp, easing: Easing.spring({damping: 11})});
	const pulse = (start: number) => interpolate(frame, [start, start + 34], [0, 1], clamp);

	return (
		<SceneFrame tone="mint">
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				{[260, 380, 520, 680].map((rad, i) => (
					<circle
						key={rad}
						cx={x}
						cy={y}
						r={rad * interpolate(frame, [0, 150], [0.94, 1.04])}
						fill="none"
						stroke={NAVY}
						strokeWidth={2}
						opacity={interpolate(frame, [0 + i * 5, 20 + i * 5], [0, 0.08 - i * 0.012], clamp)}
					/>
				))}
				<circle
					cx={x}
					cy={y}
					r={r}
					fill="none"
					stroke={GREEN}
					strokeWidth={6}
					strokeLinecap="round"
					pathLength={1}
					strokeDasharray={1}
					strokeDashoffset={1 - ring}
					transform={`rotate(180 ${x} ${y})`}
				/>
				{[100, 118].map((s) => (
					<circle
						key={s}
						cx={x}
						cy={y}
						r={34 + 120 * pulse(s)}
						fill="none"
						stroke={GREEN}
						strokeWidth={4}
						opacity={(1 - pulse(s)) * (pulse(s) > 0 ? 0.7 : 0)}
					/>
				))}
				<circle cx={x} cy={y} r={34 * dot} fill={NAVY} />
			</svg>
			<AbsoluteFill style={{alignItems: 'center'}}>
				<Interactive.Div
					name="Hook text"
					style={{position: 'absolute', top: 470, width: 920, display: 'flex', flexDirection: 'column', alignItems: 'center'}}
				>
					<Words text="وِجْهَتُكَ" start={6} exit={126} style={{fontSize: 158, fontWeight: 900, color: NAVY}} />
					<Words
						text="تَبْدَأُ مِنْ هُنَا"
						start={14}
						stagger={7}
						exit={128}
						colors={{2: GREEN}}
						style={{fontSize: 106, fontWeight: 800, color: NAVY, marginTop: 0}}
					/>
				</Interactive.Div>
			</AbsoluteFill>
		</SceneFrame>
	);
};
