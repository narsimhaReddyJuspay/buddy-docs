<script lang="ts">
  let { method = 'GET', path = '', description = '' }: {
    method?: string;
    path?: string;
    description?: string;
  } = $props();

  const methodColors: Record<string, string> = {
    GET: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    POST: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    PUT: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    DELETE: 'bg-red-500/15 text-red-400 border-red-500/20',
    PATCH: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    WS: 'bg-violet-500/15 text-violet-400 border-violet-500/20'
  };
</script>

<div class="my-4 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 not-prose">
  <span class="rounded-md border px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wide {methodColors[method] ?? methodColors.GET}">
    {method}
  </span>
  <code class="text-sm font-medium text-foreground" style="font-family: var(--mono-font-family);">{path}</code>
  {#if description}
    <span class="ml-auto text-xs text-muted-foreground hidden sm:inline">{description}</span>
  {/if}
</div>
