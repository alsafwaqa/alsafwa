import React from 'react';
import {Composition} from 'remotion';
import './brand';
import {SafwaAd} from './SafwaAd';

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="SafwaAd"
			component={SafwaAd}
			width={1080}
			height={1920}
			fps={30}
			durationInFrames={1331}
		/>
	);
};
