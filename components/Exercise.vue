<script setup lang="ts">
import { computed } from 'vue'

// Le dépôt est fourni par la GitHub Action (VITE_REPO_URL), avec le dépôt Coda-Dijon par défaut en local
const props = withDefaults(defineProps<{ path: string; tag?: string }>(), { tag: 'Exercice' })
const repoUrl = (import.meta.env.VITE_REPO_URL || 'https://github.com/Coda-Dijon/crafting-code-b2').replace(/\/$/, '')
const href = computed(() => `${repoUrl}/tree/main/${encodeURI(props.path)}`)
</script>

<template>
  <div class="exercise">
    <span class="exercise__tag">{{ tag }}</span>
    <a :href="href" target="_blank" rel="noopener">{{ path }}</a>
  </div>
</template>
