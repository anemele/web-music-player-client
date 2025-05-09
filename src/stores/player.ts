import { getMusicFile, type MusicInter } from "@/api";
import { joinTitleAndArtist } from "@/tools";
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

    function selectMusic(music: MusicInter) {
        if (currentMusic.id === music.id) { return }
        Object.assign(currentMusic, music);
        document.title = joinTitleAndArtist(currentMusic);
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
        selectMusic,
        reloadMusic,
    }
})