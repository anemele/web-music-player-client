<script lang="ts" setup>
import { useMusicDataStore } from "@/store/musicdata";
import { PlayMode, usePlayModeStore, useShowStore } from "@/store/state";
import { Events, emitter } from '@/tools/emit';
import { onMounted, ref } from 'vue';
import MusicItem from './MusicItem.vue';
import PlaylistItem from './PlaylistItem.vue';

const musicDataStore = useMusicDataStore();
const playModeStore = usePlayModeStore();
const showStore = useShowStore();

// 挂载后等待100毫秒再初始化
onMounted(() => setTimeout(musicDataStore.init, 100))

let playlistIndex = ref(0);
function selectPlaylist(index: number) {
    if (playlistIndex.value === index) { return }
    playlistIndex.value = index;
    musicDataStore.updateMusicList(musicDataStore.playlistList[playlistIndex.value])
    // 隐藏播放列表
    showStore.toggleShow()
}

let activeIndex = ref(-1)
function selectMusic(idx: number) {
    if (activeIndex.value === idx) { return }
    activeIndex.value = idx;
    document.title = musicDataStore.musicList[idx].title + ' - ' + musicDataStore.musicList[idx].artist
    emitter.emit(Events.SendMusic, musicDataStore.musicList[idx])
}

function randMusic() {
    return Math.floor(Math.random() * musicDataStore.musicList.length)
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
            if (next) { idx = (activeIndex.value + 1) % musicDataStore.musicList.length }
            else { idx = (activeIndex.value - 1 + musicDataStore.musicList.length) % musicDataStore.musicList.length }
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
</script>

<template>
    <div>
        <li class="item" v-for="(item, index) in musicDataStore.musicList" :key="item.id" @click="selectMusic(index)"
            :class="{ current: activeIndex === index }">
            <MusicItem :item="item" :index="index" />
        </li>
    </div>
    <div v-show="showStore.playlistShow" class="playlist">
        <li class="playlist-item" v-for="(item, index) in musicDataStore.playlistList" :key="item.id"
            @click="selectPlaylist(index)" :class="{ current: playlistIndex === index }">
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