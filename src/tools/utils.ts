export function convertSecondToTime(second: number): string {
  let minutes = Math.floor(second / 60);
  let seconds = Math.floor(second % 60);
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  if (minutes < 60) {
    return `${minutes}:${seconds}`;
  }
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  return `${hours}:${minutes}:${seconds}`;
}
