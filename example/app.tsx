import * as React from 'react';
import {Component} from 'react';
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play';
import VidPauseIcon from '@atlaskit/icon/glyph/vid-pause';
import VidFullScreenOnIcon from '@atlaskit/icon/glyph/vid-full-screen-on';
import VolumeIcon from '@atlaskit/icon/glyph/hipchat/outgoing-sound';
import Button from '@atlaskit/button';
import Select from '@atlaskit/single-select';
import Video from '../src';
import {VideoRendererWrapper, SelectWrapper, ErrorWrapper, VideoWrapper, MutedIndicator, LeftControls, RightControls, ControlsWrapper, TimeRangeWrapper, CurrentTime, AppWrapper, TimebarWrapper, Timebar, VolumeWrapper, TimeWrapper, BufferedProgress} from './styled';
import {TimeRange} from './timeRange';

export interface VideoSource {
  content: string;
  value: string;
}

export interface AppState {
  currentSource: VideoSource;
}

const hdVideoSrc = 'http://vjs.zencdn.net/v/oceans.mp4';
const sdVideoSrc = 'http://vjs.zencdn.net/v/oceans.webm';
const sdVideoSrc2 = 'http://www.onirikal.com/videos/mp4/battle_games.mp4';
const errorVideoSrc = 'http://zzarcon';
const videoSources = [
  {
    items: [
      { value: hdVideoSrc, content: 'HD' },
      { value: sdVideoSrc, content: 'SD' },
      { value: sdVideoSrc2, content: 'SD - 2' },
      { value: errorVideoSrc, content: 'Errored' }
    ]
  }
];
const selectedItem = videoSources[0].items[0];
export default class App extends Component <{}, AppState> {
  state: AppState = {
    currentSource: selectedItem
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
      currentSource: currentSource.value === 'HD' ? videoSources[0].items[1] : videoSources[0].items[0]
    });
  }

  onVideoSelected = (e: {item: VideoSource}) => {
    this.setState({
      currentSource: e.item
    });
  }

  render() {
    const {currentSource} = this.state;

    return (
      <AppWrapper>
        <SelectWrapper>
          <Select
            label="Video src"
            items={videoSources}
            defaultSelected={selectedItem}
            onSelected={this.onVideoSelected}
          />
        </SelectWrapper>
        <VideoRendererWrapper>
          <Video src={currentSource.value} >
            {(video, videoState, actions) => {
              if (videoState.status === 'errored') {
                return (
                  <ErrorWrapper>
                    Error
                  </ErrorWrapper>
                );
              }

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
                          <MutedIndicator isMuted={videoState.isMuted} />
                          <Button onClick={actions.toggleMute} iconBefore={<VolumeIcon label="volume" />} />
                          <input type="range" step={0.01} value={videoState.volume} max={1} onChange={this.onVolumeChange(actions.setVolume)} />
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
        </VideoRendererWrapper>
      </AppWrapper>
    )
  }
}