import styled, {injectGlobal} from 'styled-components';

injectGlobal`
  * {
    padding: 0;
    margin: 0;
  }
`;

export const AppWrapper = styled.div`
  text-align: center;
  padding: 10px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  overflow: hidden;
  background: black;
  height: calc(100% - 100px);
`;

export const Timebar = styled.progress`

`;

export const TimebarWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`;

export const VolumeWrapper = styled.div`
  flex: 1;
  margin-right: 10px;
`;

export const TimeWrapper = styled.div`
  width: 700px;
  margin-right: 30px;
`;

export const CurrentTime = styled.div`
  width: 100px;
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
  cursor: pointer;
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
`;

export const TimeLineWrapper = styled.div`
  height: 20px;
  display: flex;
  align-items: center;

  &:hover ${TimeLine} {
    height: 6px;
  }
`;