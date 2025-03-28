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

let items = reactive<ItemInter[]>([])
// for (let i = 0; i < 100; i++) {
//     items.push({
//         id: i,
//         title: "Love Story",
//         artist: "Taylor Swift", album: "1989", duration: "3:21",
//     })
// }

// TODO
// 如何设置后端 url？硬编码不是个好方法。


onMounted(() => setTimeout(async () => {
    let res = await getMusicList();
    if (res.data === null) {
        alert('server error')
        return
    }

    res.data.forEach((it: ItemInter) => items.push(it))
}, 50))

let isActive = ref(-1)
function selectMusic(id: number) {
    if (isActive.value === id) { return }

    isActive.value = id;
    emitter.emit(Events.sendMusic, getMusic(id))
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