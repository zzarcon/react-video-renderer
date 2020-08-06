import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import Video, {
  VideoProps,
  RenderCallback,
  VideoState,
  VideoComponentState
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

  const simulate = (component: ReactWrapper<VideoProps, VideoComponentState, Video>, event: string, target: any = {}) => {
    component.find('video').simulate(event, {
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
    });

    it('should play new src at the current time when src changes and video is not paused', () => {
      const { component } = setup();
      const instance = component.instance() as Video;

      instance.play = jest.fn();
      instance.navigate = jest.fn();

      simulate(component, 'timeUpdate', {
        currentTime: 10,
        buffered: {}
      });
      simulate(component, 'play');
      component.setProps({
        src: 'new-src'
      });
      expect(instance.play).toHaveBeenCalledTimes(1);
      expect(instance.navigate).toBeCalledWith(10);
      expect(component.prop('src')).toEqual('new-src');
      expect(component.state('currentTime')).toEqual(10);
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

    xit('should return the buffered value', () => {
      // TODO: fake multiple ranges
    });

    it('should return error status when the video is errored', () => {
      const { component } = setup();

      simulate(component, 'error');

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

    it('should set loading state when video is waiting', () => {
      const { component, children } = setup();

      simulate(component, 'waiting');
      expect(children.mock.calls[1][1].isLoading).toBeTruthy();
      simulate(component, 'canPlay');
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
        expect.anything()
      );
    });

    it('should play the video when play action is called', () => {
      const { videoActions, component } = setup();
      const playSpy = spyOn(component.instance().videoElement, 'play');
      videoActions.play();
      expect(playSpy).toHaveBeenCalled();
    });

    it('should pause the video when pause action is called', () => {
      const { videoActions, component } = setup();
      const pauseSpy = spyOn(component.instance().videoElement, 'pause');
      videoActions.pause();
      expect(pauseSpy).toHaveBeenCalled();
    });

    it('should change video volume when setVolume is called', () => {
      const { children, videoActions } = setup();

      videoActions.setVolume(0.1);

      const expectedState: Partial<VideoState> = {
        volume: 0.1,
      };

      expect(children).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining(expectedState),
        expect.anything()
      );
    });
  });
});
