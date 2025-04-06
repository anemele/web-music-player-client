<template>
    <div class="btnGrp">
        <button @click="locateCurrent">+</button>
    </div>
</template>

<script lang="ts" setup>
import { emitter, Events } from "@/tools/emit";

function locateCurrent() {
    document.querySelector(".current")?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
    });
}

emitter.on(Events.locateCurrent, function () {
    // 此处要加一个延时，否则 class 变化太慢，事件响应太快，导致显示不一致。
    setTimeout(locateCurrent, 100); // 100ms 后执行 locateCurrent
})
</script>

<style scoped>
.btnGrp {
    display: flex;
    flex-flow: column;
    position: fixed;
    bottom: 120px;
    right: 30px;
}

.btnGrp>button {
    font-size: x-large;
    background-color: #eeee;
    z-index: 999;
    border-radius: 50%;
    margin-top: 10px;
}
</style>