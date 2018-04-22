import styled, {injectGlobal} from 'styled-components';

injectGlobal`
  body {
    background-color: lavender;
  }
`;

export const AppWrapper = styled.div`
  width: 1000px;
  margin: 0 auto;
  text-align: center;
  padding: 10px;
`;

export const Timebar = styled.progress`

`;

export const TimebarWrapper = styled.div`
  display: flex;
  align-items: center;
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