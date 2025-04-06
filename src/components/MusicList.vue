<template>
    <div>
        <li class="item" v-for="(item, index) in items" :key="item.id" @click="selectMusic(index)"
            :class="{ current: isActive === index }">
            <MusicItem :item="item" :index="index" />
        </li>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import MusicItem from './MusicItem.vue';
import { Events, emitter } from '@/tools/emit';
import { type ItemInter } from './inter'

import { getMusic, getMusicList } from "@/api";

// 此处设置默认数据，防止后端服务器未开启导致页面空白
let items = reactive<ItemInter[]>([
    {
        id: 1,
        title: 'Title 1',
        artist: 'Artist 1',
        album: 'Album 1',
        duration: '1:23',
    }
])

onMounted(() => setTimeout(async () => {
    let res = await getMusicList();
    if (res.data === null) {
        alert('server error')
        return
    }
    if (res.data.length === 0) {
        alert('no music')
        return
    }
    // 移除默认数据
    items.pop()
    res.data.forEach((it: ItemInter) => items.push(it))
}, 50))

let isActive = ref(-1)
function selectMusic(idx: number) {
    if (isActive.value === idx) { return }
    isActive.value = idx;
    document.title = items[idx].title + ' - ' + items[idx].artist
    emitter.emit(Events.sendMusic, items[idx])
    emitter.emit(Events.locateCurrent)
}

function randMusic() {
    return Math.floor(Math.random() * items.length)
}
emitter.on(Events.nextMusic, () => { selectMusic(randMusic()) })

</script>

<style>
li.current {
    background-color: #dddd;
}

li.item {
    position: relative;
    display: flex;
    height: 50px;
    align-items: center;
    color: #999
}
</style>