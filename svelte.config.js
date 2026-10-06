import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  // Preprocesador para compilar TypeScript en bloques <script lang="ts">
  preprocess: vitePreprocess(),
};
