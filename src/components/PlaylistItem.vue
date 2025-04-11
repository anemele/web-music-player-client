<script setup lang="ts">
defineProps<{ name: string, count: number }>()
</script>

<template>
    <div class="playlist-item">
        <span class="name">{{ name }}</span><span class="count">({{ count }})</span>
    </div>
</template>

<style scoped>
.playlist-item {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    padding: 8px 10px;
    box-sizing: border-box;
    border-radius: 5px;
    width: 100%;
    cursor: pointer;
}

.name {
    font-weight: bold;
    margin-right: 15px;
}
</style>