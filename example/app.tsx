import * as React from 'react';
import {Component} from 'react';
import FieldRange from '@atlaskit/field-range';
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play';
import VidPauseIcon from '@atlaskit/icon/glyph/vid-pause';
import VidFullScreenOnIcon from '@atlaskit/icon/glyph/vid-full-screen-on';
import Button from '@atlaskit/button';
import Video from '../src';
import {CurrentTime, AppWrapper, TimebarWrapper, Timebar, VolumeWrapper, TimeWrapper} from './styled';

export interface VideoSource {
  label: string;
  src: string;
}

export interface AppState {
  currentSource: VideoSource;
}

const hdVideoSrc = 'http://vjs.zencdn.net/v/oceans.mp4';
// const sdVideoSrc = 'http://www.onirikal.com/videos/mp4/battle_games.mp4';
const sdVideoSrc = 'http://vjs.zencdn.net/v/oceans.webm';
const sources = [
  {
    label: 'hd',
    src: hdVideoSrc
  },
  {
    label: 'sd',
    src: sdVideoSrc
  },
];

export default class App extends Component <{}, AppState> {
  state: AppState = {
    currentSource: sources[0]
  }

  onTimeChange = (navigate: Function) => (value: number) => {
    navigate(value);
  }

  onVolumeChange = (setVolume: Function) => (value: number) => {
    setVolume(value);
  }

  toggleHD = () => {
    const {currentSource} = this.state;

    this.setState({
      currentSource: currentSource === sources[1] ? sources[0] : sources[1]
    });
  }

  render() {
    const {currentSource} = this.state;

    return (
      <AppWrapper>
        <Video src={currentSource.src} >
          {(video, videoState, actions) => {
            const button = videoState.status === 'playing' ? (
              <Button appearance="primary" iconBefore={<VidPauseIcon label="play" />} onClick={actions.pause} />
             ) : (
              <Button appearance="primary" iconBefore={<VidPlayIcon label="pause" />} onClick={actions.play} />
             );
             const fullScreenButton = (
              <Button appearance="primary" iconBefore={<VidFullScreenOnIcon label="fullscreen" />} onClick={actions.requestFullscreen} />
             );
             const hdButtonAppearance = currentSource.label === 'hd' ? 'primary' : undefined;
             const hdButton = <Button appearance={hdButtonAppearance} onClick={this.toggleHD}>HD</Button>

            return (
              <div>
                {video}
                <TimebarWrapper>
                  {button}
                  <CurrentTime>
                    {Math.round(videoState.currentTime)} / {Math.round(videoState.duration)}
                  </CurrentTime>
                  <TimeWrapper>
                    <FieldRange
                      value={videoState.currentTime}
                      min={0}
                      max={videoState.duration}
                      // step={2}
                      onChange={this.onTimeChange(actions.navigate)}
                    />
                  </TimeWrapper>
                  <VolumeWrapper>
                    <FieldRange
                      value={videoState.volume}
                      min={0}
                      max={1}
                      step={0.01}
                      onChange={this.onVolumeChange(actions.setVolume)}
                    />
                  </VolumeWrapper>
                  {hdButton}
                  {fullScreenButton}
                </TimebarWrapper>                
              </div>
            );
          }}
        </Video>
      </AppWrapper>
    )
  }
}