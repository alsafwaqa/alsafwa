import React from 'react';
import {AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {GREEN, MINT, MINT_PALE, NAVY, WHITE} from '../brand';
import {SceneFrame} from '../components/SceneFrame';
import {Words} from '../components/Words';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const SHIELD =
	'M 540 1010 L 740 1080 L 740 1250 C 740 1370 650 1440 540 1485 C 430 1440 340 1370 340 1250 L 340 1080 Z';

// Help with security approvals for Egypt: a shield (security) holding a
// simple line drawing of the pyramids (Egypt). No document is depicted.
export const Egypt: React.FC = () => {
	const frame = useCurrentFrame();
	const outline = interpolate(frame, [6, 44], [0, 1], {...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1)});
	const fill = interpolate(frame, [36, 60], [0, 1], clamp);
	const pyramids = interpolate(frame, [48, 80], [0, 1], {...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1)});
	const sun = interpolate(frame, [70, 86], [0, 1], {...clamp, easing: Easing.spring({damping: 12})});
	const lift = interpolate(frame, [14, 60], [40, 0], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});

	return (
		<SceneFrame tone="paper">
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, translate: `0 ${lift}px`}}>
				<defs>
					<linearGradient id="shield-fill" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor={WHITE} />
						<stop offset="100%" stopColor={MINT_PALE} />
					</linearGradient>
					<filter id="shield-shadow" x="-30%" y="-30%" width="160%" height="160%">
						<feDropShadow dx={0} dy={30} stdDeviation={30} floodColor={NAVY} floodOpacity={0.18} />
					</filter>
				</defs>
				<path d={SHIELD} fill="url(#shield-fill)" opacity={fill} filter="url(#shield-shadow)" />
				<path
					d={SHIELD}
					fill="none"
					stroke={NAVY}
					strokeWidth={7}
					strokeLinejoin="round"
					pathLength={1}
					strokeDasharray={1}
					strokeDashoffset={1 - outline}
				/>
				<circle cx={460} cy={1170} r={24 * sun} fill={MINT} />
				<g fill="none" stroke={GREEN} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round">
					<path
						d="M 410 1350 L 520 1185 L 630 1350"
						pathLength={1}
						strokeDasharray={1}
						strokeDashoffset={1 - pyramids}
					/>
					<path
						d="M 585 1350 L 650 1255 L 700 1330"
						pathLength={1}
						strokeDasharray={1}
						strokeDashoffset={1 - pyramids}
					/>
					<path d="M 390 1350 H 690" opacity={pyramids} />
				</g>
			</svg>
			<AbsoluteFill style={{alignItems: 'center'}}>
				<Interactive.Div
					name="Egypt text"
					style={{position: 'absolute', top: 360, width: 960, display: 'flex', flexDirection: 'column', alignItems: 'center'}}
				>
					<Words text="نُسَاعِدُكَ فِي" start={8} stagger={6} exit={126} style={{fontSize: 70, fontWeight: 700, color: NAVY}} />
					<Words
						text="الْمُوَافَقَاتِ الْأَمْنِيَّةِ"
						start={20}
						stagger={8}
						exit={128}
						style={{fontSize: 86, fontWeight: 900, color: GREEN, marginTop: 0}}
					/>
					<Words text="لِمِصْرَ" start={36} exit={130} style={{fontSize: 120, fontWeight: 900, color: NAVY, marginTop: 0}} />
				</Interactive.Div>
			</AbsoluteFill>
		</SceneFrame>
	);
};
