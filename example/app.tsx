import * as React from 'react';
import { Component } from 'react';
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play';
import VidPauseIcon from '@atlaskit/icon/glyph/vid-pause';
import VidFullScreenOnIcon from '@atlaskit/icon/glyph/vid-full-screen-on';
import EditorTableDisplayOptionsIcon from '@atlaskit/icon/glyph/editor/table-display-options';
import VolumeIcon from '@atlaskit/icon/glyph/hipchat/outgoing-sound';
import Button from '@atlaskit/button';
import Select from '@atlaskit/single-select';
import Spinner from '@atlaskit/spinner';
import Corner from 'react-gh-corner';
import Video, { SetPlaybackSpeed, VideoTextTracks } from '../src';
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
  PlaybackSpeedWrapper,
  SubtitlesWrapper,
} from './styled';
import { TimeRange } from './timeRange';

export interface ContentSource {
  content: string;
  value: string;
  textTracks?: VideoTextTracks;
}

export interface PlaybackSpeedSource {
  content: string;
  value: number;
}

export interface AppState {
  currentSource: ContentSource;
  sourceType: ContentType;
  playbackSpeed: number;
}

type ContentType = 'video' | 'audio';
type ContentSourceSelect = Array<{ items: ContentSource[] }>;
type PlaybackSpeedSourceSelect = Array<{ items: PlaybackSpeedSource[] }>;

const audioSrc = 'https://upload.wikimedia.org/wikipedia/en/8/80/The_Amen_Break%2C_in_context.ogg';
const audioSrcError = 'https://upload.wikimedia.org/';
const hdVideoSrc = 'http://vjs.zencdn.net/v/oceans.mp4';
const sdVideoSrc = 'http://vjs.zencdn.net/v/oceans.webm';
const sdVideoSrc2 = 'http://www.onirikal.com/videos/mp4/battle_games.mp4';
const vttSrc =
  'http://gist.githubusercontent.com/samdutton/ca37f3adaf4e23679957b8083e061177/raw/e19399fbccbc069a2af4266e5120ae6bad62699a/sample.vtt';
const errorVideoSrc = 'http://zzarcon';
const chooseContent: ContentSourceSelect = [
  {
    items: [
      {
        value: 'video',
        content: 'video',
      },
      {
        value: 'audio',
        content: 'audio',
      },
    ],
  },
];
const audioSources: ContentSourceSelect = [
  {
    items: [
      { value: audioSrc, content: 'OGG' },
      { value: audioSrcError, content: 'Errored' },
    ],
  },
];
const videoSources: ContentSourceSelect = [
  {
    items: [
      {
        value: hdVideoSrc,
        content: 'HD',
        textTracks: {
          subtitles: { selectedTrackIndex: 0, tracks: [{ src: vttSrc, lang: 'en', label: 'Subtitles (english)' }] },
        },
      },
      {
        value: sdVideoSrc,
        content: 'SD',
        textTracks: {
          subtitles: { selectedTrackIndex: 0, tracks: [{ src: vttSrc, lang: 'en', label: 'Subtitles (english)' }] },
        },
      },
      { value: sdVideoSrc2, content: 'SD - 2' },
      { value: errorVideoSrc, content: 'Errored' },
    ],
  },
];
const playbackSpeeds: PlaybackSpeedSourceSelect = [
  {
    items: [
      { value: 0.5, content: '0.5' },
      { value: 0.75, content: '0.75' },
      { value: 1, content: 'normal' },
      { value: 1.25, content: '1.25' },
      { value: 1.5, content: '1.5' },
      { value: 1.75, content: '1.75' },
      { value: 2, content: '2' },
    ],
  },
];

const selectDefaultSource = (type: ContentType) =>
  type === 'audio' ? audioSources[0].items[0] : videoSources[0].items[0];

const selectDefaultPlaybackSpeed = (playbackSpeed: number) =>
  playbackSpeeds[0].items.find((item) => item.value === playbackSpeed);

export default class App extends Component<{}, AppState> {
  subtitlesTrackRef: React.RefObject<HTMLTrackElement> | undefined;

  state: AppState = {
    currentSource: selectDefaultSource('video'),
    sourceType: 'video',
    playbackSpeed: 1,
  };

  onNavigate = (navigate: Function) => (value: number) => {
    navigate(value);
  };

  onVolumeChange = (setVolume: Function) => (e: any) => {
    const value = e.target.value;
    setVolume(value);
  };

  toggleHD = () => {
    const { currentSource } = this.state;

    this.setState({
      currentSource: currentSource.value === 'HD' ? videoSources[0].items[1] : videoSources[0].items[0],
    });
  };

  onContentSelected = (e: { item: ContentSource }) => {
    this.setState({
      currentSource: e.item,
    });
  };

  renderSpinner = () => {
    return (
      <SpinnerWrapper>
        <Spinner size="xlarge" />
      </SpinnerWrapper>
    );
  };

  switchContent = (e: { item: { value: ContentType; content: ContentType } }) => {
    this.setState({ sourceType: e.item.value, currentSource: selectDefaultSource(e.item.value) });
  };

  private changePlaybackSpeed = (setPlaybackSpeed: SetPlaybackSpeed) => (playbackSpeed: number) => {
    setPlaybackSpeed(playbackSpeed);
    this.setState({ playbackSpeed });
  };

  private getDefaultTimeLocalStorageKey() {
    const { currentSource } = this.state;
    return `react-video-render-default-time-${currentSource.value}`;
  }

  private get defaultTime(): number {
    const savedTime = localStorage.getItem(this.getDefaultTimeLocalStorageKey());

    if (savedTime) {
      return JSON.parse(savedTime);
    } else {
      return 0;
    }
  }

  private onTimeChange = (currentTime: number) => {
    localStorage.setItem(this.getDefaultTimeLocalStorageKey(), JSON.stringify(currentTime));
  };

  render() {
    const { currentSource, sourceType, playbackSpeed } = this.state;

    return (
      <AppWrapper>
        <BuiltWithWrapper>
          Built with{' '}
          <a target="_blank" href="https://github.com/zzarcon/react-video-renderer">
            react-video-renderer
          </a>{' '}
          🎥
        </BuiltWithWrapper>
        <Corner href="https://github.com/zzarcon/react-video-renderer" size={100} />
        <SelectWrapper>
          <Select
            label="Content type"
            items={chooseContent}
            onSelected={this.switchContent}
            defaultSelected={{
              value: 'video',
              content: 'video',
            }}
          />
          <Select
            label="Content src"
            items={sourceType === 'audio' ? audioSources : videoSources}
            defaultSelected={selectDefaultSource(sourceType)}
            onSelected={this.onContentSelected}
          />
        </SelectWrapper>
        <VideoRendererWrapper>
          <Video
            sourceType={sourceType}
            crossOrigin="anonymous"
            src={currentSource.value}
            autoPlay={true}
            textTracks={currentSource.textTracks}
            defaultTime={this.defaultTime}
            onTimeChange={this.onTimeChange}
          >
            {(video, videoState, actions) => {
              const { status, currentTime, buffered, duration, volume, isLoading } = videoState;
              if (status === 'errored') {
                return <ErrorWrapper>Error</ErrorWrapper>;
              }
              const button =
                status === 'playing' ? (
                  <Button iconBefore={<VidPauseIcon label="play" />} onClick={actions.pause} />
                ) : (
                  <Button iconBefore={<VidPlayIcon label="pause" />} onClick={actions.play} />
                );
              const fullScreenButton = sourceType === 'video' && (
                <Button iconBefore={<VidFullScreenOnIcon label="fullscreen" />} onClick={actions.requestFullscreen} />
              );
              const pictureInPictureButton = videoState.isPictureInPictureEnabled && sourceType === 'video' && (
                <Button
                  iconBefore={<EditorTableDisplayOptionsIcon label="pictureinPicture" />}
                  onClick={actions.togglePictureInPicture}
                />
              );
              const hdButton = sourceType === 'video' && <Button onClick={this.toggleHD}>HD</Button>;

              const playbackSpeedSelect = (
                <PlaybackSpeedWrapper>
                  <Select
                    appearance="normal"
                    droplistShouldFitContainer={true}
                    label="Speed"
                    position="bottom center"
                    items={playbackSpeeds}
                    defaultSelected={selectDefaultPlaybackSpeed(playbackSpeed)}
                    onSelected={({ item: { value } }: any) => this.changePlaybackSpeed(actions.setPlaybackSpeed)(value)}
                  />
                </PlaybackSpeedWrapper>
              );

              const currentEnglishSubtitlesCues = videoState.currentActiveCues('subtitles', 'en');
              const subtitles =
                currentEnglishSubtitlesCues && currentEnglishSubtitlesCues.length > 0 ? (
                  <SubtitlesWrapper>
                    {Array.prototype.map.call(currentEnglishSubtitlesCues, (cue: any, index: number) => (
                      <span key={index}>{cue.text}</span>
                    ))}
                  </SubtitlesWrapper>
                ) : undefined;

              return (
                <VideoWrapper>
                  {isLoading && this.renderSpinner()}
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
                          <MutedIndicator isMuted={videoState.isMuted} />
                          <Button onClick={actions.toggleMute} iconBefore={<VolumeIcon label="volume" />} />
                          <input
                            type="range"
                            step={0.01}
                            value={volume}
                            max={1}
                            onChange={this.onVolumeChange(actions.setVolume)}
                          />
                        </VolumeWrapper>
                      </LeftControls>
                      <RightControls>
                        {playbackSpeedSelect}
                        {hdButton}
                        {fullScreenButton}
                        {pictureInPictureButton}
                      </RightControls>
                    </ControlsWrapper>
                  </TimebarWrapper>
                  {subtitles}
                </VideoWrapper>
              );
            }}
          </Video>
        </VideoRendererWrapper>
      </AppWrapper>
    );
  }
}
