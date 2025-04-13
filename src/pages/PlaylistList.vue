<script setup lang="ts">
import { deletePlaylist, postPlaylist, type PlaylistInter } from '@/api';
import PlaylistItem from '@/components/PlaylistItem.vue';
import { useMusicDataStore } from '@/stores/musicdata';
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

    if (musicDataStore.playlistMap.has(id)) {
        musicDataStore.selectedPlaylistId = id;
        router.push({ path: '/playlist/edit' })
    }
}

function createPlaylist() {
    const name = prompt('请输入歌单名称：')?.trim();
    if (!name) { return }

    // 这里默认选择第一首歌，因为传空列表后端会报错 400 bad request
    const data = { name, songs: [0] }
    postPlaylist(data).then((res) => {
        console.log(res.data)
        const playlist = res.data as PlaylistInter;
        musicDataStore.playlistList.push(playlist);
        musicDataStore.selectedPlaylistId = playlist.id;
        router.push({ path: '/playlist/edit' })
    }).catch((err) => {
        alert('创建歌单失败')
        console.log(err)
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
            <span> {{ musicDataStore.playlistList[activeID]?.name }}</span>
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
@import '@/assets/less/playlist';

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
            margin: 5px 10px;
            border-color: rgb(152, 62, 155);
        }
    }
}
</style>