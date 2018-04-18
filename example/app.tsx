import * as React from 'react';
import {Component} from 'react';
import Video from '../src';
import {AppWrapper, TimebarWrapper, Timebar} from './styled';

export interface AppState {
  
}

const videoSrc = 'http://vjs.zencdn.net/v/oceans.mp4';

export default class App extends Component <{}, AppState> {
  state: AppState = {
    
  }

  render() {
    return (
      <AppWrapper>
        <Video src={videoSrc} >
          {(video, videoState, actions) => {
            const button = videoState.status === 'playing' ? <button onClick={actions.pause}>Pause</button> : <button onClick={actions.play}>Play</button>;

            return (
              <div>
                {video}
                <TimebarWrapper>
                  <div>
                    {button}
                  </div> 
                  <div>
                    {Math.round(videoState.currentTime)} / {Math.round(videoState.duration)}
                  </div>
                  <Timebar value={videoState.currentTime} max={videoState.duration} />
                  <progress value={videoState.volume} max="1" />
                </TimebarWrapper>                
              </div>
            );
          }}
        </Video>
      </AppWrapper>
    )
  }
}