<script setup lang="ts">
defineProps<{ title: string, artist: string, album: string }>()
</script>

<template>
    <div class="content">
        <div class="name">{{ title }}</div>
        <div class="album">{{ artist }} - {{ album }}</div>
    </div>
</template>

<style scoped>
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
    margin-bottom: 4px
}

.album {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: calc(100% - 80px);
    font-size: 11px
}
</style>