import { defineStore } from "pinia";

export const usePlayerStore = defineStore("player", () => {
    const player = new Audio()

    return {
        player
    }
})