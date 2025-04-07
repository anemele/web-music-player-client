import mitt from "mitt";

export const emitter = mitt();
export enum Events {
  SendMusic = 'SendMusic',
  NextMusic = 'NextMusic',
  PrevMusic = 'PrevMusic',
  TogglePlayMode = 'TogglePlayMode',
  ReloadMusic = 'Reload',
  LocateCurrent = 'LocateCurrent',
  Test = 'Test',
}
