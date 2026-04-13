<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ConfigPanel from '$lib/components/ConfigPanel.svelte';
</script>

<svelte:head><title>VAD Configuration — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>VAD &amp; Turn Detection</h1>
  <p class="text-muted-foreground text-lg mb-8">Silero VAD parameters, turn-detection strategies, and per-node overrides.</p>

  <h2 id="overview">Overview</h2>
  <p>
    Voice Activity Detection (VAD) determines when the user is speaking. Turn detection
    decides when the user has <em>finished</em> speaking so the bot can respond.
    Breeze Buddy uses the <strong>Silero VAD</strong> model combined with one of three turn-detection strategies.
  </p>

  <h2 id="vad-parameters">VAD Parameters</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Field</th><th>Type</th><th>Range</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>confidence</code></td><td><code>float</code></td><td>0.0–1.0</td><td>Minimum confidence to classify audio as speech.</td></tr>
        <tr><td><code>start_secs</code></td><td><code>float</code></td><td>≥ 0</td><td>Consecutive speech seconds before marking onset.</td></tr>
        <tr><td><code>stop_secs</code></td><td><code>float</code></td><td>≥ 0</td><td>Consecutive silence seconds before marking offset.</td></tr>
        <tr><td><code>min_volume</code></td><td><code>float</code></td><td>≥ 0</td><td>Audio below this volume is treated as silence.</td></tr>
      </tbody>
    </table>
  </div>

  <ConfigPanel title="VAD Configuration" icon="🎛️" variant="customize">
    <CodeBlock lang="json" code={`{
  "vad_config": {
    "confidence": 0.5,
    "start_secs": 0.2,
    "stop_secs": 0.8,
    "min_volume": 0.6
  }
}`} />
  </ConfigPanel>

  <Callout type="tip" title="Tuning tips">
    <p>Lower <code>confidence</code> catches softer speech but may false-trigger on noise. Higher <code>stop_secs</code> prevents premature cutoffs but adds latency. Start with defaults and tune from test calls.</p>
  </Callout>

  <h2 id="turn-detection">Turn Detection Strategies</h2>
  <p>Set via <code>stt_configuration.turn_detection</code>:</p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Strategy</th><th>Mechanism</th><th>Latency</th><th>Best With</th><th>Extra Config</th></tr>
      </thead>
      <tbody>
        <tr><td><code>stt_native</code></td><td>Provider endpoint token</td><td>Lowest</td><td>Soniox</td><td>None</td></tr>
        <tr><td><code>smart_turn</code></td><td>Whisper ONNX prosody analysis</td><td>Medium</td><td>Deepgram</td><td><code>smart_turn_config</code></td></tr>
        <tr><td><code>timeout</code></td><td>Silent timer after last transcript</td><td>Configurable</td><td>Any</td><td><code>user_speech_timeout</code></td></tr>
      </tbody>
    </table>
  </div>

  <h3 id="smart-turn-config">Smart Turn Config</h3>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Field</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>stop_secs</code></td><td><code>3.0</code></td><td>Max silence seconds before forcing turn stop.</td></tr>
        <tr><td><code>pre_speech_ms</code></td><td><code>500.0</code></td><td>Audio context (ms) before speech onset for analysis.</td></tr>
        <tr><td><code>max_duration_secs</code></td><td><code>8.0</code></td><td>Maximum turn duration.</td></tr>
        <tr><td><code>cpu_count</code></td><td><code>1</code></td><td>CPU threads for ONNX inference.</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="per-node-overrides">Per-Node Overrides</h2>
  <p>VAD and turn-detection follow a <strong>reset-then-apply</strong> cascade:</p>
  <ol>
    <li>Template-level <code>vad_config</code> applies as baseline.</li>
    <li>When entering a node with its own config, template settings are <strong>reset</strong>.</li>
    <li>Node-level settings apply in full — no merging.</li>
  </ol>

  <Callout type="warning" title="No merging">
    <p>Node-level <code>vad_config</code> replaces the template config entirely. Include all desired fields — missing ones revert to system defaults, not the template's values.</p>
  </Callout>

  <h2 id="full-example">Full Example</h2>

  <ConfigPanel title="VAD + Smart Turn (Production)" icon="⚙️" variant="customize">
    <CodeBlock lang="json" code={`{
  "configurations": {
    "vad_config": {
      "confidence": 0.5,
      "start_secs": 0.2,
      "stop_secs": 0.8,
      "min_volume": 0.6
    },
    "stt_configuration": {
      "provider": "deepgram",
      "language": "en",
      "turn_detection": "smart_turn",
      "deepgram_config": {
        "model": "nova-3-general",
        "endpointing_ms": 25,
        "no_delay": true
      },
      "smart_turn_config": {
        "stop_secs": 3.0,
        "pre_speech_ms": 500.0,
        "max_duration_secs": 8.0,
        "cpu_count": 1
      }
    }
  }
}`} />
  </ConfigPanel>
</div>
