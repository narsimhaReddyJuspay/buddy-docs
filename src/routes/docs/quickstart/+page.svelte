<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ApiEndpoint from '$lib/components/ApiEndpoint.svelte';
</script>

<svelte:head><title>Quick Start — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Quick Start</h1>
  <p class="text-muted-foreground text-lg mb-8">Get a voice agent running in under 5 minutes.</p>

  <Callout type="info" title="Prerequisites">
    <p>You'll need an <a href="/docs/auth/overview">authenticated API token</a> and a deployed Breeze Buddy backend. See <a href="/docs/architecture">Architecture</a> for an overview of how the platform fits together.</p>
  </Callout>

  <!-- ───────── Step 1 ───────── -->
  <h2 id="step-1-create-template">Step 1 — Create a Template</h2>
  <p>
    A <a href="/docs/templates/overview">template</a> is the JSON blueprint that defines your agent's conversation flow — nodes, transitions, functions, hooks, and provider config.
    Here's a minimal appointment-reminder template (key fields only — see <a href="/docs/templates/overview">Templates Overview</a> for the full schema):
  </p>

  <ApiEndpoint method="POST" path="/agent/voice/breeze-buddy/templates" />

  <CodeBlock lang="json" code={`{
  "name": "appointment-reminder",
  "flow": {
    "initial_node": "greeting",
    "nodes": [
      {
        "node_name": "greeting",
        "task_messages": [
          { "role": "system", "content": "Greet the customer and confirm their appointment on {appointment_date} at {appointment_time}." }
        ],
        "functions": [
          { "name": "appointment_confirmed", "transition_to": "farewell" },
          { "name": "appointment_rescheduled", "transition_to": "farewell",
            "properties": { "new_date": { "type": "string" } } }
        ]
      },
      {
        "node_name": "farewell",
        "task_messages": [
          { "role": "system", "content": "Thank the customer and say goodbye." }
        ],
        "functions": [
          { "name": "end_call", "transition_to": null }
        ]
      }
    ]
  },
  "configurations": {
    "initial_greeting": "Hi {customer_name}, this is Breeze calling about your appointment.",
    "tts_voice_name": "rhea",
    "stt_configuration": { "provider": "deepgram", "language": "en" }
  }
}`} />

  <p class="text-sm text-muted-foreground">
    Nodes define conversation stages; functions define exit transitions. Learn more about
    <a href="/docs/templates/nodes">flow nodes</a>,
    <a href="/docs/templates/functions">functions &amp; hooks</a>, and
    <a href="/docs/templates/variables">variables</a>.
  </p>

  <!-- ───────── Step 2 ───────── -->
  <h2 id="step-2-configure-execution">Step 2 — Configure Call Execution</h2>
  <p>
    A <a href="/docs/config/template-config">configuration</a> binds a template to a telephony provider, calling window, and retry policy.
    See <a href="/docs/config/configurations-api">Configurations API</a> for all available fields.
  </p>

  <ApiEndpoint method="POST" path="/agent/voice/breeze-buddy/configurations" />

  <CodeBlock lang="json" code={`{
  "reseller_id": "your-reseller-id",
  "template": "appointment-reminder",
  "calling_provider": "TWILIO",
  "call_start_time": "09:00:00",
  "call_end_time": "18:00:00",
  "max_retry": 2,
  "retry_offset": 3600,
  "enable_calling": true
}`} />

  <p class="text-sm text-muted-foreground">
    Supported providers: <a href="/docs/telephony/twilio">Twilio</a>, <a href="/docs/telephony/plivo">Plivo</a>, <a href="/docs/telephony/exotel">Exotel</a>.
    For inbound call setup see <a href="/docs/telephony/inbound">Inbound Calls</a>.
  </p>

  <!-- ───────── Step 3 ───────── -->
  <h2 id="step-3-push-lead">Step 3 — Push a Lead</h2>
  <p>
    A lead represents a single call to be made. Push it with the template name and a payload containing the dynamic variables referenced in your template.
    See <a href="/docs/misc/leads">Leads API</a> for bulk operations and status tracking.
  </p>

  <ApiEndpoint method="POST" path="/agent/voice/breeze-buddy/push/lead/v2" />

  <CodeBlock lang="json" code={`{
  "request_id": "unique-request-123",
  "template": "appointment-reminder",
  "reseller_id": "your-reseller-id",
  "execution_mode": "TELEPHONY",
  "payload": {
    "customer_name": "John",
    "customer_phone": "+14155551234",
    "appointment_date": "April 15, 2026",
    "appointment_time": "2:30 PM"
  }
}`} />

  <Callout type="tip" title="Test without a phone call">
    <p>Set <code>execution_mode</code> to <code>"DAILY_TEST"</code> to test in the browser via <a href="/docs/daily/overview">Daily WebRTC</a>. Connect using the <a href="/docs/daily/connect-api"><code>/daily/connect</code></a> endpoint — no telephony provider required.</p>
  </Callout>

  <!-- ───────── Step 4 ───────── -->
  <h2 id="step-4-monitor">Step 4 — Monitor</h2>
  <p>Check the lead status and retrieve the recording after the call:</p>

  <ApiEndpoint method="GET" path="/agent/voice/breeze-buddy/leads/{'{lead_id}'}" />

  <p>
    The response includes status, outcome, transcription, call timing, and
    <a href="https://langfuse.com" target="_blank" rel="noopener">Langfuse</a> scores.
    Set up <a href="/docs/misc/webhooks">webhooks</a> for real-time notifications, or query the
    <a href="/docs/misc/analytics">Analytics API</a> for aggregate reporting.
    For full observability see <a href="/docs/advanced/observability">Observability &amp; Tracing</a>.
  </p>

  <!-- ───────── Next Steps ───────── -->
  <h2 id="next-steps">Next Steps</h2>
  <div class="grid sm:grid-cols-2 gap-4 not-prose mt-4">
    <a href="/docs/templates/overview" class="group rounded-xl border border-border p-5 hover:border-primary/40 transition-colors">
      <h3 class="text-base font-semibold text-foreground group-hover:text-primary transition-colors">Template System</h3>
      <p class="text-sm text-muted-foreground mt-1">Deep dive into nodes, functions, hooks, and variables.</p>
    </a>
    <a href="/docs/telephony/overview" class="group rounded-xl border border-border p-5 hover:border-primary/40 transition-colors">
      <h3 class="text-base font-semibold text-foreground group-hover:text-primary transition-colors">Telephony</h3>
      <p class="text-sm text-muted-foreground mt-1">Twilio, Plivo, Exotel — outbound &amp; inbound call flows.</p>
    </a>
    <a href="/docs/daily/overview" class="group rounded-xl border border-border p-5 hover:border-primary/40 transition-colors">
      <h3 class="text-base font-semibold text-foreground group-hover:text-primary transition-colors">Daily WebRTC</h3>
      <p class="text-sm text-muted-foreground mt-1">Browser-based voice sessions with sub-second latency.</p>
    </a>
    <a href="/docs/config/template-config" class="group rounded-xl border border-border p-5 hover:border-primary/40 transition-colors">
      <h3 class="text-base font-semibold text-foreground group-hover:text-primary transition-colors">Configuration</h3>
      <p class="text-sm text-muted-foreground mt-1">STT, TTS, LLM, VAD, retry, and calling window settings.</p>
    </a>
  </div>
</div>
