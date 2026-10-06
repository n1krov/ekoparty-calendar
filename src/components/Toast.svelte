<script lang="ts">
  import { toastState } from '../stores/toast';
</script>

{#if $toastState.isVisible}
  <div class="toast" role="status" aria-live="polite">
    {$toastState.message}
  </div>
{/if}
