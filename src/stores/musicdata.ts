import { getMusicList, getPlaylistList, type MusicInter, type PlaylistInter } from "@/api";
import { MapArray } from "@/tools";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

class CurrentMusicList {
    private ma: MapArray<MusicInter>;

    constructor() {
        this.ma = new MapArray();
    }

    get length() {
        return this.ma.length;
    }

    get arrayData() {
        return this.ma.arrayData;
    }

    update(musiclist: MusicInter[]) {
        this.ma.clear();
        musiclist.forEach((item: MusicInter) => {
            this.ma.push(item);
        })
    }

    random(): MusicInter | undefined {
        if (this.length === 0) {
            return undefined;
        }
        const idx = Math.floor(Math.random() * this.length)
        return this.ma.getarr(idx);
    }

    nextof(music: MusicInter, forward: boolean = true): MusicInter | undefined {
        if (this.length === 0) {
            return undefined;
        }
        let idx = this.ma.index(music.id);
        if (idx === -1) {
            return undefined;
        }
        if (forward) {
            idx = (idx + 1) % this.ma.length;
        } else {
            idx = (idx - 1 + this.ma.length) % this.ma.length;
        }
        return this.ma.getarr(idx);
    }
}

export const useMusicDataStore = defineStore("musicdata", () => {
    const playlists = reactive<MapArray<PlaylistInter>>(new MapArray());
    const musiclist = reactive<MapArray<MusicInter>>(new MapArray());

    const currentPlaylist = reactive<PlaylistInter>({
        id: 0,
        name: '',
        songs: [],
    });
    const currentMusiclist = reactive<CurrentMusicList>(new CurrentMusicList());

    const selectedPlaylistId = ref(-1);

    async function init() {
        // 获取全部音乐数据
        let res = await getMusicList()
        if (!res.data) {
            alert("Failed to get music list");
            return;
        }

        res.data.forEach((item: MusicInter) => {
            musiclist.push(item)
        });
        const defaultPlaylist = {
            id: 0,
            name: '[Default]',
            songs: musiclist.arrayData,
        }
        playlists.push(defaultPlaylist)

        Object.assign(currentPlaylist, defaultPlaylist)
        currentMusiclist.update(defaultPlaylist.songs)

        // 获取全部播放列表
        res = await getPlaylistList();
        if (!res.data) {
            return;
        }
        const playlistsData: { id: number, name: string, songs: number[] }[] = res.data;
        playlistsData.forEach((item) => {
            const playlist: PlaylistInter = {
                id: item.id,
                name: item.name,
                songs: [],
            }
            item.songs.forEach((id: number) => {
                const music = musiclist.getmap(id);
                if (music) {
                    playlist.songs.push(music);
                }
            })
            playlists.push(playlist);
        });
    }

    setTimeout(init, 100)

    return {
        playlists,
        musiclist,

        currentPlaylist,
        currentMusiclist,

        selectedPlaylistId,
    }
})
