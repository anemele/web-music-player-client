<script lang="ts" setup>
import { Events, emitter } from '@/tools/emit';
import { onMounted, reactive, ref } from 'vue';
import { type ItemInter } from './inter';
import MusicItem from './MusicItem.vue';
import { PlayMode } from './consts'
import { getMusicList } from "@/api";

// 此处设置默认数据，防止后端服务器未开启导致页面空白
let items = reactive<ItemInter[]>([
    {
        id: 1,
        title: 'Title 1',
        artist: 'Artist 1',
        album: 'Album 1',
        duration: 123,
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

let activeIndex = ref(-1)
function selectMusic(idx: number) {
    if (activeIndex.value === idx) { return }
    activeIndex.value = idx;
    document.title = items[idx].title + ' - ' + items[idx].artist
    emitter.emit(Events.SendMusic, items[idx])
    emitter.emit(Events.LocateCurrent)
}

let playMode = ref(PlayMode.RANDOM)
emitter.on(Events.TogglePlayMode, (e) => {
    const mode = e as PlayMode
    playMode.value = mode
})

function randMusic() {
    return Math.floor(Math.random() * items.length)
}

function nextMusic() {
    switch (playMode.value) {
        case PlayMode.RANDOM:
            selectMusic(randMusic())
            break;
        case PlayMode.LIST_LOOP:
            selectMusic((activeIndex.value + 1) % items.length)
            break;
        case PlayMode.SINGLE_LOOP:
            emitter.emit(Events.ReloadMusic)
            break;
        default:
            // should never happen
            console.error('unknown play mode:', playMode.value)
            break;
    }
}

function prevMusic() {
    switch (playMode.value) {
        case PlayMode.RANDOM:
            selectMusic(randMusic())
            break;
        case PlayMode.LIST_LOOP:
            selectMusic((activeIndex.value - 1 + items.length) % items.length)
            break;
        case PlayMode.SINGLE_LOOP:
            emitter.emit(Events.ReloadMusic)
            break;
        default:
            // should never happen
            console.error('unknown play mode:', playMode.value)
            break;
    }
}

emitter.on(Events.NextMusic, () => setTimeout(() => nextMusic(), 100))
emitter.on(Events.PrevMusic, () => setTimeout(() => prevMusic(), 100))
</script>

<template>
    <div>
        <li class="item" v-for="(item, index) in items" :key="item.id" @click="selectMusic(index)"
            :class="{ current: activeIndex === index }">
            <MusicItem :item="item" :index="index" />
        </li>
    </div>
</template>

<style scoped>
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