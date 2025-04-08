<script lang="ts" setup>
import { useMusicDataStore } from "@/store/musicdata";
import { PlayMode, usePlayModeStore, useShowStore } from "@/store/state";
import { Events, emitter } from '@/tools/emit';
import { ref } from 'vue';
import { useRouter } from "vue-router";
import MusicItem from './MusicItem.vue';
import PlaylistItem from './PlaylistItem.vue';

const musicDataStore = useMusicDataStore();
const playModeStore = usePlayModeStore();
const showStore = useShowStore();

let playlistIndex = ref(0);
function selectPlaylist(index: number) {
    if (playlistIndex.value === index) { return }
    playlistIndex.value = index;
    musicDataStore.updateMusicList(musicDataStore.playlistList[playlistIndex.value])
    // 隐藏播放列表
    // showStore.toggleShow()
}

let activeIndex = ref(-1)
function selectMusic(idx: number) {
    if (activeIndex.value === idx) { return }
    activeIndex.value = idx;
    document.title = musicDataStore.currentMusicList[idx].title + ' - ' + musicDataStore.currentMusicList[idx].artist
    emitter.emit(Events.SendMusic, musicDataStore.currentMusicList[idx])
}

function randMusic() {
    return Math.floor(Math.random() * musicDataStore.currentMusicList.length)
}

function changeMusic(next: boolean) {
    switch (playModeStore.playMode) {
        case PlayMode.RANDOM:
            selectMusic(randMusic())
            break;
        case PlayMode.SINGLE_LOOP:
            emitter.emit(Events.ReloadMusic)
            break;
        case PlayMode.LIST_LOOP:
            let idx: number;
            if (next) { idx = (activeIndex.value + 1) % musicDataStore.currentMusicList.length }
            else { idx = (activeIndex.value - 1 + musicDataStore.currentMusicList.length) % musicDataStore.currentMusicList.length }
            selectMusic(idx)
            break;
        default:
            // should never happen
            console.error('unknown play mode:', playModeStore.playMode)
            break;
    }
}

emitter.on(Events.NextMusic, () => setTimeout(() => changeMusic(true), 100))
emitter.on(Events.PrevMusic, () => setTimeout(() => changeMusic(false), 100))

const router = useRouter()
function editPlaylist(id: number) {
    if (id === 0) { console.log('默认歌单不能编辑'); return }
    router.push({ path: '/playlist/' + id })
}
</script>

<template>
    <div>
        <li class="music-item" v-for="(item, index) in musicDataStore.currentMusicList" :key="item.id"
            @click="selectMusic(index)" :class="{ current: activeIndex === index }">
            <MusicItem :item="item" :index="index" />
        </li>
    </div>
    <div v-show="showStore.playlistShow" class="playlist">
        <li class="playlist-item" v-for="(item, index) in musicDataStore.playlistList" :key="item.id"
            @click="selectPlaylist(index)" :class="{ current: playlistIndex === index }">
            <PlaylistItem :name="item.name" :count="item.songs.length" />
        </li>
        <button class="edit-playlist" @click="editPlaylist(musicDataStore.playlistList[playlistIndex].id)">edit</button>
    </div>
</template>

<style scoped>
.current {
    background-color: #cccc;
}

.music-item {
    position: relative;
    display: flex;
    height: 50px;
    align-items: center;
    color: #999
}

.playlist {
    position: fixed;
    margin: auto;
    bottom: 20%;
    left: 0;
    right: 0;
    width: fit-content;
    background-color: #fff;

    display: flex;
    flex-direction: column;
    justify-content: center;
}

.playlist-item {
    display: flex;
    color: #999;
}

.edit-playlist {
    color: blue;
    background-color: skyblue;
    font-size: 16px;
    font-style: italic;
    font-weight: bold;
    border-width: 2px;
    border-color: gray;
    border-radius: 10%;
    margin-top: 5px;
    padding: 2px 5px;
    margin-top: 5px;
}
</style>