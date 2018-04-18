import * as React from 'react';
import {Component, ReactNode} from 'react';

export type VideoStatus = 'playing' | 'paused';

export interface VideoState {
  currentTime?: number;
  volume?: number;
  status: VideoStatus;
  duration?: number;
}

export interface VideoActions {
  play: () => void;
  pause: () => void;
  navigate: (time: number) => void;
  setVolume: (volume: number) => void;
}

export interface VideoProps {
  src: string;
  children: (videoElement: ReactNode, state: VideoState, actions: VideoActions) => ReactNode;
  controls?: boolean;
  autoPlay?: boolean;
}

export interface VideoComponentState {
  video?: HTMLVideoElement;
  currentTime?: number;
  volume?: number;
  status?: VideoStatus;
  duration?: number;
}

export class Video extends Component<VideoProps, VideoComponentState> {
  videoElement: HTMLVideoElement;

  state: VideoComponentState = {
    
  }

  static defaultProps: Partial<VideoProps> = {
    autoPlay: false,
    controls: false
  }
  
  onVolumeChange = (e: any) => {
    const video = e.target as HTMLVideoElement;
    
    this.setState({
      volume: video.volume
    })
  }

  onLoadedMetadata = (e: any) => {
    // console.log(e.target)
  }

  onTimeUpdate = (e: any) => {
    const video = e.target as HTMLVideoElement;

    this.setState({
      currentTime: video.currentTime
    });
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
    const {currentTime, volume, status, duration} = this.state;

    return {
      currentTime,
      volume,
      status,
      duration
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

  get actions(): VideoActions {
    const {play, pause, navigate, setVolume} = this;

    return {
      play,
      pause,
      navigate,
      setVolume
    };
  }

  saveVideoRef = (element: HTMLVideoElement) => {
    this.videoElement = element;
  }

  render() {
    const {videoState, actions} = this;
    const {video} = this.state;
    const {src, children, autoPlay, controls} = this.props;

    return children(
      <video
        ref={this.saveVideoRef}
        src={src}
        preload="metadata"
        controls={controls}
        autoPlay={autoPlay}
        onPlay={this.onPlay}
        onPause={this.onPause}
        onVolumeChange={this.onVolumeChange}
        onLoadedMetadata={this.onLoadedMetadata}
        onTimeUpdate={this.onTimeUpdate}
        onCanPlay={this.onCanPlay}
      />,
      videoState,
      actions      
    );
  }
}
