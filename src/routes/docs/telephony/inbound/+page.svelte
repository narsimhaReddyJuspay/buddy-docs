<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ApiEndpoint from '$lib/components/ApiEndpoint.svelte';
  import FlowDiagram from '$lib/components/FlowDiagram.svelte';
  import ConfigPanel from '$lib/components/ConfigPanel.svelte';
</script>

<svelte:head><title>Inbound Calls — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Inbound Calls</h1>
  <p class="text-muted-foreground text-base mb-6">
    Handle incoming customer calls with automatic template resolution, IVR routing for multi-service numbers, business hours enforcement, and per-number rate limiting.
  </p>

  <!-- ───────── How Inbound Works ───────── -->
  <h2 id="how-inbound-works">How Inbound Routing Works</h2>
  <p>When a customer calls one of your registered outbound numbers, the telephony provider sends a webhook to Breeze Buddy. The server resolves which conversation template(s) are mapped to that number and routes the call accordingly.</p>

  <FlowDiagram steps={["Customer Dials Number", "Provider Webhook", "Business Hours Check", "Template Resolution", "Single / IVR Routing", "WebSocket → Voice Pipeline"]} variant="integrate" />

  <div class="step-list">
    <div class="step-list-item">
      <div class="step-list-number">1</div>
      <div><strong>Customer dials</strong> — The customer calls one of your registered outbound numbers.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">2</div>
      <div><strong>Provider webhook</strong> — The provider (Twilio/Plivo/Exotel) hits the <code>/&#123;provider&#125;/answer</code> webhook.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">3</div>
      <div><strong>Pre-checks</strong> — Business hours, rate limits, and block rules are evaluated. Calls outside valid windows are rejected or redirected.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">4</div>
      <div><strong>Template resolution</strong> — The server queries all templates associated with the dialed number.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">5</div>
      <div><strong>Routing</strong> — Single template → direct connect. Multiple templates → IVR selection menu.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">6</div>
      <div><strong>Voice pipeline</strong> — A WebSocket connection is established and the AI agent begins the conversation.</div>
    </div>
  </div>

  <!-- ───────── Template Resolution ───────── -->
  <h2 id="template-resolution">Template Resolution</h2>
  <p>The routing decision depends on how many templates are mapped to the dialed number:</p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Templates Found</th><th>Behavior</th><th>Customer Experience</th></tr></thead>
      <tbody>
        <tr><td><strong>Single template</strong></td><td>Direct WebSocket connection</td><td>Immediately connected to AI agent</td></tr>
        <tr><td><strong>Multiple templates</strong></td><td>IVR mode activated</td><td>Hears a menu, presses a digit to select</td></tr>
        <tr><td><strong>No templates</strong></td><td>Block action triggered</td><td>Hears rejection message or gets redirected</td></tr>
      </tbody>
    </table>
  </div>

  <!-- ───────── Webhooks Per Provider ───────── -->
  <h2 id="provider-webhooks">Provider Webhooks</h2>
  <p>Each provider has its own answer webhook for handling inbound calls. The response format varies by provider:</p>

  <ApiEndpoint method="POST" path="/twilio/answer" description="Twilio inbound answer — returns TwiML XML with WebSocket stream or IVR Gather." />
  <ApiEndpoint method="POST" path="/plivo/answer" description="Plivo inbound answer — returns Plivo XML with Stream or GetDigits elements." />
  <ApiEndpoint method="POST" path="/exotel/answer" description="Exotel inbound answer — returns applet response with WebSocket URL." />

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Provider</th><th>Webhook</th><th>Response Format</th><th>IVR Element</th></tr></thead>
      <tbody>
        <tr><td><strong>Twilio</strong></td><td><code>POST /twilio/answer</code></td><td>TwiML XML</td><td><code>&lt;Gather&gt;</code></td></tr>
        <tr><td><strong>Plivo</strong></td><td><code>POST /plivo/answer</code></td><td>Plivo XML</td><td><code>&lt;GetDigits&gt;</code></td></tr>
        <tr><td><strong>Exotel</strong></td><td><code>POST /exotel/answer</code></td><td>Applet response</td><td>Applet-based IVR</td></tr>
      </tbody>
    </table>
  </div>

  <!-- ───────── IVR Routing ───────── -->
  <h2 id="ivr-routing">IVR Routing</h2>
  <p>When multiple templates are mapped to the same number, IVR mode activates. The system generates a TTS-based menu from each template's IVR configuration and waits for the customer to press a digit.</p>

  <FlowDiagram steps={["Multiple Templates Found", "Generate TTS Menu", "Play IVR Greeting", "Customer Presses Digit", "Route to Selected Template", "WebSocket Connection"]} variant="integrate" />

  <h3 id="ivr-configuration">IVR Configuration</h3>
  <p>Each template can define IVR settings that control how it appears in the menu:</p>

  <ConfigPanel title="IVR Template Settings" icon="📋" variant="integrate">
    <div class="space-y-3 text-sm">
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">ivr_greeting</span>
        <span class="text-foreground">TTS text for the menu option (e.g., "Press 1 for Sales")</span>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">ivr_goodbye</span>
        <span class="text-foreground">TTS message on timeout or invalid input</span>
      </div>
      <div class="flex items-baseline justify-between">
        <span class="text-muted-foreground">ivr_priority</span>
        <span class="text-foreground">Menu order — lower number = presented first</span>
      </div>
    </div>
  </ConfigPanel>

  <CodeBlock lang="json" filename="template-ivr-config.json" code={`{
  "ivr_greeting": "Press 1 for Sales support",
  "ivr_goodbye": "Thank you for calling. Goodbye.",
  "ivr_priority": 1
}`} />

  <Callout type="info" title="Agent-Side TTS">
    <p>IVR menu greetings are generated via TTS at runtime — no pre-recorded audio files needed. Update the greeting text in the template and changes take effect immediately.</p>
  </Callout>

  <!-- ───────── Business Hours ───────── -->
  <h2 id="business-hours">Business Hours</h2>
  <p>Inbound calls can be restricted to a daily time window. Calls outside business hours trigger the configured block action.</p>

  <ConfigPanel title="Business Hours Settings" icon="🕐" variant="integrate">
    <div class="space-y-3 text-sm">
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">inbound_call_start_time</span>
        <code class="text-violet-400">HH:MM (e.g., "09:00")</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">inbound_call_end_time</span>
        <code class="text-violet-400">HH:MM (e.g., "18:00")</code>
      </div>
      <div class="flex items-baseline justify-between">
        <span class="text-muted-foreground">inbound_call_timezone</span>
        <code class="text-violet-400">IANA timezone (e.g., "Asia/Kolkata")</code>
      </div>
    </div>
  </ConfigPanel>

  <CodeBlock lang="json" filename="business-hours.json" code={`{
  "inbound_call_start_time": "09:00",
  "inbound_call_end_time": "18:00",
  "inbound_call_timezone": "Asia/Kolkata"
}`} />

  <!-- ───────── Block Actions ───────── -->
  <h2 id="block-actions">Block Actions</h2>
  <p>When a call is blocked (outside business hours, no templates, or rate-limited), one of two actions is taken:</p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Action</th><th>Behavior</th><th>Configuration</th></tr></thead>
      <tbody>
        <tr><td><strong>REJECT</strong></td><td>Plays <code>inbound_block_message</code> via TTS, then hangs up</td><td><code>inbound_block_message</code> — the TTS message to play</td></tr>
        <tr><td><strong>REDIRECT</strong></td><td>Forwards the call to <code>inbound_redirect_number</code></td><td><code>inbound_redirect_number</code> — the fallback phone number</td></tr>
      </tbody>
    </table>
  </div>

  <ConfigPanel title="Block Action Configuration" icon="🚫" variant="integrate">
    <div class="space-y-3 text-sm">
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">inbound_block_action</span>
        <code class="text-violet-400">REJECT | REDIRECT</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">inbound_block_message</span>
        <span class="text-foreground">TTS message for REJECT action</span>
      </div>
      <div class="flex items-baseline justify-between">
        <span class="text-muted-foreground">inbound_redirect_number</span>
        <span class="text-foreground">Fallback number for REDIRECT action</span>
      </div>
    </div>
  </ConfigPanel>

  <CodeBlock lang="json" filename="block-action.json" code={`{
  "inbound_block_action": "REJECT",
  "inbound_block_message": "We are currently closed. Please call back during business hours.",
  "inbound_redirect_number": "+1234567890"
}`} />

  <Callout type="warning" title="Block Behavior Difference">
    <p>With <code>REJECT</code>, the customer hears the block message via TTS before the call ends. With <code>REDIRECT</code>, the call is forwarded immediately — no message is played.</p>
  </Callout>

  <!-- ───────── Rate Limiting ───────── -->
  <h2 id="rate-limiting">Rate Limiting</h2>
  <p>Inbound calls are subject to concurrency-based rate limiting to manage system capacity and prevent abuse. Limits are enforced per outbound number.</p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Aspect</th><th>Details</th></tr></thead>
      <tbody>
        <tr><td><strong>Scope</strong></td><td>Per outbound number — each number has its own counter</td></tr>
        <tr><td><strong>Tracking</strong></td><td>Redis-based counter with automatic expiry</td></tr>
        <tr><td><strong>Isolation</strong></td><td>Independent from outbound call concurrency limits</td></tr>
        <tr><td><strong>Exceeded behavior</strong></td><td>Block action is triggered (REJECT or REDIRECT)</td></tr>
      </tbody>
    </table>
  </div>

  <Callout type="info" title="Concurrency Independence">
    <p>Inbound rate limits are tracked separately from outbound call concurrency. A number can handle outbound campaigns and inbound calls simultaneously, each with independent limits.</p>
  </Callout>

  <!-- ───────── Inbound Settings Summary ───────── -->
  <h2 id="full-configuration">Full Inbound Configuration</h2>
  <p>Here is the complete set of inbound-related fields that can be configured at the template or number level:</p>

  <CodeBlock lang="json" filename="inbound-config-complete.json" code={`{
  "ivr_greeting": "Press 1 for Sales, Press 2 for Support",
  "ivr_goodbye": "No input received. Goodbye.",
  "ivr_priority": 1,
  "inbound_call_start_time": "09:00",
  "inbound_call_end_time": "18:00",
  "inbound_call_timezone": "Asia/Kolkata",
  "inbound_block_action": "REJECT",
  "inbound_block_message": "We are currently closed.",
  "inbound_redirect_number": "+1234567890"
}`} />
</div>
