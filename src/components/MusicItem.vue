<script lang="ts" setup>
import { type MusicInter } from '@/api';
import { convertSecondToTime } from '@/tools';
import MusicItemContent from './MusicItemContent.vue';

defineProps<{ item: MusicInter, index: number }>()
</script>

<template>
    <div class="index">
        <span>{{ index + 1 }}</span>
        <i></i>
    </div>
    <MusicItemContent :title="item.title" :artist="item.artist" :album="item.album" />
    <div class="duration">{{ convertSecondToTime(item.duration) }}</div>
</template>

<style scoped>
.index {
    width: 50px;
    font-size: 16px;
    text-align: center
}

.index>i {
    position: absolute;
    top: 0;
    left: 12px;
    font-size: 20px;
    line-height: 50px;
    color: red
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
</style>