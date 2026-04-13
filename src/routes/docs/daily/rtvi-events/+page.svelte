<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ConfigPanel from '$lib/components/ConfigPanel.svelte';
</script>

<svelte:head><title>RTVI Events — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>RTVI Events</h1>
  <p class="text-muted-foreground text-base mb-6">
    Real-time Voice Transport Interface events provide live transcription, bot responses, pipeline metrics, and function call notifications during Daily voice sessions.
  </p>

  <!-- Enabling Events -->
  <h2 id="enabling-events">Enabling Events</h2>
  <p>RTVI events are dispatched automatically during Daily sessions. Enable them on the backend via environment variable:</p>

  <CodeBlock lang="bash" filename=".env" code={`ENABLE_BREEZE_BUDDY_DAILY_EVENTS=true`} />

  <Callout type="info" title="Client-Side Listeners">
    <p>Events are received on the client through the RTVI client's event emitter. Register listeners with <code>client.on(eventName, handler)</code> — no additional configuration is needed beyond the environment flag above.</p>
  </Callout>

  <!-- Event Reference -->
  <h2 id="event-reference">Event Reference</h2>
  <p>Complete list of events emitted during a Daily voice session:</p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Event</th>
          <th>Direction</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>userTranscription</code></td>
          <td>Server → Client</td>
          <td>Real-time user speech transcription with interim and final results</td>
        </tr>
        <tr>
          <td><code>botLlmText</code></td>
          <td>Server → Client</td>
          <td>LLM output tokens streamed as they are generated</td>
        </tr>
        <tr>
          <td><code>botTtsText</code></td>
          <td>Server → Client</td>
          <td>Text currently being spoken by the TTS engine</td>
        </tr>
        <tr>
          <td><code>botSpeaking</code></td>
          <td>Server → Client</td>
          <td>Boolean flag — <code>true</code> when bot audio is playing, <code>false</code> when stopped</td>
        </tr>
        <tr>
          <td><code>botReady</code></td>
          <td>Server → Client</td>
          <td>Bot has joined the room and the pipeline is ready to process audio</td>
        </tr>
        <tr>
          <td><code>conversationStart</code></td>
          <td>Server → Client</td>
          <td>Pipeline initialized and conversation has begun</td>
        </tr>
        <tr>
          <td><code>conversationEnd</code></td>
          <td>Server → Client</td>
          <td>Conversation finished — triggered by <code>end_conversation</code> function call</td>
        </tr>
        <tr>
          <td><code>metrics</code></td>
          <td>Server → Client</td>
          <td>Pipeline latency metrics: STT, LLM TTFB, TTS TTFB, and total latency</td>
        </tr>
        <tr>
          <td><code>functionCall</code></td>
          <td>Server → Client</td>
          <td>LLM invoked a template function — includes name, arguments, and transition target</td>
        </tr>
        <tr>
          <td><code>pipelineError</code></td>
          <td>Server → Client</td>
          <td>Pipeline processing error with error type and message</td>
        </tr>
        <tr>
          <td><code>trackStarted</code></td>
          <td>Transport</td>
          <td>New audio/video track available — use for audio visualization</td>
        </tr>
        <tr>
          <td><code>disconnected</code></td>
          <td>Transport</td>
          <td>Client disconnected from the Daily room</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Transcription Events -->
  <h2 id="transcription-events">Transcription Events</h2>
  <p>User speech is transcribed in real time with both interim (partial) and final results. Use <code>data.final</code> to determine when a phrase is complete.</p>

  <h3 id="transcription-payload">Event Payload</h3>
  <CodeBlock lang="json" code={`{
  "type": "user_transcription",
  "data": {
    "text": "Yes, I'd like to confirm my appointment",
    "final": true,
    "timestamp": 1713020400000,
    "user_id": "participant_abc"
  }
}`} />

  <h3 id="transcription-listener">Listener Example</h3>
  <CodeBlock lang="typescript" filename="transcription.ts" code={`// Accumulate interim results, commit on final
let interimText = '';

client.on('userTranscription', (data) => {
  if (data.final) {
    // Final transcription — add to conversation history
    addToTranscript({ role: 'user', text: data.text });
    interimText = '';
  } else {
    // Interim — update live preview
    interimText = data.text;
    updateLivePreview(interimText);
  }
});`} />

  <!-- Bot Response Events -->
  <h2 id="bot-response-events">Bot Response Events</h2>
  <p>Bot responses come through multiple event streams — LLM token output for streaming text, and TTS text for what is actually being spoken.</p>

  <CodeBlock lang="typescript" filename="bot-events.ts" code={`// Streaming LLM tokens (before TTS)
client.on('botLlmText', (data) => {
  // data.text contains the latest token(s)
  appendToLlmStream(data.text);
});

// Text being spoken by TTS
client.on('botTtsText', (data) => {
  addToTranscript({ role: 'bot', text: data.text });
});

// Bot speaking state
client.on('botSpeaking', (isSpeaking) => {
  if (isSpeaking) {
    showSpeakingIndicator();
  } else {
    hideSpeakingIndicator();
  }
});`} />

  <!-- Metrics Events -->
  <h2 id="metrics-events">Metrics Events</h2>
  <p>Pipeline performance metrics are emitted after each turn, providing visibility into latency across STT, LLM, and TTS stages.</p>

  <h3 id="metrics-payload">Metrics Payload</h3>
  <CodeBlock lang="json" code={`{
  "type": "metrics",
  "data": {
    "stt_latency_ms": 120,
    "llm_ttfb_ms": 340,
    "tts_ttfb_ms": 180,
    "total_latency_ms": 640,
    "llm_tokens": {
      "prompt": 1200,
      "completion": 45
    }
  }
}`} />

  <h3 id="metrics-listener">Metrics Listener</h3>
  <CodeBlock lang="typescript" filename="metrics.ts" code={`client.on('metrics', (data) => {
  // Log for observability
  console.table({
    'STT Latency': \`\${data.stt_latency_ms}ms\`,
    'LLM TTFB': \`\${data.llm_ttfb_ms}ms\`,
    'TTS TTFB': \`\${data.tts_ttfb_ms}ms\`,
    'Total': \`\${data.total_latency_ms}ms\`,
    'Tokens (prompt)': data.llm_tokens.prompt,
    'Tokens (completion)': data.llm_tokens.completion
  });

  // Send to your analytics endpoint
  trackMetrics(data);
});`} />

  <!-- Function Call Events -->
  <h2 id="function-call-events">Function Call Events</h2>
  <p>When the LLM invokes a template function (e.g., confirming an appointment or transitioning to another node), a <code>functionCall</code> event is emitted.</p>

  <h3 id="function-call-payload">Function Call Payload</h3>
  <CodeBlock lang="json" code={`{
  "type": "function-call",
  "data": {
    "function_name": "appointment_confirmed",
    "arguments": {
      "date": "2026-04-15",
      "time": "10:00 AM"
    },
    "transition_to": "farewell"
  }
}`} />

  <h3 id="function-call-listener">Function Call Listener</h3>
  <CodeBlock lang="typescript" filename="function-calls.ts" code={`client.on('functionCall', (data) => {
  const { function_name, arguments: args, transition_to } = data;

  console.log(\`Function: \${function_name}\`, args);

  // React to specific function calls in your UI
  switch (function_name) {
    case 'appointment_confirmed':
      showConfirmation(args.date, args.time);
      break;
    case 'end_conversation':
      prepareSessionEnd();
      break;
    default:
      console.log(\`Unhandled function: \${function_name}\`);
  }

  if (transition_to) {
    console.log(\`Transitioning to node: \${transition_to}\`);
  }
});`} />

  <!-- Error Events -->
  <h2 id="error-events">Error Event Handling</h2>
  <p>Pipeline and transport errors should be handled gracefully to maintain a good user experience.</p>

  <ConfigPanel title="Error Event Configuration" icon="🛡️" variant="integrate">
    <div class="overflow-x-auto rounded-xl border border-border my-2">
      <table class="w-full text-sm">
        <thead class="bg-muted/30">
          <tr>
            <th class="text-left p-3 font-semibold text-foreground border-b border-border whitespace-nowrap text-xs uppercase tracking-wider">Error Type</th>
            <th class="text-left p-3 font-semibold text-foreground border-b border-border whitespace-nowrap text-xs uppercase tracking-wider">Source</th>
            <th class="text-left p-3 font-semibold text-foreground border-b border-border whitespace-nowrap text-xs uppercase tracking-wider">Recommended Action</th>
          </tr>
        </thead>
        <tbody>
          <tr class="hover:bg-muted/20 transition-colors">
            <td class="p-3 text-muted-foreground border-b border-border/60"><code>connection-failed</code></td>
            <td class="p-3 text-muted-foreground border-b border-border/60">Transport</td>
            <td class="p-3 text-muted-foreground border-b border-border/60">Retry with exponential backoff; check network</td>
          </tr>
          <tr class="hover:bg-muted/20 transition-colors">
            <td class="p-3 text-muted-foreground border-b border-border/60"><code>mic-permission-denied</code></td>
            <td class="p-3 text-muted-foreground border-b border-border/60">Transport</td>
            <td class="p-3 text-muted-foreground border-b border-border/60">Prompt user to grant microphone permissions</td>
          </tr>
          <tr class="hover:bg-muted/20 transition-colors">
            <td class="p-3 text-muted-foreground border-b border-border/60"><code>stt-error</code></td>
            <td class="p-3 text-muted-foreground border-b border-border/60">Pipeline</td>
            <td class="p-3 text-muted-foreground border-b border-border/60">Transient — pipeline will recover automatically</td>
          </tr>
          <tr class="hover:bg-muted/20 transition-colors">
            <td class="p-3 text-muted-foreground border-b border-border/60"><code>llm-error</code></td>
            <td class="p-3 text-muted-foreground border-b border-border/60">Pipeline</td>
            <td class="p-3 text-muted-foreground border-b border-border/60">Check LLM provider status; may trigger fallback</td>
          </tr>
          <tr class="hover:bg-muted/20 transition-colors">
            <td class="p-3 border-b-0 text-muted-foreground"><code>tts-error</code></td>
            <td class="p-3 border-b-0 text-muted-foreground">Pipeline</td>
            <td class="p-3 border-b-0 text-muted-foreground">Check TTS provider status; pipeline will retry</td>
          </tr>
        </tbody>
      </table>
    </div>
  </ConfigPanel>

  <CodeBlock lang="typescript" filename="error-events.ts" code={`// Transport-level errors
client.on('error', (error) => {
  console.error(\`[\${error.type}] \${error.message}\`);

  switch (error.type) {
    case 'connection-failed':
      showRetryUI();
      break;
    case 'mic-permission-denied':
      showMicPermissionPrompt();
      break;
    default:
      showGenericError(error.message);
  }
});

// Pipeline processing errors
client.on('pipelineError', (error) => {
  console.error('Pipeline error:', error);
  // Pipeline errors are usually transient — log and monitor
  trackError('pipeline', error);
});`} />

  <!-- Custom Event Patterns -->
  <h2 id="custom-event-patterns">Custom Event Patterns</h2>
  <p>Combine multiple events to build rich UI patterns like typing indicators, conversation state machines, and latency dashboards.</p>

  <CodeBlock lang="typescript" filename="combined-events.ts" code={`type ConversationState = 'idle' | 'listening' | 'thinking' | 'speaking';
let state: ConversationState = 'idle';

// Build a state machine from RTVI events
client.on('userTranscription', (data) => {
  if (!data.final) state = 'listening';
});

client.on('userTranscription', (data) => {
  if (data.final) state = 'thinking';
});

client.on('botSpeaking', (isSpeaking) => {
  state = isSpeaking ? 'speaking' : 'idle';
});

// Aggregate metrics over the session
const metricsHistory: Array<{ total: number; timestamp: number }> = [];

client.on('metrics', (data) => {
  metricsHistory.push({
    total: data.total_latency_ms,
    timestamp: Date.now()
  });

  // Calculate rolling average
  const avg = metricsHistory.reduce((sum, m) => sum + m.total, 0)
    / metricsHistory.length;
  updateLatencyDisplay(avg);
});`} />

  <Callout type="tip" title="Event Cleanup">
    <p>Always remove event listeners when your component unmounts or the session ends. Use <code>client.off(eventName, handler)</code> or call <code>client.disconnect()</code> which cleans up all listeners automatically.</p>
  </Callout>

  <!-- Next Steps -->
  <h2 id="next-steps">Next Steps</h2>
  <div class="not-prose feature-grid">
    <a href="/docs/daily/web-sdk" class="card-integrate block no-underline">
      <div class="flex items-start gap-3">
        <span class="text-2xl">📦</span>
        <div>
          <h3 class="text-sm font-semibold text-foreground mb-1">Web SDK Setup</h3>
          <p class="text-xs text-muted-foreground">Install the SDK and connect your frontend to handle these events.</p>
        </div>
      </div>
    </a>
    <a href="/docs/advanced/observability" class="card-integrate block no-underline">
      <div class="flex items-start gap-3">
        <span class="text-2xl">📊</span>
        <div>
          <h3 class="text-sm font-semibold text-foreground mb-1">Observability</h3>
          <p class="text-xs text-muted-foreground">Forward metrics events to your observability stack for monitoring.</p>
        </div>
      </div>
    </a>
  </div>
</div>
