<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import FlowDiagram from '$lib/components/FlowDiagram.svelte';
</script>

<svelte:head><title>Voice Pipeline — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Voice Pipeline</h1>
  <p class="text-muted-foreground text-lg mb-8">End-to-end audio processing pipeline — from microphone input to speaker output. Built on <a href="https://github.com/pipecat-ai/pipecat" target="_blank" rel="noopener">Pipecat</a>. See <a href="/docs/architecture">Architecture</a> for where the pipeline fits in the broader system.</p>

  <h2 id="pipeline-overview">Pipeline Overview</h2>
  <p>
    Every voice call flows through a sequential pipeline of processors. Audio arrives from the
    transport layer (<a href="/docs/daily/overview">Daily WebRTC</a> or <a href="/docs/telephony/overview">Telephony WebSocket</a>), gets transcribed, processed by the LLM, synthesized to speech, and sent
    back to the caller.
  </p>

  <FlowDiagram steps={[
    "transport.input()",
    "STT",
    "TranscriptionGate",
    "UserIdle",
    "UserAggregator",
    "LLM",
    "TTS",
    "transport.output()",
    "AssistantAggregator"
  ]} />

  <h2 id="stt-providers">STT (Speech-to-Text) Providers</h2>
  <p>
    The STT stage converts raw audio into text transcriptions. Multiple providers are
    supported with different strengths.
  </p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Provider</th>
          <th>Key</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><a href="https://soniox.com" target="_blank" rel="noopener">Soniox</a></td><td><code>soniox</code></td><td>Default. Low-latency streaming with strong multilingual support.</td></tr>
        <tr><td><a href="https://deepgram.com" target="_blank" rel="noopener">Deepgram</a></td><td><code>deepgram</code></td><td>High accuracy, extensive language coverage.</td></tr>
        <tr><td><a href="https://www.sarvam.ai" target="_blank" rel="noopener">Sarvam</a></td><td><code>sarvam</code></td><td>Optimized for Indian languages.</td></tr>
        <tr><td><a href="https://openai.com/research/whisper" target="_blank" rel="noopener">OpenAI</a></td><td><code>openai</code></td><td>Whisper-based, high accuracy for English.</td></tr>
        <tr><td><a href="https://cloud.google.com/speech-to-text" target="_blank" rel="noopener">Google</a></td><td><code>google</code></td><td>Google Cloud Speech-to-Text.</td></tr>
      </tbody>
    </table>
  </div>

  <Callout type="info" title="Provider Configuration">
    <p>Configure the STT provider in your template's STT config. See <a href="/docs/config/stt">STT Configuration</a> for full options.</p>
  </Callout>

  <h2 id="llm">LLM (Large Language Model)</h2>
  <p>
    The LLM processes the transcribed user input along with the conversation history and system
    prompts to generate the assistant's response. Breeze Buddy uses <a href="https://azure.microsoft.com/en-us/products/ai-services/openai-service" target="_blank" rel="noopener">Azure OpenAI</a>
    as the LLM provider. Prompts are defined in your <a href="/docs/templates/flow-nodes">flow node</a> <code>task_messages</code>.
  </p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Aspect</th>
          <th>Detail</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Provider</td><td>Azure OpenAI</td></tr>
        <tr><td>Streaming</td><td>Yes — token-by-token streaming for low-latency TTS feeding</td></tr>
        <tr><td>Function Calling</td><td>Supported — tools/functions defined in <a href="/docs/templates/functions-hooks">template flow nodes</a></td></tr>
        <tr><td>Context Window</td><td>Managed automatically with conversation history truncation</td></tr>
      </tbody>
    </table>
  </div>

  <Callout type="info" title="LLM Configuration">
    <p>Adjust model, temperature, max tokens, and other parameters in <a href="/docs/config/llm">LLM Configuration</a>.</p>
  </Callout>

  <h2 id="tts-providers">TTS (Text-to-Speech) Providers</h2>
  <p>
    The TTS stage converts the LLM's text response into audio that is streamed back to the caller.
  </p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Provider</th>
          <th>Key</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><a href="https://elevenlabs.io" target="_blank" rel="noopener">ElevenLabs</a></td><td><code>elevenlabs</code></td><td>Default. Natural-sounding voices with low latency.</td></tr>
        <tr><td><a href="https://cartesia.ai" target="_blank" rel="noopener">Cartesia</a></td><td><code>cartesia</code></td><td>Ultra-low latency streaming TTS.</td></tr>
        <tr><td><a href="https://www.sarvam.ai" target="_blank" rel="noopener">Sarvam</a></td><td><code>sarvam</code></td><td>Indian language voices.</td></tr>
        <tr><td><a href="https://cloud.google.com/text-to-speech" target="_blank" rel="noopener">Google</a></td><td><code>google</code></td><td>Google Cloud Text-to-Speech.</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="transcription-gate">TranscriptionGate</h2>
  <p>
    The TranscriptionGate sits between STT and the user aggregator. It provides two key capabilities:
  </p>
  <ul>
    <li><strong>Keyword filtering</strong> — filters out known noise phrases or false positives from the STT output.</li>
    <li><strong>Hard mute control</strong> — when the gate is closed, all user transcriptions are blocked from reaching the LLM. This is used during assistant speech to prevent the agent from responding to its own audio.</li>
  </ul>

  <h2 id="user-idle">UserIdle Handling</h2>
  <p>
    The UserIdle processor monitors for silence from the user. If no speech is detected for a
    configured duration, it:
  </p>
  <ol>
    <li>Sends a configurable idle prompt to re-engage the user.</li>
    <li>Repeats up to <code>max_retries</code> times.</li>
    <li>Ends the call if the user remains silent after all retries are exhausted.</li>
  </ol>

  <Callout type="tip" title="Configuration">
    <p>See <a href="/docs/config/user-idle">User Idle Handling</a> for timeout durations, prompt customization, and retry settings.</p>
  </Callout>

  <h2 id="aggregators">Aggregators</h2>

  <h3 id="user-aggregator">UserAggregator</h3>
  <p>
    Collects and merges partial user transcriptions into complete user turns before sending
    them to the LLM. Works with the turn detection strategy to determine when the user has
    finished speaking.
  </p>

  <h3 id="assistant-aggregator">AssistantAggregator</h3>
  <p>
    Collects the assistant's streamed response tokens and the corresponding TTS audio,
    assembling the complete assistant turn for transcription logging and analytics.
  </p>

  <h2 id="user-turn-strategies">User Turn Strategies</h2>
  <p>
    Turn detection determines when the user has finished speaking and the system should
    process their input. The strategy is configured via VAD (Voice Activity Detection) settings.
  </p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Strategy</th>
          <th>Behavior</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>endpointing</code></td><td>Uses silence duration after speech to detect turn end. Configurable via <code>stop_secs</code>.</td></tr>
        <tr><td><code>push-to-talk</code></td><td>User explicitly signals turn boundaries (used in Daily/WebRTC sessions).</td></tr>
      </tbody>
    </table>
  </div>

  <Callout type="info" title="VAD Settings">
    <p>Fine-tune turn detection in <a href="/docs/config/vad">VAD &amp; Turn Detection</a> configuration.</p>
  </Callout>

  <h2 id="transport-layer">Transport Layer</h2>
  <p>
    The transport layer manages the audio I/O connection between the voice pipeline and the
    caller. Breeze Buddy supports two transport modes:
  </p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Transport</th>
          <th>Use Case</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong><a href="/docs/telephony/overview">Telephony</a></strong> (Twilio / Plivo / Exotel)</td><td>PSTN calls — outbound dialing and inbound call handling.</td></tr>
        <tr><td><strong><a href="/docs/daily/overview">Daily WebRTC</a></strong></td><td>Browser-based sessions, playground testing, and Daily SDK integrations.</td></tr>
      </tbody>
    </table>
  </div>
</div>
