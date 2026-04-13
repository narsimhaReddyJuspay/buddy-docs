<script lang="ts">
  let {
    title,
    description,
    href,
    icon = '',
    iconHtml = '',
    provider = '',
    status = 'available'
  }: {
    title: string;
    description: string;
    href: string;
    icon?: string;
    iconHtml?: string;
    provider?: string;
    status?: 'available' | 'beta' | 'coming-soon';
  } = $props();

  const statusStyles = {
    available: { badge: 'bg-green-500/10 text-green-400 border-green-500/20', label: 'Available' },
    beta: { badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20', label: 'Beta' },
    'coming-soon': { badge: 'bg-muted text-muted-foreground border-border', label: 'Soon' }
  };
</script>

<a
  href={href}
  class="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-0.5"
>
  <!-- Status badge -->
  {#if status !== 'available'}
    <span class="absolute top-3 right-3 rounded-md border px-2 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wider {statusStyles[status].badge}">
      {statusStyles[status].label}
    </span>
  {/if}

  <!-- Icon + Provider -->
  <div class="flex items-center gap-3">
    <div class="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-xl">
      {#if iconHtml}
        {@html iconHtml}
      {:else}
        {icon}
      {/if}
    </div>
    {#if provider}
      <span class="rounded-md bg-violet-500/8 px-2 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wider text-violet-400">
        {provider}
      </span>
    {/if}
  </div>

  <!-- Content -->
  <div>
    <h4 class="text-sm font-semibold text-foreground mb-1">{title}</h4>
    <p class="text-[0.75rem] text-muted-foreground leading-relaxed">{description}</p>
  </div>

  <!-- CTA -->
  <span class="mt-auto text-[0.6875rem] font-medium text-violet-400/70 group-hover:text-violet-400 transition-colors">
    View integration →
  </span>
</a>
