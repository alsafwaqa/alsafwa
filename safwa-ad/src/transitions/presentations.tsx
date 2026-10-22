import type {
	TransitionPresentation,
	TransitionPresentationComponentProps,
} from '@remotion/transitions';
import React from 'react';
import {AbsoluteFill, interpolate, useVideoConfig} from 'remotion';
import {GREEN, MINT, NAVY, WHITE} from '../brand';
import {bandPath, projectionRange, starPoints, starPolygon, unit} from './geometry';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// 1. Flight-path wipe: the new scene follows the plane's direction, with
// two green lines (the logo's speed lines) on its leading edge.
type DiagonalProps = {angle: number};
const DiagonalReveal: React.FC<TransitionPresentationComponentProps<DiagonalProps>> = ({
	children,
	presentationDirection,
	presentationProgress: p,
	passedProps,
}) => {
	const {width, height} = useVideoConfig();
	if (presentationDirection === 'exiting') {
		return (
			<AbsoluteFill style={{scale: String(1 + 0.06 * p), filter: `blur(${p * 4}px)`}}>
				{children}
			</AbsoluteFill>
		);
	}
	const d = unit(passedProps.angle);
	const {min, max} = projectionRange(width, height, d);
	const edge = min - 60 + (max - min + 120) * p;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{clipPath: `path('${bandPath(width, height, d, min - 10, edge)}')`}}>
				{children}
			</AbsoluteFill>
			<svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
				<path d={bandPath(width, height, d, edge - 16, edge)} fill={GREEN} />
				<path d={bandPath(width, height, d, edge + 14, edge + 20)} fill={GREEN} opacity={0.5} />
			</svg>
		</AbsoluteFill>
	);
};
export const diagonalReveal = (angle: number): TransitionPresentation<DiagonalProps> => ({
	component: DiagonalReveal,
	props: {angle},
});

// 2. Portal: the camera dives into the "here" dot, whose colour becomes
// the next scene's background.
type PortalProps = {cx: number; cy: number};
const Portal: React.FC<TransitionPresentationComponentProps<PortalProps>> = ({
	children,
	presentationDirection,
	presentationProgress: p,
	passedProps: {cx, cy},
}) => {
	if (presentationDirection === 'exiting') {
		return (
			<AbsoluteFill style={{scale: String(1 + 1.6 * p * p), transformOrigin: `${cx}px ${cy}px`}}>
				{children}
			</AbsoluteFill>
		);
	}
	const r = interpolate(p, [0, 1], [34, 2300], {...clamp});
	return (
		<AbsoluteFill style={{clipPath: `circle(${r * p}px at ${cx}px ${cy}px)`}}>
			<AbsoluteFill style={{scale: String(1.25 - 0.25 * p), transformOrigin: `${cx}px ${cy}px`}}>
				{children}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
export const portal = (cx: number, cy: number): TransitionPresentation<PortalProps> => ({
	component: Portal,
	props: {cx, cy},
});

// 3. Speed stripes: the new scene arrives in three staggered diagonal
// stripes, like the speed lines behind the logo plane.
type StripesProps = {angle: number; dark: boolean};
const Stripes: React.FC<TransitionPresentationComponentProps<StripesProps>> = ({
	children,
	presentationDirection,
	presentationProgress: p,
	passedProps,
}) => {
	const {width, height} = useVideoConfig();
	if (presentationDirection === 'exiting') {
		return (
			<AbsoluteFill
				style={{
					translate: `${-60 * p}px ${-30 * p}px`,
					filter: `blur(${p * 5}px)`,
				}}
			>
				{children}
			</AbsoluteFill>
		);
	}
	// Stripes run along `angle`; they grow across the perpendicular axis.
	const along = unit(passedProps.angle);
	const across = {x: -along.y, y: along.x};
	const {min, max} = projectionRange(width, height, across);
	const n = 3;
	const band = (max - min) / n;
	const lag = 0.22;
	const paths: string[] = [];
	const edges: string[] = [];
	for (let k = 0; k < n; k++) {
		const local = interpolate(p, [k * lag, 1 - (n - 1 - k) * lag * 0.35], [0, 1], {...clamp});
		const from = min + k * band - 2;
		const to = from + (band + 4) * local;
		const path = bandPath(width, height, across, from, to);
		if (path) paths.push(path);
		if (local > 0 && local < 1) {
			edges.push(bandPath(width, height, across, to - 12, to));
		}
	}
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{clipPath: `path('${paths.join(' ') || 'M 0 0 Z'}')`}}>
				{children}
			</AbsoluteFill>
			<svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
				{edges.map((e, i) => (
					<path key={i} d={e} fill={passedProps.dark ? MINT : GREEN} />
				))}
			</svg>
		</AbsoluteFill>
	);
};
export const speedStripes = (angle: number, dark: boolean): TransitionPresentation<StripesProps> => ({
	component: Stripes,
	props: {angle, dark},
});

// 4. Horizon: the globe flattens into a line, which opens up into the
// horizon of the next scene.
type HorizonProps = {cy: number};
const Horizon: React.FC<TransitionPresentationComponentProps<HorizonProps>> = ({
	children,
	presentationDirection,
	presentationProgress: p,
	passedProps: {cy},
}) => {
	const {width, height} = useVideoConfig();
	if (presentationDirection === 'exiting') {
		const squash = interpolate(p, [0, 0.55], [1, 0.004], {...clamp});
		return (
			<AbsoluteFill
				style={{scale: `1 ${squash}`, transformOrigin: `50% ${cy}px`, opacity: interpolate(p, [0.45, 0.6], [1, 0], {...clamp})}}
			>
				{children}
			</AbsoluteFill>
		);
	}
	const open = interpolate(p, [0.45, 1], [0, 1], {...clamp});
	const top = cy - cy * open;
	const bottom = cy + (height - cy) * open;
	const line = interpolate(p, [0.2, 0.55], [0, 1], {...clamp});
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{clipPath: `inset(${top}px 0 ${height - bottom}px 0)`}}>
				{children}
			</AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: (width * (1 - line)) / 2,
					width: width * line,
					top: cy - 2,
					height: 4,
					background: NAVY,
					opacity: 1 - open,
				}}
			/>
		</AbsoluteFill>
	);
};
export const horizon = (cy: number): TransitionPresentation<HorizonProps> => ({
	component: Horizon,
	props: {cy},
});

// 5. Star iris: an eight-pointed star (the Umrah scene's motif) blooms
// from behind the plane and opens onto the next scene.
type StarProps = {cx: number; cy: number};
const StarIris: React.FC<TransitionPresentationComponentProps<StarProps>> = ({
	children,
	presentationDirection,
	presentationProgress: p,
	passedProps: {cx, cy},
}) => {
	const {width, height} = useVideoConfig();
	if (presentationDirection === 'exiting') {
		return (
			<AbsoluteFill style={{scale: String(1 + 0.12 * p), transformOrigin: `${cx}px ${cy}px`}}>
				{children}
			</AbsoluteFill>
		);
	}
	const r = 1800 * p * p;
	const rot = 45 * p;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{clipPath: starPolygon(cx, cy, r, rot)}}>{children}</AbsoluteFill>
			<svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
				<polygon points={starPoints(cx, cy, r, rot)} fill="none" stroke={GREEN} strokeWidth={10} />
			</svg>
		</AbsoluteFill>
	);
};
export const starIris = (cx: number, cy: number): TransitionPresentation<StarProps> => ({
	component: StarIris,
	props: {cx, cy},
});

// 6. Lift: the camera tilts up after the plane; the old scene recedes
// upwards into depth while the new one rises in.
type LiftProps = Record<string, never>;
const Lift: React.FC<TransitionPresentationComponentProps<LiftProps>> = ({
	children,
	presentationDirection,
	presentationProgress: p,
}) => {
	if (presentationDirection === 'exiting') {
		return (
			<AbsoluteFill
				style={{
					translate: `0 ${-28 * p}%`,
					scale: String(1 - 0.12 * p),
					opacity: 1 - 0.6 * p,
					filter: `blur(${p * 6}px)`,
				}}
			>
				{children}
			</AbsoluteFill>
		);
	}
	return (
		<AbsoluteFill
			style={{
				translate: `0 ${(1 - p) * 100}%`,
				boxShadow: '0 -40px 80px rgba(16, 59, 71, 0.18)',
				borderTopLeftRadius: 80 * (1 - p),
				borderTopRightRadius: 80 * (1 - p),
				overflow: 'hidden',
			}}
		>
			{children}
		</AbsoluteFill>
	);
};
export const lift = (): TransitionPresentation<LiftProps> => ({component: Lift, props: {}});

// 7. Iris close: everything gathers into the plane at the centre, leaving
// the clean logo stage behind.
type IrisProps = {cx: number; cy: number};
const IrisClose: React.FC<TransitionPresentationComponentProps<IrisProps>> = ({
	children,
	presentationDirection,
	presentationProgress: p,
	passedProps: {cx, cy},
}) => {
	const {width, height} = useVideoConfig();
	if (presentationDirection === 'exiting') {
		const r = 2300 * (1 - p) ** 2;
		return (
			<AbsoluteFill style={{zIndex: 1}}>
				<AbsoluteFill style={{clipPath: `circle(${r}px at ${cx}px ${cy}px)`}}>{children}</AbsoluteFill>
				<svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
					<circle cx={cx} cy={cy} r={r} fill="none" stroke={GREEN} strokeWidth={8} opacity={p < 0.98 ? 1 : 0} />
				</svg>
			</AbsoluteFill>
		);
	}
	return <AbsoluteFill style={{scale: String(1.08 - 0.08 * p), background: WHITE}}>{children}</AbsoluteFill>;
};
export const irisClose = (cx: number, cy: number): TransitionPresentation<IrisProps> => ({
	component: IrisClose,
	props: {cx, cy},
});
