import mitt from "mitt";

export const emitter = mitt();
export enum Events {
  SendMusic = "SendMusic",
  NextMusic = "NextMusic",
  PrevMusic = "PrevMusic",
  ReloadMusic = "Reload",
}
