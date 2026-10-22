import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {FONT} from '../brand';

// Arabic line animated word by word (never letter by letter, so the letters
// stay joined). Words enter in reading order, right to left.
export const Words: React.FC<{
	readonly text: string;
	// Local frame at which the first word starts.
	readonly start: number;
	readonly stagger?: number;
	// Optional colour per word index (0 = first word, on the right).
	readonly colors?: Record<number, string>;
	// Local frame at which the whole line leaves.
	readonly exit?: number;
	readonly style?: React.CSSProperties;
}> = ({text, start, stagger = 7, colors = {}, exit, style}) => {
	const frame = useCurrentFrame();
	const words = text.split(' ').filter(Boolean);

	const out =
		exit === undefined
			? 0
			: interpolate(frame, [exit, exit + 14], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: Easing.bezier(0.7, 0, 0.84, 0),
				});

	return (
		<div
			dir="rtl"
			lang="ar"
			style={{
				fontFamily: FONT,
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'center',
				columnGap: '0.26em',
				lineHeight: 1.55,
				opacity: 1 - out,
				translate: `0 ${-40 * out}px`,
				filter: out > 0 ? `blur(${out * 10}px)` : undefined,
				...style,
			}}
		>
			{words.map((word, i) => {
				const t0 = start + i * stagger;
				const p = interpolate(frame, [t0, t0 + 20], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: Easing.bezier(0.16, 1, 0.3, 1),
				});
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							opacity: interpolate(p, [0, 0.6], [0, 1], {extrapolateRight: 'clamp'}),
							translate: `0 ${(1 - p) * 0.42}em`,
							scale: String(0.92 + 0.08 * p),
							filter: p < 1 ? `blur(${(1 - p) * 9}px)` : undefined,
							color: colors[i],
						}}
					>
						{word}
					</span>
				);
			})}
		</div>
	);
};
