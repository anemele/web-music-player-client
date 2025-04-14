import { type HasID } from "@/types";
import axios from "axios";

const baseURL = "/api";

const request = axios.create({ baseURL });

export interface BaseMusicInter {
  title: string;
  artist: string;
  album: string;
  duration: number;
};
export interface MusicInter extends BaseMusicInter, HasID { };

export interface BasePlaylistInter {
  name: string;
  songs: MusicInter[];
};
export interface PlaylistInter extends BasePlaylistInter, HasID { };

export function getPlaylist(id: number) {
  return request.get("/list/" + id + "/");
}

// POST does not need `id`
export function postPlaylist(data: BasePlaylistInter) {
  return request.post("/list/", {
    name: data.name,
    songs: data.songs.map((item) => item.id),
  });
}

export function putPlaylist(data: PlaylistInter) {
  return request.put("/list/" + data.id + "/", {
    name: data.name,
    songs: data.songs.map((item) => item.id),
  });
}

export function deletePlaylist(id: number) {
  return request.delete("/list/" + id + "/");
}

export function getPlaylistList() {
  return request.get("/list/");
}

export function getMusic(id: number) {
  return request.get("/music/" + id + "/");
}

export function getMusicList() {
  return request.get("/music/");
}

export function getMusicFile(id: number) {
  return (baseURL + "/music/" + id + "/file");
}
