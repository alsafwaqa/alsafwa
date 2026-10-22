import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Backdrop, Foreground, type Tone} from './Backdrop';

// Background layers + a slow camera push-in, so no frame is ever static.
export const SceneFrame: React.FC<{
	readonly tone: Tone;
	readonly watermark?: boolean;
	readonly foreground?: boolean;
	readonly children: React.ReactNode;
}> = ({tone, watermark, foreground = true, children}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	return (
		<AbsoluteFill>
			<Backdrop tone={tone} watermark={watermark} />
			<AbsoluteFill
				style={{
					scale: String(
						interpolate(frame, [0, durationInFrames], [1, 1.035], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						}),
					),
				}}
			>
				{children}
			</AbsoluteFill>
			{foreground ? <Foreground tone={tone} /> : null}
		</AbsoluteFill>
	);
};
