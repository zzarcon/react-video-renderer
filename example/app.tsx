import * as React from 'react';
import {Component} from 'react';
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play';
import VidPauseIcon from '@atlaskit/icon/glyph/vid-pause';
import VidFullScreenOnIcon from '@atlaskit/icon/glyph/vid-full-screen-on';
import VolumeIcon from '@atlaskit/icon/glyph/hipchat/outgoing-sound';
import Button from '@atlaskit/button';
import Video from '../src';
import {VideoWrapper, MuttedIndicator, LeftControls, RightControls, ControlsWrapper, TimeRangeWrapper, CurrentTime, AppWrapper, TimebarWrapper, Timebar, VolumeWrapper, TimeWrapper, BufferedProgress} from './styled';
import {TimeRange} from './timeRange';

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

  onVolumeChange = (setVolume: Function) => (e: any) => {
    const value = e.target.value;
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
              <Button iconBefore={<VidPauseIcon label="play" />} onClick={actions.pause} />
             ) : (
              <Button iconBefore={<VidPlayIcon label="pause" />} onClick={actions.play} />
             );
             const fullScreenButton = (
              <Button iconBefore={<VidFullScreenOnIcon label="fullscreen" />} onClick={actions.requestFullscreen} />
             );
            //  const hdButtonAppearance = currentSource.label === 'hd' ? 'primary' : undefined;
             const hdButton = <Button onClick={this.toggleHD}>HD</Button>
             const isMutted = videoState.volume === 0; 

            return (
              <VideoWrapper>
                {video}
                <TimebarWrapper>
                  <TimeRangeWrapper>
                    <TimeRange
                      currentTime={videoState.currentTime}
                      bufferedTime={videoState.buffered}
                      duration={videoState.duration}
                      onChange={this.onTimeChange(actions.navigate)}
                    />
                  </TimeRangeWrapper>
                  <ControlsWrapper>
                    <LeftControls>
                      {button}
                      <CurrentTime>
                        {Math.round(videoState.currentTime)} / {Math.round(videoState.duration)}
                      </CurrentTime>
                      <VolumeWrapper>
                        <MuttedIndicator isMutted={isMutted} />
                        <Button onClick={actions.toggleMute} iconBefore={<VolumeIcon label="volume" />} />
                        <input type="range" step="0.01" value={videoState.volume} max={1} onChange={this.onVolumeChange(actions.setVolume)} />
                      </VolumeWrapper>  
                    </LeftControls>
                    <RightControls>
                      {hdButton}
                      {fullScreenButton}
                    </RightControls>                    
                  </ControlsWrapper>
                </TimebarWrapper>                
              </VideoWrapper>
            );
          }}
        </Video>
      </AppWrapper>
    )
  }
}