<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ConfigPanel from '$lib/components/ConfigPanel.svelte';
</script>

<svelte:head><title>TTS Configuration — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>TTS (Text-to-Speech)</h1>
  <p class="text-muted-foreground text-lg mb-8">Voice presets, Cartesia and ElevenLabs fine-tuning, and LLM-based provider selection.</p>

  <h2 id="overview">Overview</h2>
  <p>
    Breeze Buddy supports multiple TTS providers. Use a quick voice preset via
    <code>tts_voice_name</code>, or configure individual providers with
    <code>cartesia_voice_configurations</code> and <code>elevenlabs_voice_configurations</code>.
    For multilingual flows, <code>tts_selection_config</code> lets an LLM pick the best provider per utterance.
  </p>

  <h2 id="voice-presets">Voice Presets</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Preset</th><th>Provider</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>rhea</code></td><td>Cartesia / ElevenLabs</td><td>Warm, professional female voice.</td></tr>
        <tr><td><code>sara</code></td><td>Cartesia / ElevenLabs</td><td>Friendly, conversational female voice.</td></tr>
        <tr><td><code>mira</code></td><td>Cartesia / ElevenLabs</td><td>Calm, neutral female voice.</td></tr>
      </tbody>
    </table>
  </div>

  <Callout type="info" title="Preset vs. custom">
    <p>When <code>tts_voice_name</code> is set, it provides defaults. Explicit provider configs override the preset for that provider.</p>
  </Callout>

  <h2 id="provider-comparison">Provider Comparison</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Feature</th><th>Cartesia</th><th>ElevenLabs</th></tr>
      </thead>
      <tbody>
        <tr><td>Emotion control</td><td>Yes — tags like <code>positivity:high</code></td><td>No</td></tr>
        <tr><td>Volume control</td><td>0.5–2.0</td><td>No</td></tr>
        <tr><td>Speed range</td><td>0.6–1.5</td><td>0.7–1.2</td></tr>
        <tr><td>Model selection</td><td>No</td><td>Yes — e.g. <code>eleven_turbo_v2_5</code></td></tr>
        <tr><td>Best for</td><td>Expressive English</td><td>Multilingual, natural prosody</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="cartesia-config">Cartesia Configuration</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>voice_id</code></td><td><code>str</code></td><td>—</td><td>Cartesia voice UUID.</td></tr>
        <tr><td><code>volume</code></td><td><code>float</code></td><td><code>1.0</code></td><td>Output volume (0.5–2.0).</td></tr>
        <tr><td><code>speed</code></td><td><code>float</code></td><td><code>1.0</code></td><td>Speech rate (0.6–1.5).</td></tr>
        <tr><td><code>emotion</code></td><td><code>list[str]</code></td><td><code>null</code></td><td>Emotion tags, e.g. <code>["positivity:high", "curiosity"]</code>.</td></tr>
        <tr><td><code>language</code></td><td><code>str</code></td><td>—</td><td>BCP-47 language code.</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="elevenlabs-config">ElevenLabs Configuration</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>voice_id</code></td><td><code>str</code></td><td>—</td><td>ElevenLabs voice identifier.</td></tr>
        <tr><td><code>model_id</code></td><td><code>str</code></td><td>—</td><td>Model, e.g. <code>eleven_turbo_v2_5</code>.</td></tr>
        <tr><td><code>speed</code></td><td><code>float</code></td><td><code>1.0</code></td><td>Speech rate (0.7–1.2).</td></tr>
        <tr><td><code>language</code></td><td><code>str</code></td><td>—</td><td>BCP-47 language code.</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="voice-config-example">Voice Configuration Example</h2>

  <ConfigPanel title="Cartesia Voice Setup" iconHtml='<svg class="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>' variant="customize">
    <CodeBlock lang="json" code={`{
  "configurations": {
    "cartesia_voice_configurations": {
      "voice_id": "a0e99841-438c-4a64-b679-ae501e7d6091",
      "volume": 1.2,
      "speed": 1.1,
      "emotion": ["positivity:high", "curiosity"],
      "language": "en"
    }
  }
}`} />
  </ConfigPanel>

  <h2 id="tts-selection">LLM-Based TTS Selection</h2>
  <p>
    <code>tts_selection_config</code> enables dynamic provider selection per utterance via a Gemini LLM call.
  </p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Field</th><th>Type</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>enabled</code></td><td><code>bool</code></td><td>Enable LLM-based selection.</td></tr>
        <tr><td><code>prompt</code></td><td><code>str</code></td><td>Instruction guiding the LLM's provider choice.</td></tr>
        <tr><td><code>providers</code></td><td><code>list[TTSProvider]</code></td><td>Available providers: <code>cartesia</code>, <code>elevenlabs</code>.</td></tr>
      </tbody>
    </table>
  </div>

  <ConfigPanel title="Multilingual TTS Selection" icon="🌐" variant="customize">
    <CodeBlock lang="json" code={`{
  "configurations": {
    "tts_selection_config": {
      "enabled": true,
      "prompt": "Use cartesia for English, elevenlabs for Hindi.",
      "providers": ["cartesia", "elevenlabs"]
    },
    "cartesia_voice_configurations": {
      "voice_id": "a0e99841-438c-4a64-b679-ae501e7d6091",
      "language": "en"
    },
    "elevenlabs_voice_configurations": {
      "voice_id": "pFZP5JQG7iQjIQuC4Bku",
      "model_id": "eleven_turbo_v2_5",
      "language": "hi"
    }
  }
}`} />
  </ConfigPanel>

  <Callout type="warning" title="Latency trade-off">
    <p>LLM-based selection adds a small latency overhead per utterance. Use only when you need multilingual provider switching.</p>
  </Callout>

  <h2 id="best-practices">Best Practices</h2>
  <ul>
    <li>Start with a <strong>voice preset</strong> (<code>tts_voice_name</code>) for quick setup.</li>
    <li>Fine-tune <code>speed</code> and <code>volume</code> after listening to test calls.</li>
    <li>Use <code>emotion</code> tags with Cartesia for expressiveness.</li>
    <li>Enable <code>tts_selection_config</code> only for multilingual or multi-accent flows.</li>
  </ul>
</div>
