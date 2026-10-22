// Small helpers to build clip-path shapes for the custom transitions.

type Pt = {x: number; y: number};

// Clip a convex polygon by the half-plane  dot(p, n) <= c.
const clipHalfPlane = (poly: Pt[], n: Pt, c: number): Pt[] => {
	const out: Pt[] = [];
	for (let i = 0; i < poly.length; i++) {
		const a = poly[i];
		const b = poly[(i + 1) % poly.length];
		const da = a.x * n.x + a.y * n.y - c;
		const db = b.x * n.x + b.y * n.y - c;
		if (da <= 0) out.push(a);
		if (da * db < 0) {
			const t = da / (da - db);
			out.push({x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t});
		}
	}
	return out;
};

const rect = (w: number, h: number): Pt[] => [
	{x: 0, y: 0},
	{x: w, y: 0},
	{x: w, y: h},
	{x: 0, y: h},
];

export const unit = (deg: number): Pt => ({
	x: Math.cos((deg * Math.PI) / 180),
	y: Math.sin((deg * Math.PI) / 180),
});

// Range of dot(p, d) over the canvas corners.
export const projectionRange = (w: number, h: number, d: Pt) => {
	const v = rect(w, h).map((p) => p.x * d.x + p.y * d.y);
	return {min: Math.min(...v), max: Math.max(...v)};
};

// Part of the canvas where  from <= dot(p, d) <= to, as an SVG path.
export const bandPath = (w: number, h: number, d: Pt, from: number, to: number) => {
	let poly = clipHalfPlane(rect(w, h), d, to);
	poly = clipHalfPlane(poly, {x: -d.x, y: -d.y}, -from);
	if (poly.length < 3) return '';
	return `M ${poly.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ')} Z`;
};

// 8-pointed star (two overlapping squares) as a CSS polygon().
export const starPolygon = (cx: number, cy: number, r: number, rotationDeg: number) => {
	const inner = r * (Math.cos(Math.PI / 4) / Math.cos(Math.PI / 8));
	const pts: string[] = [];
	for (let i = 0; i < 16; i++) {
		const a = ((rotationDeg + i * 22.5 - 90) * Math.PI) / 180;
		const rr = i % 2 === 0 ? r : inner;
		pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)}px ${(cy + rr * Math.sin(a)).toFixed(1)}px`);
	}
	return `polygon(${pts.join(', ')})`;
};

export const starPoints = (cx: number, cy: number, r: number, rotationDeg: number) => {
	const inner = r * (Math.cos(Math.PI / 4) / Math.cos(Math.PI / 8));
	const pts: string[] = [];
	for (let i = 0; i < 16; i++) {
		const a = ((rotationDeg + i * 22.5 - 90) * Math.PI) / 180;
		const rr = i % 2 === 0 ? r : inner;
		pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`);
	}
	return pts.join(' ');
};
