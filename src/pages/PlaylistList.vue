<script setup lang="ts">
import { deletePlaylist, postPlaylist } from '@/api';
import PlaylistItem from '@/components/PlaylistItem.vue';
import { useMusicDataStore } from '@/store/musicdata';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const musicDataStore = useMusicDataStore()
const router = useRouter()

const activeIndex = ref(-1)
function selectPlaylist(idx: number) {
    if (activeIndex.value !== idx) {
        activeIndex.value = idx
        return
    }

    musicDataStore.playlistIndex = idx
    router.push({ path: '/playlist/edit' })
}

function createPlaylist() {
    const name = prompt('请输入歌单名称：');
    if (!name) { return }

    // 这里默认选择第一首歌，因为传空列表后端会报错 400 bad request
    const playlist = { name, songs: [0] }
    postPlaylist(playlist).then((res) => {
        console.log(res.data)
        musicDataStore.playlistList.push(res.data)
        musicDataStore.playlistIndex = musicDataStore.playlistList.length - 1
        router.push({ path: '/playlist/edit' })
    })
}

function removePlaylist() {
    const playlist = musicDataStore.playlistList[activeIndex.value]
    if (!playlist) {
        console.log('no playlist selected')
        return
    }

    if (!confirm('是否删除歌单：' + playlist.name)) { return }

    deletePlaylist(playlist.id).then((res) => {
        musicDataStore.playlistList.splice(activeIndex.value, 1)
        activeIndex.value = -1
    })
}
</script>

<template>
    <div class="list-container">
        <ul>
            <li class="music-item" v-for="(item, index) in musicDataStore.playlistList.slice(1)" :key="item.id"
                @click="selectPlaylist(index + 1)">
                <PlaylistItem :name="item.name" :count="item.songs.length"
                    :class="{ current: activeIndex === index + 1 }" />
            </li>
        </ul>
    </div>
    <footer class="footer">
        <button @click="createPlaylist">新建</button>
        <button @click="removePlaylist">删除</button>
    </footer>
</template>

<style scoped>
.current {
    background-color: #cccc;
}

.music-item {
    position: relative;
    display: flex;
    height: 50px;
}

.list-container {
    margin-bottom: 30px;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: flex;
    align-items: center;
}

.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #aaa;
    color: white;
    display: flex;
    justify-content: center;
    padding: 10px;
    z-index: 1;
    height: 30px;
}

button {
    margin: 0 10px;
    padding: 5px 10px;
    border-radius: 30%;
    cursor: pointer;
}
</style>