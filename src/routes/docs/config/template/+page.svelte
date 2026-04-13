<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import FlowDiagram from '$lib/components/FlowDiagram.svelte';
  import ConfigPanel from '$lib/components/ConfigPanel.svelte';
</script>

<svelte:head><title>Template Configuration — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Template Configuration</h1>
  <p class="text-muted-foreground text-lg mb-8">The <code>configurations</code> object on every template — controls STT, TTS, VAD, LLM, audio, interruptions, and more.</p>

  <h2 id="overview">Overview</h2>
  <p>
    Each template carries an optional <code>configurations</code> object (<code>ConfigurationModel</code>).
    All fields are optional — sensible defaults apply when omitted.
  </p>

  <FlowDiagram steps={['Global Defaults', 'Template Config', 'Node Override']} variant="customize" />

  <Callout type="info" title="Config Cascade">
    <p>Node-level config <strong>replaces</strong> (not merges with) template-level config. If a node sets its own <code>stt_configuration</code>, it fully overrides the template setting.</p>
  </Callout>

  <h2 id="categories">Configuration Categories</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Category</th><th>Key Fields</th><th>Details</th></tr>
      </thead>
      <tbody>
        <tr><td>Speech-to-Text</td><td><code>stt_configuration</code></td><td><a href="/docs/config/stt">STT Config</a></td></tr>
        <tr><td>Text-to-Speech</td><td><code>tts_voice_name</code>, <code>cartesia_voice_configurations</code>, <code>elevenlabs_voice_configurations</code>, <code>tts_selection_config</code></td><td><a href="/docs/config/tts">TTS Config</a></td></tr>
        <tr><td>Voice Activity</td><td><code>vad_config</code></td><td><a href="/docs/config/vad">VAD Config</a></td></tr>
        <tr><td>Interruption</td><td><code>interruption</code></td><td><a href="/docs/config/interruption">Interruption Config</a></td></tr>
        <tr><td>LLM</td><td><code>llm_configurations</code></td><td><a href="/docs/config/llm">LLM Config</a></td></tr>
        <tr><td>Audio</td><td><code>enable_background_sound</code>, <code>noise_filter</code>, <code>keyword_filter</code></td><td><a href="/docs/config/audio">Audio Config</a></td></tr>
        <tr><td>Idle Handling</td><td><code>user_idle_configuration</code></td><td><a href="/docs/config/user-idle">User Idle</a></td></tr>
        <tr><td>Telephony</td><td><code>enable_inbound</code>, <code>transfer_number</code>, IVR fields</td><td><a href="/docs/telephony/overview">Telephony</a></td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="fields-reference">Fields Reference</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>stt_configuration</code></td><td><code>STTConfiguration</code></td><td><code>null</code></td><td>STT provider, language, turn detection.</td></tr>
        <tr><td><code>tts_voice_name</code></td><td><code>TTSVoiceName</code></td><td><code>null</code></td><td>Quick preset — <code>rhea</code>, <code>sara</code>, or <code>mira</code>.</td></tr>
        <tr><td><code>cartesia_voice_configurations</code></td><td><code>CartesiaVoiceConfiguration</code></td><td><code>null</code></td><td>Cartesia TTS: voice_id, volume, speed, emotion.</td></tr>
        <tr><td><code>elevenlabs_voice_configurations</code></td><td><code>ElevenLabsVoiceConfiguration</code></td><td><code>null</code></td><td>ElevenLabs TTS: voice_id, model_id, speed.</td></tr>
        <tr><td><code>tts_selection_config</code></td><td><code>TTSSelectionConfig</code></td><td><code>null</code></td><td>LLM-based TTS provider selection.</td></tr>
        <tr><td><code>enable_background_sound</code></td><td><code>bool</code></td><td><code>false</code></td><td>Mix ambient audio into the call.</td></tr>
        <tr><td><code>background_sound_file</code></td><td><code>BackgroundSoundFile</code></td><td><code>null</code></td><td>Ambient file — e.g. <code>office-ambience</code>.</td></tr>
        <tr><td><code>background_sound_volume</code></td><td><code>float</code></td><td><code>2.0</code></td><td>Gain multiplier for background sound.</td></tr>
        <tr><td><code>initial_greeting</code></td><td><code>str</code></td><td><code>null</code></td><td>First bot utterance. Supports <code>{"{variable}"}</code> placeholders.</td></tr>
        <tr><td><code>vad_config</code></td><td><code>VadConfig</code></td><td><code>null</code></td><td>Silero VAD tuning: confidence, start/stop secs.</td></tr>
        <tr><td><code>interruption</code></td><td><code>InterruptionConfig</code></td><td><code>null</code></td><td>Interruption mode and min_words threshold.</td></tr>
        <tr><td><code>user_idle_configuration</code></td><td><code>UserIdleHandlingConfig</code></td><td><code>null</code></td><td>Idle timer: timeout, message, max retries.</td></tr>
        <tr><td><code>llm_configurations</code></td><td><code>LLMConfiguration</code></td><td><code>null</code></td><td>LLM model and temperature.</td></tr>
        <tr><td><code>enable_inbound</code></td><td><code>bool</code></td><td><code>false</code></td><td>Accept inbound calls on this template.</td></tr>
        <tr><td><code>transfer_number</code></td><td><code>str</code></td><td><code>null</code></td><td>E.164 number for warm transfer.</td></tr>
        <tr><td><code>noise_filter</code></td><td><code>NoiseFilterConfig</code></td><td><code>null</code></td><td>AIC-based noise enhancement.</td></tr>
        <tr><td><code>keyword_filter</code></td><td><code>KeywordFilterConfig</code></td><td><code>null</code></td><td>Suppress specific words from bot speech.</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="full-example">Full JSON Example</h2>

  <ConfigPanel title="Complete Configuration Object" icon="⚙️" variant="customize">
    <CodeBlock lang="json" code={`{
  "configurations": {
    "stt_configuration": {
      "provider": "deepgram",
      "language": "en",
      "turn_detection": "smart_turn",
      "deepgram_config": { "model": "nova-3-general", "endpointing_ms": 25 },
      "smart_turn_config": { "stop_secs": 3.0, "pre_speech_ms": 500.0 }
    },
    "tts_voice_name": "rhea",
    "cartesia_voice_configurations": {
      "voice_id": "a0e99841-438c-4a64-b679-ae501e7d6091",
      "volume": 1.0, "speed": 1.0,
      "emotion": ["positivity:high"], "language": "en"
    },
    "vad_config": {
      "confidence": 0.5, "start_secs": 0.2,
      "stop_secs": 0.8, "min_volume": 0.6
    },
    "interruption": { "mode": "enabled", "min_words": 2 },
    "user_idle_configuration": {
      "enabled": true, "timeout": 5.0,
      "idle_message": "Are you still there?", "max_retries": 3
    },
    "llm_configurations": { "model": "gpt-4o", "temperature": 0.7 },
    "enable_background_sound": true,
    "background_sound_file": "office-ambience",
    "initial_greeting": "Hello {customer_name}, calling from {company}."
  }
}`} />
  </ConfigPanel>

  <Callout type="tip" title="Start simple">
    <p>Begin with <code>initial_greeting</code> and <code>tts_voice_name</code>, then layer in STT, VAD, and interruption tuning as needed.</p>
  </Callout>
</div>
