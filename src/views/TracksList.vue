<script setup lang="ts">

</script>

<template>
    <main class="tracks-list">
        <h2>Tracks List View</h2>
    </main>
</template>

<style scoped>
.track-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow-y: auto;
    flex: 1;
}

.track-item {
    display: flex;
    align-items: center;
    padding: 0.6rem 0.75rem;
    border-radius: var(--radius-md);
    gap: 0.75rem;
    transition: background 0.2s;
}
</style>