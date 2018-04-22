export const requestFullScreen = (element: HTMLVideoElement) => {
  const methods = ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen'];
  const methodName = methods.find(name => element[name]);
  
  element[methodName]();
}