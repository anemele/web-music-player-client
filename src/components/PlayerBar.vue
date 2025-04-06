<template>
    <div class="player-bar">
        <!-- <audio ref="player" controls autoplay @ended="emitter.emit(Events.nextMusic)"> -->
        <!-- 保持后台播放需要内嵌 source 标签 -->
        <!-- 后台播放需要浏览器支持！！！ -->
        <!-- <source :src="src"> -->
        <!-- </audio> -->
        <!-- 播放进度条 -->
        <div class="progress">
            <i>{{ convertSecondToTime(current) }}</i>
            <div class="progress-container" @click="changeCurrentTime">
                <div class="progress-bar" :style="{width: `${(current/duration)*100}%`}"></div>
            </div>
            <i>{{ convertSecondToTime(duration) }}</i>
        </div>
        <div class="controls">
            <div class="left-controls">
                <button @click="emitter.emit(Events.nextMusic)">
                    <img src="@/assets/image/btn-prev.svg" alt="">
                </button>
                <button @click="playAndPause">
                    <img v-show="player.paused" src="@/assets/image/btn-play.svg" alt="">
                    <img v-show="!player.paused" src="@/assets/image/btn-pause.svg" alt="">
                </button>
                <button @click="emitter.emit(Events.nextMusic)">
                    <img src="@/assets/image/btn-next.svg" alt="">
                </button>
            </div>
            <div class="right-controls">
                <button @click="TODO">模式</button>
                <button @click="TODO">
                    <img src="@/assets/image/btn-list.svg" alt="">
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from "vue";
    import { emitter, Events } from "@/tools/emit";
    import { convertSecondToTime } from "@/tools/utils";
    import { type ItemInter } from "./inter";
    import { getMusic } from "@/api";

    const player = new Audio()

    emitter.on(Events.sendMusic, (e) => {
        // 此处类型检查不过，使用断言改变类型
        // 虽然不很美观，但是可以通过类型检查
        const music = e as ItemInter
        player.src = getMusic(music.id)
        current.value = 0
        duration.value = music.duration
        // 使用 source 标签后要 load 否则无法播放
        // 改用 Audio 对象之后不要 load 否则会有重音
        // player.load()
        if (player.paused) { player.play() }
    })

    function playAndPause() {
        player.paused ? player.play() : player.pause()
    }

    let current = ref(0)
    let duration = ref(123)

    function changeCurrentTime(event: MouseEvent) {
        // 用选择器获取目标，不要用 event ，因为 event 可能是冒泡事件
        const progressContrainer = document.querySelector('.progress-container')
        // 获取进度条容器宽度，此处应该不会为 undefined
        const width = progressContrainer?.clientWidth;
        // console.log(width)
        if (width === undefined) {
            alert('Internal error: progress container width is undefined')
            return
        }
        // 获取点击位置相对于进度条容器左侧的距离
        const clickX = event.offsetX;
        // console.log(clickX)
        current.value = (clickX / width) * duration.value;
        // 设置当前播放时间
        player.currentTime = current.value
    }

    player.ontimeupdate = function () {
        current.value = player.currentTime
    }

    player.onended = function () {
        emitter.emit(Events.nextMusic)
    }

    function TODO() {
        alert('TODO')
    }

</script>

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
        opacity: 0.9;
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