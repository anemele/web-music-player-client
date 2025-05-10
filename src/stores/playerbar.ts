import { defineStore } from "pinia";
import { ref } from "vue";

export enum PlayMode {
    RANDOM = "RANDOM",
    LIST_LOOP = "LIST_LOOP",
    SINGLE_LOOP = "SINGLE_LOOP",
}

const PlayModeList = [
    PlayMode.RANDOM,
    PlayMode.LIST_LOOP,
    PlayMode.SINGLE_LOOP,
];

const playModeIndex = ref(0);

export const usePlayerbarStore = defineStore('playerbar', () => {
    const playlistShow = ref(false)

    let toggleShowTimer: number | undefined = undefined;

    function toggleShow() {
        if (toggleShowTimer !== null) {
            clearTimeout(toggleShowTimer);
        }
        playlistShow.value = !playlistShow.value;
        if (playlistShow.value) {
            toggleShowTimer = setTimeout(() => {
                playlistShow.value = false;
            }, 10000); // 10秒后隐藏
        }
    }

    const playMode = ref(PlayMode.RANDOM)

    function togglePlayMode() {
        playModeIndex.value = (playModeIndex.value + 1) % PlayModeList.length;
        playMode.value = PlayModeList[playModeIndex.value];
    }

    return { playlistShow, toggleShow, playMode, togglePlayMode };
})
