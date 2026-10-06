/// <reference types="vite/client" />

declare module '*.svelte' {
  import type { ComponentType } from 'svelte';
  const component: any;
  export default component;
}
