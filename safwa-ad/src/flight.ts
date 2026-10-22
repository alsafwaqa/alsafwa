import {interpolate, interpolateColors} from 'remotion';
import {GREEN, LOGO_PLANE_CENTER, WHITE} from './brand';

// The logo's plane is the thread that connects every scene.
// Its whole journey is described here in *global* frames (see timeline.ts).
//
// Position keyframes are joined with a Catmull-Rom curve so the path is
// smooth. `stop: true` makes the plane ease out of / into that keyframe
// (natural acceleration and deceleration); keyframes without it are passed
// through at speed. `cut: true` means the plane re-enters from off-screen
// there, so the trail is not drawn across the jump.

type Key = {
	f: number;
	x: number;
	y: number;
	stop?: boolean;
	cut?: boolean;
	// Fixed heading (degrees). Used when the plane must not turn, e.g. the
	// small pull-back before take-off, or when it is docked in the logo.
	h?: number;
};

const P0 = LOGO_PLANE_CENTER;
// Heading of the plane as drawn in the logo (pointing up-right).
export const LOGO_HEADING = -45;

const circle = (
	cx: number,
	cy: number,
	r: number,
	fromAngle: number,
	toAngle: number,
	fromFrame: number,
	toFrame: number,
	steps: number,
): Key[] =>
	Array.from({length: steps + 1}, (_, i) => {
		const t = i / steps;
		const a = fromAngle + (toAngle - fromAngle) * t;
		return {
			f: Math.round(fromFrame + (toFrame - fromFrame) * t),
			x: cx + r * Math.cos(a),
			y: cy + r * Math.sin(a),
		};
	});

// Tilted orbit around the globe of the "other destinations" scene.
export const ORBIT = {cx: 540, cy: 1180, rx: 430, ry: 130, tilt: (-12 * Math.PI) / 180};
const orbitPoint = (theta: number) => {
	const ex = ORBIT.rx * Math.cos(theta);
	const ey = ORBIT.ry * Math.sin(theta);
	return {
		x: ORBIT.cx + ex * Math.cos(ORBIT.tilt) - ey * Math.sin(ORBIT.tilt),
		y: ORBIT.cy + ex * Math.sin(ORBIT.tilt) + ey * Math.cos(ORBIT.tilt),
	};
};
const ORBIT_FROM = 470;
const ORBIT_TO = 560;
const ORBIT_THETA_FROM = Math.PI;
const ORBIT_THETA_TO = Math.PI - 2.5 * Math.PI;
const orbitTheta = (frame: number) =>
	ORBIT_THETA_FROM +
	(ORBIT_THETA_TO - ORBIT_THETA_FROM) * ((frame - ORBIT_FROM) / (ORBIT_TO - ORBIT_FROM));

const orbitKeys: Key[] = Array.from({length: 16}, (_, i) => {
	const f = ORBIT_FROM + i * 6;
	return {f, ...orbitPoint(orbitTheta(f))};
});

// Marker of the hook scene ("هنا").
export const HOOK_MARKER = {x: 540, y: 1220, r: 170};

const KEYS: Key[] = [
	// 1. Docked in the logo, then the small pull-back and take-off.
	{f: 0, ...P0, stop: true, h: LOGO_HEADING},
	{f: 92, ...P0, stop: true, h: LOGO_HEADING},
	{f: 101, x: P0.x - 22, y: P0.y + 22, stop: true, h: LOGO_HEADING},
	{f: 112, x: 1010, y: 770},
	{f: 122, x: 1250, y: 540},
	// 2. Hook: enters from bottom-left and draws the ring around "here".
	{f: 132, x: -160, y: 1560, cut: true},
	{f: 146, x: 180, y: 1390},
	...circle(HOOK_MARKER.x, HOOK_MARKER.y, HOOK_MARKER.r, Math.PI, 3.5 * Math.PI, 158, 218, 10),
	{f: 230, x: 820, y: 900},
	{f: 242, x: 1240, y: 640},
	// 3. Gulf visas: hops from card to card, right to left (reading order).
	{f: 252, x: 1240, y: 300, cut: true},
	{f: 278, x: 790, y: 795, stop: true},
	{f: 282, x: 790, y: 795, stop: true},
	{f: 302, x: 290, y: 795, stop: true},
	{f: 312, x: 290, y: 795, stop: true},
	{f: 334, x: 790, y: 1075, stop: true},
	{f: 342, x: 790, y: 1075, stop: true},
	{f: 362, x: 290, y: 1075, stop: true},
	{f: 384, x: 330, y: 1440},
	{f: 402, x: 540, y: 1520, stop: true},
	{f: 416, x: 540, y: 1520, stop: true},
	{f: 440, x: 1250, y: 1000},
	// 4. Other destinations: one and a quarter orbits around the globe,
	// then away along what becomes the horizon.
	{f: 452, x: -160, y: 1330, cut: true},
	...orbitKeys,
	{f: 578, x: 1250, y: 1330},
	// 5. Flights & hotels: rolls up the runway towards the horizon,
	// lifts off, hovers, then moves to the centre for the star reveal.
	{f: 596, x: 540, y: 2080, cut: true},
	{f: 640, x: 540, y: 1290},
	{f: 662, x: 620, y: 1110},
	{f: 688, x: 860, y: 850, stop: true},
	{f: 716, x: 860, y: 850, stop: true},
	{f: 744, x: 540, y: 1010, stop: true},
	{f: 758, x: 540, y: 1010, stop: true},
	// 6. Umrah: circles the star, then flies down the list of services.
	{f: 772, x: 240, y: 800},
	{f: 784, x: 330, y: 470},
	{f: 794, x: 620, y: 395},
	{f: 804, x: 850, y: 560},
	{f: 816, x: 900, y: 900},
	{f: 830, x: 900, y: 1170, stop: true},
	{f: 852, x: 900, y: 1350, stop: true},
	{f: 872, x: 900, y: 1530, stop: true},
	{f: 892, x: 760, y: 1730, stop: true},
	{f: 910, x: 760, y: 1730, stop: true},
	{f: 932, x: 1250, y: 1380},
	// 7. Egypt: rises from bottom-left over the shield.
	{f: 950, x: -160, y: 1700, cut: true},
	{f: 972, x: 190, y: 1400},
	{f: 988, x: 330, y: 1040},
	{f: 1000, x: 540, y: 930},
	{f: 1012, x: 800, y: 1000, stop: true},
	{f: 1038, x: 800, y: 1000, stop: true},
	{f: 1072, x: 860, y: -200},
	// 8. Closing: climbs in from below and waits under the call to action.
	{f: 1086, x: 540, y: 2080, cut: true},
	{f: 1106, x: 540, y: 1650},
	{f: 1122, x: 560, y: 1540, stop: true},
	{f: 1190, x: 560, y: 1540, stop: true},
	{f: 1214, x: 540, y: 960, stop: true},
	{f: 1222, x: 540, y: 960, stop: true},
	// 9. Lands back in the logo along its own heading.
	{f: 1231, x: 450, y: 1070},
	{f: 1238, x: 475, y: 1180},
	{f: 1246, x: P0.x - 260, y: P0.y + 260},
	{f: 1256, ...P0, stop: true, h: LOGO_HEADING},
	{f: 1400, ...P0, stop: true, h: LOGO_HEADING},
];

const easeInOut = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);
const easeIn = (t: number) => t * t;
const easeOut = (t: number) => 1 - (1 - t) * (1 - t);

const segmentIndex = (frame: number) => {
	if (frame <= KEYS[0].f) return 0;
	for (let i = 0; i < KEYS.length - 1; i++) {
		if (frame < KEYS[i + 1].f) return i;
	}
	return KEYS.length - 2;
};

const catmull = (p0: number, p1: number, p2: number, p3: number, t: number) =>
	0.5 *
	(2 * p1 +
		(-p0 + p2) * t +
		(2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t +
		(-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);

export const planePosition = (frame: number) => {
	const i = segmentIndex(frame);
	const a = KEYS[i];
	const b = KEYS[i + 1];
	if (frame <= a.f) return {x: a.x, y: a.y};
	if (frame >= b.f && i === KEYS.length - 2) return {x: b.x, y: b.y};
	// Off-screen jump: hold the last position until the re-entry frame.
	if (b.cut) return {x: a.x, y: a.y};
	// Hovering in place.
	if (a.x === b.x && a.y === b.y) return {x: a.x, y: a.y};
	const raw = (frame - a.f) / (b.f - a.f);
	const t =
		a.stop && b.stop ? easeInOut(raw) : a.stop ? easeIn(raw) : b.stop ? easeOut(raw) : raw;
	// Between two stops: a straight, eased move.
	if (a.stop && b.stop) return {x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t};
	// A stop does not borrow the direction of the keyframe beyond it, so the
	// curve never overshoots where the plane slows down.
	const prev = i > 0 && !a.cut && !a.stop ? KEYS[i - 1] : {x: 2 * a.x - b.x, y: 2 * a.y - b.y};
	const nextKey = KEYS[i + 2];
	const next = nextKey && !nextKey.cut && !b.stop ? nextKey : {x: 2 * b.x - a.x, y: 2 * b.y - a.y};
	return {
		x: catmull(prev.x, a.x, b.x, next.x, t),
		y: catmull(prev.y, a.y, b.y, next.y, t),
	};
};

const lastCutBefore = (frame: number) => {
	let cut = 0;
	for (const k of KEYS) {
		if (k.cut && k.f <= frame) cut = k.f;
	}
	return cut;
};

const angleOf = (dx: number, dy: number) => (Math.atan2(dy, dx) * 180) / Math.PI;

const lockedHeading = (frame: number): number | null => {
	const i = segmentIndex(frame);
	const a = KEYS[i];
	const b = KEYS[i + 1];
	if (a.h !== undefined && b.h !== undefined && frame >= a.f) {
		return a.h + (b.h - a.h) * Math.min(1, (frame - a.f) / (b.f - a.f));
	}
	return null;
};

export const planeHeading = (frame: number): number => {
	const locked = lockedHeading(frame);
	if (locked !== null) return locked;
	const floor = lastCutBefore(frame);
	const ceiling = nextCutAfter(frame);
	const v = velocity(frame, floor);
	if (Math.hypot(v.x, v.y) > MOVING) return angleOf(v.x, v.y);

	// Slow or stationary: turn smoothly from the direction it arrived in to
	// the direction it will leave in, so the plane pivots instead of snapping.
	const speedAt = (f: number) => Math.hypot(velocity(f, floor).x, velocity(f, floor).y);
	let fa = frame;
	let arrived: number | null = null;
	while (fa > floor && frame - fa < 90) {
		const lock = lockedHeading(fa);
		if (lock !== null) {
			arrived = lock;
			break;
		}
		if (speedAt(fa) > MOVING) {
			const va = velocity(fa, floor);
			arrived = angleOf(va.x, va.y);
			break;
		}
		fa--;
	}
	let fd = frame;
	let leaves: number | null = null;
	while (fd < ceiling && fd - frame < 90) {
		const lock = lockedHeading(fd);
		if (lock !== null) {
			leaves = lock;
			break;
		}
		if (speedAt(fd) > MOVING) {
			const vd = velocity(fd, floor);
			leaves = angleOf(vd.x, vd.y);
			break;
		}
		fd++;
	}
	if (arrived === null && leaves === null) return LOGO_HEADING;
	if (arrived === null) return leaves as number;
	if (leaves === null) return arrived;
	const t = (frame - fa) / Math.max(1, fd - fa);
	const s = t * t * (3 - 2 * t);
	const delta = ((((leaves - arrived) % 360) + 540) % 360) - 180;
	return arrived + delta * s;
};

// Below this speed (px per frame) the direction of travel is unreliable.
const MOVING = 5;

const velocity = (frame: number, floor: number) => {
	const p1 = planePosition(Math.max(floor, frame - 1));
	const p2 = planePosition(Math.max(floor, frame + 1));
	return {x: (p2.x - p1.x) / 2, y: (p2.y - p1.y) / 2};
};

const nextCutAfter = (frame: number) => {
	for (const k of KEYS) {
		if (k.cut && k.f > frame) return k.f - 1;
	}
	return KEYS[KEYS.length - 1].f;
};

export const planeSpeed = (frame: number) => {
	const p1 = planePosition(frame - 0.5);
	const p2 = planePosition(frame + 0.5);
	return Math.hypot(p2.x - p1.x, p2.y - p1.y);
};

export const isCutBetween = (from: number, to: number) =>
	KEYS.some((k) => k.cut && k.f > from && k.f <= to);

// Size of the plane (1 = the size it has inside the logo).
export const planeScale = (frame: number) => {
	if (frame >= ORBIT_FROM - 10 && frame <= ORBIT_TO + 6) {
		// Bigger in front of the globe, smaller behind it.
		const theta = orbitTheta(Math.min(Math.max(frame, ORBIT_FROM), ORBIT_TO));
		const depth = Math.sin(theta);
		const w = interpolate(frame, [ORBIT_FROM - 10, ORBIT_FROM, ORBIT_TO, ORBIT_TO + 6], [0, 1, 1, 0], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});
		return 0.9 * (1 - w) + (0.78 + 0.22 * depth) * w;
	}
	return interpolate(
		frame,
		[0, 252, 280, 440, 596, 640, 688, 744, 758, 900, 950, 1086, 1122, 1214, 1256],
		[1, 1, 0.9, 0.9, 2.6, 0.85, 0.85, 1, 1, 0.85, 0.95, 1.2, 1, 1, 1],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);
};

export const planeOpacity = (frame: number) => {
	// The raster logo shows the plane while it is docked; the flying vector
	// plane takes over for take-off and hands back after landing.
	const base = interpolate(frame, [90, 92, 1256, 1260], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	if (frame >= ORBIT_FROM && frame <= ORBIT_TO) {
		const depth = Math.sin(orbitTheta(frame));
		return base * interpolate(depth, [-1, 0], [0.45, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	}
	return base;
};

// Green on light scenes, white on the navy scenes.
export const planeColor = (frame: number) =>
	interpolateColors(
		frame,
		[0, 238, 252, 433, 452, 731, 748, 936, 950],
		[GREEN, GREEN, WHITE, WHITE, GREEN, GREEN, WHITE, WHITE, GREEN],
	);
