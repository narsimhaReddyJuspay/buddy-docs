<script lang="ts">
  import '../app.css';

  let { children } = $props();
</script>

<svelte:head>
  <title>Breeze Buddy — Documentation</title>
</svelte:head>

{@render children()}
