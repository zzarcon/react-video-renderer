import * as React from 'react';
import {shallow, mount} from 'enzyme';
import Video, {VideoProps} from '../src';

describe('VideoRenderer', () => {
  const setup = (props?: Partial<VideoProps>) => {
    const src = 'video-url';
    const children = jest.fn().mockImplementation((video) => {
      return video;
    });
    const component = shallow((
      <Video src={src} {...props}>
        {children}
      </Video>
    ));

    return {
      component,
      children
    };
  };

  describe('video element', () => {
    it('should create a video element with the right properties', () => {
      const {children: defaultChildren} = setup();

      expect(defaultChildren.mock.calls[0][0].props).toEqual(expect.objectContaining({
        src: 'video-url',
        preload: 'metadata',
        autoPlay: false,
        controls: false
      }));

      const {children: customChildren} = setup({
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
      const {component, children} = setup();
      const instance = component.instance() as Video;

      instance.play = jest.fn();
      instance.navigate = jest.fn();

      component.find('video').simulate('timeUpdate', {
        target: {
          currentTime: 10,
          buffered: {}
        }
      });
      component.find('video').simulate('play');
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
    it('should return initial state when video is ready to play', () => {
      const {component, children} = setup();

      component.find('video').simulate('canPlay', {
        target: {
          currentTime: 1,
          volume: 0.5,
          duration: 25
        }
      });

      expect(children.mock.calls[1][1]).toEqual({
        currentTime: 1,
        volume: 0.5,
        status: 'paused',
        duration: 25,
        buffered: 0
      });
    });

    it('should return the current time whenever time changes', () => {
      const {component, children} = setup();
      component.find('video').simulate('timeUpdate', {
        target: {
          currentTime: 1,
          buffered: {}
        }
      });

      expect(children.mock.calls[1][1]).toEqual({
        currentTime: 1,
        volume: 0,
        status: 'paused',
        duration: 0,
        buffered: 0
      });
    });

    it('should return volume value on change', () => {
      const {component, children} = setup();
      component.find('video').simulate('volumeChange', {
        target: {
          volume: 10
        }
      });
      expect(children.mock.calls[1][1]).toEqual({
        currentTime: 0,
        volume: 10,
        status: 'paused',
        duration: 0,
        buffered: 0
      });
    });

    it('should reset duration when video duration changes', () => {
      const {component, children} = setup();
      component.find('video').simulate('durationChange', {
        target: {
          duration: 10
        }
      });
      expect(children.mock.calls[1][1]).toEqual({
        currentTime: 0,
        volume: 0,
        status: 'paused',
        duration: 10,
        buffered: 0
      });
    });

    xit('should return the buffered value', () => {
      // TODO: fake multiple ranges
    });

    it('should return error status when the video is errored', () => {
      const {component, children} = setup();

      component.find('video').simulate('error');

      expect(component.state('status')).toEqual('errored');
    });
  });

  describe('actions', () => {
    xit('should set video current time to passed time when navigate is called', () => {

    });

    xit('should play the video when play action is called', () => {

    });

    xit('should pause the video when pause action is called', () => {

    });

    xit('should change video volume when setVolume is called', () => {

    });

    xit('should enter full screen mode when requestFullscreen action is called', () => {

    });
  });
});
