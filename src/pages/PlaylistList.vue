<script setup lang="ts">
import { deletePlaylist, postPlaylist } from '@/api';
import PlaylistItem from '@/components/PlaylistItem.vue';
import { useMusicDataStore } from '@/store/musicdata';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const musicDataStore = useMusicDataStore()
const router = useRouter()

const activeID = ref(-1)
function selectPlaylist(id: number) {
    if (activeID.value !== id) {
        activeID.value = id
        return
    }

    const playlist = musicDataStore.playlistMap.get(id);
    if (playlist === undefined) { return }

    Object.assign(musicDataStore.currentPlaylist, playlist);
    router.push({ path: '/playlist/edit' })
}

function createPlaylist() {
    const name = prompt('请输入歌单名称：')?.trim();
    if (!name) { return }

    // 这里默认选择第一首歌，因为传空列表后端会报错 400 bad request
    const playlist = { name, songs: [0] }
    postPlaylist(playlist).then((res) => {
        console.log(res.data)
        musicDataStore.playlistList.push(res.data)
        musicDataStore.currentPlaylist = res.data
        router.push({ path: '/playlist/edit' })
    })
}

function removePlaylist() {
    const playlist = musicDataStore.playlistList[activeID.value]
    if (!playlist) {
        console.log('no playlist selected')
        return
    }

    if (!confirm('是否删除歌单：' + playlist.name)) { return }

    deletePlaylist(playlist.id).then((res) => {
        musicDataStore.playlistList.splice(activeID.value, 1)
        activeID.value = -1
    })
}
</script>

<template>
    <div class="app-container">
        <header class="header">
            <span> {{ activeID === -1 ? '' : musicDataStore.playlistList[activeID].name }}</span>
        </header>
        <div class="list-container">
            <PlaylistItem class="playlist-item" :class="{ current: activeID === item.id }"
                v-for="item in musicDataStore.playlistList.slice(1)" :key="item.id" :name="item.name"
                :count="item.songs.length" @click="selectPlaylist(item.id)" />
        </div>
        <footer class="footer">
            <button @click="createPlaylist">新建</button>
            <button @click="removePlaylist">删除</button>
        </footer>
    </div>
</template>

<style scoped lang="less">
@import './playlist';

.current {
    background-color: #c4e5e4;
    color: #1d879c;
}

.app-container {

    .header {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .list-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;

        .playlist-item {
            margin: 10px;
            padding: 10px;
            border-color: rgb(152, 62, 155);
        }
    }
}
</style>