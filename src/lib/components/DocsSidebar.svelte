<script lang="ts">
  import { page } from '$app/stores';
  import { navigation, type NavGroup } from '$lib/navigation';

  let { onNavigate }: { onNavigate?: () => void } = $props();

  let collapsedGroups: Record<string, boolean> = $state({});

  function toggleGroup(title: string) {
    collapsedGroups[title] = !collapsedGroups[title];
  }

  function isActive(href: string): boolean {
    return $page.url.pathname === href;
  }

  function isGroupActive(group: NavGroup): boolean {
    return group.items.some(item => $page.url.pathname === item.href);
  }
</script>

<nav class="flex flex-col gap-1 px-3 py-1">
  {#each navigation as group}
    {@const active = isGroupActive(group)}
    <div class="mb-0.5">
      <!-- Group header — loom style collapsible -->
      <button
        class="group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
        onclick={() => toggleGroup(group.title)}
      >
        <span class="flex-1 text-left">{group.title}</span>
        <svg
          class="h-3 w-3 shrink-0 transition-transform duration-200 opacity-40 group-hover:opacity-70
            {collapsedGroups[group.title] ? '' : 'rotate-90'}"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {#if !collapsedGroups[group.title]}
        <div class="flex flex-col gap-0.5 mt-0.5">
          {#each group.items as item}
            {@const itemActive = isActive(item.href)}
            <a
              href={item.href}
              class="group/item flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-all duration-150
                {itemActive
                  ? '!bg-foreground !text-background font-semibold'
                  : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'}"
              onclick={() => onNavigate?.()}
            >
              <span class="truncate">{item.title}</span>
              {#if item.badge}
                <span
                  class="ml-auto shrink-0 rounded px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wider
                    {itemActive
                      ? 'bg-background/20 text-background'
                      : 'bg-muted text-muted-foreground'}"
                >
                  {item.badge}
                </span>
              {/if}
            </a>
          {/each}
        </div>
      {/if}
    </div>
  {/each}
</nav>
