import * as React from 'react';
import {Component, ReactNode} from 'react';
import {requestFullScreen} from './utils';

export type ContentStatus = 'playing' | 'paused' | 'errored';
export type ContentError = MediaError | null;
export interface ContentState {
  status: ContentStatus;
  currentTime: number;
  volume: number;
  duration: number;
  buffered: number;
  isMuted: boolean;
  isLoading: boolean;
  error?: ContentError;
}

export type NavigateFunction = (time: number) => void;
export type SetVolumeFunction = (volume: number) => void;

export interface ContentActions {
  play: () => void;
  pause: () => void;
  navigate: NavigateFunction;
  setVolume: SetVolumeFunction;
  mute: () => void;
  unmute: () => void;
  toggleMute: () => void;
  requestFullscreen: () => void;
}

export type ContentRenderCallback = (audioElement: ReactNode, state: ContentState, actions: ContentActions) => ReactNode;

export interface ContentProps {
  type: 'video' | 'audio'
  src: string;
  children: ContentRenderCallback;
  controls?: boolean;
  autoPlay?: boolean;
  preload?: string;
}

export interface ContentComponentState {
  currentTime: number;
  volume: number;
  status: ContentStatus;
  duration: number;
  buffered: number;
  isMuted: boolean;
  isLoading: boolean;
  error?: ContentError;
}

export type ContentElement = HTMLVideoElement | HTMLAudioElement;

const getVolumeFromContent = (content: ContentElement): {volume: number, isMuted: boolean} => {
  const volume = content.volume;
  const isMuted = volume === 0;

  return {
    volume,
    isMuted
  };
};

export class AudioVideo extends Component<ContentProps, ContentComponentState> {
  contentElement: ContentElement;

  state: ContentComponentState = {
    isLoading: true,
    buffered: 0,
    currentTime: 0,
    volume: 1,
    status: 'paused',
    duration: 0,
    isMuted: false
  }

  constructor(props: ContentProps) {
    super(props);
    const {type} = this.props;
    // Initializing with an empty element to make TS happy
    this.contentElement = document.createElement(type);
  }

  static defaultProps: Partial<ContentProps> = {
    autoPlay: false,
    controls: false,
    preload: 'metadata'
  }

  componentDidUpdate(prevProps: ContentProps) {
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

  onVolumeChange = (e: any) => {
    const content = e.target as ContentElement;
    const {volume, isMuted} = getVolumeFromContent(content);
    
    this.setState({
      volume,
      isMuted
    });
  }

  onTimeUpdate = (e: any) => {
    const video = e.target as HTMLVideoElement;

    this.setState({
      currentTime: video.currentTime
    });

    if (video.buffered.length) {
      const buffered = video.buffered.end(video.buffered.length - 1);

      this.setState({buffered});
    }
  }

  onCanPlay = (e: any) => {
    const content = e.target as ContentElement;
    const {volume, isMuted} = getVolumeFromContent(content);

    this.setState({
      volume,
      isMuted,
      isLoading: false,
      currentTime: content.currentTime,
      duration: content.duration
    });
  }

  onPlay = () => {
    this.setState({
      status: 'playing'
    });
  }

  onPause = (e: any) => {
    const video = e.target as ContentElement;
    
    this.setState({
      status: 'paused'
    });
  } 

  get contentState(): ContentState {
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

  play = () => {
    this.contentElement.play();
  }

  pause = () => {
    this.contentElement.pause();
  }

  navigate = (time: number) => {
    this.setState({currentTime: time});
    this.contentElement.currentTime = time;
  }

  setVolume = (volume: number) => {
    this.setState({volume});
    this.contentElement.volume = volume;
  }

  requestFullscreen = () => {
    const {type} = this.props;
    if (type === 'video') {
      requestFullScreen(this.contentElement as HTMLVideoElement);
    }
  }

  mute = () => {
    this.setVolume(0);
  }

  unmute = () => {
    // TODO: Set volume to previous value before mutting
    this.setVolume(0.5);
  }

  toggleMute = () => {
    const {volume} = this.contentState;

    if (volume > 0) {
      this.mute();
    } else {
      this.unmute();
    }
  }

  get actions(): ContentActions {
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

  saveContentRef = (element: ContentElement) => {
    if (!element) {return;}

    this.contentElement = element;
  }

  onDurationChange = (e: any) => {
    const content = e.target as ContentElement;
    
    this.setState({
      duration: content.duration
    });
  }

  onError = (e: any) => {
    const content = e.target as ContentElement;
    
    this.setState({
      isLoading: false,
      status: 'errored',
      error: content.error
    });
  }

  onWaiting = () => {
    this.setState({ isLoading: true });
  }

  render() {
    const {contentState, actions} = this;
    const {type, src, children, autoPlay, controls, preload} = this.props;
    const TagName = type;

    return children(
      <TagName
        ref={this.saveContentRef}
        src={src}
        preload={preload}
        controls={controls}
        autoPlay={autoPlay}
        onPlay={this.onPlay}
        onPause={this.onPause}
        onVolumeChange={this.onVolumeChange}
        onTimeUpdate={this.onTimeUpdate}
        onCanPlay={this.onCanPlay}
        onDurationChange={this.onDurationChange}
        onError={this.onError}
        onWaiting={this.onWaiting}
      />,
      contentState,
      actions      
    );
  }
}
