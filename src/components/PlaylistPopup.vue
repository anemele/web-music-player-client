<script setup lang="ts">
import { useMusicDataStore } from '@/stores/musicdata';
import { useRouter } from 'vue-router';
import PlaylistItem from './PlaylistItem.vue';

const musicDataStore = useMusicDataStore()

function selectPlaylist(id: number) {
    if (musicDataStore.currentPlaylist.id === id) { return }
    const playlist = musicDataStore.playlistMap.get(id);
    if (playlist === undefined) {
        Object.assign(musicDataStore.currentPlaylist, musicDataStore.playlistList[0]);
    } else {
        Object.assign(musicDataStore.currentPlaylist, playlist);
    }
    musicDataStore.updateCurrentMusic();
}

const router = useRouter()

function editPlaylist() {
    if (musicDataStore.currentPlaylist.id === 0) {
        console.log('默认歌单不能编辑');
        alert('默认歌单不能编辑');
        return;
    }
    musicDataStore.selectedPlaylistId = musicDataStore.currentPlaylist.id;
    router.push({ path: '/playlist/edit' })
}

function routePlaylist() {
    router.push({ path: '/playlist' })
}
</script>

<template>
    <div class="main">
        <div class="playlist">
            <PlaylistItem :class="{ current: musicDataStore.currentPlaylist.id === item.id }"
                v-for="item in musicDataStore.playlistList" :key="item.id" :name="item.name" :count="item.songs.length"
                @click="selectPlaylist(item.id)" />
        </div>
        <div class="button">
            <button @click="editPlaylist"> edit </button>
            <button @click="routePlaylist"> more </button>
        </div>
    </div>
</template>

<style scoped lang="less">
@playlist-bg: #def;
@playlist-item-fg: #666;
@seleted-item-bg: #eff;
@seleted-item-fg: #999;

.current {
    background-color: @seleted-item-bg ;
    color: @seleted-item-fg;
}

.main {
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: fit-content;

    border-radius: 5px;

    .playlist {
        background-color: @playlist-bg;
        color: @playlist-item-fg;

        border-radius: 5px;
    }

    .button button {
        color: blue;
        background-color: transparent;
        font-size: 16px;
        font-style: italic;
        font-weight: bold;
        border: none;
        border-radius: 10%;
        margin: 5px 10px;
        padding: 2px 5px;
        cursor: pointer;

        &:hover {
            background-color: lightblue;
        }

        &:active {
            background-color: darkblue;
            color: white;
        }
    }
}
</style>