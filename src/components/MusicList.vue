<script lang="ts" setup>
import { getMusicList, getPlaylistList, type MusicInter, type PlaylistInter } from "@/api";
import { Events, emitter } from '@/tools/emit';
import { onMounted, reactive, ref } from 'vue';
import MusicItem from './MusicItem.vue';
import PlaylistItem from './PlaylistItem.vue';
import { PlayMode } from './consts';

const playlistList = reactive<PlaylistInter[]>([]);
const musicListMap = new Map<number, MusicInter>();

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

function updateMusicList(playlist: PlaylistInter) {
    // 清空原有数据
    musicList.length = 0

    playlist.songs.forEach(async (id: number) => {
        musicList.push(musicListMap.get(id) as MusicInter)
    })
}

let playlistIndex = ref(0);

onMounted(() => setTimeout(async function () {
    let res = await getPlaylistList();
    if (res.data === undefined) {
        alert("Failed to get playlist list");
        return;
    }
    if (res.data.length === 0) {
        alert("No playlist found");
        return;
    }
    res.data.forEach((item: PlaylistInter) => {
        playlistList.push(item);
    });

    res = await getMusicList()
    if (res.data === undefined) {
        alert("Failed to get music list");
        return;
    }
    res.data.forEach((item: MusicInter) => {
        musicListMap.set(item.id, item)
    });

    updateMusicList(playlistList[playlistIndex.value]);
}, 100))

function selectPlaylist(index: number) {
    if (playlistIndex.value === index) { return }
    playlistIndex.value = index;
    updateMusicList(playlistList[playlistIndex.value])
    playlistShow.value = false
}

let playlistShow = ref(false)
emitter.on(Events.TogglePlaylist, ()=>{    playlistShow.value = !playlistShow.value})

let activeIndex = ref(-1)
function selectMusic(idx: number) {
    if (activeIndex.value === idx) { return }
    activeIndex.value = idx;
    document.title = musicList[idx].title + ' - ' + musicList[idx].artist
    emitter.emit(Events.SendMusic, musicList[idx])
}

let playMode = ref(PlayMode.RANDOM)
emitter.on(Events.TogglePlayMode, (e) => {
    const mode = e as PlayMode
    playMode.value = mode
})

function randMusic() {
    return Math.floor(Math.random() * musicList.length)
}

function nextMusic() {
    switch (playMode.value) {
        case PlayMode.RANDOM:
            selectMusic(randMusic())
            break;
        case PlayMode.LIST_LOOP:
            selectMusic((activeIndex.value + 1) % musicList.length)
            break;
        case PlayMode.SINGLE_LOOP:
            emitter.emit(Events.ReloadMusic)
            break;
        default:
            // should never happen
            console.error('unknown play mode:', playMode.value)
            break;
    }
}

function prevMusic() {
    switch (playMode.value) {
        case PlayMode.RANDOM:
            selectMusic(randMusic())
            break;
        case PlayMode.LIST_LOOP:
            selectMusic((activeIndex.value - 1 + musicList.length) % musicList.length)
            break;
        case PlayMode.SINGLE_LOOP:
            emitter.emit(Events.ReloadMusic)
            break;
        default:
            // should never happen
            console.error('unknown play mode:', playMode.value)
            break;
    }
}

emitter.on(Events.NextMusic, () => setTimeout(() => nextMusic(), 100))
emitter.on(Events.PrevMusic, () => setTimeout(() => prevMusic(), 100))
</script>

<template>
    <div>
        <li class="item" v-for="(item, index) in musicList" :key="item.id" @click="selectMusic(index)"
            :class="{ current: activeIndex === index }">
            <MusicItem :item="item" :index="index" />
        </li>
    </div>
    <div v-show="playlistShow" class="playlist">
        <li class="playlist-item" v-for="(item, index) in playlistList" :key="item.id" @click="selectPlaylist(index)"
            :class="{ current: playlistIndex === index }">
            <PlaylistItem :name="item.name" :count="item.songs.length" />
        </li>
    </div>
</template>

<style scoped>
li.current {
    background-color: #dddd;
}

li.item {
    position: relative;
    display: flex;
    height: 50px;
    align-items: center;
    color: #999
}

div.playlist {
    position: fixed;
    bottom: 20%;
    right: 5%;
}

li.playlist-item {
    display: flex;
    color: #999;
}
</style>