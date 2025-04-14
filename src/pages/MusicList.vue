<script lang="ts" setup>
import MusicItem from '@/components/MusicItem.vue';
import PlayerBar from '@/components/PlayerBar.vue';
import PlaylistPopup from '@/components/PlaylistPopup.vue';
import { useMusicDataStore } from "@/stores/musicdata";
import { usePlayerStore } from "@/stores/player";
import { usePlayerbarStore } from "@/stores/playerbar";
import { joinTitleAndArtist } from "@/tools";

const musicDataStore = useMusicDataStore();
const playerbarStore = usePlayerbarStore();
const playerStore = usePlayerStore();

</script>

<template>
    <div class="app-container">
        <div class="titlebar">
            <span>{{ joinTitleAndArtist(playerStore.currentMusic) }}</span>
        </div>

        <div class="music-list">
            <MusicItem :class="{ current: playerStore.currentMusic.id === item.id }"
                v-for="(item, index) in musicDataStore.currentMusiclist.arrayData" :key="item.id" :item="item"
                :index="index" @click="playerStore.selectMusic(item)" />
        </div>

        <PlayerBar class="playerbar" />

        <PlaylistPopup class="playlistpopup" v-show="playerbarStore.playlistShow" />
    </div>
</template>

<style scoped lang="less">
@import "@/assets/less/var.less";

@seleted-item-bg: #dcb;
@seleted-item-fg: #89a;

.current {
    background-color: @seleted-item-bg;
    color: @seleted-item-fg;
}

@main-bg-color: #fed;
@music-list-item-fg: #345;
@titlebar-fg: white;
@titlebar-bg: lightsalmon;
@titlebar-height: 50px;
@playerbar-fg: white;
@playerbar-bg: lightsalmon;
@playerbar-height: 100px;

.app-container {
    display: flex;
    flex-direction: column;
    background-color: @main-bg-color;
    height: 100vh;

    .titlebar {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        padding: 5px;
        z-index: @fixed-z-index;
        top: 0;
        left: 0;
        right: 0;
        font-size: 24px;
        height: @titlebar-height;
        color: @titlebar-fg;
        background-color: @titlebar-bg;

        span {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            margin-left: 15px;
            margin-right: 15px;

        }
    }

    .music-list {
        margin-top: @titlebar-height;
        margin-bottom: @playerbar-height;
        color: @music-list-item-fg;
        overflow-y: auto;
    }

    .playerbar {
        position: fixed;
        z-index: @fixed-z-index;
        bottom: 0;
        width: 100%;
        height: @playerbar-height;
        background-color: @playerbar-bg;
        color: @playerbar-fg;
    }

    .playlistpopup {
        position: fixed;
        align-items: center;
        margin: auto;
        left: 0;
        right: 0;
        bottom: 25%;
    }
}
</style>