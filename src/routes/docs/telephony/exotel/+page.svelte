<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ApiEndpoint from '$lib/components/ApiEndpoint.svelte';
  import FlowDiagram from '$lib/components/FlowDiagram.svelte';
  import ConfigPanel from '$lib/components/ConfigPanel.svelte';
</script>

<svelte:head><title>Exotel Integration — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Exotel Integration</h1>
  <p class="text-muted-foreground text-base mb-6">
    Integrate Exotel for India-focused telephony with applet-based call routing, native bridge transfers, and μ-law audio streaming.
  </p>

  <!-- ───────── Prerequisites ───────── -->
  <h2 id="prerequisites">Prerequisites</h2>

  <div class="step-list">
    <div class="step-list-item">
      <div class="step-list-number">1</div>
      <div><strong>Exotel account</strong> — Sign up at <code>exotel.com</code> and obtain your <strong>API Key</strong>, <strong>API Token</strong>, and <strong>Account SID</strong>.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">2</div>
      <div><strong>Exotel numbers</strong> — Purchase Indian virtual numbers or use your existing Exotel numbers with voice capability.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">3</div>
      <div><strong>Passthru applet</strong> — Create a passthru applet in your Exotel dashboard that forwards calls to your answer webhook URL.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">4</div>
      <div><strong>Register numbers</strong> — Add your Exotel numbers via the <a href="/docs/api/numbers">Numbers API</a> with <code>provider: "exotel"</code>.</div>
    </div>
  </div>

  <Callout type="info" title="India-Focused Provider">
    <p>Exotel is primarily designed for Indian telephony infrastructure. It offers excellent connectivity, local number support, and compliance with Indian telecom regulations (TRAI).</p>
  </Callout>

  <ConfigPanel title="Exotel Environment Variables" icon="🔑" variant="integrate">
    <div class="space-y-3 text-sm">
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">EXOTEL_API_KEY</span>
        <span class="text-foreground">Exotel API key for authentication</span>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">EXOTEL_API_TOKEN</span>
        <span class="text-foreground">Exotel API token for authentication</span>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">EXOTEL_SID</span>
        <span class="text-foreground">Exotel account SID</span>
      </div>
      <div class="flex items-baseline justify-between">
        <span class="text-muted-foreground">EXOTEL_TEMPLATE_APPLET_APP_ID</span>
        <span class="text-foreground">Default applet ID for call routing</span>
      </div>
    </div>
  </ConfigPanel>

  <!-- ───────── Applet-Based Routing ───────── -->
  <h2 id="applet-based-routing">Applet-Based Routing</h2>
  <p>Unlike Twilio and Plivo which use URL-based webhooks directly, Exotel uses an <strong>applet-based routing model</strong>. Calls are initiated by triggering an applet via the Exotel API, and the applet configuration determines the call flow.</p>

  <FlowDiagram steps={["Trigger Applet API", "Exotel Routes via Applet", "Customer Answers", "Applet Hits Webhook", "WebSocket Audio", "Voice Pipeline"]} variant="integrate" />

  <h3 id="passthru-applet-setup">Passthru Applet Setup</h3>
  <p>The passthru applet acts as a bridge between Exotel's call routing system and your Breeze Buddy server. Set it up in the Exotel dashboard:</p>

  <div class="step-list">
    <div class="step-list-item">
      <div class="step-list-number">1</div>
      <div>Log in to the Exotel dashboard and navigate to <strong>App Bazaar → My Apps</strong>.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">2</div>
      <div>Create a new <strong>Passthru Applet</strong> and configure the webhook URL to point to your server's <code>/exotel/answer</code> endpoint.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">3</div>
      <div>Note the <strong>Applet App ID</strong> — you'll need it for the <code>EXOTEL_TEMPLATE_APPLET_APP_ID</code> environment variable.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">4</div>
      <div>For warm transfer, configure an additional passthru applet for the <code>/exotel/dial-up</code> endpoint.</div>
    </div>
  </div>

  <h3 id="applet-configuration">Applet ID Configuration</h3>
  <p>The applet ID can be configured at two levels, with template-level settings taking precedence:</p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Source</th><th>Setting</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><strong>Environment</strong></td><td><code>EXOTEL_TEMPLATE_APPLET_APP_ID</code></td><td>Default applet ID — used when no template-level override exists</td></tr>
        <tr><td><strong>Template</strong></td><td><code>telephony_config.applet_app_id</code></td><td>Per-template override — takes precedence over the env variable</td></tr>
      </tbody>
    </table>
  </div>

  <Callout type="tip" title="Multi-Applet Templates">
    <p>Use template-level <code>telephony_config.applet_app_id</code> when different conversation flows need different Exotel applet configurations — e.g., a sales applet with warm transfer vs. a survey applet without.</p>
  </Callout>

  <!-- ───────── Outbound Calls ───────── -->
  <h2 id="outbound-calls">Outbound Calls</h2>
  <p>Outbound calls are placed by calling the Exotel API with the configured applet ID. The applet routes the call and triggers the answer webhook when the customer answers.</p>

  <div class="step-list">
    <div class="step-list-item">
      <div class="step-list-number">1</div>
      <div><strong>API call</strong> — Exotel API is called with the <code>applet_app_id</code> and customer phone number.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">2</div>
      <div><strong>Applet routing</strong> — Exotel routes the call through the configured passthru applet.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">3</div>
      <div><strong>Customer answers</strong> — The applet triggers the answer webhook on your server.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">4</div>
      <div><strong>Pipeline connection</strong> — Server starts recording, allocates a pod, and returns the WebSocket URL.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">5</div>
      <div><strong>Audio streaming</strong> — Bidirectional μ-law audio at 8 kHz streams between Exotel and the pipeline.</div>
    </div>
  </div>

  <!-- ───────── Audio Encoding ───────── -->
  <h2 id="audio-encoding">Audio Encoding</h2>

  <ConfigPanel title="Exotel Audio Parameters" icon="🎧" variant="integrate">
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

  <p>Exotel uses <strong>μ-law encoding at 8 kHz</strong>, identical to Twilio's audio format. The pipeline handles the encoding transparently based on the provider.</p>

  <!-- ───────── Callbacks ───────── -->
  <h2 id="callbacks">Callbacks</h2>

  <ApiEndpoint method="POST" path="/exotel/callback/status" description="Call status updates — triggers retry logic for failed calls and updates lead status." />

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Callback</th><th>Endpoint</th><th>Purpose</th></tr></thead>
      <tbody>
        <tr><td><strong>Status</strong></td><td><code>POST /exotel/callback/status</code></td><td>Call completed/failed — retry logic, lead status update</td></tr>
      </tbody>
    </table>
  </div>

  <Callout type="info" title="Simplified Callbacks">
    <p>Exotel uses a single status callback endpoint. Recording URLs are retrieved via the Exotel API after the status callback confirms the call has ended.</p>
  </Callout>

  <!-- ───────── Warm Transfer ───────── -->
  <h2 id="warm-transfer">Warm Transfer</h2>
  <p>Exotel warm transfer follows a unique pattern where the <strong>AI disconnects first</strong> and the applet takes over to bridge the customer to a live agent.</p>

  <FlowDiagram steps={["AI triggers transfer", "AI disconnects", "Applet calls /dial-up", "Returns phone number", "Exotel native bridge"]} variant="integrate" />

  <div class="step-list">
    <div class="step-list-item">
      <div class="step-list-number">1</div>
      <div>The <code>connect_to_live_agent</code> handler is invoked by the LLM.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">2</div>
      <div>The AI agent <strong>disconnects</strong> from the active call.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">3</div>
      <div>Exotel's applet flow makes a REST call to the <code>/exotel/dial-up</code> webhook.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">4</div>
      <div>The webhook returns the agent's phone number as <strong>plain text</strong> (not XML).</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">5</div>
      <div>Exotel uses its native bridge to connect the customer to the returned number.</div>
    </div>
  </div>

  <h3 id="dial-up-webhook">Dial-Up Webhook</h3>
  <ApiEndpoint method="POST" path="/exotel/dial-up" description="Called by the Exotel applet after AI disconnects. Returns the transfer target number as plain text." />

  <CodeBlock lang="python" filename="exotel_transfer.py" code={`def exotel_dial_text(transfer_number: str) -> str:
    """Returns the agent phone number as plain text
    for Exotel's applet bridge mechanism."""
    return transfer_number`} />

  <Callout type="warning" title="AI Disconnects First">
    <p>In the Exotel flow, the AI disconnects <em>before</em> the customer is bridged to the live agent. There is a brief hold period while the applet completes the bridge. This differs from Twilio (Conference API) and Plivo (<code>calls.transfer()</code>) where the AI stays connected during handoff.</p>
  </Callout>

  <!-- ───────── Regional Considerations ───────── -->
  <h2 id="regional-considerations">Regional Considerations</h2>
  <p>When deploying Exotel in production, keep these India-specific considerations in mind:</p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Consideration</th><th>Details</th></tr></thead>
      <tbody>
        <tr><td><strong>TRAI Compliance</strong></td><td>Outbound calls must comply with DND (Do Not Disturb) regulations. Exotel handles DND filtering automatically.</td></tr>
        <tr><td><strong>Calling Hours</strong></td><td>TRAI restricts promotional calls to 9 AM – 9 PM IST. Configure <code>call_start_time</code> and <code>call_end_time</code> accordingly.</td></tr>
        <tr><td><strong>Number Formats</strong></td><td>Indian numbers must include the country code (<code>+91</code>) and 10-digit mobile number.</td></tr>
        <tr><td><strong>Latency</strong></td><td>Deploy your server in the <code>ap-south-1</code> (Mumbai) region for optimal audio latency with Exotel's infrastructure.</td></tr>
        <tr><td><strong>Language Support</strong></td><td>Configure STT/TTS for Indian languages (Hindi, Tamil, Telugu, etc.) using compatible providers.</td></tr>
      </tbody>
    </table>
  </div>

  <!-- ───────── Configuration Summary ───────── -->
  <h2 id="configuration">Configuration Summary</h2>

  <ConfigPanel title="Exotel Integration Settings" icon="⚙️" variant="integrate">
    <div class="space-y-3 text-sm">
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">EXOTEL_API_KEY</span>
        <span class="text-foreground">API key for authentication</span>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">EXOTEL_API_TOKEN</span>
        <span class="text-foreground">API token for authentication</span>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">EXOTEL_SID</span>
        <span class="text-foreground">Account SID</span>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">EXOTEL_TEMPLATE_APPLET_APP_ID</span>
        <span class="text-foreground">Default passthru applet ID</span>
      </div>
      <div class="flex items-baseline justify-between">
        <span class="text-muted-foreground">telephony_config.applet_app_id</span>
        <span class="text-foreground">Template-level applet override</span>
      </div>
    </div>
  </ConfigPanel>

  <Callout type="danger" title="Production Applet Configuration">
    <p>Always verify your passthru applet webhook URLs point to the correct production endpoints before going live. An incorrectly configured applet will silently drop calls without error feedback.</p>
  </Callout>
</div>
