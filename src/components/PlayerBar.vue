<template>
    <div>
        <audio ref="player" controls autoplay @ended="emitter.emit(Events.nextMusic)">
            <!-- 保持后台播放需要内嵌 source 标签 -->
            <!-- 后台播放需要浏览器支持！！！ -->
            <source :src="src">
        </audio>
    </div>
</template>

<script lang="ts" setup>

import { ref } from "vue";
import { emitter, Events } from "@/tools/emit";
// import { onMounted } from "vue";
// import { onUnmounted } from "vue";

const player = ref()
let src = ref()

emitter.on(Events.sendMusic, (v) => {
    src.value = v
    // 使用 source 标签后要 load 否则无法播放
    player.value.load()
    if (player.value.paused) { player.value.play() }
})


// function handleKeyDown(event: KeyboardEvent) {
//     // console.log(event.keyCode)
//     // if (event.key === 'ArrowRight') {

//     if (event.keyCode === 176) {
//         emitter.emit(Events.nextMusic)
//     }
// }

// onMounted(() => {
//     window.addEventListener('keydown', handleKeyDown)
// })

// onUnmounted(() => {
//     window.removeEventListener('keydown', handleKeyDown)
// })

</script>

<style scoped>
audio {
    position: fixed;
    bottom: 10px;
    z-index: 999;
    margin: auto;
    left: 0;
    right: 0;
}
</style>