<script lang="ts" setup>
import { useMusicDataStore } from "@/store/musicdata";
import { PlayMode, usePlayModeStore, useShowStore } from "@/store/state";
import { Events, emitter } from '@/tools/emit';
import { useRouter } from "vue-router";
import MusicItem from './MusicItem.vue';
import PlaylistItem from './PlaylistItem.vue';

const musicDataStore = useMusicDataStore();
const playModeStore = usePlayModeStore();
const showStore = useShowStore();


function selectPlaylist(index: number) {
    if (musicDataStore.playlistIndex === index) { return }
    musicDataStore.playlistIndex = index;
    musicDataStore.updateMusicList(musicDataStore.playlistList[musicDataStore.playlistIndex])
}

function selectMusic(idx: number) {
    if (musicDataStore.musicIndex === idx) { return }
    musicDataStore.musicIndex = idx;

    const currentMusic = musicDataStore.getCurrentMusic()
    document.title = musicDataStore.updateCurrentTitle()
    emitter.emit(Events.SendMusic, currentMusic)
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
            if (next) { idx = (musicDataStore.musicIndex + 1) % musicDataStore.currentMusicList.length }
            else { idx = (musicDataStore.musicIndex - 1 + musicDataStore.currentMusicList.length) % musicDataStore.currentMusicList.length }
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

function editPlaylist() {
    if (musicDataStore.playlistIndex === 0) {
        console.log('默认歌单不能编辑');
        alert('默认歌单不能编辑');
        return;
    }
    router.push({ path: '/playlist/edit' })
}

function routePlaylist() {
    router.push({ path: '/playlist' })
}

</script>

<template>
    <div class="music-title">
        <span>{{ musicDataStore.currentTitle }}</span>
    </div>

    <div class="music-list">
        <!-- <ul> -->
        <li class="music-item" v-for="(item, index) in musicDataStore.currentMusicList" :key="item.id"
            @click="selectMusic(index)" :class="{ current: musicDataStore.musicIndex === index }">
            <MusicItem :item="item" :index="index" />
        </li>
        <!-- </ul> -->
    </div>

    <div v-show="showStore.playlistShow" class="playlist">
        <!-- <ul> -->
        <li class="playlist-item" v-for="(item, index) in musicDataStore.playlistList" :key="item.id"
            @click="selectPlaylist(index)" :class="{ current: musicDataStore.playlistIndex === index }">
            <PlaylistItem :name="item.name" :count="item.songs.length" />
        </li>
        <!-- </ul> -->
        <div class="edit-playlist">
            <button @click="editPlaylist"> edit </button>
            <button @click="routePlaylist"> more </button>
        </div>
    </div>
</template>

<style scoped>
.music-title {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    padding: 5px;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    font-size: 24px;
    height: 50px;
    color: white;
    background-color: gray;
}

.music-title span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-left: 15px;
    margin-right: 15px;
}

.current {
    background-color: #cccc;
}

.music-list {
    margin-top: 60px;
    margin-bottom: 110px;
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

.edit-playlist button {
    color: blue;
    background-color: skyblue;
    font-size: 16px;
    font-style: italic;
    font-weight: bold;
    border-width: 2px;
    border-color: gray;
    border-radius: 10%;
    margin: 5px 10px;
    padding: 2px 5px;
    cursor: pointer;
}
</style>