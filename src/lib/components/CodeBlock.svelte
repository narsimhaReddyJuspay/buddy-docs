<script lang="ts">
  let { code = '', lang = '', filename = '' }: {
    code?: string;
    lang?: string;
    filename?: string;
  } = $props();

  let copied = $state(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }
</script>

<div class="code-block my-5 rounded-xl overflow-hidden" style="background: linear-gradient(180deg, #1a1b2e 0%, #131420 100%); border: 1px solid rgba(255,255,255,0.08);">
  {#if filename || lang}
    <div class="flex items-center justify-between px-4 py-2.5" style="background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.06);">
      <div class="flex items-center gap-2">
        <!-- Terminal dots -->
        <div class="flex items-center gap-1.5 mr-2">
          <span class="h-2.5 w-2.5 rounded-full bg-red-500/70"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-yellow-500/70"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-green-500/70"></span>
        </div>
        {#if filename}
          <span class="text-xs font-medium" style="color: rgba(255,255,255,0.5);">{filename}</span>
        {/if}
      </div>
      <div class="flex items-center gap-3">
        {#if lang}
          <span class="text-[0.625rem] uppercase font-mono tracking-wider" style="color: rgba(139,92,246,0.6);">{lang}</span>
        {/if}
        <button
          class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[0.6875rem] font-medium transition-all"
          style="color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);"
          onmouseenter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
          onmouseleave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
          onclick={copy}
        >
          {#if copied}
            <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
            Copied!
          {:else}
            <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy
          {/if}
        </button>
      </div>
    </div>
  {/if}
  <pre class="!my-0 !rounded-none !border-0 overflow-x-auto p-4 text-[0.8125rem] leading-relaxed !bg-transparent"><code class="code-highlight">{code}</code></pre>
</div>
