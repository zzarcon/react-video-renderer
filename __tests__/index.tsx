import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import Video, {
  VideoProps,
  RenderCallback,
  VideoState,
  VideoComponentState, SourceElement
} from '../src';

describe('VideoRenderer', () => {
  const setup = (props?: Partial<VideoProps>) => {
    const src = 'video-url';
    const children = jest.fn().mockImplementation((video) => {
      return video;
    }) as jest.Mock<ReturnType<RenderCallback>, Parameters<RenderCallback>>;

    const component = mount<Video, VideoProps, VideoComponentState>((
      <Video src={src} {...props}>
        {children}
      </Video>
    ));
    const videoActions = children.mock.calls[0][2];

    return {
      component,
      children,
      videoActions
    };
  };

  const simulate = (component: ReactWrapper<VideoProps, VideoComponentState, Video>, event: string, target: any = {}, sourceType: 'video' | 'audio' = 'video') => {
    component.find(sourceType).simulate(event, {
      target
    });
  }

  describe('video element', () => {
    it('should create a video element with the right properties', () => {
      const { children: defaultChildren } = setup();

      expect(defaultChildren.mock.calls[0][0].props).toEqual(expect.objectContaining({
        src: 'video-url',
        preload: 'metadata',
        autoPlay: false,
        controls: false
      }));

      const { children: customChildren } = setup({
        src: 'some-src',
        preload: 'none',
        autoPlay: true,
        controls: true
      });

      expect(customChildren.mock.calls[0][0].props).toEqual(expect.objectContaining({
        src: 'some-src',
        preload: 'none',
        autoPlay: true,
        controls: true
      }));

      expect(customChildren.mock.calls[0][3].current).toEqual(expect.objectContaining<Partial<SourceElement>>({
        currentTime: 0,
      }));
    });

    it('should play new src at the current time when src changes and video is not paused', () => {
      const { component } = setup();
      const instance = component.instance() as Video;

      instance['play'] = jest.fn();
      instance['navigate'] = jest.fn();

      simulate(component, 'timeUpdate', {
        currentTime: 10,
        buffered: {}
      });
      simulate(component, 'play');
      component.setProps({
        src: 'new-src'
      });
      expect(instance['play']).toHaveBeenCalledTimes(1);
      expect(instance['navigate']).toBeCalledWith(10);
      expect(component.prop('src')).toEqual('new-src');
      expect(component.state('currentTime')).toEqual(10);
    });

    it('should start playing from defaultTime point if provided', () => {
      const { children, component } = setup({ defaultTime: 10 });
      const videoElement = children.mock.calls[0][3].current;
      if (!videoElement) {
        return expect(videoElement).toBeDefined();
      }
      simulate(component, 'loadeddata');
      expect(videoElement.currentTime).toEqual(10);
    });

    xit('should return the same video element regardless of re-renders', () => {

    });
  });

  describe('state', () => {
    it('should return initial state', () => {
      const { children } = setup();
      expect(children.mock.calls[0][1]).toEqual({
        currentTime: 0,
        volume: 1,
        status: 'paused',
        isMuted: false,
        isLoading: true,
        duration: 0,
        buffered: 0
      });
    });

    it('should return initial state for audio', () => {
      const { children } = setup({ sourceType: 'audio' });
      expect(children.mock.calls[0][1]).toEqual({
        currentTime: 0,
        volume: 1,
        status: 'paused',
        isMuted: false,
        isLoading: true,
        duration: 0,
        buffered: 0
      });
    });

    it('should return correct state when audio is ready to play', () => {
      const { component, children } = setup({ sourceType: 'audio' });

      simulate(component, 'canPlay', {
        currentTime: 1,
        volume: 0.5,
        duration: 25
      }, 'audio');

      expect(children.mock.calls[1][1]).toEqual({
        currentTime: 1,
        volume: 0.5,
        status: 'paused',
        isMuted: false,
        isLoading: false,
        duration: 25,
        buffered: 0
      });
    });

    it('should return correct state when video is ready to play', () => {
      const { component, children } = setup();

      simulate(component, 'canPlay', {
        currentTime: 1,
        volume: 0.5,
        duration: 25
      });

      expect(children.mock.calls[1][1]).toEqual({
        currentTime: 1,
        volume: 0.5,
        status: 'paused',
        isMuted: false,
        isLoading: false,
        duration: 25,
        buffered: 0
      });
    });

    it('should return the current time whenever time changes', () => {
      const { component, children } = setup();
      simulate(component, 'timeUpdate', {
        currentTime: 1,
        buffered: {}
      });

      expect(children.mock.calls[1][1]).toEqual({
        currentTime: 1,
        volume: 1,
        status: 'paused',
        isMuted: false,
        isLoading: true,
        duration: 0,
        buffered: 0
      });
    });

    it('should return the current time whenever time changes for audio', () => {
      const { component, children } = setup({ sourceType: 'audio' });
      simulate(component, 'timeUpdate', {
        currentTime: 1,
        buffered: {}
      }, 'audio');

      expect(children.mock.calls[1][1]).toEqual({
        currentTime: 1,
        volume: 1,
        status: 'paused',
        isMuted: false,
        isLoading: true,
        duration: 0,
        buffered: 0
      });
    });

    it('should return volume value on change', () => {
      const { component, children } = setup();
      simulate(component, 'volumeChange', {
        volume: 10
      });
      expect(children.mock.calls[1][1]).toEqual({
        currentTime: 0,
        volume: 10,
        status: 'paused',
        duration: 0,
        buffered: 0,
        isMuted: false,
        isLoading: true
      });
    });

    it('should return volume value on change for audio', () => {
      const { component, children } = setup({ sourceType: 'audio' });
      simulate(component, 'volumeChange', {
        volume: 10
      }, 'audio');
      expect(children.mock.calls[1][1]).toEqual({
        currentTime: 0,
        volume: 10,
        status: 'paused',
        duration: 0,
        buffered: 0,
        isMuted: false,
        isLoading: true
      });
    });

    it('should reset duration when video duration changes', () => {
      const { component, children } = setup();
      simulate(component, 'durationChange', {
        duration: 10
      });
      expect(children.mock.calls[1][1]).toEqual({
        currentTime: 0,
        volume: 1,
        isMuted: false,
        isLoading: true,
        status: 'paused',
        duration: 10,
        buffered: 0
      });
    });

    it('should reset duration when audio duration changes', () => {
      const { component, children } = setup({ sourceType: 'audio' });
      simulate(component, 'durationChange', {
        duration: 10
      }, 'audio');
      expect(children.mock.calls[1][1]).toEqual({
        currentTime: 0,
        volume: 1,
        isMuted: false,
        isLoading: true,
        status: 'paused',
        duration: 10,
        buffered: 0
      });
    });

    xit('should return the buffered value', () => {
      // TODO: fake multiple ranges
    });

    it('should return error status when the video is errored', () => {
      const { component } = setup();

      simulate(component, 'error');

      expect(component.state('status')).toEqual('errored');
      expect(component.state('isLoading')).toEqual(false);
    });

    it('should return error status when the audio is errored', () => {
      const { component } = setup({ sourceType: 'audio' });

      simulate(component, 'error', {}, 'audio');

      expect(component.state('status')).toEqual('errored');
      expect(component.state('isLoading')).toEqual(false);
    });

    it('should return right value for isMuted state', () => {
      const { component, children } = setup();

      simulate(component, 'canPlay', {
        currentTime: 1,
        volume: 0,
        duration: 2
      });

      expect(children.mock.calls[1][1]).toEqual({
        currentTime: 1,
        volume: 0,
        isMuted: true,
        isLoading: false,
        status: 'paused',
        duration: 2,
        buffered: 0
      });

      simulate(component, 'volumeChange', {
        volume: 0.1
      });

      expect(children.mock.calls[2][1]).toEqual({
        currentTime: 1,
        volume: 0.1,
        isMuted: false,
        isLoading: false,
        status: 'paused',
        duration: 2,
        buffered: 0
      });
    });

    it('should return right value for isMuted state for audio', () => {
      const { component, children } = setup({ sourceType: 'audio' });

      simulate(component, 'canPlay', {
        currentTime: 1,
        volume: 0,
        duration: 2
      }, 'audio');

      expect(children.mock.calls[1][1]).toEqual({
        currentTime: 1,
        volume: 0,
        isMuted: true,
        isLoading: false,
        status: 'paused',
        duration: 2,
        buffered: 0
      });

      simulate(component, 'volumeChange', {
        volume: 0.1
      }, 'audio');

      expect(children.mock.calls[2][1]).toEqual({
        currentTime: 1,
        volume: 0.1,
        isMuted: false,
        isLoading: false,
        status: 'paused',
        duration: 2,
        buffered: 0
      });
    });

    it('should set loading state when video is waiting', () => {
      const { component, children } = setup();

      simulate(component, 'waiting');
      expect(children.mock.calls[1][1].isLoading).toBeTruthy();
      simulate(component, 'canPlay');
      expect(children.mock.calls[2][1].isLoading).toBeFalsy();
    });

    it('should set loading state when audio is waiting', () => {
      const { component, children } = setup({ sourceType: 'audio' });

      simulate(component, 'waiting', {}, 'audio');
      expect(children.mock.calls[1][1].isLoading).toBeTruthy();
      simulate(component, 'canPlay', {}, 'audio');
      expect(children.mock.calls[2][1].isLoading).toBeFalsy();
    });
  });

  describe('actions', () => {

    it('should set video current time to passed time when navigate is called', () => {
      const { children, videoActions } = setup();

      videoActions.navigate(10);

      const expectedState: Partial<VideoState> = {
        currentTime: 10,
      };
      expect(children).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining(expectedState),
        expect.anything(),
        expect.anything(),
      );
    });

    it('should set audio current time to passed time when navigate is called', () => {
      const { component, videoActions } = setup({ sourceType: 'audio' });
      videoActions.navigate(10);
      expect(component.state().currentTime).toEqual(10);
    });

    it('should play the video when play action is called', () => {
      const { videoActions, children } = setup();
      const videoElement = children.mock.calls[0][3].current;
      if (!videoElement) {
        return expect(videoElement).toBeDefined();
      }
      const playSpy = spyOn(videoElement, 'play');
      videoActions.play();
      expect(playSpy).toHaveBeenCalled();
    });

    it('should pause the video when pause action is called', () => {
      const { videoActions, children } = setup();
      const videoElement = children.mock.calls[0][3].current;
      if (!videoElement) {
        return expect(videoElement).toBeDefined();
      }
      const pauseSpy = spyOn(videoElement, 'pause');
      videoActions.pause();
      expect(pauseSpy).toHaveBeenCalled();
    });

    it('should change video volume when setVolume is called', () => {
      const { children, videoActions } = setup({ sourceType: 'audio' });

      videoActions.setVolume(0.1);

      const expectedState: Partial<VideoState> = {
        volume: 0.1,
      };

      expect(children).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining(expectedState),
        expect.anything(),
        expect.anything(),
      );
    });

    it('should change audio volume when setVolume is called', () => {
      const { children, videoActions } = setup({ sourceType: 'audio' });

      videoActions.setVolume(0.1);

      const expectedState: Partial<VideoState> = {
        volume: 0.1,
      };

      expect(children).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining(expectedState),
        expect.anything(),
        expect.anything(),
      );
    });

    it('should use previous volume value when unmute video', () => {
      const { children, videoActions } = setup({ sourceType: 'audio' });

      videoActions.setVolume(0.3);
      videoActions.mute();
      let expectedState: Partial<VideoState> = {
        volume: 0,
      };
      expect(children).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining(expectedState),
        expect.anything(),
        expect.anything(),
      );
      videoActions.unmute();
      expectedState = {
        volume: 0.3,
      };
      expect(children).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining(expectedState),
        expect.anything(),
        expect.anything(),
      );
    });

    it('should change playback speed when setPlaybackSpeed is called', () => {
      const { videoActions, children } = setup({ sourceType: 'video' });
      const videoElement = children.mock.calls[0][3].current;
      if (!videoElement) {
        return expect(videoElement).toBeDefined();
      }
      videoActions.setPlaybackSpeed(1.5);
      expect(videoElement.playbackRate).toEqual(1.5)
    });
  });

  describe('ref', () => {
    it('should pass dom video ref to render callback', () => {
      const { children } = setup();
      expect(children.mock.calls[0][3].current).toBeInstanceOf(HTMLVideoElement);
    })

    it('should pass dom audio ref to render callback', () => {
      const { children } = setup({ sourceType: 'audio' });
      expect(children.mock.calls[0][3].current).toBeInstanceOf(HTMLAudioElement);
    })
  });

  describe('as audio element', () => {
    it('should create an audio element with the right properties', () => {
      const { children: defaultChildren } = setup({ sourceType: 'audio' });

      expect(defaultChildren.mock.calls[0][0].props).toEqual(expect.objectContaining({
        src: 'video-url',
        preload: 'metadata',
        autoPlay: false,
        controls: false
      }));

      const { children: customChildren } = setup({
        src: 'some-src',
        preload: 'none',
        autoPlay: true,
        controls: true
      });

      expect(customChildren.mock.calls[0][0].props).toEqual(expect.objectContaining({
        src: 'some-src',
        preload: 'none',
        autoPlay: true,
        controls: true
      }));
    });

    it('should play new src at the current time when src changes and audio is not paused', () => {
      const { component } = setup({ sourceType: 'audio' });
      const instance = component.instance() as Video;

      instance['play'] = jest.fn();
      instance['navigate'] = jest.fn();

      simulate(component, 'timeUpdate', {
        currentTime: 10,
        buffered: {}
      }, 'audio');
      simulate(component, 'play', {}, 'audio');
      component.setProps({
        src: 'new-src'
      });
      expect(instance['play']).toHaveBeenCalledTimes(1);
      expect(instance['navigate']).toBeCalledWith(10);
      expect(component.prop('src')).toEqual('new-src');
      expect(component.state('currentTime')).toEqual(10);
    });

    it('should start playing from defaultTime point if provided', () => {
      const { children, component } = setup({ defaultTime: 10, sourceType: 'audio' });
      const videoElement = children.mock.calls[0][3].current;
      if (!videoElement) {
        return expect(videoElement).toBeDefined();
      }
      simulate(component, 'loadeddata', undefined, 'audio');
      expect(videoElement.currentTime).toEqual(10);
    });
  });

  describe('public events', () => {
    it('should raise onCanPlay prop with event when media played', () => {
      const onCanPlay = jest.fn();
      const { component } = setup({
        onCanPlay,
      });
      const instance = component.instance() as Video;
      instance['play'] = jest.fn();
      const e = {
        target: {
          volume: 1,
        },
      } as any;

      simulate(component, 'play');
      component.setProps({
        src: 'new-src',
      });
      instance['onCanPlay'](e);
      expect(onCanPlay).toHaveBeenCalledWith(e);
    });

    it('should raise onError prop with event when media errors', () => {
      const onError = jest.fn();
      const { component } = setup({
        onError,
      });
      const instance = component.instance() as Video;
      instance['play'] = jest.fn();
      const e = {
        target: {
          error: 'some-error',
        },
      } as any;

      simulate(component, 'play');
      component.setProps({
        src: 'new-src',
      });
      instance['onError'](e);
      expect(onError).toHaveBeenCalledWith(e);
      expect(component.state().error).toEqual('some-error');
    });

    it('should notify every other second when play time changes', () => {
      const onTimeChange = jest.fn<
        ReturnType<Required<VideoProps>['onTimeChange']>,
        Parameters<Required<VideoProps>['onTimeChange']>
      >();
      const { component } = setup({
        onTimeChange,
      });

      simulate(component, 'timeUpdate', {
        currentTime: 10.5,
        buffered: {}
      });
      simulate(component, 'timeUpdate', {
        currentTime: 10.6,
        buffered: {}
      });
      simulate(component, 'timeUpdate', {
        currentTime: 11.2,
        buffered: {}
      });
      simulate(component, 'timeUpdate', {
        currentTime: 11.5,
        buffered: {}
      });

      expect(onTimeChange).toHaveBeenCalledTimes(2);
      expect(onTimeChange).toHaveBeenCalledWith(10);
      expect(onTimeChange).toHaveBeenCalledWith(11);
    });
  });
});
