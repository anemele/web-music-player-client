<script lang="ts" setup>
import { useMusicDataStore } from "@/store/musicdata";
import { PlayMode, usePlayModeStore, useShowStore } from "@/store/state";
import { Events, emitter } from '@/tools/emit';
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import MusicItem from './MusicItem.vue';
import PlaylistItem from './PlaylistItem.vue';

const musicDataStore = useMusicDataStore();
const playModeStore = usePlayModeStore();
const showStore = useShowStore();

let { playlistIndex, musicIndex } = storeToRefs(musicDataStore);

function selectPlaylist(index: number) {
    if (playlistIndex.value === index) { return }
    playlistIndex.value = index;
    musicDataStore.updateMusicList(musicDataStore.playlistList[playlistIndex.value])
}

function selectMusic(idx: number) {
    if (musicIndex.value === idx) { return }
    musicIndex.value = idx;
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
            if (next) { idx = (musicIndex.value + 1) % musicDataStore.currentMusicList.length }
            else { idx = (musicIndex.value - 1 + musicDataStore.currentMusicList.length) % musicDataStore.currentMusicList.length }
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

function routePlaylist() {
    router.push({ path: '/playlist/' })
}

</script>

<template>
    <div>
        <li class="music-item" v-for="(item, index) in musicDataStore.currentMusicList" :key="item.id"
            @click="selectMusic(index)" :class="{ current: musicIndex === index }">
            <MusicItem :item="item" :index="index" />
        </li>
    </div>
    <div v-show="showStore.playlistShow" class="playlist">
        <li class="playlist-item" v-for="(item, index) in musicDataStore.playlistList" :key="item.id"
            @click="selectPlaylist(index)" :class="{ current: playlistIndex === index }">
            <PlaylistItem :name="item.name" :count="item.songs.length" />
        </li>
        <div class="edit-playlist">
            <button @click="editPlaylist(musicDataStore.playlistList[playlistIndex].id)">edit</button>
            <button @click="routePlaylist">more</button>
        </div>
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
}
</style>