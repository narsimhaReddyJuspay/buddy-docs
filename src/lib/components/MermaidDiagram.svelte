<script lang="ts">
  import { onMount } from 'svelte';

  let { chart = '', caption = '' }: {
    chart?: string;
    caption?: string;
  } = $props();

  let container: HTMLDivElement | undefined = $state();
  let rendered = $state(false);

  onMount(async () => {
    if (!container || !chart) return;
    try {
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          primaryColor: '#7c3aed',
          primaryTextColor: '#e2e8f0',
          primaryBorderColor: '#9142ff',
          lineColor: '#6c5ff9',
          secondaryColor: '#1e1b2e',
          tertiaryColor: '#131420',
          background: '#1a1b2e',
          mainBkg: '#1a1b2e',
          nodeBorder: 'rgba(255,255,255,0.1)',
          fontFamily: 'Geist, sans-serif',
          fontSize: '13px'
        }
      });
      const { svg } = await mermaid.render('mermaid-' + Math.random().toString(36).slice(2), chart);
      if (container) {
        container.innerHTML = svg;
        rendered = true;
      }
    } catch (e) {
      console.error('Mermaid render error:', e);
      if (container) {
        container.innerHTML = `<pre class="text-xs text-red-400 p-4">${chart}</pre>`;
      }
    }
  });
</script>

<div class="mermaid-container not-prose">
  {#if caption}
    <div class="px-4 py-2 border-b border-border/50" style="background: rgba(255,255,255,0.02);">
      <span class="text-xs font-medium text-muted-foreground">{caption}</span>
    </div>
  {/if}
  <div class="mermaid flex justify-center p-6" style="background: linear-gradient(180deg, #1a1b2e 0%, #131420 100%);" bind:this={container}>
    {#if !rendered}
      <div class="text-xs text-muted-foreground/40 animate-pulse">Loading diagram...</div>
    {/if}
  </div>
</div>
