import { getMusicList, getPlaylistList, type MusicInter, type PlaylistInter } from "@/api";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useMusicDataStore = defineStore("musicdata", () => {
    const playlistList = reactive<PlaylistInter[]>([]);
    const musicMap = new Map<number, MusicInter>();
    const currentMusicList = reactive<MusicInter[]>([]);

    function updateMusicList(playlist: PlaylistInter) {
        // 清空原有数据
        currentMusicList.length = 0

        playlist.songs.forEach((id: number) => {
            const music = musicMap.get(id)
            if (music) {
                currentMusicList.push(music)
            }
        })
    }

    async function init() {
        // 获取全部音乐数据
        let res = await getMusicList()
        if (!res.data) {
            alert("Failed to get music list");
            return;
        }

        const defaultPlaylist: PlaylistInter = {
            id: 0,
            name: '[Default]',
            songs: [],
        }
        res.data.forEach((item: MusicInter) => {
            // 默认播放列表是全部音乐
            defaultPlaylist.songs.push(item.id)
            // 音乐数据映射，方便播放列表切换时查找
            musicMap.set(item.id, item)
        });
        playlistList.length = 0
        playlistList.push(defaultPlaylist)

        // 获取全部播放列表
        res = await getPlaylistList();
        if (!res.data) {
            return;
        }
        res.data.forEach((item: PlaylistInter) => {
            playlistList.push(item);
        });

        // 默认播放列表，即全部音乐
        updateMusicList(defaultPlaylist);
    }

    setTimeout(init, 100)

    const playlistIndex = ref(0);
    const musicIndex = ref(-1);

    function getCurrentPlaylist() {
        return playlistList[playlistIndex.value];
    }

    function getCurrentMusic() {
        return currentMusicList[musicIndex.value];
    }

    const currentTitle = ref('');
    function updateCurrentTitle() {
        const music = getCurrentMusic();
        if (music) {
            currentTitle.value = `${music.title} - ${music.artist}`
        } else {
            currentTitle.value = '';
        }
        return currentTitle.value;
    }

    return {
        playlistList,
        musicMap,
        currentMusicList,
        playlistIndex,
        musicIndex,
        updateMusicList,
        getCurrentPlaylist,
        getCurrentMusic,
        currentTitle,
        updateCurrentTitle,
    }
})
