# react-video-renderer [![Build Status](https://travis-ci.org/zzarcon/react-video-renderer.svg?branch=master)](https://travis-ci.org/zzarcon/react-video-renderer)
> Build custom video players effortless

* Render props, get all video state passed down as props.
* Bidirectional flow to render and update the video state in a declarative way.
* No side effects out of the box, you just need to build the UI.
* Actions handling: play, pause, mute, unmute, navigate, etc
* Dependency free, [<2KB size](https://bundlephobia.com/result?p=react-video-renderer)
* Cross-browser support, no more browser hacks.

# Demo 🎩

[https://zzarcon.github.io/react-video-renderer](https://zzarcon.github.io/react-video-renderer)

# Installation 🚀

```
$ yarn add react-video-renderer
```

# Usage ⛏

> Render video state and communicate user interactions up when volume or time changes.

```jsx
import Video from 'react-video-renderer';

<Video src="https://mysite.com/video.mp4">
  {(video, state, actions) => (
    <div>
      {video}
      <div>{state.currentTime} / {state.duration} / {state.buffered}</div>
      <progress value={state.currentTime} max={state.duration} onChange={actions.navigate} />
      <progress value={state.volume} max={1} onChange={actions.setVolume} />
      <button onClick={actions.play}>Play</button>
      <button onClick={actions.pause}>Pause</button>
      <button onClick={actions.requestFullScreen}>Fullscreen</button>
    </div>
  )}
</Video>
```

<div align="center">
  <img src="example/video-renderer-flow.png" alt="Logo" >
  <br><br>
</div>

# Api 💅

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
interface VideoState {
  status: 'playing' | 'paused' | 'errored';
  currentTime: number;
  volume: number;
  duration: number;
  buffered: number;
  isMuted: boolean;
  isLoading: boolean;
  error?: MediaError | null;
}
```

**actions**

```typescript
interface VideoActions {
  play: () => void;
  pause: () => void;
  navigate: (time: number) => void;
  setVolume: (volume: number) => void;
  requestFullscreen: () => void;
  mute: () => void;
  unmute: () => void;
  toggleMute: () => void;
}
```

# Error handling 💥

> this is all you need to detect video errors 

```jsx
<Video src="some-error-video.mov">
  {(video, state) => {
    if (state.status === 'errored') {
      return (
        <ErrorWrapper>
          Error
        </ErrorWrapper>
      );
    }

    return (
      <div>
        {video}
      </div>
    )
  }}
</Video>
```

# Loading state ✨

> you can still interact with the player regardless if the video is loading or not

```jsx
<Video src="me-video.mp4">
  {(video, state, actions) => {
    const loadingComponent = state.isLoading ? 'loading...' : undefined;

    return (
      <div>
        {video}
        {loadingComponent}
        <button onClick={actions.play}>Play</button>
        <button onClick={actions.pause}>Pause</button>
      </div>
    )
  }}
</Video>
```

# Author 🧔

[@zzarcon](https://twitter.com/zzarcon)