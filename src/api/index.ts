import axios from "axios";

const ApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const request = axios.create({
  baseURL: ApiBaseUrl,
});

export function getMusicList() {
  return request.get("/list");
}

export function getMusic(id: number) {
  return (ApiBaseUrl + "/music/" + id);
}
