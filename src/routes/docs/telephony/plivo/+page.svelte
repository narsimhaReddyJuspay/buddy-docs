<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ApiEndpoint from '$lib/components/ApiEndpoint.svelte';
  import FlowDiagram from '$lib/components/FlowDiagram.svelte';
  import ConfigPanel from '$lib/components/ConfigPanel.svelte';
</script>

<svelte:head><title>Plivo Integration — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Plivo Integration</h1>
  <p class="text-muted-foreground text-base mb-6">
    Integrate Plivo for cost-effective outbound campaigns and inbound call handling with PCM audio streaming, XML-based call control, and <code>calls.transfer()</code> warm transfers.
  </p>

  <!-- ───────── Prerequisites ───────── -->
  <h2 id="prerequisites">Prerequisites</h2>

  <div class="step-list">
    <div class="step-list-item">
      <div class="step-list-number">1</div>
      <div><strong>Plivo account</strong> — Sign up at <code>plivo.com</code> and obtain your <strong>Auth ID</strong> and <strong>Auth Token</strong> from the dashboard.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">2</div>
      <div><strong>Phone numbers</strong> — Purchase Plivo numbers with voice capability in your target regions.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">3</div>
      <div><strong>Webhook access</strong> — Ensure your Breeze Buddy server is publicly accessible for Plivo callbacks.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">4</div>
      <div><strong>Register numbers</strong> — Add your Plivo numbers via the <a href="/docs/misc/numbers">Numbers API</a> with <code>provider: "plivo"</code>.</div>
    </div>
  </div>

  <ConfigPanel title="Plivo Environment Variables" icon="🔑" variant="integrate">
    <div class="space-y-3 text-sm">
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">PLIVO_AUTH_ID</span>
        <span class="text-foreground">Your Plivo Auth ID</span>
      </div>
      <div class="flex items-baseline justify-between">
        <span class="text-muted-foreground">PLIVO_AUTH_TOKEN</span>
        <span class="text-foreground">Your Plivo Auth Token</span>
      </div>
    </div>
  </ConfigPanel>

  <!-- ───────── Outbound Calls ───────── -->
  <h2 id="outbound-calls">Outbound Calls</h2>
  <p>Plivo outbound calls use the <code>calls.create()</code> API with an <code>answer_url</code> that points to the server's Plivo answer webhook. When the customer picks up, Plivo hits this URL to receive XML instructions.</p>

  <FlowDiagram steps={["calls.create()", "Customer Answers", "Plivo hits answer_url", "Start Recording + AIC", "Pod Allocation", "WebSocket Audio"]} variant="integrate" />

  <div class="step-list">
    <div class="step-list-item">
      <div class="step-list-number">1</div>
      <div><strong>API call</strong> — <code>calls.create()</code> with <code>answer_url</code> pointing to <code>/plivo/answer</code> and <code>hangup_url</code> pointing to <code>/plivo/callback/status</code>.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">2</div>
      <div><strong>Customer answers</strong> — Plivo hits the <code>answer_url</code> webhook.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">3</div>
      <div><strong>Recording + noise cancellation</strong> — The webhook starts call recording via the Plivo API and optionally enables AIC noise enhancement.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">4</div>
      <div><strong>Pod allocation</strong> — Smart Router allocates a dedicated pod (production) or a static URL is used (development).</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">5</div>
      <div><strong>WebSocket stream</strong> — XML response establishes a bidirectional PCM audio stream to the pipeline.</div>
    </div>
  </div>

  <!-- ───────── Answer Webhook ───────── -->
  <h2 id="answer-webhook">Answer Webhook</h2>
  <ApiEndpoint method="POST" path="/plivo/answer" description="Called by Plivo when the customer answers. Returns XML with the WebSocket stream URL." />

  <p>The answer webhook performs the following in sequence:</p>
  <ol>
    <li>Starts call recording via the Plivo API</li>
    <li>Enables noise cancellation if configured</li>
    <li>Allocates a dedicated pod via Smart Router (production) or uses a static URL (development)</li>
    <li>Returns an XML response with the bidirectional WebSocket stream</li>
  </ol>

  <CodeBlock lang="xml" filename="plivo-answer-response.xml" code={`<Response>
  <Stream streamTimeout="86400" keepCallAlive="true"
    contentType="audio/x-l16;rate=8000"
    bidirectional="true"
    url="wss://your-domain.com/agent/voice/breeze-buddy/ws/plivo">
    lead_id
  </Stream>
</Response>`} />

  <!-- ───────── Audio Encoding ───────── -->
  <h2 id="audio-encoding">Audio Encoding</h2>
  <p>Plivo uses <strong>PCM L16 at 8 kHz</strong> — a key difference from Twilio and Exotel which use μ-law encoding. This means raw 16-bit linear PCM samples are streamed bidirectionally.</p>

  <ConfigPanel title="Plivo Audio Parameters" icon="🎧" variant="integrate">
    <div class="space-y-3 text-sm">
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Encoding</span>
        <code class="text-violet-400">PCM L16 (linear 16-bit)</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Sample Rate</span>
        <code class="text-violet-400">8000 Hz</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Content Type</span>
        <code class="text-violet-400">audio/x-l16;rate=8000</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Stream Timeout</span>
        <code class="text-violet-400">86400 seconds (24h)</code>
      </div>
      <div class="flex items-baseline justify-between">
        <span class="text-muted-foreground">Bidirectional</span>
        <code class="text-violet-400">true</code>
      </div>
    </div>
  </ConfigPanel>

  <Callout type="info" title="PCM vs μ-law">
    <p>PCM L16 provides higher fidelity than μ-law at the same sample rate, but uses more bandwidth. The pipeline auto-detects the encoding based on the provider and handles the conversion transparently.</p>
  </Callout>

  <!-- ───────── Callbacks ───────── -->
  <h2 id="callbacks">Callbacks</h2>

  <ApiEndpoint method="POST" path="/plivo/callback/status" description="Call hangup notification — triggers retry logic and status updates." />
  <ApiEndpoint method="POST" path="/plivo/callback/details" description="Recording URL delivery after the call ends." />
  <ApiEndpoint method="POST" path="/plivo/callback/transfer" description="Warm transfer status — reports whether the transfer succeeded or failed." />

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Callback</th><th>Endpoint</th><th>Purpose</th></tr></thead>
      <tbody>
        <tr><td><strong>Status</strong></td><td><code>POST /plivo/callback/status</code></td><td>Call completed/failed — retry logic, lead status update</td></tr>
        <tr><td><strong>Details</strong></td><td><code>POST /plivo/callback/details</code></td><td>Delivers the recording URL for storage</td></tr>
        <tr><td><strong>Transfer</strong></td><td><code>POST /plivo/callback/transfer</code></td><td>Reports outcome of warm transfer attempts</td></tr>
      </tbody>
    </table>
  </div>

  <!-- ───────── Warm Transfer ───────── -->
  <h2 id="warm-transfer">Warm Transfer</h2>
  <p>Plivo warm transfer uses the <code>calls.transfer()</code> API to redirect the active call to a dial-up webhook that returns <code>&lt;Dial&gt;</code> XML.</p>

  <FlowDiagram steps={["AI triggers transfer", "calls.transfer() → /dial-up", "Webhook returns Dial XML", "Customer bridged to agent", "AI disconnects"]} variant="integrate" />

  <div class="step-list">
    <div class="step-list-item">
      <div class="step-list-number">1</div>
      <div>The <code>connect_to_live_agent</code> built-in handler is invoked by the LLM.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">2</div>
      <div>Plivo <code>calls.transfer()</code> redirects the active call to the <code>/plivo/dial-up</code> webhook.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">3</div>
      <div>The webhook looks up the transfer number and returns <code>&lt;Dial&gt;&lt;Number&gt;</code> XML.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">4</div>
      <div>Plivo bridges the customer to the live agent. The AI disconnects.</div>
    </div>
  </div>

  <h3 id="dial-up-webhook">Dial-Up Webhook</h3>
  <ApiEndpoint method="POST" path="/plivo/dial-up" description="Called by Plivo after calls.transfer(). Returns Dial XML to connect the customer to the transfer target." />

  <CodeBlock lang="xml" filename="plivo-dial-response.xml" code={`<Response>
  <Dial callerId="{outbound_number}">
    <Number>{transfer_number}</Number>
  </Dial>
</Response>`} />

  <Callout type="warning" title="Transfer Timeouts">
    <p>If the transfer target does not answer within the configured timeout, the call returns to the AI agent. The conversation resumes with an error message and the AI can offer alternatives.</p>
  </Callout>

  <!-- ───────── Recording ───────── -->
  <h2 id="recording">Recording</h2>
  <p>Unlike Twilio's native <code>record=True</code>, Plivo requires recording to be started explicitly via the API during the <code>/plivo/answer</code> webhook. The recording URL is delivered asynchronously via <code>/plivo/callback/details</code>.</p>

  <CodeBlock lang="python" filename="plivo_recording.py" code={`# Recording is started during the answer webhook
plivo_client.calls.record(
    call_uuid=call_uuid,
    callback_url=f"{base_url}/plivo/callback/details"
)`} />

  <!-- ───────── Configuration Summary ───────── -->
  <h2 id="configuration">Configuration Summary</h2>

  <ConfigPanel title="Plivo Integration Settings" icon="⚙️" variant="integrate">
    <div class="space-y-3 text-sm">
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">answer_url</span>
        <code class="text-violet-400">/plivo/answer</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">hangup_url</span>
        <code class="text-violet-400">/plivo/callback/status</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">recording_callback</span>
        <code class="text-violet-400">/plivo/callback/details</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">transfer_url</span>
        <code class="text-violet-400">/plivo/dial-up</code>
      </div>
      <div class="flex items-baseline justify-between">
        <span class="text-muted-foreground">transfer_callback</span>
        <code class="text-violet-400">/plivo/callback/transfer</code>
      </div>
    </div>
  </ConfigPanel>

  <Callout type="tip" title="Cost Optimization">
    <p>Plivo generally offers lower per-minute rates than Twilio for voice calls, especially in international markets. Compare pricing for your target regions before selecting a provider.</p>
  </Callout>
</div>
