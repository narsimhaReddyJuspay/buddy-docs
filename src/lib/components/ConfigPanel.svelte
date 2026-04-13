<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    title,
    variant = 'default',
    children
  }: {
    title: string;
    variant?: 'default' | 'integrate' | 'customize';
    children?: Snippet;
  } = $props();

  const variantStyles = {
    default: { border: 'border-border', accent: 'text-foreground', dot: 'bg-foreground' },
    integrate: { border: 'border-violet-500/20', accent: 'text-violet-400', dot: 'bg-violet-400' },
    customize: { border: 'border-amber-500/20', accent: 'text-amber-400', dot: 'bg-amber-400' }
  };

  const s = $derived(variantStyles[variant]);
</script>

<div class="config-panel my-6 rounded-xl border {s.border} overflow-hidden" style="background: rgba(255,255,255,0.01);">
  <div class="flex items-center gap-3 border-b border-border/50 px-5 py-3" style="background: rgba(255,255,255,0.02);">
    <div class="flex items-center gap-1.5">
      <span class="h-2 w-2 rounded-full {s.dot} opacity-70"></span>
      <span class="h-2 w-2 rounded-full {s.dot} opacity-40"></span>
      <span class="h-2 w-2 rounded-full {s.dot} opacity-20"></span>
    </div>
    <span class="text-[0.8125rem] font-semibold {s.accent}">{title}</span>
  </div>
  <div class="p-5">
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>
