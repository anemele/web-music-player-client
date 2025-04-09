import axios from "axios";

const baseURL = "/api";

const request = axios.create({ baseURL });

export interface PlaylistInter {
  id: number;
  name: string;
  songs: number[];
}

export function getPlaylist(id: number) {
  return request.get("/list/" + id);
}

// POST does not need `id`
export function postPlaylist(data: { name: string; songs: number[] }) {
  return request.post("/list/", {
    name: data.name,
    songs: data.songs,
  });
}

export function putPlaylist(data: PlaylistInter) {
  return request.put("/list/" + data.id, {
    name: data.name,
    songs: data.songs,
  });
}

export function deletePlaylist(id: number) {
  return request.delete("/list/" + id);
}

export function getPlaylistList() {
  return request.get("/list");
}

export interface MusicInter {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
}

export function getMusic(id: number) {
  return request.get("/music/" + id);
}

export function getMusicList() {
  return request.get("/music");
}

export function getMusicFile(id: number) {
  return (baseURL + "/music/" + id + "/file");
}
