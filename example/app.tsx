import * as React from 'react';
import {Component} from 'react';
import FieldRange from '@atlaskit/field-range';
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play';
import VidPauseIcon from '@atlaskit/icon/glyph/vid-pause';
import Button from '@atlaskit/button';
import Video from '../src';
import {CurrentTime, AppWrapper, TimebarWrapper, Timebar, VolumeWrapper, TimeWrapper} from './styled';

export interface AppState {
  
}

const videoSrc = 'http://vjs.zencdn.net/v/oceans.mp4';

export default class App extends Component <{}, AppState> {
  state: AppState = {
    
  }

  onTimeChange = (navigate: Function) => (value: number) => {
    navigate(value);
  }

  onVolumeChange = (setVolume: Function) => (value: number) => {
    setVolume(value);
  }

  render() {
    return (
      <AppWrapper>
        <Video src={videoSrc} >
          {(video, videoState, actions) => {
            const button = videoState.status === 'playing' ? (
              <Button appearance="primary" iconBefore={<VidPauseIcon label="play" />} onClick={actions.pause} />
             ) : (
              <Button appearance="primary" iconBefore={<VidPlayIcon label="pause" />} onClick={actions.play} />
             );

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
                </TimebarWrapper>                
              </div>
            );
          }}
        </Video>
      </AppWrapper>
    )
  }
}