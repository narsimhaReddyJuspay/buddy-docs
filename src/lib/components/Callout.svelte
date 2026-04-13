<script lang="ts">
  import type { Snippet } from 'svelte';

  let { type = 'info', title = '', children }: {
    type?: 'info' | 'warning' | 'danger' | 'tip';
    title?: string;
    children: Snippet;
  } = $props();

  const styles: Record<string, { border: string; bg: string; icon: string; title: string }> = {
    info: {
      border: 'border-l-[var(--buddy-purple)]',
      bg: 'bg-[color-mix(in_srgb,var(--buddy-purple)_6%,transparent)]',
      icon: 'ℹ',
      title: 'text-[var(--buddy-purple-light)]'
    },
    warning: {
      border: 'border-l-[var(--buddy-orange)]',
      bg: 'bg-[color-mix(in_srgb,var(--buddy-orange)_6%,transparent)]',
      icon: '⚠',
      title: 'text-[var(--buddy-orange-light)]'
    },
    danger: {
      border: 'border-l-red-500',
      bg: 'bg-red-500/5',
      icon: '🚨',
      title: 'text-red-400'
    },
    tip: {
      border: 'border-l-emerald-500',
      bg: 'bg-emerald-500/5',
      icon: '💡',
      title: 'text-emerald-400'
    }
  };

  const s = $derived(styles[type] ?? styles.info);
</script>

<div class="my-5 rounded-lg border-l-4 {s.border} {s.bg} px-5 py-4 not-prose">
  {#if title}
    <p class="mb-2 text-sm font-semibold {s.title}">
      <span class="mr-1.5">{s.icon}</span>{title}
    </p>
  {/if}
  <div class="text-[0.8125rem] text-muted-foreground leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
    {@render children()}
  </div>
</div>
