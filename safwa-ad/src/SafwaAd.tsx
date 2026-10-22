import {Audio} from '@remotion/media';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import React from 'react';
import {AbsoluteFill, Easing, staticFile} from 'remotion';
import {FlightLayer} from './components/FlightLayer';
import {HOOK_MARKER} from './flight';
import {Closing} from './scenes/Closing';
import {Egypt} from './scenes/Egypt';
import {FlightsHotels} from './scenes/FlightsHotels';
import {GulfVisas} from './scenes/GulfVisas';
import {Hook} from './scenes/Hook';
import {LogoIntro} from './scenes/LogoIntro';
import {LogoOutro} from './scenes/LogoOutro';
import {OtherDestinations} from './scenes/OtherDestinations';
import {Umrah} from './scenes/Umrah';
import {SCENES, START, TRANSITIONS} from './timeline';
import {
	diagonalReveal,
	horizon,
	irisClose,
	lift,
	portal,
	speedStripes,
	starIris,
} from './transitions/presentations';

const inOut = Easing.bezier(0.65, 0, 0.35, 1);

// Motion sound effects only: no music, no song, no voice-over.
// Frames are global; scene starts come from timeline.ts.
const SFX: {at: number; src: string; volume: number}[] = [
	{at: 0, src: 'swish.wav', volume: 0.5},
	{at: 30, src: 'shimmer.wav', volume: 0.55},
	{at: 95, src: 'whoosh-long.wav', volume: 0.8},
	{at: START.hook + 2, src: 'whoosh-short.wav', volume: 0.55},
	{at: START.hook + 28, src: 'pop.wav', volume: 0.5},
	{at: START.hook + 98, src: 'pop-high.wav', volume: 0.7},
	{at: START.hook + 106, src: 'riser.wav', volume: 0.5},
	{at: START.gulfVisas - 2, src: 'whoosh-long.wav', volume: 0.75},
	{at: START.gulfVisas + 38, src: 'swish.wav', volume: 0.6},
	{at: START.gulfVisas + 62, src: 'swish.wav', volume: 0.6},
	{at: START.gulfVisas + 94, src: 'swish.wav', volume: 0.6},
	{at: START.gulfVisas + 122, src: 'swish.wav', volume: 0.6},
	{at: START.gulfVisas + 178, src: 'whoosh-short.wav', volume: 0.6},
	{at: START.otherDestinations - 2, src: 'whoosh-long.wav', volume: 0.65},
	{at: START.otherDestinations + 34, src: 'pop-high.wav', volume: 0.4},
	{at: START.otherDestinations + 58, src: 'pop-high.wav', volume: 0.35},
	{at: START.flightsHotels - 4, src: 'whoosh-short.wav', volume: 0.6},
	{at: START.flightsHotels + 10, src: 'thump.wav', volume: 0.55},
	{at: START.flightsHotels + 30, src: 'whoosh-long.wav', volume: 0.7},
	{at: START.umrah - 22, src: 'riser.wav', volume: 0.45},
	{at: START.umrah, src: 'whoosh-long.wav', volume: 0.7},
	{at: START.umrah + 18, src: 'shimmer.wav', volume: 0.35},
	{at: START.umrah + 97, src: 'pop.wav', volume: 0.55},
	{at: START.umrah + 119, src: 'pop.wav', volume: 0.55},
	{at: START.umrah + 141, src: 'pop.wav', volume: 0.55},
	{at: START.egypt - 10, src: 'whoosh-short.wav', volume: 0.6},
	{at: START.egypt + 4, src: 'swish.wav', volume: 0.55},
	{at: START.egypt + 14, src: 'swish.wav', volume: 0.4},
	{at: START.closing - 10, src: 'whoosh-long.wav', volume: 0.7},
	{at: START.closing + 58, src: 'pop-high.wav', volume: 0.6},
	{at: START.logoOutro - 20, src: 'riser.wav', volume: 0.45},
	{at: START.logoOutro + 2, src: 'whoosh-short.wav', volume: 0.55},
	{at: START.logoOutro + 44, src: 'thump.wav', volume: 0.6},
	{at: START.logoOutro + 45, src: 'shimmer.wav', volume: 0.6},
];

export const SafwaAd: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: 'white'}}>
			<TransitionSeries>
				<TransitionSeries.Sequence name="Logo intro" durationInFrames={SCENES.logoIntro}>
					<LogoIntro />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={diagonalReveal(-45)}
					timing={linearTiming({durationInFrames: TRANSITIONS.introToHook, easing: inOut})}
				/>
				<TransitionSeries.Sequence name="Hook" durationInFrames={SCENES.hook}>
					<Hook />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={portal(HOOK_MARKER.x, HOOK_MARKER.y)}
					timing={linearTiming({durationInFrames: TRANSITIONS.hookToVisas, easing: Easing.bezier(0.55, 0, 0.45, 1)})}
				/>
				<TransitionSeries.Sequence name="Gulf visas" durationInFrames={SCENES.gulfVisas}>
					<GulfVisas />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={speedStripes(-32, false)}
					timing={linearTiming({durationInFrames: TRANSITIONS.visasToOther, easing: inOut})}
				/>
				<TransitionSeries.Sequence name="Other destinations" durationInFrames={SCENES.otherDestinations}>
					<OtherDestinations />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={horizon(1180)}
					timing={linearTiming({durationInFrames: TRANSITIONS.otherToFlights, easing: inOut})}
				/>
				<TransitionSeries.Sequence name="Flights and hotels" durationInFrames={SCENES.flightsHotels}>
					<FlightsHotels />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={starIris(540, 1010)}
					timing={linearTiming({durationInFrames: TRANSITIONS.flightsToUmrah, easing: Easing.bezier(0.5, 0, 0.3, 1)})}
				/>
				<TransitionSeries.Sequence name="Umrah" durationInFrames={SCENES.umrah}>
					<Umrah />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={speedStripes(-32, true)}
					timing={linearTiming({durationInFrames: TRANSITIONS.umrahToEgypt, easing: inOut})}
				/>
				<TransitionSeries.Sequence name="Egypt" durationInFrames={SCENES.egypt}>
					<Egypt />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={lift()}
					timing={linearTiming({durationInFrames: TRANSITIONS.egyptToClosing, easing: inOut})}
				/>
				<TransitionSeries.Sequence name="Closing" durationInFrames={SCENES.closing}>
					<Closing />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={irisClose(540, 960)}
					timing={linearTiming({durationInFrames: TRANSITIONS.closingToOutro, easing: Easing.bezier(0.5, 0, 0.3, 1)})}
				/>
				<TransitionSeries.Sequence name="Logo outro" durationInFrames={SCENES.logoOutro}>
					<LogoOutro />
				</TransitionSeries.Sequence>
			</TransitionSeries>
			<FlightLayer />
			{SFX.map((s) => (
				<Audio key={`${s.at}-${s.src}`} name={s.src} from={s.at} src={staticFile(`sfx/${s.src}`)} volume={s.volume} />
			))}
		</AbsoluteFill>
	);
};
