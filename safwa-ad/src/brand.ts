import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Every colour is taken from the logo (public/brand/logo-original.png)
// or is a tint of one of those two colours.
export const NAVY = '#103B47';
export const GREEN = '#087E63';
export const NAVY_SOFT = '#1A4B59';
export const MINT = '#8ED8BE'; // light tint of GREEN, used on navy backgrounds
export const MINT_PALE = '#E6F3EE';
export const PAPER = '#F5F9F8';
export const WHITE = '#FFFFFF';

export const FONT = 'Noto Kufi Arabic';

const ARABIC_RANGE =
	'U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC';
const LATIN_RANGE =
	'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';

for (const weight of ['700', '800', '900']) {
	loadFont({
		family: FONT,
		url: staticFile(`fonts/noto-kufi-arabic-arabic-${weight}-normal.woff2`),
		weight,
		unicodeRange: ARABIC_RANGE,
	});
	loadFont({
		family: FONT,
		url: staticFile(`fonts/noto-kufi-arabic-latin-${weight}-normal.woff2`),
		weight,
		unicodeRange: LATIN_RANGE,
	});
}

// Logo geometry, in pixels of the original 840x352 logo file.
export const LOGO_SIZE = {width: 840, height: 352};
// Content centre of the original logo (wordmarks + plane).
export const LOGO_CONTENT_CENTER = {x: 414, y: 185.5};
// The plane graphic occupies this box inside the original logo.
export const LOGO_PLANE_BOX = {x: 600, y: 128, width: 112, height: 108};

// How the logo is placed on the 1080x1920 canvas in the opening and closing.
export const LOGO_SCALE = 1.4;
export const LOGO_CENTER_ON_CANVAS = {x: 540, y: 900};
export const LOGO_LEFT =
	LOGO_CENTER_ON_CANVAS.x - LOGO_CONTENT_CENTER.x * LOGO_SCALE;
export const LOGO_TOP =
	LOGO_CENTER_ON_CANVAS.y - LOGO_CONTENT_CENTER.y * LOGO_SCALE;

// Where the plane of the logo sits on the canvas (centre of its box).
export const LOGO_PLANE_CENTER = {
	x: LOGO_LEFT + (LOGO_PLANE_BOX.x + LOGO_PLANE_BOX.width / 2) * LOGO_SCALE,
	y: LOGO_TOP + (LOGO_PLANE_BOX.y + LOGO_PLANE_BOX.height / 2) * LOGO_SCALE,
};
