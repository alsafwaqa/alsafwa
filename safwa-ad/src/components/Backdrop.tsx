import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {GREEN, MINT, MINT_PALE, NAVY, NAVY_SOFT, PAPER, WHITE} from '../brand';
import {Plane} from './Plane';

export type Tone = 'white' | 'paper' | 'mint' | 'navy';

const BASE: Record<Tone, string> = {
	white: `radial-gradient(circle at 50% 46%, ${WHITE} 0%, ${WHITE} 55%, ${PAPER} 100%)`,
	paper: `linear-gradient(180deg, ${WHITE} 0%, ${PAPER} 100%)`,
	mint: `radial-gradient(circle at 50% 40%, ${WHITE} 0%, ${MINT_PALE} 95%)`,
	navy: `radial-gradient(circle at 50% 34%, ${NAVY_SOFT} 0%, ${NAVY} 70%)`,
};

// Layered background: base colour, a slow dot grid, large soft discs that
// drift at different speeds (parallax) and, optionally, a giant faint
// outline of the logo plane. Gives the flat brand palette visual depth.
export const Backdrop: React.FC<{
	readonly tone: Tone;
	readonly watermark?: boolean;
	readonly dots?: boolean;
}> = ({tone, watermark = false, dots = true}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const dark = tone === 'navy';
	const disc = dark ? 'rgba(142, 216, 190, 0.07)' : 'rgba(8, 126, 99, 0.06)';
	const disc2 = dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(16, 59, 71, 0.045)';

	return (
		<AbsoluteFill style={{background: BASE[tone], overflow: 'hidden'}}>
			{dots ? (
				<AbsoluteFill
					style={{
						backgroundImage: `radial-gradient(circle, ${dark ? 'rgba(255,255,255,0.11)' : 'rgba(16,59,71,0.10)'} 2px, transparent 2.6px)`,
						backgroundSize: '54px 54px',
						backgroundPosition: `${frame * 0.25}px ${-frame * 0.4}px`,
						maskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 80%)',
					}}
				/>
			) : null}
			<div
				style={{
					position: 'absolute',
					width: 900,
					height: 900,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${disc} 0%, transparent 70%)`,
					left: -260 + frame * 0.6,
					top: 120 - frame * 0.3,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					width: 1200,
					height: 1200,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${disc2} 0%, transparent 70%)`,
					left: 380 - frame * 0.9,
					top: 1050 + frame * 0.2,
				}}
			/>
			{watermark ? (
				<div
					style={{
						position: 'absolute',
						left: width / 2 - 700,
						top: height / 2 - 700,
						width: 1400,
						height: 1400,
						opacity: dark ? 0.07 : 0.05,
						rotate: `${interpolate(frame, [0, 300], [-8, 6])}deg`,
						scale: String(interpolate(frame, [0, 300], [1, 1.08])),
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Plane color={dark ? MINT : GREEN} width={1100} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};

// Blurred discs that drift quickly in front of the content: the nearest
// depth layer.
export const Foreground: React.FC<{readonly tone: Tone}> = ({tone}) => {
	const frame = useCurrentFrame();
	const c = tone === 'navy' ? 'rgba(142, 216, 190, 0.10)' : 'rgba(8, 126, 99, 0.07)';
	return (
		<AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					width: 220,
					height: 220,
					borderRadius: '50%',
					background: c,
					filter: 'blur(26px)',
					left: 900 - frame * 2.2,
					top: 260 + frame * 0.8,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					width: 300,
					height: 300,
					borderRadius: '50%',
					background: c,
					filter: 'blur(34px)',
					left: -120 + frame * 1.6,
					top: 1650 - frame * 1.1,
				}}
			/>
		</AbsoluteFill>
	);
};

