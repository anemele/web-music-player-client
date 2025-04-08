import { getMusicList, getPlaylistList, type MusicInter, type PlaylistInter } from "@/api";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useMusicDataStore = defineStore("musicdata", () => {
    const playlistList = reactive<PlaylistInter[]>([
        {
            id: 0,
            name: 'Default',
            songs: [],
        }
    ]);

    // 此处设置默认数据，防止后端服务器未开启导致页面空白
    const musicList = reactive<MusicInter[]>([
        {
            id: 1,
            title: 'Title 1',
            artist: 'Artist 1',
            album: 'Album 1',
            duration: 111,
        }
    ])

    const musicListMap = new Map<number, MusicInter>();

    function updateMusicList(playlist: PlaylistInter) {
        // 清空原有数据
        musicList.length = 0

        playlist.songs.forEach((id: number) => {
            const music = musicListMap.get(id)
            if (music) {
                musicList.push(music)
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
        res.data.forEach((item: MusicInter) => {
            // 第一个播放列表是全部音乐
            playlistList[0].songs.push(item.id)
            // 音乐数据映射，方便播放列表切换时查找
            musicListMap.set(item.id, item)
        });

        // 获取全部播放列表
        res = await getPlaylistList();
        if (!res.data) {
            return;
        }
        res.data.forEach((item: PlaylistInter) => {
            playlistList.push(item);
        });

        // 默认播放第一个播放列表，即全部音乐
        updateMusicList(playlistList[0]);
    }

    return {
        playlistList,
        musicList,
        musicListMap,
        init,
        updateMusicList,
    }
})
