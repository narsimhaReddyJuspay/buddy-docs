<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import FlowDiagram from '$lib/components/FlowDiagram.svelte';
  import ApiEndpoint from '$lib/components/ApiEndpoint.svelte';
  import ConfigPanel from '$lib/components/ConfigPanel.svelte';
</script>

<svelte:head><title>Daily WebRTC Integration — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Daily WebRTC Integration</h1>
  <p class="text-muted-foreground text-base mb-6">
    Integrate browser and mobile voice sessions using Daily.co's WebRTC transport — delivering sub-second latency,
    real-time transcription events, and cloud recording out of the box.
  </p>

  <Callout type="info" title="Prerequisites">
    <p>Before integrating, ensure you have a <strong>Daily.co API key</strong> configured in your environment, a deployed Breeze Buddy backend, and leads pushed with <code>execution_mode</code> set to <code>DAILY</code> or <code>DAILY_TEST</code>.</p>
  </Callout>

  <!-- Connection Flow -->
  <h2 id="connection-flow">Connection Flow</h2>
  <p>
    Daily.co provides the WebRTC transport layer that streams audio directly between the user's browser (or mobile app) and Breeze Buddy's Pipecat voice pipeline — no phone network required.
  </p>

  <FlowDiagram steps={["Push Lead (DAILY mode)", "POST /daily/connect", "Create Daily Room", "Generate Tokens", "Spawn Bot Process", "WebRTC Audio Session"]} variant="integrate" />

  <ol class="step-list not-prose mt-8 mb-8 text-muted-foreground">
    <li>
      <strong class="text-foreground">Push a lead</strong> via the Leads API with <code>execution_mode: "DAILY"</code> or <code>"DAILY_TEST"</code>. The lead enters <code>BACKLOG</code> status.
    </li>
    <li>
      <strong class="text-foreground">Call the connect endpoint</strong> with the lead's ID. The backend validates the lead exists and is in <code>BACKLOG</code> state.
    </li>
    <li>
      <strong class="text-foreground">Room creation</strong> — a Daily room is created (or pulled from the pre-warmed pool) with a 1-hour expiry and cloud recording enabled.
    </li>
    <li>
      <strong class="text-foreground">Token generation</strong> — separate user and bot tokens are generated with appropriate permissions. The room name is stored as <code>call_id</code> on the lead.
    </li>
    <li>
      <strong class="text-foreground">Bot process spawned</strong> — the Pipecat pipeline is started in the pre-warmed process pool, connecting to the room with the bot token.
    </li>
    <li>
      <strong class="text-foreground">Client joins</strong> — your frontend uses the returned <code>room_url</code> and <code>token</code> to join the room. Audio flows bidirectionally via WebRTC.
    </li>
  </ol>

  <!-- Connect Endpoint -->
  <h2 id="connect-endpoint">Connect Endpoint</h2>

  <ApiEndpoint method="POST" path="/agent/voice/breeze-buddy/daily/connect" description="Creates a Daily room, generates tokens, spawns the bot process, and returns connection credentials." />

  <h3 id="request-body">Request Body</h3>
  <CodeBlock lang="json" code={`{
  "lead_id": "uuid-of-the-lead"
}`} />

  <h3 id="response-payload">Response Payload</h3>
  <CodeBlock lang="json" code={`{
  "room_url": "https://your-domain.daily.co/room-abc123",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "session_id": "sess_abc123",
  "lead_id": "uuid-of-the-lead"
}`} />

  <h3 id="quick-connect-example">Quick Connect Example</h3>
  <CodeBlock lang="typescript" filename="connect.ts" code={`const response = await fetch(
  'https://your-api.example.com/agent/voice/breeze-buddy/daily/connect',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <your-api-key>'
    },
    body: JSON.stringify({ lead_id: 'uuid-of-the-lead' })
  }
);

const { room_url, token, session_id } = await response.json();
// Use room_url and token to join with the Daily client SDK`} />

  <!-- Transport Configuration -->
  <h2 id="transport-configuration">Transport Configuration</h2>
  <p>Daily uses higher-fidelity audio settings compared to telephony. Understanding the differences is essential when configuring your pipeline.</p>

  <ConfigPanel title="Daily Transport Settings" icon="🔊" variant="integrate">
    <div class="overflow-x-auto rounded-xl border border-border my-2">
      <table class="w-full text-sm">
        <thead class="bg-muted/30">
          <tr>
            <th class="text-left p-3 font-semibold text-foreground border-b border-border whitespace-nowrap text-xs uppercase tracking-wider">Parameter</th>
            <th class="text-left p-3 font-semibold text-foreground border-b border-border whitespace-nowrap text-xs uppercase tracking-wider">Daily (WebRTC)</th>
            <th class="text-left p-3 font-semibold text-foreground border-b border-border whitespace-nowrap text-xs uppercase tracking-wider">Telephony (WebSocket)</th>
          </tr>
        </thead>
        <tbody>
          <tr class="hover:bg-muted/20 transition-colors">
            <td class="p-3 text-muted-foreground border-b border-border/60">Sample Rate</td>
            <td class="p-3 text-muted-foreground border-b border-border/60"><code>16000 Hz</code></td>
            <td class="p-3 text-muted-foreground border-b border-border/60"><code>8000 Hz</code></td>
          </tr>
          <tr class="hover:bg-muted/20 transition-colors">
            <td class="p-3 text-muted-foreground border-b border-border/60">Transport Class</td>
            <td class="p-3 text-muted-foreground border-b border-border/60"><code>DailyParams</code></td>
            <td class="p-3 text-muted-foreground border-b border-border/60"><code>FastAPIWebsocketParams</code></td>
          </tr>
          <tr class="hover:bg-muted/20 transition-colors">
            <td class="p-3 text-muted-foreground border-b border-border/60">Audio Codec</td>
            <td class="p-3 text-muted-foreground border-b border-border/60">WebRTC (Opus)</td>
            <td class="p-3 text-muted-foreground border-b border-border/60">μ-law / PCM</td>
          </tr>
          <tr class="hover:bg-muted/20 transition-colors">
            <td class="p-3 text-muted-foreground border-b border-border/60">Noise Filtering</td>
            <td class="p-3 text-muted-foreground border-b border-border/60">AIC enhancement (optional)</td>
            <td class="p-3 text-muted-foreground border-b border-border/60">AIC enhancement (optional)</td>
          </tr>
          <tr class="hover:bg-muted/20 transition-colors">
            <td class="p-3 border-b-0 text-muted-foreground">Real-Time Events</td>
            <td class="p-3 border-b-0 text-muted-foreground">RTVI protocol</td>
            <td class="p-3 border-b-0 text-muted-foreground">WebSocket messages</td>
          </tr>
        </tbody>
      </table>
    </div>
  </ConfigPanel>

  <!-- Integration Architecture -->
  <h2 id="integration-architecture">Integration Architecture</h2>
  <p>
    The Daily integration uses a <strong>room-based architecture</strong>. Each voice session is an isolated Daily room with exactly two participants — the end user and the bot. This provides:
  </p>
  <ul>
    <li><strong>Network isolation</strong> — each session runs in its own WebRTC room with dedicated media servers</li>
    <li><strong>Automatic scaling</strong> — Daily handles TURN/STUN servers and global media routing</li>
    <li><strong>Cloud recording</strong> — every room is created with recording enabled; audio is captured server-side</li>
    <li><strong>Token-based auth</strong> — separate user and bot tokens with scoped permissions per room</li>
  </ul>

  <!-- Room Pooling -->
  <h2 id="room-pooling">Room Pooling</h2>
  <p>
    To eliminate cold-start latency on the connect endpoint, Breeze Buddy maintains a <strong>pre-warmed pool of Daily rooms</strong>.
    When a connect request arrives, a room is pulled from the pool instantly rather than waiting for the Daily API to create one.
  </p>

  <Callout type="tip" title="Pool Configuration">
    <p>Pool size and replenishment rate are configured via environment variables. The pool is initialized at application startup and rooms are replenished asynchronously as they are consumed.</p>
  </Callout>

  <!-- Next Steps -->
  <h2 id="next-steps">Next Steps</h2>
  <div class="not-prose feature-grid">
    <a href="/docs/daily/web-sdk" class="card-integrate block no-underline">
      <div class="flex items-start gap-3">
        <span class="text-2xl">📦</span>
        <div>
          <h3 class="text-sm font-semibold text-foreground mb-1">Web SDK Setup</h3>
          <p class="text-xs text-muted-foreground">Install the Pipecat client SDK and connect your frontend to a Daily voice session.</p>
        </div>
      </div>
    </a>
    <a href="/docs/daily/rtvi-events" class="card-integrate block no-underline">
      <div class="flex items-start gap-3">
        <span class="text-2xl">⚡</span>
        <div>
          <h3 class="text-sm font-semibold text-foreground mb-1">RTVI Events</h3>
          <p class="text-xs text-muted-foreground">Handle real-time transcription, bot responses, metrics, and function call events.</p>
        </div>
      </div>
    </a>
    <a href="/docs/daily/recording" class="card-integrate block no-underline">
      <div class="flex items-start gap-3">
        <span class="text-2xl">🎙️</span>
        <div>
          <h3 class="text-sm font-semibold text-foreground mb-1">Recording</h3>
          <p class="text-xs text-muted-foreground">Cloud recording configuration, retrieval, and storage integration.</p>
        </div>
      </div>
    </a>
    <a href="/docs/api/leads" class="card-integrate block no-underline">
      <div class="flex items-start gap-3">
        <span class="text-2xl">👤</span>
        <div>
          <h3 class="text-sm font-semibold text-foreground mb-1">Leads API</h3>
          <p class="text-xs text-muted-foreground">Push leads with DAILY execution mode to initiate browser voice sessions.</p>
        </div>
      </div>
    </a>
  </div>
</div>
