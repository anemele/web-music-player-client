<script lang="ts" setup>
import { type MusicInter } from '@/api';
import { convertSecondToTime } from '@/tools';
import MusicItemContent from './MusicItemContent.vue';

defineProps<{ item: MusicInter, index: number }>()
</script>

<template>
    <div class="music-item">
        <div class="index">
            <span>{{ index + 1 }}</span>
        </div>
        <MusicItemContent :title="item.title" :artist="item.artist" :album="item.album" />
        <div class="duration">{{ convertSecondToTime(item.duration) }}</div>
    </div>
</template>

<style scoped lang="less">
@height: 50px;

.music-item {
    position: relative;
    display: flex;
    height: @height;
    align-items: center;

    .index {
        width: @height;
        font-size: 16px;
        text-align: center;
    }

    .duration {
        position: absolute;
        font-size: 13px;
        top: 0;
        right: 0;
        width: 80px;
        height: 100%;
        line-height: 55px;
        text-align: center;
    }
}
</style>