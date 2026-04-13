<script lang="ts">
  let { steps = [] }: { steps?: string[] } = $props();
</script>

<div class="my-6 overflow-x-auto not-prose">
  <div class="flex items-center gap-1 min-w-max py-2">
    {#each steps as step, i}
      <div class="flex items-center justify-center rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground whitespace-nowrap"
           style="background: linear-gradient(to top, color-mix(in srgb, var(--buddy-purple) 3%, var(--card)), var(--card));">
        {step}
      </div>
      {#if i < steps.length - 1}
        <svg class="h-3 w-3 shrink-0 text-muted-foreground/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6" /></svg>
      {/if}
    {/each}
  </div>
</div>
