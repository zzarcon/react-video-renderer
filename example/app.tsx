import * as React from 'react';
import { Component } from 'react';
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play';
import VidPauseIcon from '@atlaskit/icon/glyph/vid-pause';
import VidFullScreenOnIcon from '@atlaskit/icon/glyph/vid-full-screen-on';
import VolumeIcon from '@atlaskit/icon/glyph/hipchat/outgoing-sound';
import Button from '@atlaskit/button';
import Select from '@atlaskit/single-select';
import Spinner from '@atlaskit/spinner';
import Corner from 'react-gh-corner';
import Slider from '@atlaskit/field-range';
import Video, { SetPlaybackSpeed } from '../src';
import {
  VideoRendererWrapper,
  SelectWrapper,
  ErrorWrapper,
  VideoWrapper,
  MutedIndicator,
  LeftControls,
  RightControls,
  ControlsWrapper,
  TimeRangeWrapper,
  CurrentTime,
  AppWrapper,
  TimebarWrapper,
  VolumeWrapper,
  SpinnerWrapper,
  BuiltWithWrapper,
  PlaybackSpeedWrapper
} from './styled';
import { TimeRange } from './timeRange';

export interface ContentSource {
  content: string;
  value: string;
}

export interface AppState {
  currentSource: ContentSource;
  sourceType: ContentType;
  playbackSpeed: number;
}

type ContentType = 'video' | 'audio'

const audioSrc = 'https://upload.wikimedia.org/wikipedia/en/8/80/The_Amen_Break%2C_in_context.ogg';
const audioSrcError = 'https://upload.wikimedia.org/';
const hdVideoSrc = 'http://vjs.zencdn.net/v/oceans.mp4';
const sdVideoSrc = 'http://vjs.zencdn.net/v/oceans.webm';
const sdVideoSrc2 = 'http://www.onirikal.com/videos/mp4/battle_games.mp4';
const errorVideoSrc = 'http://zzarcon';
const chooseContent = [
  {
    items: [
      {
        value: 'video', content: 'video'
      },
      {
        value: 'audio', content: 'audio'
      }
    ]
  }
]
const audioSources = [
  {
    items: [
      { value: audioSrc, content: 'OGG' },
      { value: audioSrcError, content: 'Errored' }
    ]
  }
]
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

const selectDefault = (type: ContentType) => type === 'audio' ? audioSources[0].items[0] : videoSources[0].items[0]
export default class App extends Component <{}, AppState> {
  state: AppState = {
    currentSource: selectDefault('video'),
    sourceType: 'video',
    playbackSpeed: 1
  }

  onNavigate = (navigate: Function) => (value: number) => {
    navigate(value);
  }

  onVolumeChange = (setVolume: Function) => (e: any) => {
    const value = e.target.value;
    setVolume(value);
  }

  toggleHD = () => {
    const { currentSource } = this.state;

    this.setState({
      currentSource: currentSource.value === 'HD' ? videoSources[0].items[1] : videoSources[0].items[0]
    });
  }

  onContentSelected = (e: { item: ContentSource }) => {
    this.setState({
      currentSource: e.item
    });
  }

  renderSpinner = () => {
    return (
      <SpinnerWrapper>
        <Spinner size="xlarge"/>
      </SpinnerWrapper>
    );
  }

  switchContent = (e: { item: { value: ContentType, content: ContentType } }) => {
    this.setState({ sourceType: e.item.value, currentSource: selectDefault(e.item.value) });
  }

  private changePlaybackSpeed = (setPlaybackSpeed: SetPlaybackSpeed) => (playbackSpeed: number) => {
    setPlaybackSpeed(playbackSpeed);
    this.setState({ playbackSpeed })
  }

  private getDefaultTimeLocalStorageKey() {
    const { currentSource } = this.state;
    return `react-video-render-default-time-${currentSource.value}`
  }

  private get defaultTime(): number {
    const savedTime = localStorage.getItem(
      this.getDefaultTimeLocalStorageKey()
    );

    if (savedTime) {
      return JSON.parse(savedTime);
    } else {
      return 0;
    }
  }

  private onTimeChange = (currentTime: number) => {
    localStorage.setItem(
      this.getDefaultTimeLocalStorageKey(),
      JSON.stringify(currentTime),
    );
  }

  render() {
    const { currentSource, sourceType, playbackSpeed } = this.state;

    return (
      <AppWrapper>
        <BuiltWithWrapper>
          Built with <a target="_blank"
                        href="https://github.com/zzarcon/react-video-renderer">react-video-renderer</a> 🎥
        </BuiltWithWrapper>
        <Corner
          href="https://github.com/zzarcon/react-video-renderer"
          size={100}
        />
        <SelectWrapper>
          <Select
            label="Content type"
            items={chooseContent}
            onSelected={this.switchContent}
            defaultSelected={{
              value: 'video', content: 'video'
            }}
          />
          <Select
            label="Content src"
            items={sourceType === 'audio' ? audioSources : videoSources}
            defaultSelected={selectDefault(sourceType)}
            onSelected={this.onContentSelected}
          />
        </SelectWrapper>
        <VideoRendererWrapper>
          <Video
            sourceType={sourceType}
            src={currentSource.value}
            defaultTime={this.defaultTime}
            onTimeChange={this.onTimeChange}
          >
            {(video, videoState, actions) => {
              const { status, currentTime, buffered, duration, volume, isLoading } = videoState;
              if (status === 'errored') {
                return (
                  <ErrorWrapper>
                    Error
                  </ErrorWrapper>
                );
              }
              const button = status === 'playing' ? (
                <Button iconBefore={<VidPauseIcon label="play"/>} onClick={actions.pause}/>
              ) : (
                <Button iconBefore={<VidPlayIcon label="pause"/>} onClick={actions.play}/>
              );
              const fullScreenButton = sourceType === 'video' && (
                <Button iconBefore={<VidFullScreenOnIcon label="fullscreen"/>}
                        onClick={actions.requestFullscreen}/>);
              const hdButton = sourceType === 'video' &&
                <Button onClick={this.toggleHD}>HD</Button>;

              return (
                <VideoWrapper>
                  {isLoading && this.renderSpinner()}
                  <PlaybackSpeedWrapper>
                    Speed: {playbackSpeed}
                    <Slider
                      step={0.5}
                      min={0.5}
                      max={2}
                      value={playbackSpeed}
                      onChange={this.changePlaybackSpeed(actions.setPlaybackSpeed)}
                    />
                  </PlaybackSpeedWrapper>
                  {video}
                  <TimebarWrapper>
                    <TimeRangeWrapper>
                      <TimeRange
                        currentTime={currentTime}
                        bufferedTime={buffered}
                        duration={duration}
                        onChange={this.onNavigate(actions.navigate)}
                      />
                    </TimeRangeWrapper>
                    <ControlsWrapper>
                      <LeftControls>
                        {button}
                        <CurrentTime>
                          {Math.round(currentTime)} / {Math.round(duration)}
                        </CurrentTime>
                        <VolumeWrapper>
                          <MutedIndicator isMuted={videoState.isMuted}/>
                          <Button onClick={actions.toggleMute}
                                  iconBefore={<VolumeIcon label="volume"/>}/>
                          <input type="range" step={0.01} value={volume} max={1}
                                 onChange={this.onVolumeChange(actions.setVolume)}/>
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
