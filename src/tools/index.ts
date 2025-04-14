import { type MusicInter } from "@/api";
import { type HasID } from "@/types";

export function convertSecondToTime(second: number): string {
  let minutes = Math.floor(second / 60);
  let seconds = Math.floor(second % 60);
  if (minutes < 60) {
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }
  let hours = Math.floor(minutes / 60);
  minutes = Math.floor(minutes % 60);
  return `${hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds
    }`;
}

export function joinTitleAndArtist(music: MusicInter): string {
  return `${music.title} - ${music.artist}`;
}

export class MapArray<T extends HasID> {
  private map: Map<number, T>;
  private array: T[];

  constructor() {
    this.map = new Map();
    this.array = [];
  }

  get length(): number {
    return this.array.length;
  }

  get arrayData(): T[] {
    return this.array;
  }

  index(id: number): number {
    const item = this.map.get(id);
    if (item === undefined) {
      return -1;
    }
    return this.array.indexOf(item);
  }

  has(id: number): boolean {
    return this.map.has(id);
  }

  getmap(id: number): T | undefined {
    return this.map.get(id);
  };

  getarr(idx: number): T | undefined {
    return this.array[idx];
  }

  set(id: number, item: T) {
    if (this.map.has(id)) {
      this.map.set(id, item);
    } else {
      this.push(item);
    }
  }

  delete(id: number): boolean {
    const item = this.map.get(id);
    if (item === undefined) {
      console.error(`not found id ${id}`);
      return false;
    }
    // should never false
    this.map.delete(id);
    // should never -1
    const idx = this.array.indexOf(item);
    this.array.splice(idx, 1);

    return true;
  }

  push(item: T) {
    this.map.set(item.id, item);
    const length = this.array.push(item);
  }

  clear() {
    this.map.clear();
    this.array.length = 0;
  }
}
