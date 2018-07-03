export const requestFullScreen = (element: HTMLVideoElement) => {
  const methods = ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen'];
  const methodName = (methods as any).find((name: string) => (element as any)[name]);
  
  (element as any)[methodName]();
}