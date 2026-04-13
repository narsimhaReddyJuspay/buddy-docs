<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    title,
    icon = '⚙️',
    variant = 'default',
    children
  }: {
    title: string;
    icon?: string;
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
    <span class="text-base">{icon}</span>
    <span class="text-[0.8125rem] font-semibold {s.accent}">{title}</span>
    <span class="h-1.5 w-1.5 rounded-full {s.dot} opacity-60 ml-auto"></span>
  </div>
  <div class="p-5">
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>
