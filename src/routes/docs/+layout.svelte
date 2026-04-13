<script lang="ts">
  import DocsSidebar from '$lib/components/DocsSidebar.svelte';
  import TableOfContents from '$lib/components/TableOfContents.svelte';
  import { page } from '$app/stores';
  import { navigation } from '$lib/navigation';

  let { children } = $props();

  let sidebarOpen = $state(false);
  let isDark = $state(true);

  let breadcrumb = $derived.by(() => {
    const path = $page.url.pathname;
    for (const group of navigation) {
      const item = group.items.find((i) => i.href === path);
      if (item) return { group: group.title, page: item.title };
    }
    return { group: 'Docs', page: 'Introduction' };
  });

  function toggleTheme() {
    isDark = !isDark;
    document.documentElement.classList.toggle('dark', isDark);
  }

  function closeSidebar() {
    sidebarOpen = false;
  }
</script>

<!-- Loom-style: sidebar-wrapper with inset main -->
<div class="flex min-h-svh w-full bg-sidebar p-2 md:p-3" style="--sidebar-width: 16rem;">
  <!-- Mobile overlay -->
  {#if sidebarOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
      onclick={closeSidebar}
    ></div>
  {/if}

  <!-- Sidebar -->
  <aside
    class="fixed inset-y-0 left-0 z-50 flex h-svh w-64 flex-col bg-sidebar lg:sticky lg:top-0 lg:w-[var(--sidebar-width)] lg:translate-x-0
    {sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200"
  >
    <!-- Brand header — harbour buddy logo -->
    <div class="flex items-center gap-3 px-4 py-4">
      <img src="/breeze-buddy-mini.svg" alt="Breeze Buddy" class="h-8 w-8 rounded-lg" />
      <div class="flex flex-col">
        <span class="text-sm font-semibold leading-tight text-sidebar-foreground">Breeze Buddy</span>
        <span class="text-[0.625rem] text-muted-foreground">Developer Docs</span>
      </div>
    </div>

    <!-- Search -->
    <div class="px-3 pb-3">
      <div class="flex w-full items-center gap-2 rounded-md border border-sidebar-border bg-background/50 px-3 py-1.5 text-sm text-muted-foreground/50 transition-colors cursor-text">
        <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
        <span class="text-[0.8125rem]">Search docs...</span>
        <kbd class="ml-auto rounded border border-sidebar-border/60 bg-muted/40 px-1.5 py-0.5 text-[0.5625rem] font-mono text-muted-foreground/40">&#x2318;K</kbd>
      </div>
    </div>

    <!-- Nav -->
    <div class="flex-1 overflow-y-auto">
      <DocsSidebar onNavigate={closeSidebar} />
    </div>

    <!-- Footer -->
    <div class="border-t border-sidebar-border px-3 py-3">
      <div class="flex items-center justify-between">
        <span class="inline-flex items-center rounded-md px-1.5 py-0.5 text-[0.5625rem] font-bold tracking-wider badge-purple">v2.0</span>
        <div class="flex items-center gap-0.5 rounded-lg border border-sidebar-border/60 bg-muted/30 p-0.5">
          <button
            class="rounded-md p-1 transition-all duration-150
              {isDark ? '' : 'bg-background text-foreground shadow-sm'}"
            onclick={() => { isDark = false; document.documentElement.classList.remove('dark'); }}
            aria-label="Light mode"
          >
            <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          </button>
          <button
            class="rounded-md p-1 transition-all duration-150
              {isDark ? 'bg-background text-foreground shadow-sm' : ''}"
            onclick={() => { isDark = true; document.documentElement.classList.add('dark'); }}
            aria-label="Dark mode"
          >
            <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>
        </div>
      </div>
    </div>
  </aside>

  <!-- Inset main area (loom pattern: Sidebar.Inset -> rounded-xl with shadow) -->
  <main class="relative flex w-full flex-1 flex-col rounded-xl bg-background shadow-sm md:ms-0">
    <!-- Header -->
    <header class="flex h-12 shrink-0 items-center gap-3 border-b border-border px-6">
      <button
        class="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
        onclick={() => (sidebarOpen = !sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
      </button>

      <!-- Separator -->
      <div class="hidden lg:block h-4 w-px bg-border"></div>

      <!-- Breadcrumb (loom style: simple text) -->
      <nav class="flex items-center gap-2 text-sm">
        <span class="text-muted-foreground">{breadcrumb.group}</span>
        <svg class="h-3 w-3 text-muted-foreground/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6" /></svg>
        <span class="font-medium text-foreground">{breadcrumb.page}</span>
      </nav>

      <div class="ml-auto flex items-center gap-2">
        <div class="flex items-center gap-0.5 rounded-lg border border-border bg-muted/30 p-0.5">
          <button
            class="rounded-md p-1.5 transition-all duration-150
              {isDark ? '' : 'bg-background text-foreground shadow-sm'}"
            onclick={() => { isDark = false; document.documentElement.classList.remove('dark'); }}
            aria-label="Light mode"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          </button>
          <button
            class="rounded-md p-1.5 transition-all duration-150
              {isDark ? 'bg-background text-foreground shadow-sm' : ''}"
            onclick={() => { isDark = true; document.documentElement.classList.add('dark'); }}
            aria-label="Dark mode"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Content + TOC -->
    <div class="flex flex-1 overflow-hidden">
      <div class="flex-1 overflow-y-auto scroll-smooth" id="docs-scroll-container">
        <div class="mx-auto max-w-5xl px-6 py-8 pb-24 lg:px-8" data-doc-content>
          {@render children()}
        </div>
      </div>

      <!-- Table of Contents -->
      <aside class="hidden w-[200px] shrink-0 border-l border-border/50 px-4 py-6 xl:block overflow-y-auto">
        <TableOfContents />
      </aside>
    </div>
  </main>
</div>
