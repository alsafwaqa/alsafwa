import React from 'react';
import {Img, staticFile} from 'remotion';
import {LOGO_LEFT, LOGO_SCALE, LOGO_SIZE, LOGO_TOP} from '../brand';

// The real logo, split into three exactly aligned layers of the original
// file (Arabic wordmark, Latin wordmark, plane). With all three fully
// visible and untransformed, the result is pixel-identical to the logo.
// Reveal values are 0..1.
export const LogoLayers: React.FC<{
	readonly arabic: number;
	readonly latin: number;
	readonly plane: number;
	readonly style?: React.CSSProperties;
}> = ({arabic, latin, plane, style}) => {
	const w = LOGO_SIZE.width * LOGO_SCALE;
	const h = LOGO_SIZE.height * LOGO_SCALE;
	// Horizontal extent of each wordmark inside the logo file, in %.
	const AR = {from: 17, to: 64.5};
	const EN = {from: 13.6, to: 64};
	const layer: React.CSSProperties = {position: 'absolute', inset: 0, width: w, height: h};

	return (
		<div
			style={{
				position: 'absolute',
				left: LOGO_LEFT,
				top: LOGO_TOP,
				width: w,
				height: h,
				...style,
			}}
		>
			{/* Arabic reads right to left, so it is revealed from the right. */}
			<Img
				src={staticFile('brand/logo-ar.png')}
				style={{
					...layer,
					clipPath: `inset(-5% 0 -5% ${AR.to - (AR.to - AR.from) * arabic}%)`,
					translate: `${(1 - arabic) * 30}px 0`,
					opacity: Math.min(1, arabic * 5),
					filter: arabic < 1 ? `blur(${(1 - arabic) * 6}px)` : undefined,
				}}
			/>
			<Img
				src={staticFile('brand/logo-en.png')}
				style={{
					...layer,
					clipPath: `inset(-5% ${100 - (EN.from + (EN.to - EN.from) * latin)}% -5% 0)`,
					opacity: Math.min(1, latin * 1.6),
				}}
			/>
			<Img src={staticFile('brand/logo-plane.png')} style={{...layer, opacity: plane}} />
		</div>
	);
};
