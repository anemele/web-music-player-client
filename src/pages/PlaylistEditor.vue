<script setup lang="ts">
import { putPlaylist, type MusicInter, type PlaylistInter } from '@/api';
import MusicItemContent from '@/components/MusicItemContent.vue';
import { useMusicDataStore } from '@/stores/musicdata';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const musicDataStore = useMusicDataStore();
const musicList = reactive<MusicInter[]>([]);
// 此处使用 ref
const selectedItems = ref(new Set<number>());

const playlistName = ref('')
const disabled = ref(true)

function getPlaylist(): PlaylistInter | null {
    if (musicDataStore.currentPlaylist.id === 0) {
        console.log('默认歌单不能编辑')
        return null
    }
    const playlist = musicDataStore.currentPlaylist

    playlistName.value = playlist.name
    playlist.songs.forEach((id) => {
        selectedItems.value.add(id)
        musicList.push(musicDataStore.musicMap.get(id) as MusicInter)
    })
    musicDataStore.playlistList[0].songs.forEach((id) => {
        if (selectedItems.value.has(id)) { return }
        musicList.push(musicDataStore.musicMap.get(id) as MusicInter)
    })
    disabled.value = false

    return playlist
}

const playlist = getPlaylist()

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
    if (playlist === null) { return }
    if (selectedItems.value.size === 0) {
        alert('请选择至少一首歌曲');
        return;
    }

    const newPlaylist = {
        id: playlist.id,
        name: playlistName.value,
        songs: Array.from(selectedItems.value).sort()
    };

    putPlaylist(newPlaylist).then((res) => {
        for (const item of musicDataStore.playlistList) {
            if (item.id === playlist.id) {
                const msg = `${item.name} (${item.songs.length}) -> ${newPlaylist.name} (${newPlaylist.songs.length})`;
                console.log('更新歌单:', msg);
                item.name = newPlaylist.name;
                item.songs = newPlaylist.songs;
                alert('更新成功：' + msg);
                break;
            }
        }

        setTimeout(router.back, 1000)
    }).catch((err) => {
        console.log('更新歌单失败:', err);
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
            <input type="text" placeholder="请输入标题" v-model="playlistName" :disabled="disabled">
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
            <button @click="submitSelection" :disabled="disabled">提交</button>
            <button @click="selectAllorNone" :disabled="disabled">
                {{
                    selectedItems.size === musicList.length ? "取消" : "全选"
                }}
            </button>
        </footer>
    </div>
</template>

<style scoped lang="less">
@import '@/assets/less/playlist';

.app-container {
    .header {
        input {
            width: 60%;
            margin-left: 10px;
            margin-right: 10px;
            padding: 5px 10px;
            height: 35px;
            font-size: 20px;
            border-radius: 5px;
            border: none;
            outline: none;
            color: #0d0b53;
            background-color: #ffffff;
        }
    }

    .list-container {
        >ul {
            list-style-type: none;
            padding: 0;

            >li {
                display: flex;
                align-items: center;
                margin-bottom: 10px;

                input[type="checkbox"] {
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    margin-right: 10px;
                    border: 2px solid #ccc;
                    border-radius: 4px;
                    outline: none;
                    position: relative;
                    cursor: pointer;
                }

                input[type="checkbox"]:checked::before {
                    content: '\2713';
                    color: blue;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }
        }
    }
}
</style>