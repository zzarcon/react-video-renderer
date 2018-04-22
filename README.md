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