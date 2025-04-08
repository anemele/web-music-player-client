<script setup lang="ts">
import { useMusicDataStore } from '@/store/musicdata';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PlaylistItem from './PlaylistItem.vue';
import { deletePlaylist, postPlaylist } from '@/api';

const musicDataStore = useMusicDataStore()
const router = useRouter()

let activeIndex = ref(-1)
function selectPlaylist(idx: number) {
    if (activeIndex.value !== idx) {
        activeIndex.value = idx
        return
    }
    const id = musicDataStore.playlistList[idx].id
    router.push({ path: '/playlist/' + id })
}

function createPlaylist() {
    postPlaylist({ name: "新建歌单", songs: [1] }).then((res) => {
        console.log(res.data)
        musicDataStore.playlistList.push(res.data)
        router.push({ path: '/playlist/' + res.data.id })
    })
}

function removePlaylist() {
    const playlist = musicDataStore.playlistList[activeIndex.value]
    if (!playlist) {
        console.log('no playlist selected')
        return
    }
    if (!window.confirm('是否删除歌单：' + playlist.name)) { return }
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
}
</style>