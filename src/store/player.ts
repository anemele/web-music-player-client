import { getMusicFile, type MusicInter, type PlaylistInter } from "@/api";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const usePlayerStore = defineStore("player", () => {
    const player = new Audio()

    function playAndPause() {
        player.paused ? player.play() : player.pause()
    }

    const currentTime = ref(0)

    player.ontimeupdate = () => {
        currentTime.value = player.currentTime
    }

    function changeMusic() {
        if (!player.paused) { player.pause() }
        currentTime.value = 0
        player.src = getMusicFile(currentMusic.id)
        reloadMusic()
    }

    function reloadMusic() {
        if (player.paused) { player.play() }
    }

    const currentMusic = reactive<MusicInter>({
        id: 0,
        title: "标题",
        artist: "歌手",
        album: "专辑",
        duration: 0,
    })

    return {
        player,
        currentMusic,
        currentTime,
        playAndPause,
        changeMusic,
        reloadMusic,
    }
})