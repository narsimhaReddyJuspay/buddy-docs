<script lang="ts">
  import FlowDiagram from '$lib/components/FlowDiagram.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import ConfigPanel from '$lib/components/ConfigPanel.svelte';
  import IntegrationCard from '$lib/components/IntegrationCard.svelte';
</script>

<svelte:head><title>Telephony Overview — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Telephony Integration</h1>
  <p class="text-muted-foreground text-base mb-6">
    Connect Breeze Buddy to the PSTN via <a href="https://www.twilio.com" target="_blank" rel="noopener">Twilio</a>, <a href="https://www.plivo.com" target="_blank" rel="noopener">Plivo</a>, or <a href="https://exotel.com" target="_blank" rel="noopener">Exotel</a> — enabling outbound campaigns and inbound call handling through real-time WebSocket audio streaming. For browser-based sessions without PSTN, see <a href="/docs/daily/overview">Daily WebRTC</a>.
  </p>

  <!-- ───────── How It Works ───────── -->
  <h2 id="how-it-works">How Telephony Works</h2>
  <p>
    Every telephony call follows the same core pattern: the provider places or receives a phone call and bridges it to a
    <strong>bidirectional WebSocket</strong> connection. Audio frames stream in real-time between the provider and the
    Pipecat <a href="/docs/advanced/pipeline">voice pipeline</a>, which runs <a href="/docs/config/stt">STT</a> → <a href="/docs/config/llm">LLM</a> → <a href="/docs/config/tts">TTS</a> on each turn.
  </p>

  <FlowDiagram steps={["Provider API", "PSTN Call", "Customer Answers", "WebSocket Bridge", "Voice Pipeline", "Callbacks"]} variant="integrate" />

  <p>
    The WebSocket endpoint (<code>/ws/&#123;provider&#125;</code>) accepts raw audio frames at <strong>8 kHz</strong> and returns
    synthesized speech in the same format. All call metadata — lead ID, template ID, outbound number — is passed as
    query parameters or stream metadata so the pipeline can load the correct <a href="/docs/templates/overview">conversation template</a>.
  </p>

  <Callout type="info" title="Pod Isolation">
    <p>In production, each call runs on a dedicated pod allocated by the Smart Router. See <a href="/docs/architecture">Architecture</a> for details on pod isolation and the process model.</p>
  </Callout>

  <!-- ───────── Outbound Flow ───────── -->
  <h2 id="outbound-flow">Outbound Call Flow</h2>
  <p>Outbound calls are driven by a background cron that picks up leads in <code>BACKLOG</code> status within the <a href="/docs/config/call-execution">configured calling window</a>.</p>

  <FlowDiagram steps={["Cron Pickup", "Reserve Number", "Provider API Call", "Customer Answers", "WebSocket Audio", "Voice Pipeline", "Status Callback"]} variant="integrate" />

  <div class="step-list">
    <div class="step-list-item">
      <div class="step-list-number">1</div>
      <div><strong>Cron pickup</strong> — The scheduler selects a <code>BACKLOG</code> lead whose <a href="/docs/config/call-execution">calling hours</a> and timezone match the current time.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">2</div>
      <div><strong>Reserve outbound number</strong> — An available number is locked for the duration of the call to prevent double-dialing. See <a href="/docs/misc/numbers">Numbers &amp; Merchants</a>.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">3</div>
      <div><strong>Provider API call</strong> — <a href="/docs/telephony/twilio">Twilio</a> <code>calls.create()</code>, <a href="/docs/telephony/plivo">Plivo</a> <code>calls.create()</code>, or <a href="/docs/telephony/exotel">Exotel</a> applet trigger initiates a PSTN call to the customer.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">4</div>
      <div><strong>Customer answers</strong> — The provider establishes a WebSocket and begins streaming audio bidirectionally.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">5</div>
      <div><strong>Voice pipeline</strong> — <a href="https://github.com/pipecat-ai/pipecat" target="_blank" rel="noopener">Pipecat</a> processes audio in real-time: <a href="/docs/config/stt">STT</a> → <a href="/docs/config/llm">LLM</a> → <a href="/docs/config/tts">TTS</a>, following the <a href="/docs/templates/overview">conversation template</a>.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">6</div>
      <div><strong>Callbacks</strong> — On call end the provider sends status and recording callbacks. The lead is updated to <code>FINISHED</code> or <code>RETRY</code>. Configure <a href="/docs/misc/webhooks">webhooks</a> for real-time notifications.</div>
    </div>
  </div>

  <!-- ───────── Inbound Flow ───────── -->
  <h2 id="inbound-flow">Inbound Call Flow</h2>
  <p>When a customer dials one of your outbound numbers, the telephony provider hits your answer webhook. The server resolves which <a href="/docs/templates/overview">template(s)</a> are mapped to that number and routes accordingly. See <a href="/docs/telephony/inbound">Inbound Calls</a> and <a href="/docs/advanced/ivr">IVR Routing</a> for details.</p>

  <FlowDiagram steps={["Customer Dials", "Provider Webhook", "Resolve Templates", "Single / IVR Routing", "WebSocket Connection", "Voice Pipeline"]} variant="integrate" />

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Templates Found</th><th>Behavior</th></tr></thead>
      <tbody>
        <tr><td><strong>Single template</strong></td><td>Customer is connected to the AI agent immediately via WebSocket</td></tr>
        <tr><td><strong>Multiple templates</strong></td><td>IVR menu plays — customer presses a digit to select a service/agent</td></tr>
        <tr><td><strong>No templates</strong></td><td>Call is rejected or redirected based on block action configuration</td></tr>
      </tbody>
    </table>
  </div>

  <!-- ───────── Provider Comparison ───────── -->
  <h2 id="provider-comparison">Provider Comparison</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Feature</th><th>Twilio</th><th>Plivo</th><th>Exotel</th></tr></thead>
      <tbody>
        <tr><td><strong>Outbound</strong></td><td>TwiML / inline <code>twiml=</code></td><td><code>answer_url</code> webhook</td><td>Applet-based routing</td></tr>
        <tr><td><strong>Inbound</strong></td><td>Webhook → TwiML</td><td>Webhook → XML</td><td>Applet → webhook</td></tr>
        <tr><td><strong>Audio Encoding</strong></td><td>μ-law 8 kHz</td><td>PCM L16 8 kHz</td><td>μ-law 8 kHz</td></tr>
        <tr><td><strong>Recording</strong></td><td>Native (<code>record=True</code>)</td><td>API-initiated</td><td>API-initiated</td></tr>
        <tr><td><strong>Warm Transfer</strong></td><td>Conference API</td><td><code>calls.transfer()</code></td><td>Applet bridge</td></tr>
        <tr><td><strong>Regions</strong></td><td>Global</td><td>Global</td><td>India-focused</td></tr>
      </tbody>
    </table>
  </div>

  <!-- ───────── Integration Cards ───────── -->
  <h2 id="choose-provider">Choose a Provider</h2>
  <p>Select a telephony provider to view the complete integration guide:</p>

  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 not-prose">
    <IntegrationCard
      title="Twilio"
      description="Global coverage with TwiML-based call control, Conference API for transfers, and native recording."
      href="/docs/telephony/twilio"
      iconHtml='<svg class="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.11 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'
      provider="Twilio"
      status="available"
    />
    <IntegrationCard
      title="Plivo"
      description="Cost-effective global telephony with XML-based call control and PCM audio streaming."
      href="/docs/telephony/plivo"
      iconHtml='<svg class="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
      provider="Plivo"
      status="available"
    />
    <IntegrationCard
      title="Exotel"
      description="India-focused provider with applet-based routing and native bridge transfers."
      href="/docs/telephony/exotel"
      iconHtml='<svg class="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'
      provider="Exotel"
      status="available"
    />
  </div>

  <!-- ───────── Provider Config ───────── -->
  <h2 id="provider-configuration">Provider Configuration</h2>
  <p>Select your telephony provider and supply the required credentials as environment variables. The system auto-detects which provider to use based on the outbound number's <code>provider</code> field.</p>

  <ConfigPanel title="Telephony Provider Selection" iconHtml='<svg class="h-4 w-4 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"/><line x1="2" y1="20" x2="2.01" y2="20"/></svg>' variant="integrate">
    <div class="space-y-3 text-sm">
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Provider</span>
        <code class="text-violet-400">twilio | plivo | exotel</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Determined by</span>
        <span class="text-foreground">Outbound number <code>provider</code> field</span>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">WebSocket path</span>
        <code class="text-violet-400">/ws/&#123;provider&#125;</code>
      </div>
      <div class="flex items-baseline justify-between">
        <span class="text-muted-foreground">Answer webhook</span>
        <code class="text-violet-400">/&#123;provider&#125;/answer</code>
      </div>
    </div>
  </ConfigPanel>

  <!-- ───────── Audio Transport ───────── -->
  <h2 id="audio-transport">Audio Encoding &amp; Transport</h2>
  <p>All providers stream audio over a persistent WebSocket connection using the <code>FastAPIWebsocketParams</code> transport. The encoding varies by provider:</p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Parameter</th><th>Twilio</th><th>Plivo</th><th>Exotel</th></tr></thead>
      <tbody>
        <tr><td><strong>Sample Rate</strong></td><td><code>8000 Hz</code></td><td><code>8000 Hz</code></td><td><code>8000 Hz</code></td></tr>
        <tr><td><strong>Encoding</strong></td><td>μ-law (G.711)</td><td>PCM L16</td><td>μ-law (G.711)</td></tr>
        <tr><td><strong>Channels</strong></td><td>Mono</td><td>Mono</td><td>Mono</td></tr>
        <tr><td><strong>Frame delivery</strong></td><td>Base64 in JSON</td><td>Raw binary</td><td>Base64 in JSON</td></tr>
        <tr><td><strong>Noise filter</strong></td><td>Optional AIC</td><td>Optional AIC</td><td>Optional AIC</td></tr>
      </tbody>
    </table>
  </div>

  <Callout type="tip" title="AIC Noise Enhancement">
    <p>When enabled, the AIC noise enhancement filter runs on inbound audio <em>before</em> it reaches the <a href="/docs/config/stt">STT engine</a>, significantly improving transcription accuracy in noisy phone environments. See <a href="/docs/config/audio">Audio Configuration</a> for setup.</p>
  </Callout>

  <!-- ───────── Call Lifecycle ───────── -->
  <h2 id="call-lifecycle">Call Lifecycle States</h2>
  <p>Every lead moves through a deterministic state machine during the calling process:</p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Status</th><th>Description</th><th>Next States</th></tr></thead>
      <tbody>
        <tr><td><code>BACKLOG</code></td><td>Lead pushed via API, waiting for cron pickup</td><td><code>PROCESSING</code></td></tr>
        <tr><td><code>PROCESSING</code></td><td>Call initiated, conversation in progress</td><td><code>FINISHED</code>, <code>RETRY</code></td></tr>
        <tr><td><code>FINISHED</code></td><td>Call completed — outcome &amp; recording stored</td><td>Terminal</td></tr>
        <tr><td><code>RETRY</code></td><td>Call failed (no answer, busy, error) — scheduled for retry</td><td><code>BACKLOG</code></td></tr>
      </tbody>
    </table>
  </div>

  <!-- ───────── Step-by-step Integration ───────── -->
  <h2 id="integration-steps">Step-by-Step Integration</h2>
  <p>Follow these steps to integrate telephony with your Breeze Buddy deployment:</p>

  <div class="step-list">
    <div class="step-list-item">
      <div class="step-list-number">1</div>
      <div><strong>Create provider account</strong> — Sign up for Twilio, Plivo, or Exotel and obtain API credentials.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">2</div>
      <div><strong>Configure environment variables</strong> — Set <code>TWILIO_ACCOUNT_SID</code>, <code>PLIVO_AUTH_ID</code>, or <code>EXOTEL_API_KEY</code> and related secrets.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">3</div>
      <div><strong>Provision outbound numbers</strong> — Purchase numbers and register them via the <a href="/docs/misc/numbers">Numbers &amp; Merchants API</a> with the correct provider tag.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">4</div>
      <div><strong>Set up webhooks</strong> — Point your provider's answer/status/recording callbacks to the appropriate <code>/&#123;provider&#125;/</code> endpoints.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">5</div>
      <div><strong>Create a template</strong> — Define a conversation flow with nodes, functions, and hooks via the <a href="/docs/templates/templates-api">Templates API</a>.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">6</div>
      <div><strong>Push leads</strong> — Send leads via the <a href="/docs/misc/leads">Leads API</a> with <code>status: "BACKLOG"</code> to start the outbound campaign.</div>
    </div>
  </div>

  <Callout type="warning" title="Webhook Accessibility">
    <p>Your server must be publicly accessible for telephony providers to reach the answer/callback webhooks. In development, use a tunneling service like <code>ngrok</code> to expose your local server.</p>
  </Callout>

  <!-- ───────── Related Pages ───────── -->
  <h2 id="next-steps">Next Steps</h2>
  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Topic</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><a href="/docs/telephony/twilio">Twilio Integration</a></td><td>TwiML configuration, Conference API transfers, native recording</td></tr>
        <tr><td><a href="/docs/telephony/plivo">Plivo Integration</a></td><td>XML-based call control, PCM audio, <code>calls.transfer()</code></td></tr>
        <tr><td><a href="/docs/telephony/exotel">Exotel Integration</a></td><td>Applet routing, India-focused, plain-text bridge transfers</td></tr>
        <tr><td><a href="/docs/telephony/inbound">Inbound Calls</a></td><td>Webhook routing, IVR menus, business hours, rate limiting</td></tr>
        <tr><td><a href="/docs/telephony/warm-transfer">Warm Transfer</a></td><td>Handoff to live agents across all providers</td></tr>
      </tbody>
    </table>
  </div>
</div>
