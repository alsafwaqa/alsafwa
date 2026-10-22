// Single source of truth for the ad's timing (30 fps).
// Scenes overlap by the duration of the transition between them, so a
// scene's global start = previous start + previous duration - transition.
// The plane's flight path (flight.ts) and the sound effects are keyed to
// the global frames derived here, so change timings in this file only.

export const FPS = 30;

export const SCENES = {
	logoIntro: 130,
	hook: 150,
	gulfVisas: 215,
	otherDestinations: 160,
	flightsHotels: 180,
	umrah: 225,
	egypt: 150,
	closing: 165,
	logoOutro: 120,
} as const;

export const TRANSITIONS = {
	introToHook: 20,
	hookToVisas: 22,
	visasToOther: 20,
	otherToFlights: 20,
	flightsToUmrah: 22,
	umrahToEgypt: 20,
	egyptToClosing: 20,
	closingToOutro: 20,
} as const;

type SceneKey = keyof typeof SCENES;

const ORDER: SceneKey[] = [
	'logoIntro',
	'hook',
	'gulfVisas',
	'otherDestinations',
	'flightsHotels',
	'umrah',
	'egypt',
	'closing',
	'logoOutro',
];
const T = Object.values(TRANSITIONS);

export const START: Record<SceneKey, number> = (() => {
	const out = {} as Record<SceneKey, number>;
	let cursor = 0;
	ORDER.forEach((key, i) => {
		out[key] = cursor;
		cursor += SCENES[key] - (T[i] ?? 0);
	});
	return out;
})();

export const TOTAL_FRAMES =
	Object.values(SCENES).reduce((a, b) => a + b, 0) - T.reduce((a, b) => a + b, 0);
