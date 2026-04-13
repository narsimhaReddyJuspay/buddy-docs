<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
</script>

<svelte:head><title>Audio & Background — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Audio &amp; Background</h1>
  <p class="text-muted-foreground text-lg mb-8">Background sound, noise filtering, and keyword filtering for cleaner audio output.</p>

  <h2 id="overview">Overview</h2>
  <p>
    Breeze Buddy provides three audio-related configuration areas: background ambient sound,
    noise enhancement filtering, and keyword suppression in bot speech output.
  </p>

  <h2 id="background-sound">Background Sound</h2>
  <p>
    Mix ambient audio into the call to make the interaction feel more natural — for example,
    simulating a busy office environment.
  </p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>enable_background_sound</code></td><td><code>bool</code></td><td><code>false</code></td><td>Enable or disable ambient background audio.</td></tr>
        <tr><td><code>background_sound_file</code></td><td><code>BackgroundSoundFile</code></td><td><code>null</code></td><td>Which ambient file to play. Currently available: <code>office-ambience</code>.</td></tr>
        <tr><td><code>background_sound_volume</code></td><td><code>float</code></td><td><code>2.0</code></td><td>Gain multiplier for the background sound level.</td></tr>
      </tbody>
    </table>
  </div>

  <CodeBlock lang="json" code={`{
  "configurations": {
    "enable_background_sound": true,
    "background_sound_file": "office-ambience",
    "background_sound_volume": 2.0
  }
}`} />

  <Callout type="tip" title="Volume tuning">
    <p>The default volume of <code>2.0</code> works well for most scenarios. Lower it to <code>1.0–1.5</code> if callers report difficulty hearing the bot's voice over the ambient sound.</p>
  </Callout>

  <h2 id="noise-filter">Noise Filter</h2>
  <p>
    The noise filter applies audio enhancement to the incoming audio stream, reducing
    background noise and improving STT accuracy.
  </p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>enable</code></td><td><code>bool</code></td><td>—</td><td>Enable or disable the noise filter.</td></tr>
        <tr><td><code>type</code></td><td><code>NoiseFilterType</code></td><td>—</td><td>Noise filter algorithm. Currently available: <code>aic</code>.</td></tr>
      </tbody>
    </table>
  </div>

  <h3 id="noise-filter-type">NoiseFilterType</h3>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Value</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>aic</code></td><td>AIC-based noise enhancement. Cleans up background noise, echo, and ambient interference for clearer audio input.</td></tr>
      </tbody>
    </table>
  </div>

  <CodeBlock lang="json" code={`{
  "configurations": {
    "noise_filter": {
      "enable": true,
      "type": "aic"
    }
  }
}`} />

  <Callout type="info" title="When to use">
    <p>Enable AIC noise filtering when callers are in noisy environments (vehicles, outdoors, crowded areas). It adds minimal latency and significantly improves STT accuracy.</p>
  </Callout>

  <h2 id="keyword-filter">Keyword Filter</h2>
  <p>
    The keyword filter suppresses specific words or phrases in the bot's speech output.
    This is useful for filtering filler words, profanity, or unwanted phrases before they
    are spoken to the caller.
  </p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>enabled</code></td><td><code>bool</code></td><td>—</td><td>Enable or disable keyword filtering.</td></tr>
        <tr><td><code>keywords</code></td><td><code>List[str]</code></td><td>—</td><td>List of words or phrases to filter out of bot speech.</td></tr>
        <tr><td><code>match_type</code></td><td><code>KeywordMatchType</code></td><td>—</td><td>Matching strategy: <code>exact</code> or <code>includes</code>.</td></tr>
      </tbody>
    </table>
  </div>

  <h3 id="match-types">KeywordMatchType</h3>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Value</th><th>Description</th><th>Example</th></tr>
      </thead>
      <tbody>
        <tr><td><code>exact</code></td><td>Whole-word matching only. The keyword must match a complete word.</td><td><code>"um"</code> matches "um" but not "umbrella".</td></tr>
        <tr><td><code>includes</code></td><td>Substring matching. The keyword is removed wherever it appears.</td><td><code>"um"</code> matches "um", "umbrella", "aluminum".</td></tr>
      </tbody>
    </table>
  </div>

  <CodeBlock lang="json" code={`{
  "configurations": {
    "keyword_filter": {
      "enabled": true,
      "keywords": ["um", "uh", "like", "you know"],
      "match_type": "exact"
    }
  }
}`} />

  <Callout type="warning" title="Use exact matching for common words">
    <p>Prefer <code>exact</code> matching for short, common filler words. Using <code>includes</code> with short keywords can unintentionally strip parts of legitimate words.</p>
  </Callout>

  <h2 id="full-example">Full Audio Configuration Example</h2>

  <CodeBlock lang="json" code={`{
  "configurations": {
    "enable_background_sound": true,
    "background_sound_file": "office-ambience",
    "background_sound_volume": 1.5,
    "noise_filter": {
      "enable": true,
      "type": "aic"
    },
    "keyword_filter": {
      "enabled": true,
      "keywords": ["um", "uh", "hmm"],
      "match_type": "exact"
    }
  }
}`} />
</div>
