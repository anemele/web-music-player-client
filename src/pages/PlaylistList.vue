<script setup lang="ts">
import { deletePlaylist, postPlaylist, type BasePlaylistInter } from '@/api';
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

    if (musicDataStore.playlists.has(id)) {
        musicDataStore.selectedPlaylistId = id;
        router.push({ path: '/playlist/edit' })
    } else {
        console.log('no playlist with id:', id)
    }
}

function createPlaylist() {
    const name = prompt('请输入歌单名称：')?.trim();
    if (!name) { return }

    const data: BasePlaylistInter = { name, songs: [] }
    postPlaylist(data).then((res) => {
        console.log(res.data)
        const playlist = { id: res.data.id, ...data };
        musicDataStore.playlists.push(playlist);
        activeID.value = playlist.id;
    }).catch((err) => {
        alert('创建歌单失败')
        console.log(err)
    })
}

function removePlaylist() {
    const playlist = musicDataStore.playlists.getmap(activeID.value)
    if (playlist === undefined) {
        console.log('no playlist selected')
        return
    }

    if (!confirm('是否删除歌单：' + playlist.name + ' (' + playlist.songs.length + ')')) { return }

    deletePlaylist(playlist.id).then((res) => {
        musicDataStore.playlists.delete(activeID.value)
        activeID.value = -1
    })
}
</script>

<template>
    <div class="app-container">
        <header class="header">
            <span> {{ musicDataStore.playlists.getmap(activeID)?.name }}</span>
        </header>
        <div class="list-container">
            <PlaylistItem class="playlist-item" :class="{ current: activeID === item.id }"
                v-for="item in musicDataStore.playlists.arrayData.slice(1)" :key="item.id" :name="item.name"
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