<script setup lang="ts">
import { useMusicDataStore } from "@/stores/musicdata";
import { usePlayerStore } from "@/stores/player";
import { PlayMode, usePlayerbarStore } from "@/stores/playerbar";
import { convertSecondToTime } from "@/tools";

const playerStore = usePlayerStore()
const playerbarStore = usePlayerbarStore()
const musicDataStore = useMusicDataStore()

function changeMusic(next: boolean = true) {
    function inner() {
        switch (playerbarStore.playMode) {
            case PlayMode.RANDOM:
                if (musicDataStore.currentMusicList.length === 1) {
                    playerStore.reloadMusic()
                } else {
                    while (true) {
                        const music = musicDataStore.randMusic()
                        if (music.id !== playerStore.currentMusic.id) {
                            playerStore.selectMusic(music)
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
                playerStore.selectMusic(music)
                break;
            default:
                // should never happen
                console.error('unknown play mode:', playerbarStore.playMode)
                break;
        }
    }

    setTimeout(inner, 50)
}

playerStore.player.onended = () => changeMusic()

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
                <button @click="changeMusic()">
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

<style scoped lang="less">
.player-bar {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    /* 进度条样式 */
    .progress {
        width: 90%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;

        /* 进度条容器样式 */
        .progress-container {
            width: 100%;
            height: 10px;
            margin-left: 10px;
            margin-right: 10px;
            background-color: #afd3f7;
            border-radius: 5px;
            cursor: pointer;
        }

        /* 进度条样式 */
        .progress-bar {
            height: 100%;
            background-color: #4098f7;
            border-radius: 5px;
            width: 0%;
        }
    }

    /* 控制按钮样式 */
    .controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 90%;
        margin-top: 10px;

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
        button {
            background: transparent;
            border: none;
            cursor: pointer;
            margin: 5px;

            &:focus {
                outline: none;
            }

            &:active {
                transform: scale(0.9);
            }

            img {
                width: 30px;
                height: 30px;
            }
        }
    }
}
</style>