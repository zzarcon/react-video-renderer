import * as React from 'react';
import {Component} from 'react';
import {AppWrapper} from './styled';

export interface AppState {
  
}

export default class App extends Component <{}, AppState> {
  state: AppState = {
    
  }

  render() {
    return (
      <AppWrapper>
        Example!
      </AppWrapper>
    )
  }
}