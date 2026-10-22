import React from 'react';
import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {FONT, GREEN, NAVY, WHITE} from '../brand';
import {SceneFrame} from '../components/SceneFrame';
import {Words} from '../components/Words';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Routes from every direction gathering at one point: all the travel
// details in one place.
const ROUTES = [
	'M -40 300 C 200 420 360 760 540 960',
	'M 1120 260 C 900 420 700 700 540 960',
	'M -40 1500 C 220 1300 360 1100 540 960',
	'M 1120 1600 C 880 1360 700 1120 540 960',
	'M 540 1980 C 470 1600 600 1250 540 960',
];

// Generic chat bubble (not a third-party logo).
const ChatIcon = () => (
	<svg width={70} height={70} viewBox="0 0 70 70">
		<path
			d="M 35 8 C 52 8 64 19 64 33 C 64 47 52 58 35 58 C 30 58 26 57 22 55 L 9 61 L 13 49 C 8 44 6 39 6 33 C 6 19 18 8 35 8 Z"
			fill="none"
			stroke={WHITE}
			strokeWidth={5}
			strokeLinejoin="round"
		/>
		<circle cx={23} cy={33} r={4} fill={WHITE} />
		<circle cx={35} cy={33} r={4} fill={WHITE} />
		<circle cx={47} cy={33} r={4} fill={WHITE} />
	</svg>
);

// "All the details of your trip" → "Contact us on WhatsApp".
export const Closing: React.FC = () => {
	const frame = useCurrentFrame();
	const routes = interpolate(frame, [0, 40], [0, 1], {...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1)});
	const routesFade = interpolate(frame, [40, 80], [0.5, 0.18], clamp);
	const cta = interpolate(frame, [58, 80], [0, 1], {...clamp, easing: Easing.spring({damping: 12})});
	const pulse = (s: number) => interpolate(frame, [s, s + 30], [0, 1], clamp);

	return (
		<SceneFrame tone="mint">
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				{ROUTES.map((d) => (
					<path
						key={d}
						d={d}
						fill="none"
						stroke={GREEN}
						strokeWidth={4}
						strokeLinecap="round"
						pathLength={1}
						strokeDasharray={1}
						strokeDashoffset={1 - routes}
						opacity={routesFade}
					/>
				))}
			</svg>
			<AbsoluteFill style={{alignItems: 'center'}}>
				<Interactive.Div
					name="Closing line"
					style={{position: 'absolute', top: 470, width: 960, display: 'flex', flexDirection: 'column', alignItems: 'center'}}
				>
					<Words text="كُلُّ تَفَاصِيلِ" start={14} stagger={8} style={{fontSize: 110, fontWeight: 900, color: NAVY}} />
					<Words text="سَفَرِكَ" start={30} style={{fontSize: 160, fontWeight: 900, color: GREEN, marginTop: -16}} />
				</Interactive.Div>
				{[96, 124].map((s) => (
					<div
						key={s}
						style={{
							position: 'absolute',
							top: 1110,
							width: 860,
							height: 140,
							borderRadius: 999,
							border: `4px solid ${GREEN}`,
							scale: String(1 + 0.18 * pulse(s)),
							opacity: pulse(s) > 0 ? (1 - pulse(s)) * 0.6 : 0,
						}}
					/>
				))}
				<Interactive.Div
					name="WhatsApp call to action"
					style={{
						position: 'absolute',
						top: 1110,
						height: 140,
						padding: '0 54px',
						borderRadius: 999,
						background: GREEN,
						boxShadow: '0 24px 50px rgba(8, 126, 99, 0.35)',
						display: 'flex',
						flexDirection: 'row-reverse',
						alignItems: 'center',
						gap: 24,
						opacity: interpolate(frame, [56, 62], [0, 1], clamp),
						scale: String(0.6 + 0.4 * cta),
					}}
				>
					<ChatIcon />
					<div dir="rtl" lang="ar" style={{fontFamily: FONT}}>
						<Words text="تَوَاصَلْ مَعَنَا عَبْرَ وَاتْسَاب" start={64} stagger={6} style={{fontSize: 50, fontWeight: 800, color: WHITE}} />
					</div>
				</Interactive.Div>
			</AbsoluteFill>
		</SceneFrame>
	);
};
