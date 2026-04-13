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

<div class="my-5 rounded-xl border border-border/50 overflow-hidden bg-[oklch(10%_0_0)]">
  {#if filename || lang}
    <div class="flex items-center justify-between border-b border-white/5 px-4 py-2">
      <div class="flex items-center gap-2">
        {#if filename}
          <span class="text-xs text-muted-foreground/60 font-medium">{filename}</span>
        {/if}
      </div>
      <div class="flex items-center gap-2">
        {#if lang}
          <span class="text-[0.625rem] text-muted-foreground/40 uppercase font-mono tracking-wider">{lang}</span>
        {/if}
        <button
          class="rounded-md px-2 py-1 text-[0.625rem] text-muted-foreground/40 transition-all hover:text-muted-foreground hover:bg-white/5"
          onclick={copy}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  {/if}
  <pre class="!my-0 !rounded-none !border-0 overflow-x-auto p-4 text-[0.8125rem] leading-relaxed !bg-transparent"><code>{code}</code></pre>
</div>
