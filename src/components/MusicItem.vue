<template>
    <div class="index">
        <span>{{ index + 1 }}</span>
        <i></i>
    </div>
    <div class="content">
        <div class="name">{{ item.title }}</div>
        <div class="album">{{ item.artist }} - {{ item.album }}</div>
    </div>
    <div class="duration">{{ item.duration }}</div>
</template>

<script lang="ts" setup>
import { type ItemInter } from './inter'

defineProps<{ item: ItemInter, index: number }>()

</script>


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

.content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 1px 1px -1px #ccc
}

.name {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: calc(100% - 80px);
    font-size: 15px;
    color: #000;
    margin-bottom: 4px
}

.album {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: calc(100% - 80px);
    font-size: 11px
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