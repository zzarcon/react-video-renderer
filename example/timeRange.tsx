import * as React from 'react';
import { Component } from 'react';
import { TimeLineWrapper, TimeLine, CurrentTimeLine, Thumb, BufferedTime } from './styled';

export interface TimeRangeProps {
  currentTime: number;
  bufferedTime: number;
  duration: number;
  onChange: (newTime: number) => void;
}

export interface TimeRangeState {
  isDragging: boolean;
}

export class TimeRange extends Component<TimeRangeProps, TimeRangeState> {
  state: TimeRangeState = {
    isDragging: false,
  };

  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (e: MouseEvent) => {
    const { isDragging } = this.state;
    if (!isDragging) {
      return;
    }

    const { currentTime, onChange, duration } = this.props;
    const { movementX } = e;
    const thumbCorrection = 65;
    const movementPercentage =
      Math.abs(movementX) * 100 / duration / thumbCorrection;

    onChange(
      currentTime + (movementX > 0 ? movementPercentage : -movementPercentage),
    );
  };

  onMouseUp = () => {
    this.setState({
      isDragging: false,
    });
  };

  onThumbMouseDown = () => {
    this.setState({
      isDragging: true,
    });
  };

  onNavigate = (e: any) => {
    const { duration, onChange } = this.props;
    const event = e.nativeEvent;
    const x = event.x;
    const width = e.currentTarget.getBoundingClientRect().width;
    const currentTime = x * duration / width;

    onChange(currentTime);
  };

  render() {
    const { currentTime, duration, bufferedTime } = this.props;
    const currentPosition = currentTime * 100 / duration;
    const bufferedTimePercentage = bufferedTime * 100 / duration;

    return (
      <TimeLineWrapper>
        <TimeLine onClick={this.onNavigate}>
          <BufferedTime style={{ width: `${bufferedTimePercentage}%` }} />
          <CurrentTimeLine style={{ width: `${currentPosition}%` }}>
            <Thumb onMouseDown={this.onThumbMouseDown} />
          </CurrentTimeLine>
        </TimeLine>
      </TimeLineWrapper>
    );
  }
}
