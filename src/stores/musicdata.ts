import { getMusicList, getPlaylistList, type MusicInter, type PlaylistInter } from "@/api";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useMusicDataStore = defineStore("musicdata", () => {
    const playlistMap = new Map<number, PlaylistInter>();
    const playlistList = reactive<PlaylistInter[]>([]);
    const musicMap = new Map<number, MusicInter>();
    const musicList = reactive<number[]>([]);

    const currentPlaylist = reactive<PlaylistInter>({
        id: 0,
        name: '',
        songs: [],
    });
    const selectedPlaylistId = ref(-1);
    const currentMusicList = reactive<MusicInter[]>([]);
    const currentMusicMap = new Map<number, number>()
    function updateCurrentMusic() {
        currentMusicList.length = 0;
        currentMusicMap.clear()
        currentPlaylist.songs.forEach((id: number, index: number) => {
            const music = musicMap.get(id);
            if (music === undefined) {
                // should never happen
                return;
            }
            currentMusicList.push(music)
            currentMusicMap.set(id, index)
        })
    }

    async function init() {
        // 获取全部音乐数据
        let res = await getMusicList()
        if (!res.data) {
            alert("Failed to get music list");
            return;
        }

        res.data.forEach((item: MusicInter) => {
            musicMap.set(item.id, item)
            musicList.push(item.id)
        });
        const defaultPlaylist = {
            id: 0,
            name: '[Default]',
            songs: musicList,
        }
        playlistMap.set(defaultPlaylist.id, defaultPlaylist)
        playlistList.push(defaultPlaylist)

        Object.assign(currentPlaylist, defaultPlaylist)
        updateCurrentMusic()

        // 获取全部播放列表
        res = await getPlaylistList();
        if (!res.data) {
            return;
        }
        res.data.forEach((item: PlaylistInter) => {
            playlistMap.set(item.id, item);
            playlistList.push(item);
        });
    }

    setTimeout(init, 100)

    function randMusic() {
        const idx = Math.floor(Math.random() * currentMusicList.length)
        return currentMusicList[idx]
    }

    return {
        playlistList,
        playlistMap,
        musicList,
        musicMap,

        currentPlaylist,
        selectedPlaylistId,
        currentMusicList,
        currentMusicMap,
        updateCurrentMusic,
        randMusic,
    }
})
