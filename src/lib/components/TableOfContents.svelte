<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  interface TocItem {
    id: string;
    text: string;
    level: number;
  }

  let items = $state<TocItem[]>([]);
  let activeId = $state('');

  function buildToc() {
    const container = document.querySelector('[data-doc-content]');
    if (!container) return;
    const headings = container.querySelectorAll('h2[id], h3[id]');
    items = Array.from(headings).map((h) => ({
      id: h.id,
      text: h.textContent?.trim() ?? '',
      level: h.tagName === 'H2' ? 2 : 3
    }));
  }

  onMount(() => {
    buildToc();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeId = entry.target.id;
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );
    const container = document.querySelector('[data-doc-content]');
    if (container) {
      container.querySelectorAll('h2[id], h3[id]').forEach((h) => observer.observe(h));
    }
    return () => observer.disconnect();
  });

  $effect(() => {
    void $page.url.pathname;
    setTimeout(buildToc, 100);
  });
</script>

{#if items.length > 0}
  <div class="space-y-1">
    <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">On this page</p>
    {#each items as item}
      <a
        href="#{item.id}"
        class="block text-[0.8125rem] leading-relaxed transition-colors py-0.5
          {item.level === 3 ? 'pl-3' : ''}
          {activeId === item.id
            ? 'text-foreground font-medium'
            : 'text-muted-foreground/60 hover:text-muted-foreground'}"
      >
        {item.text}
      </a>
    {/each}
  </div>
{/if}
