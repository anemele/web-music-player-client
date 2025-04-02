<template>
    <div class="btnGrp">
        <button @click="locateCurrent">+</button>
        <button @click="emitter.emit(Events.nextMusic)">></button>
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

emitter.on(Events.locateCurrent, locateCurrent)

</script>

<style scoped>
.btnGrp {
    display: flex;
    flex-flow: column;
    position: fixed;
    bottom: 90px;
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