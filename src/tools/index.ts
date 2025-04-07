export function convertSecondToTime(second: number): string {
  let minutes = Math.floor(second / 60);
  let seconds = Math.floor(second % 60);
  if (minutes < 60) {
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }
  let hours = Math.floor(minutes / 60);
  minutes = Math.floor(minutes % 60);
  return `${hours}:${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
}
