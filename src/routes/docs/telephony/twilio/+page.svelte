<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ApiEndpoint from '$lib/components/ApiEndpoint.svelte';
  import FlowDiagram from '$lib/components/FlowDiagram.svelte';
  import ConfigPanel from '$lib/components/ConfigPanel.svelte';
</script>

<svelte:head><title>Twilio Integration — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Twilio Integration</h1>
  <p class="text-muted-foreground text-base mb-6">
    Complete guide to integrating Twilio for outbound campaigns, inbound call handling, native recording, and Conference API warm transfers.
  </p>

  <!-- ───────── Prerequisites ───────── -->
  <h2 id="prerequisites">Prerequisites</h2>
  <p>Before integrating Twilio, ensure the following are in place:</p>

  <div class="step-list">
    <div class="step-list-item">
      <div class="step-list-number">1</div>
      <div><strong>Twilio account</strong> — Sign up at <code>twilio.com</code> and note your <strong>Account SID</strong> and <strong>Auth Token</strong> from the console dashboard.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">2</div>
      <div><strong>Phone numbers</strong> — Purchase one or more Twilio phone numbers with voice capability enabled.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">3</div>
      <div><strong>Webhook access</strong> — Your Breeze Buddy server must be reachable from the public internet (or via <code>ngrok</code> in development).</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">4</div>
      <div><strong>Register numbers</strong> — Add your Twilio numbers via the <a href="/docs/api/numbers">Numbers API</a> with <code>provider: "twilio"</code>.</div>
    </div>
  </div>

  <ConfigPanel title="Twilio Environment Variables" icon="🔑" variant="integrate">
    <div class="space-y-3 text-sm">
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">TWILIO_ACCOUNT_SID</span>
        <span class="text-foreground">Your Twilio Account SID</span>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">TWILIO_AUTH_TOKEN</span>
        <span class="text-foreground">Your Twilio Auth Token</span>
      </div>
      <div class="flex items-baseline justify-between">
        <span class="text-muted-foreground">TWILIO_PHONE_NUMBER</span>
        <span class="text-foreground">Default outbound caller ID (optional)</span>
      </div>
    </div>
  </ConfigPanel>

  <!-- ───────── Outbound Calls ───────── -->
  <h2 id="outbound-calls">Outbound Calls</h2>
  <p>Twilio outbound calls support two modes depending on whether pod isolation is enabled:</p>

  <h3 id="with-pod-isolation">With Pod Isolation (Production)</h3>
  <FlowDiagram steps={["calls.create(url=webhook)", "Smart Router allocates pod", "Returns TwiML with pod WS URL", "WebSocket audio stream", "Voice Pipeline"]} variant="integrate" />

  <p>In production, calls are created with a <code>url=</code> parameter pointing to the Smart Router webhook. The router allocates a dedicated pod and returns TwiML containing the pod-specific WebSocket URL.</p>

  <h3 id="without-pod-isolation">Without Pod Isolation (Development)</h3>
  <FlowDiagram steps={["calls.create(twiml=inline)", "Static WebSocket URL", "WebSocket audio stream", "Voice Pipeline"]} variant="integrate" />

  <p>In development, calls are created with an inline <code>twiml=</code> parameter containing a static WebSocket URL — no Smart Router needed.</p>

  <!-- ───────── TwiML Configuration ───────── -->
  <h2 id="twiml-configuration">TwiML Configuration</h2>
  <p>The TwiML response instructs Twilio to open a bidirectional WebSocket stream to the Breeze Buddy voice pipeline. The <code>lead_id</code> parameter carries the lead context through the connection.</p>

  <CodeBlock lang="xml" filename="twiml-response.xml" code={`<Response>
  <Connect>
    <Stream url="wss://your-domain.com/agent/voice/breeze-buddy/ws/twilio">
      <Parameter name="lead_id" value="uuid-of-lead" />
    </Stream>
  </Connect>
</Response>`} />

  <Callout type="info" title="Stream Parameters">
    <p>The <code>lead_id</code> parameter is passed as WebSocket metadata when the stream connects. The pipeline uses it to look up the template, variables, and configuration for the conversation.</p>
  </Callout>

  <!-- ───────── WebSocket Endpoint ───────── -->
  <h2 id="websocket-endpoint">WebSocket Endpoint</h2>
  <ApiEndpoint method="WS" path="/agent/voice/breeze-buddy/ws/twilio" description="Bidirectional audio stream for Twilio calls. Receives μ-law 8kHz audio in base64-encoded JSON frames." />

  <ConfigPanel title="Twilio Audio Parameters" icon="🎧" variant="integrate">
    <div class="space-y-3 text-sm">
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Encoding</span>
        <code class="text-violet-400">μ-law (G.711)</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Sample Rate</span>
        <code class="text-violet-400">8000 Hz</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Channels</span>
        <code class="text-violet-400">Mono</code>
      </div>
      <div class="flex items-baseline justify-between">
        <span class="text-muted-foreground">Frame format</span>
        <code class="text-violet-400">Base64 in JSON</code>
      </div>
    </div>
  </ConfigPanel>

  <!-- ───────── Callbacks ───────── -->
  <h2 id="callbacks">Callbacks</h2>
  <p>Twilio sends asynchronous callbacks for recording delivery, call status, and fallback handling. Configure these URLs when creating the call.</p>

  <ApiEndpoint method="POST" path="/twilio/callback/details" description="Recording URL delivery — Twilio sends the recording URL after the call ends." />
  <ApiEndpoint method="POST" path="/twilio/callback/status" description="Call status updates — triggers retry logic for failed/no-answer calls." />
  <ApiEndpoint method="POST" path="/twilio/callback/twiml-fallback" description="TwiML fallback — called when the primary url= webhook (Smart Router) is unreachable." />

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Callback</th><th>Endpoint</th><th>Purpose</th></tr></thead>
      <tbody>
        <tr><td><strong>Recording</strong></td><td><code>POST /twilio/callback/details</code></td><td>Delivers the recording URL to be stored with the lead</td></tr>
        <tr><td><strong>Status</strong></td><td><code>POST /twilio/callback/status</code></td><td>Reports call outcome (completed, no-answer, busy, failed)</td></tr>
        <tr><td><strong>TwiML Fallback</strong></td><td><code>POST /twilio/callback/twiml-fallback</code></td><td>Serves fallback TwiML when Smart Router is unavailable</td></tr>
      </tbody>
    </table>
  </div>

  <!-- ───────── Number Management ───────── -->
  <h2 id="number-management">Number Management</h2>
  <p>Outbound numbers are registered through the Numbers API and tagged with <code>provider: "twilio"</code>. The system automatically uses Twilio APIs for calls placed from these numbers.</p>

  <ApiEndpoint method="POST" path="/agent/voice/breeze-buddy/outbound-numbers" description="Register a new Twilio outbound number." />
  <ApiEndpoint method="GET" path="/agent/voice/breeze-buddy/outbound-numbers" description="List all registered outbound numbers." />
  <ApiEndpoint method="DELETE" path="/agent/voice/breeze-buddy/outbound-numbers/{id}" description="Remove a registered outbound number." />

  <!-- ───────── Recording ───────── -->
  <h2 id="recording">Recording</h2>
  <p>Twilio supports native call recording via the <code>record=True</code> parameter on call creation. Recordings are stored by Twilio and the URL is delivered via the <code>/twilio/callback/details</code> callback.</p>

  <CodeBlock lang="python" filename="twilio_outbound.py" code={`client.calls.create(
    to=customer_number,
    from_=outbound_number,
    twiml=twiml_response,        # or url=webhook_url
    record=True,                  # Enable native recording
    recording_status_callback=f"{base_url}/twilio/callback/details",
    status_callback=f"{base_url}/twilio/callback/status"
)`} />

  <!-- ───────── Error Handling ───────── -->
  <h2 id="error-handling">Error Handling &amp; Retry Logic</h2>
  <p>When a call fails or goes unanswered, the status callback triggers automatic retry logic:</p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Status</th><th>Action</th></tr></thead>
      <tbody>
        <tr><td><code>completed</code></td><td>Lead marked <code>FINISHED</code> — recording stored</td></tr>
        <tr><td><code>no-answer</code></td><td>Lead marked <code>RETRY</code> — re-enters backlog after cooldown</td></tr>
        <tr><td><code>busy</code></td><td>Lead marked <code>RETRY</code> — re-enters backlog after cooldown</td></tr>
        <tr><td><code>failed</code></td><td>Lead marked <code>RETRY</code> — logged for investigation</td></tr>
        <tr><td><code>canceled</code></td><td>Lead marked <code>RETRY</code> — typically a system cancellation</td></tr>
      </tbody>
    </table>
  </div>

  <Callout type="warning" title="Retry Limits">
    <p>Retries are governed by the template's <code>max_retries</code> setting. Once exhausted, the lead moves to <code>FINISHED</code> with an appropriate failure outcome.</p>
  </Callout>

  <!-- ───────── Warm Transfer ───────── -->
  <h2 id="warm-transfer">Warm Transfer</h2>
  <p>Twilio warm transfer uses the <strong>Conference API</strong> for a seamless handoff with no audio gap:</p>

  <FlowDiagram steps={["AI triggers transfer", "Customer placed in conference", "Agent dialed into conference", "AI disconnects", "Customer + Agent continue"]} variant="integrate" />

  <p>The Conference API creates a multi-party room where the customer and transfer target can be joined simultaneously. The AI agent disconnects once the live agent is connected.</p>

  <Callout type="tip" title="No Audio Gap">
    <p>With the Conference API, the customer experiences minimal interruption. Hold music or silence plays only briefly while the live agent is being connected.</p>
  </Callout>

  <!-- ───────── Production Checklist ───────── -->
  <h2 id="production-checklist">Production Checklist</h2>

  <ConfigPanel title="Go-Live Checklist" icon="✅" variant="integrate">
    <div class="space-y-3 text-sm">
      <div class="flex items-center gap-3 border-b border-border/40 pb-2">
        <span class="h-5 w-5 rounded-full bg-green-500/15 text-green-400 text-xs flex items-center justify-center">✓</span>
        <span class="text-foreground">Twilio account upgraded from trial (removes sandbox limitations)</span>
      </div>
      <div class="flex items-center gap-3 border-b border-border/40 pb-2">
        <span class="h-5 w-5 rounded-full bg-green-500/15 text-green-400 text-xs flex items-center justify-center">✓</span>
        <span class="text-foreground">Webhook URLs use HTTPS and are publicly accessible</span>
      </div>
      <div class="flex items-center gap-3 border-b border-border/40 pb-2">
        <span class="h-5 w-5 rounded-full bg-green-500/15 text-green-400 text-xs flex items-center justify-center">✓</span>
        <span class="text-foreground">TwiML fallback URL configured for Smart Router outages</span>
      </div>
      <div class="flex items-center gap-3 border-b border-border/40 pb-2">
        <span class="h-5 w-5 rounded-full bg-green-500/15 text-green-400 text-xs flex items-center justify-center">✓</span>
        <span class="text-foreground">Recording callbacks verified and URLs stored correctly</span>
      </div>
      <div class="flex items-center gap-3 border-b border-border/40 pb-2">
        <span class="h-5 w-5 rounded-full bg-green-500/15 text-green-400 text-xs flex items-center justify-center">✓</span>
        <span class="text-foreground">Pod isolation enabled with Smart Router for production workloads</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="h-5 w-5 rounded-full bg-green-500/15 text-green-400 text-xs flex items-center justify-center">✓</span>
        <span class="text-foreground">Caller ID verified for all outbound numbers</span>
      </div>
    </div>
  </ConfigPanel>

  <Callout type="danger" title="Trial Account Limitations">
    <p>Twilio trial accounts can only call verified phone numbers and include a "trial" prefix in TTS. Upgrade your account before running production campaigns.</p>
  </Callout>
</div>
