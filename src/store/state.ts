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

let playModeIndex = 0;


export const useShowStore = defineStore('show', () => {
    let playlistShow = ref(false)

    function toggleShow() {
        playlistShow.value = !playlistShow.value;
    }

    return { playlistShow, toggleShow };
});

export const usePlayModeStore = defineStore('playmode', () => {
    let playMode = ref(PlayMode.RANDOM)

    function togglePlayMode() {
        playModeIndex = (playModeIndex + 1) % PlayModeList.length;
        playMode.value = PlayModeList[playModeIndex];
    }

    return { playMode, togglePlayMode };
})
