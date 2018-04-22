# react-video-renderer [![Build Status](https://travis-ci.org/zzarcon/react-video-renderer.svg?branch=master)](https://travis-ci.org/zzarcon/react-video-renderer)
> Videos in React with render props

Build custom video players with ease. react-video-renderer gives you all you need to build beautiful video players,you just need to build the UI.
It provides a bidirectional flow that allows you to render and update the state of the video in a declarative way. It removes annoying stuff like cross-browser support, state, etc, that you have to deal with when building custom video players.

# Demo

[https://zzarcon.github.io/react-video-renderer](https://zzarcon.github.io/react-video-renderer)

# Installation

```
$ yarn add react-video-renderer
```

# Usage
```jsx
import Video from 'react-video-renderer';

<Video src="https://mysite.com/video.mp4">
  {(video, state, actions) => {
    <div>
      {video}
      <div>{state.currentTime} / {state.duration} / {state.buffered}</div>
      <progress value={state.currentTime} max={state.duration} onChange={actions.navigate} />
      <progress value={state.volume} max={1} onChange={actions.setVolume} />
      <button onClick={actions.play}>Play</button>
      <button onClick={actions.pause}>Pause</button>
      <button onClick={actions.requestFullScreen}>Fullscreen</button>
    </div>
  }}
</Video>
```

<div align="center">
  <img src="example/video-renderer-flow.png" alt="Logo" >
  <br><br>
</div>
# Api

**props**

```typescript
interface Props {
  src: string;
  children: RenderCallback;
  controls?: boolean;
  autoPlay?: boolean;
  preload?: string;
}
```

**render method**

```typescript
type RenderCallback = (videoElement: ReactNode, state: VideoState, actions: VideoActions) => ReactNode;
```

**state**

```typescript
type VideoStatus = 'playing' | 'paused';

interface State {
  status: VideoStatus;
  currentTime?: number;
  volume?: number;
  duration?: number;
  buffered: number;
}
```

**actions**

```typescript
interface Actions {
  play: () => void;
  pause: () => void;
  navigate: (time: number) => void;
  setVolume: (volume: number) => void;
  requestFullscreen: () => void;
}
```