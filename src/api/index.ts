import axios from "axios";

const ApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const request = axios.create({
  baseURL: ApiBaseUrl,
});

export interface PlaylistInter {
  id: number;
  name: string;
  songs: number[];
}

export function getPlaylist(id: number) {
  return request.get("/list/" + id);
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
  return (ApiBaseUrl + "/music/" + id + "/file");
}
