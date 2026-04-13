<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ConfigPanel from '$lib/components/ConfigPanel.svelte';
</script>

<svelte:head><title>STT Configuration — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>STT (Speech-to-Text)</h1>
  <p class="text-muted-foreground text-lg mb-8">Provider selection, language settings, turn detection, and provider-specific tuning for <code>stt_configuration</code>.</p>

  <h2 id="overview">Overview</h2>
  <p>
    The <code>stt_configuration</code> field inside <code>ConfigurationModel</code> controls how incoming audio is transcribed.
    Choose a provider, set the language, pick a turn-detection strategy, and optionally fine-tune provider-specific parameters.
  </p>

  <h2 id="top-level-fields">Top-Level Fields</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>provider</code></td><td><code>STTProvider</code></td><td>—</td><td><code>soniox</code>, <code>deepgram</code>, <code>sarvam</code>, <code>openai</code>, <code>google</code></td></tr>
        <tr><td><code>language</code></td><td><code>str | list[str]</code></td><td><code>null</code></td><td>BCP-47 code(s). Pass a list for multilingual recognition.</td></tr>
        <tr><td><code>payload_based_language_selection</code></td><td><code>bool</code></td><td><code>false</code></td><td>LLM detects language from lead payload dynamically.</td></tr>
        <tr><td><code>turn_detection</code></td><td><code>TurnDetectionMode</code></td><td><code>stt_native</code></td><td><code>stt_native</code>, <code>smart_turn</code>, or <code>timeout</code>.</td></tr>
        <tr><td><code>user_speech_timeout</code></td><td><code>float</code></td><td><code>0.3</code></td><td>Silence seconds before finalizing a turn (timeout mode only).</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="provider-comparison">Provider Comparison</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Provider</th><th>Strengths</th><th>Native Turn Detection</th><th>Multilingual</th><th>Best Turn Mode</th></tr>
      </thead>
      <tbody>
        <tr><td><code>soniox</code></td><td>Low latency, <code>&lt;end&gt;</code> token</td><td>Yes</td><td>Yes</td><td><code>stt_native</code></td></tr>
        <tr><td><code>deepgram</code></td><td>Nova-3, smart formatting</td><td>Limited</td><td>Auto-detect</td><td><code>smart_turn</code></td></tr>
        <tr><td><code>sarvam</code></td><td>Indic language specialist</td><td>No</td><td>No</td><td><code>timeout</code></td></tr>
        <tr><td><code>google</code></td><td>Broad language coverage</td><td>Limited</td><td>Yes</td><td><code>timeout</code></td></tr>
        <tr><td><code>openai</code></td><td>Whisper-based real-time API</td><td>Yes</td><td>Yes</td><td><code>stt_native</code></td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="provider-configs">Provider-Specific Config</h2>

  <h3 id="provider-deepgram">Deepgram</h3>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Field</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>model</code></td><td><code>nova-3-general</code></td><td>Deepgram model name.</td></tr>
        <tr><td><code>endpointing_ms</code></td><td><code>25</code></td><td>Silence threshold (ms) before endpoint.</td></tr>
        <tr><td><code>utterance_end_ms</code></td><td>—</td><td>Max wait (ms) for utterance end signal.</td></tr>
        <tr><td><code>no_delay</code></td><td><code>true</code></td><td>Disable internal buffering for lower latency.</td></tr>
        <tr><td><code>smart_format</code></td><td><code>true</code></td><td>Auto capitalization and punctuation.</td></tr>
        <tr><td><code>numerals</code></td><td><code>true</code></td><td>Convert spoken numbers to digits.</td></tr>
        <tr><td><code>profanity_filter</code></td><td><code>false</code></td><td>Mask profane words.</td></tr>
        <tr><td><code>auto_detect_language</code></td><td><code>false</code></td><td>Auto-detect spoken language.</td></tr>
      </tbody>
    </table>
  </div>

  <h3 id="provider-soniox">Soniox</h3>
  <p>Fields: <code>context</code> (domain hint), <code>model</code> (model identifier).</p>

  <h3 id="provider-sarvam">Sarvam</h3>
  <p>Fields: <code>model</code>, <code>language_code</code> (e.g. <code>hi-IN</code>). Single-language only.</p>

  <h2 id="recommended-config">Recommended Configuration</h2>

  <ConfigPanel title="Deepgram + Smart Turn (Recommended)" icon="🎙️" variant="customize">
    <CodeBlock lang="json" code={`{
  "stt_configuration": {
    "provider": "deepgram",
    "language": "en",
    "turn_detection": "smart_turn",
    "deepgram_config": {
      "model": "nova-3-general",
      "endpointing_ms": 25,
      "utterance_end_ms": 1000,
      "no_delay": true,
      "smart_format": true,
      "numerals": true
    },
    "smart_turn_config": {
      "stop_secs": 3.0,
      "pre_speech_ms": 500.0,
      "max_duration_secs": 8.0,
      "cpu_count": 1
    }
  }
}`} />
  </ConfigPanel>

  <h2 id="language-selection">Language Selection</h2>
  <ul>
    <li><strong>Single</strong> — <code>"language": "en"</code></li>
    <li><strong>Multiple</strong> — <code>"language": ["en", "hi"]</code> (provider must support multilingual)</li>
    <li><strong>Payload-based</strong> — set <code>"payload_based_language_selection": true</code> and the LLM infers from lead payload</li>
  </ul>

  <Callout type="tip" title="Production recommendation">
    <p>Use <strong>Deepgram + smart_turn</strong> for the best balance of transcription quality and natural turn-taking.</p>
  </Callout>
</div>
