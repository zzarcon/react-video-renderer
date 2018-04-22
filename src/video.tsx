import * as React from 'react';
import {Component, ReactNode} from 'react';
import {requestFullScreen} from './utils';

export type VideoStatus = 'playing' | 'paused';

// TODO: Improve interface, don't make everything optional
export interface VideoState {
  status: VideoStatus;
  currentTime?: number;
  volume?: number;
  duration?: number;
  buffered: number;
}

export interface VideoActions {
  play: () => void;
  pause: () => void;
  navigate: (time: number) => void;
  setVolume: (volume: number) => void;
  requestFullscreen: () => void;
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
  video?: HTMLVideoElement;
  currentTime?: number;
  volume?: number;
  status?: VideoStatus;
  duration?: number;
  buffered: number;
}

export class Video extends Component<VideoProps, VideoComponentState> {
  videoElement: HTMLVideoElement;

  state: VideoComponentState = {
    buffered: 0
  }

  static defaultProps: Partial<VideoProps> = {
    autoPlay: false,
    controls: false,
    preload: 'metadata'
  }

  componentDidUpdate(prevProps: VideoProps) {
    const {src} = this.props;
    const {currentTime} = this.state;
    const hasSrcChanged = prevProps.src !== src;
    
    if (hasSrcChanged) {
      this.play();
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
    const video = e.target as HTMLVideoElement;
    
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

  get actions(): VideoActions {
    const {play, pause, navigate, setVolume, requestFullscreen} = this;

    return {
      play,
      pause,
      navigate,
      setVolume,
      requestFullscreen
    };
  }

  saveVideoRef = (element: HTMLVideoElement) => {
    this.videoElement = element;
  }

  onDurationChange = (e: any) => {
    const video = e.target as HTMLVideoElement;
    
    this.setState({
      duration: video.duration
    });
  }

  render() {
    const {videoState, actions} = this;
    const {video} = this.state;
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
      />,
      videoState,
      actions      
    );
  }
}
