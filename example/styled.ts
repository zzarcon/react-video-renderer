import styled, {injectGlobal} from 'styled-components';

injectGlobal`
  * {
    padding: 0;
    margin: 0;
  }

  .cdSVOz, .grZUYY {
    color: white !important;
  }
`;

export const AppWrapper = styled.div`
  
`;

export const Timebar = styled.progress`

`;

export const TimebarWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`;

export interface VolumeWrapperProps {
  isMuted: boolean;
}

export const MutedIndicator = styled.div`
  width: 29px;
  height: 2px;
  position: absolute;
  top: 5px;
  left: 9px;
  background: white;
  transform: rotate(32deg) translateY(10px);
  opacity: 0;
  pointer-events: none;

  ${(props: VolumeWrapperProps) => props.isMuted ? `
    opacity: 1;
  ` : ''}
`;

export const VolumeWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  width: 35px;
  overflow: hidden;
  transition: width .3s ease-out; 
  transition-delay: 1s;

  input {
    margin-left: 20px;
  }

  &:hover {
    width: 165px;
    transition: width .3s
  }
  &:active {
    width: 165px;
    transition: width .3s
  }
`;

export const TimeWrapper = styled.div`
  width: 700px;
  margin-right: 30px;
`;

export const CurrentTime = styled.div`
  width: 60px;
`;

export const BufferedProgress = styled.progress`
  width: 100%;
`;

export const TimeLine = styled.div`
  width: 100%;
  height: 3px;
  background-color: rgba(255,255,255,.2);
  border-radius: 5px;
  position: relative;
`;

export const CurrentTimeLine = styled.div`
  background-color: #f00;
  border-radius: inherit;
  height: inherit;
  position: absolute;
  top: 0;
`;

export const Thumb = styled.div`
  width: 13px;
  height: 13px;
  border-radius: 100%;
  background-color: #f00;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
`;

export const BufferedTime = styled.div`
  background-color: rgba(255,255,255,.4);
  height: inherit;
  border-radius: inherit;
`;

export const TimeRangeWrapper = styled.div`

`;

export const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #eee;
  user-select: none;
  font-size: 13px;
  justify-content: space-between;
  margin: 10px;
`;

export const TimeLineWrapper = styled.div`
  cursor: pointer;
  height: 20px;
  display: flex;
  align-items: center;

  &:hover {
    ${TimeLine} {
      height: 6px;
    }
    ${CurrentTimeLine} {
      min-width: 13px;
    }
  }
`;

export const LeftControls = styled.div`
  display: flex;
  align-items: center;
`;

export const RightControls = styled.div`
  display: flex;
  align-items: center;
`;

export const VideoWrapper = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const ErrorWrapper = styled.div`
  color: white;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 25px;
`

export const SelectWrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
`;

export const VideoRendererWrapper = styled.div`
  text-align: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  overflow: hidden;
  background: black;
  height: calc(100% - 135px);
  margin-top: 17px;
`;

export const SpinnerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const BuiltWithWrapper = styled.div`
  position: absolute;
  left: 20px;
  top: 20px;
  font-size: 20px;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 5px;
  
  a {
    color: black;
  }
`;

export const PlaybackSpeedWrapper = styled.div`
  background: white;
  padding-top: 80px;
`;