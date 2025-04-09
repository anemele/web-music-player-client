<script setup lang="ts">
import { getPlaylist, putPlaylist, type MusicInter, type PlaylistInter } from '@/api';
import MusicItemContent from '@/components/MusicItemContent.vue';
import { useMusicDataStore } from '@/store/musicdata';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const musicDataStore = useMusicDataStore();
const musicList = reactive<MusicInter[]>([]);
const selectedItems = ref(new Set<number>());

const playlistId = (function () {
    const tmp = useRoute().params.id;
    let res;
    if (typeof tmp === 'string') {
        res = parseInt(tmp)
    } else {
        res = parseInt(tmp[0])
    }
    return res
})();

let playlistName = ref('')
getPlaylist(playlistId).then((res) => {
    const playlist: PlaylistInter = res.data
    playlistName.value = playlist.name
    playlist.songs.forEach((id) => {
        selectedItems.value.add(id)
        musicList.push(musicDataStore.musicMap.get(id) as MusicInter)
    })
    // all music id list
    musicDataStore.playlistList[0].songs.forEach((id) => {
        if (selectedItems.value.has(id)) { return }
        musicList.push(musicDataStore.musicMap.get(id) as MusicInter)
    })
})

function toggleSelection(id: number) {
    if (selectedItems.value.has(id)) {
        selectedItems.value.delete(id);
    } else {
        selectedItems.value.add(id);
    }
}

const router = useRouter()

const submitSelection = () => {
    // console.log('提交选中的项目:', selectedItems.value);
    const newPlaylist = {
        id: playlistId,
        name: playlistName.value,
        songs: Array.from(selectedItems.value)
    };

    putPlaylist(newPlaylist).then((res) => {
        for (const item of musicDataStore.playlistList) {
            if (item.id === playlistId) {
                const msg = `${item.name} (${item.songs.length}) -> ${newPlaylist.name} (${newPlaylist.songs.length})`;
                console.log('更新歌单:', msg);
                item.name = newPlaylist.name;
                item.songs = newPlaylist.songs;
                alert('更新成功：' + msg);
                break;
            }
        }

        setTimeout(router.back, 1000)
    })
};

const selectAllorNone = () => {
    if (selectedItems.value.size === musicList.length) {
        selectedItems.value.clear();
    } else {
        selectedItems.value = new Set(musicList.map(item => item.id));
    }
};
</script>

<template>
    <div class="app-container">
        <!-- 头部 -->
        <header class="header">
            <input type="text" v-model="playlistName">
            <span> ({{ selectedItems.size }})</span>
        </header>
        <!-- 列表内容 -->
        <div class="list-container">
            <ul>
                <li v-for="item in musicList" :key="item.id" @click="toggleSelection(item.id)">
                    <input type="checkbox" v-model="selectedItems" :value="item.id" />
                    <MusicItemContent :title="item.title" :artist="item.artist" :album="item.album" />
                </li>
            </ul>
        </div>
        <!-- 底部 -->
        <footer class="footer">
            <button @click="submitSelection">提交</button>
            <button @click="selectAllorNone">
                {{
                    selectedItems.size === musicList.length ? "取消" : "全选"
                }}
            </button>
        </footer>
    </div>
</template>

<style scoped>
.app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #666;
    color: white;
    text-align: center;
    padding: 10px;
    z-index: 1;
    height: 50px;
}

.header input {
    width: 25%;
    height: 35px;
    font-size: 20px;
    font-family: "Times New Roman", Times, simhei;
    border-radius: 5px;
    color: #333;
    background-color: #ddd;
}

.header span {
    font-size: 20px;
    font-family: "Times New Roman", Times, simhei;
    color: #ddd;
}

.list-container {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    margin-top: 55px;
    /* 留出头部空间 */
    margin-bottom: 35px;
    /* 留出底部空间 */
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

input[type="checkbox"] {
    margin-right: 10px;
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