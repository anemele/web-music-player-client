import axios from "axios";

export const request = axios.create({
  // baseURL: 'http://localhost:3000',
});

export function getMusicList() {
  return request.get("/musiclist");
}

export function getMusic(id: number) {
  return ("/music/" + id);
}
