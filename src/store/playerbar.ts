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

    function toggleShow() {
        playlistShow.value = !playlistShow.value;
    }

    const playMode = ref(PlayMode.RANDOM)

    function togglePlayMode() {
        playModeIndex.value = (playModeIndex.value + 1) % PlayModeList.length;
        playMode.value = PlayModeList[playModeIndex.value];
    }

    return { playlistShow, toggleShow, playMode, togglePlayMode };
})
