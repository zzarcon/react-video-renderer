import * as React from 'react';
import {Component, ReactNode} from 'react';
import {requestFullScreen} from './utils';

export type VideoStatus = 'playing' | 'paused';

export interface VideoState {
  status: VideoStatus;
  currentTime: number;
  volume: number;
  duration: number;
  buffered: number;
  // isMutted: boolean; // TODO: implement
}

export interface VideoActions {
  play: () => void;
  pause: () => void;
  navigate: (time: number) => void;
  setVolume: (volume: number) => void;
  requestFullscreen: () => void;
  mute: () => void;
  unmute: () => void;
  toggleMute: () => void;
}

export type RenderCallback = (videoElement: ReactNode, state: VideoState, actions: VideoActions) => ReactNode;
export interface VideoProps {
  src: string;
  children: RenderCallback;
  controls?: boolean;
  autoPlay?: boolean;
  preload?: string;
}

export interface VideoComponentState {
  currentTime: number;
  volume: number;
  status: VideoStatus;
  duration: number;
  buffered: number;
}

export class Video extends Component<VideoProps, VideoComponentState> {
  videoElement: HTMLVideoElement;

  state: VideoComponentState = {
    buffered: 0,
    currentTime: 0,
    volume: 0,
    status: 'paused',
    duration: 0
  }

  static defaultProps: Partial<VideoProps> = {
    autoPlay: false,
    controls: false,
    preload: 'metadata'
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

  onVolumeChange = (e: any) => {
    const video = e.target as HTMLVideoElement;
    
    this.setState({
      volume: video.volume
    })
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
    const video = e.target as HTMLVideoElement;
    
    this.setState({
      currentTime: video.currentTime,
      volume: video.volume,
      duration: video.duration
    });
  }

  onPlay = (e: any) => {
    this.setState({
      status: 'playing'
    });
  }

  onPause = (e: any) => {
    const video = e.target as HTMLVideoElement;
    
    this.setState({
      status: 'paused'
    });
  } 

  get videoState(): VideoState {
    const {currentTime, volume, status, duration, buffered} = this.state;

    return {
      currentTime,
      volume,
      status,
      duration,
      buffered
    };
  }

  play = () => {
    this.videoElement.play();
  }

  pause = () => {
    this.videoElement.pause();
  }

  navigate = (time: number) => {
    this.setState({currentTime: time});
    this.videoElement.currentTime = time;
  }

  setVolume = (volume: number) => {
    this.setState({volume});
    this.videoElement.volume = volume;
  }

  requestFullscreen = () => {
    requestFullScreen(this.videoElement);
  }

  mute = () => {
    this.setVolume(0);
  }

  unmute = () => {
    // TODO: Set volume to previous value before mutting
    this.setVolume(0.5);
  }

  toggleMute = () => {
    const {volume} = this.videoState;

    if (volume > 0) {
      this.mute();
    } else {
      this.unmute();
    }
  }

  get actions(): VideoActions {
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

  saveVideoRef = (element: HTMLVideoElement) => {
    if (!element) {return;}

    this.videoElement = element;
  }

  onDurationChange = (e: any) => {
    const video = e.target as HTMLVideoElement;
    
    this.setState({
      duration: video.duration
    });
  }

  onError = (e) => {

  }

  render() {
    const {videoState, actions} = this;
    const {src, children, autoPlay, controls, preload} = this.props;

    return children(
      <video
        ref={this.saveVideoRef}
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
      />,
      videoState,
      actions      
    );
  }
}
