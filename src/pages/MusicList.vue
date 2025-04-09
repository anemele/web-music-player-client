<script lang="ts" setup>
import type { MusicInter } from '@/api';
import MusicItem from '@/components/MusicItem.vue';
import PlaylistItem from '@/components/PlaylistItem.vue';
import { useMusicDataStore } from "@/store/musicdata";
import { usePlayerStore } from "@/store/player";
import { PlayMode, usePlayerbarStore } from "@/store/playerbar";
import { convertSecondToTime, joinTitleAndArtist } from "@/tools";
import { useRouter } from "vue-router";

const musicDataStore = useMusicDataStore();
const playerbarStore = usePlayerbarStore();
const playerStore = usePlayerStore();

function selectPlaylist(id: number) {
    if (musicDataStore.currentPlaylist.id === id) { return }
    const playlist = musicDataStore.playlistMap.get(id);
    if (playlist === undefined) {
        Object.assign(musicDataStore.currentPlaylist, musicDataStore.playlistList[0]);
    } else {
        Object.assign(musicDataStore.currentPlaylist, playlist);
    }
    musicDataStore.updateCurrentMusicList();
    musicDataStore.updateCurrentMusicMap();
}

function selectMusic(music: MusicInter) {
    if (playerStore.currentMusic.id === music.id) { return }
    Object.assign(playerStore.currentMusic, music);
    playerStore.changeMusic()
    document.title = joinTitleAndArtist(playerStore.currentMusic)
}

function _changeMusic(next: boolean) {
    switch (playerbarStore.playMode) {
        case PlayMode.RANDOM:
            if (musicDataStore.currentMusicList.length === 1) {
                playerStore.reloadMusic()
            } else {
                while (true) {
                    const music = musicDataStore.randMusic()
                    if (music.id !== playerStore.currentMusic.id) {
                        selectMusic(music)
                        break;
                    }
                }
            }
            break;
        case PlayMode.SINGLE_LOOP:
            playerStore.reloadMusic()
            break;
        case PlayMode.LIST_LOOP:
            if (musicDataStore.currentMusicList.length === 1) {
                playerStore.reloadMusic()
            }
            let idx = musicDataStore.currentMusicMap.get(playerStore.currentMusic.id);
            if (idx === undefined) {
                idx = 0;
            } else if (next) {
                idx++;
                idx %= musicDataStore.currentMusicList.length
            } else {
                idx += musicDataStore.currentMusicList.length - 1;
                idx %= musicDataStore.currentMusicList.length
            }
            const music = musicDataStore.currentMusicList[idx]
            selectMusic(music)
            break;
        default:
            // should never happen
            console.error('unknown play mode:', playerbarStore.playMode)
            break;
    }
}

function changeMusic(next: boolean) {
    setTimeout(() => { _changeMusic(next) }, 100)
}

playerStore.player.onended = () => {
    changeMusic(true)
}

const router = useRouter()

function editPlaylist() {
    if (musicDataStore.currentPlaylist.id === 0) {
        console.log('默认歌单不能编辑');
        alert('默认歌单不能编辑');
        return;
    }
    router.push({ path: '/playlist/edit' })
}

function routePlaylist() {
    router.push({ path: '/playlist' })
}


function changeCurrentTime(event: MouseEvent) {
    // 用选择器获取目标，不要用 event ，因为 event 可能是冒泡事件
    const progressContrainer = document.querySelector('.progress-container')
    // 获取进度条容器宽度，此处应该不会为 undefined
    const width = progressContrainer?.clientWidth;
    // console.log(width)
    if (width === undefined) {
        alert('error: progress container width is undefined')
        return
    }
    // 获取点击位置相对于进度条容器左侧的距离
    const clickX = event.offsetX;
    // console.log(clickX)
    // 设置当前播放时间
    playerStore.player.currentTime = (clickX / width) * playerStore.currentMusic.duration;
}
</script>

<template>
    <div class="music-title">
        <span>{{ joinTitleAndArtist(playerStore.currentMusic) }}</span>
    </div>

    <div class="music-list">
        <!-- <ul> -->
        <li class="music-item" v-for="(item, index) in musicDataStore.currentMusicList" :key="item.id"
            @click="selectMusic(item)" :class="{ current: playerStore.currentMusic.id === item.id }">
            <MusicItem :item="item" :index="index" />
        </li>
        <!-- </ul> -->
    </div>

    <div v-show="playerbarStore.playlistShow" class="playlist">
        <!-- <ul> -->
        <li class="playlist-item" v-for="item in musicDataStore.playlistList" :key="item.id"
            @click="selectPlaylist(item.id)" :class="{ current: musicDataStore.currentPlaylist.id === item.id }">
            <PlaylistItem :name="item.name" :count="item.songs.length" />
        </li>
        <!-- </ul> -->
        <div class="edit-playlist">
            <button @click="editPlaylist"> edit </button>
            <button @click="routePlaylist"> more </button>
        </div>
    </div>

    <div class="player-bar">
        <div class="progress">
            <i>{{ convertSecondToTime(playerStore.currentTime) }}</i>
            <div class="progress-container" @click="changeCurrentTime">
                <div class="progress-bar"
                    :style="{ width: `${(playerStore.currentTime / playerStore.currentMusic.duration) * 100}%` }"></div>
            </div>
            <i>{{ convertSecondToTime(playerStore.currentMusic.duration) }}</i>
        </div>
        <div class="controls">
            <div class="left-controls">
                <button @click="changeMusic(false)">
                    <img src="@/assets/image/btn-prev.svg" alt="">
                </button>
                <button @click="playerStore.playAndPause">
                    <img v-show="playerStore.player.paused" src="@/assets/image/btn-play.svg" alt="">
                    <img v-show="!playerStore.player.paused" src="@/assets/image/btn-pause.svg" alt="">
                </button>
                <button @click="changeMusic(true)">
                    <img src="@/assets/image/btn-next.svg" alt="">
                </button>
            </div>
            <div class="right-controls">
                <button @click="playerbarStore.togglePlayMode">
                    <img v-show="playerbarStore.playMode === PlayMode.RANDOM" src="@/assets/image/btn-mode-random.svg"
                        alt="">
                    <img v-show="playerbarStore.playMode === PlayMode.LIST_LOOP"
                        src="@/assets/image/btn-mode-list-cycle.svg" alt="">
                    <img v-show="playerbarStore.playMode === PlayMode.SINGLE_LOOP"
                        src="@/assets/image/btn-mode-single-cycle.svg" alt="">
                </button>
                <button @click="playerbarStore.toggleShow">
                    <img src="@/assets/image/btn-list.svg" alt="">
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.music-title {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    padding: 5px;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    font-size: 24px;
    height: 50px;
    color: white;
    background-color: gray;
}

.music-title span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-left: 15px;
    margin-right: 15px;
}

.current {
    background-color: #cccc;
}

.music-list {
    margin-top: 60px;
    margin-bottom: 110px;
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
    cursor: pointer;
}
</style>

<style scoped>
.player-bar {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 100px;
    background-color: gray;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    flex-direction: column;
}

/* 进度条样式    */
.progress {
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
}

/* 进度条容器样式 */
.progress-container {
    width: 100%;
    height: 10px;
    margin-left: 10px;
    margin-right: 10px;
    background-color: #ddd;
    border-radius: 5px;
    cursor: pointer;
}

/* 进度条样式 */
.progress-bar {
    height: 100%;
    background-color: #007BFF;
    border-radius: 5px;
    width: 0%;
}

/* 控制按钮样式 */
.controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    margin-top: 10px;
}

/* 左侧控制按钮样式 */
.left-controls {
    display: flex;
    justify-content: left;
    align-items: center;
    width: 100%;
}

/* 右侧控制按钮样式 */
.right-controls {
    display: flex;
    justify-content: right;
    align-items: center;
    width: 100%;
}

/* 控制按钮样式 */
.controls button {
    background: transparent;
    border: none;
    cursor: pointer;
}

.controls button img {
    width: 30px;
    height: 30px;
}

button:focus {
    outline: none;
}

/* 左侧控制按钮样式 */
.left-controls button {
    margin: 5px;
}

/* 右侧控制按钮样式 */
.right-controls button {
    margin: 5px;
}
</style>