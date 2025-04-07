<script lang="ts" setup>
import { emitter, Events } from "@/tools/emit";
import { onMounted, onUnmounted, ref } from "vue";

function locateCurrent() {
    document.querySelector(".current")?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
    });
}

emitter.on(Events.LocateCurrent, function () {
    // 此处要加一个延时，否则 class 变化太慢，事件响应太快，导致显示不一致。
    setTimeout(locateCurrent, 100); // 100ms 后执行 locateCurrent
})

let isVisible = ref(false);
let scrollTimmer: number | null = null;

function handleScroll() {
    isVisible.value = window.scrollY > 800;
    if (scrollTimmer) {
        clearTimeout(scrollTimmer);
    }
    scrollTimmer = setTimeout(() => {
        isVisible.value = false;
    }, 5000);
}

onMounted(() => {window.addEventListener("scroll", handleScroll)});
onUnmounted(() => {window.removeEventListener("scroll", handleScroll)});

</script>

<template>
    <div v-show="isVisible" class="btnGrp">
        <button @click="locateCurrent">locate</button>
    </div>
</template>

<style scoped>
.btnGrp {
    display: flex;
    flex-flow: column;
    position: fixed;
    top:40%;
    left: 50%;
}

.btnGrp>button {
    font-size: x-large;
    font-family: 'Times New Roman', Times, serif;
    color: blue;
    background-color: white;
    z-index: 999;
    border-radius: 10%;
    margin-top: 10px;
}
</style>