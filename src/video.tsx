import * as React from 'react';
import {Component, ReactNode, SyntheticEvent, RefObject} from 'react';
import {requestFullScreen} from './utils';

export type VideoStatus = 'playing' | 'paused' | 'errored';
export type VideoError = MediaError | null;
export interface VideoState {
  status: VideoStatus;
  currentTime: number;
  volume: number;
  duration: number;
  buffered: number;
  isMuted: boolean;
  isLoading: boolean;
  error?: VideoError;
}

export type NavigateFunction = (time: number) => void;
export type SetVolumeFunction = (volume: number) => void;

export interface VideoActions {
  play: () => void;
  pause: () => void;
  navigate: NavigateFunction;
  setVolume: SetVolumeFunction;
  requestFullscreen: () => void;
  mute: () => void;
  unmute: () => void;
  toggleMute: () => void;
}

export type RenderCallback = (videoElement: ReactNode, state: VideoState, actions: VideoActions, ref: RefObject<SourceElement>) => ReactNode;
export interface VideoProps {
  src: string;
  children: RenderCallback;
  sourceType?: 'video' | 'audio';
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  preload?: string;
  poster?: string;
  crossOrigin?: string;
  onCanPlay?: (event: SyntheticEvent<SourceElement>) => void;
  onError?: (event: SyntheticEvent<SourceElement>) => void;
}

export interface VideoComponentState {
  currentTime: number;
  volume: number;
  status: VideoStatus;
  duration: number;
  buffered: number;
  isMuted: boolean;
  isLoading: boolean;
  error?: VideoError;
}

const getVolumeFromVideo = (video: SourceElement): {volume: number, isMuted: boolean} => {
  const volume = video.volume;
  const isMuted = volume === 0;

  return {
    volume,
    isMuted
  };
};

export type SourceElement = HTMLVideoElement | HTMLAudioElement;
const isSafari = typeof navigator !== 'undefined' ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : false;

export class Video extends Component<VideoProps, VideoComponentState> {
  previousVolume: number = 1;
  mediaRef: RefObject<SourceElement> = React.createRef();

  state: VideoComponentState = {
    isLoading: true,
    buffered: 0,
    currentTime: 0,
    volume: 1,
    status: 'paused',
    duration: 0,
    isMuted: false
  }

  static defaultProps: Partial<VideoProps> = {
    sourceType: 'video',
    autoPlay: false,
    controls: false,
    preload: isSafari ? 'auto' : 'metadata'
  }

  componentDidUpdate(prevProps: VideoProps) {
    const {src} = this.props;
    const {currentTime, status} = this.state;
    const hasSrcChanged = prevProps.src !== src;

    if (hasSrcChanged) {
      // TODO: add test to cover this case
      if (status === 'playing') {
        this.play();
      }

      this.navigate(currentTime);
    }
  }

  private onVolumeChange = (event: SyntheticEvent<SourceElement>) => {
    const video = event.target as SourceElement;
    const {volume, isMuted} = getVolumeFromVideo(video);
    
    this.setState({
      volume,
      isMuted
    });
  }

  private onTimeUpdate = (event: SyntheticEvent<SourceElement>) => {
    const video = event.target as SourceElement;

    this.setState({
      currentTime: video.currentTime
    });

    if (video.buffered.length) {
      const buffered = video.buffered.end(video.buffered.length - 1);

      this.setState({buffered});
    }
  }

  private onCanPlay = (event: SyntheticEvent<SourceElement>) => {
    const {onCanPlay} = this.props;
    const video = event.target as SourceElement;
    const {volume, isMuted} = getVolumeFromVideo(video);

    this.setState({
      volume,
      isMuted,
      isLoading: false,
      currentTime: video.currentTime,
      duration: video.duration
    });

    onCanPlay && onCanPlay(event);
  }

  private onPlay = () => {
    this.setState({
      status: 'playing'
    });
  }

  private onPause = () => {    
    this.setState({
      status: 'paused'
    });
  } 

  private get videoState(): VideoState {
    const {currentTime, volume, status, duration, buffered, isMuted, isLoading, error} = this.state;

    return {
      currentTime,
      volume,
      status,
      duration,
      buffered,
      isMuted,
      isLoading,
      error
    };
  }

  private play = () => {
    this.mediaRef.current && this.mediaRef.current.play();
  }

  private pause = () => {
    this.mediaRef.current && this.mediaRef.current.pause();
  }

  private navigate = (time: number) => {
    this.setState({currentTime: time});
    this.mediaRef.current && (this.mediaRef.current.currentTime = time);
  }

  private setVolume = (volume: number) => {
    this.setState({volume});
    if (this.mediaRef.current) {
      this.mediaRef.current.volume = volume;
      this.mediaRef.current.muted = (volume === 0);
    }
  }

  private requestFullscreen = () => {
    const {sourceType} = this.props;
    if (sourceType === 'video') {
      requestFullScreen(this.mediaRef.current as HTMLVideoElement);
    }
  }

  private mute = () => {
    const {volume} = this.state;

    this.previousVolume = volume;
    this.setVolume(0);
  }

  private unmute = () => {
    this.setVolume(this.previousVolume);
  }

  private toggleMute = () => {
    const {volume} = this.videoState;

    if (volume > 0) {
      this.mute();
    } else {
      this.unmute();
    }
  }

  private get actions(): VideoActions {
    const {play, pause, navigate, setVolume, requestFullscreen, mute, unmute, toggleMute} = this;

    return {
      play,
      pause,
      navigate,
      setVolume,
      requestFullscreen,
      mute,
      unmute,
      toggleMute
    };
  }

  private onDurationChange = (event: SyntheticEvent<SourceElement>) => {
    const video = event.target as SourceElement;
    
    this.setState({
      duration: video.duration
    });
  }

  private onError = (event: SyntheticEvent<SourceElement>) => {
    const {onError} = this.props;
    const video = event.target as SourceElement;
    
    this.setState({
      isLoading: false,
      status: 'errored',
      error: video.error
    });

    onError && onError(event);
  }

  private onWaiting = () => {
    this.setState({ isLoading: true });
  }

  render() {
    const {videoState, actions} = this;
    const {sourceType, poster, src, children, autoPlay, controls, muted, playsInline, preload, crossOrigin} = this.props;
    const TagName = sourceType || 'video'; // otherwise ts complains about not being able to create React component from TagName

    return children(
      <TagName
        ref={this.mediaRef}
        poster={poster}
        src={src}
        preload={preload}
        controls={controls}
        muted={muted}
        playsInline={playsInline}
        autoPlay={autoPlay}
        onPlay={this.onPlay}
        onPause={this.onPause}
        onVolumeChange={this.onVolumeChange}
        onTimeUpdate={this.onTimeUpdate}
        onCanPlay={this.onCanPlay}
        onDurationChange={this.onDurationChange}
        onError={this.onError}
        onWaiting={this.onWaiting}
        crossOrigin={crossOrigin}
      />,
      videoState,
      actions,
      this.mediaRef  
    );
  }
}
