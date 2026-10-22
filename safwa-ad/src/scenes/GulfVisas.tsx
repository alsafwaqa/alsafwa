import React from 'react';
import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {FONT, GREEN, MINT, NAVY, WHITE} from '../brand';
import {SceneFrame} from '../components/SceneFrame';
import {Words} from '../components/Words';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// A card unfolds downwards (hinged on its top edge) as the plane lands on it.
const CountryCard: React.FC<{
	readonly name: string;
	readonly x: number;
	readonly y: number;
	readonly at: number;
	readonly exitAt: number;
}> = ({name, x, y, at, exitAt}) => {
	const frame = useCurrentFrame();
	const open = interpolate(frame, [at, at + 22], [0, 1], {...clamp, easing: Easing.spring({damping: 13})});
	const shown = interpolate(frame, [at, at + 6], [0, 1], clamp);
	const leave = interpolate(frame, [exitAt, exitAt + 16], [0, 1], {...clamp, easing: Easing.bezier(0.6, 0, 0.9, 0.4)});
	return (
		<div
			style={{
				position: 'absolute',
				left: x - 220,
				top: y - 115,
				width: 440,
				height: 230,
				transformOrigin: '50% 0%',
				transform: `perspective(1400px) rotateX(${(1 - open) * -88}deg)`,
				opacity: shown * (1 - leave),
				translate: `0 ${leave * 120}px`,
				borderRadius: 38,
				background: WHITE,
				boxShadow: `0 ${30 * open}px 60px rgba(4, 22, 28, ${0.35 * open})`,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				overflow: 'hidden',
			}}
		>
			<svg width={74} height={74} viewBox="0 0 74 74" style={{position: 'absolute', top: 0, right: 0}}>
				<path d="M 74 0 L 74 74 L 0 0 Z" fill={GREEN} />
			</svg>
			<div
				dir="rtl"
				lang="ar"
				style={{fontFamily: FONT, fontWeight: 800, fontSize: 56, color: NAVY, lineHeight: 1.7}}
			>
				{name}
			</div>
		</div>
	);
};

// Visas for Saudi Arabia, the UAE, Oman and Bahrain.
export const GulfVisas: React.FC = () => {
	const frame = useCurrentFrame();
	const route = interpolate(frame, [30, 110], [0, 1], clamp);
	const kicker = interpolate(frame, [6, 28], [0, 1], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});
	const out = interpolate(frame, [186, 200], [0, 1], clamp);

	return (
		<SceneFrame tone="navy" watermark>
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 1 - out}}>
				<defs>
					<mask id="route-mask">
						<path
							d="M 900 700 C 840 760 800 790 790 820 L 290 820 C 200 820 200 1100 290 1100 L 790 1100 C 880 1100 880 1380 790 1380 L 290 1380"
							fill="none"
							stroke="white"
							strokeWidth={12}
							pathLength={1}
							strokeDasharray={1}
							strokeDashoffset={1 - route}
						/>
					</mask>
				</defs>
				<path
					d="M 900 700 C 840 760 800 790 790 820 L 290 820 C 200 820 200 1100 290 1100 L 790 1100 C 880 1100 880 1380 790 1380 L 290 1380"
					fill="none"
					stroke={MINT}
					strokeWidth={4}
					strokeDasharray="4 18"
					strokeLinecap="round"
					opacity={0.55}
					mask="url(#route-mask)"
				/>
			</svg>
			<AbsoluteFill style={{alignItems: 'center'}}>
				<div
					style={{
						position: 'absolute',
						top: 420,
						width: 120 * kicker,
						height: 8,
						borderRadius: 4,
						background: GREEN,
						opacity: 1 - out,
					}}
				/>
				<Interactive.Div name="Visas title" style={{position: 'absolute', top: 440, width: 920}}>
					<Words text="تَأْشِيرَاتُ" start={8} exit={186} style={{fontSize: 138, fontWeight: 900, color: WHITE}} />
				</Interactive.Div>
			</AbsoluteFill>
			<CountryCard name="السُّعُودِيَّة" x={790} y={935} at={40} exitAt={182} />
			<CountryCard name="الْإِمَارَات" x={290} y={935} at={64} exitAt={186} />
			<CountryCard name="عُمَان" x={790} y={1215} at={96} exitAt={190} />
			<CountryCard name="الْبَحْرَيْن" x={290} y={1215} at={124} exitAt={194} />
		</SceneFrame>
	);
};
