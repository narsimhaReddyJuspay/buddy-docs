<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
</script>

<svelte:head><title>IVR Routing — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>IVR Routing</h1>
  <p class="text-muted-foreground text-lg mb-8">Route <a href="/docs/telephony/inbound">inbound calls</a> to the right voice agent when multiple <a href="/docs/templates/overview">templates</a> share a single phone number.</p>

  <h2 id="overview">Overview</h2>
  <p>
    When multiple templates are configured for inbound calls on the same phone number, Breeze Buddy
    uses an IVR (Interactive Voice Response) system to let the caller choose which agent they want
    to interact with. The IVR agent speaks a menu based on each template's configuration, and the
    caller's choice routes them to the correct voice agent.
  </p>

  <h2 id="how-it-works">How It Works</h2>
  <ol>
    <li>A customer calls the inbound phone number.</li>
    <li>The system resolves all templates associated with that number.</li>
    <li>If only one template is found, the call is routed directly — no IVR menu is played.</li>
    <li>If multiple templates are found, an IVR agent is created that speaks a menu of options.</li>
    <li>The IVR agent plays each template's <code>ivr_greeting</code> in order of <code>ivr_priority</code>.</li>
    <li>The caller responds with their selection via speech (WebSocket-based selection).</li>
    <li>The call is transferred to the selected template's voice agent.</li>
  </ol>

  <h2 id="ivr-fields">IVR Configuration Fields</h2>
  <p>These fields are set on the template level:</p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>ivr_greeting</code></td><td><code>string</code></td><td>Full TTS text for this template's menu option. Spoken by the IVR agent.</td></tr>
        <tr><td><code>ivr_goodbye</code></td><td><code>string</code></td><td>Message played when the caller does not provide any input.</td></tr>
        <tr><td><code>ivr_priority</code></td><td><code>int</code></td><td>Ordering in the IVR menu. Lower numbers are spoken first. Must be <code>&gt;= 1</code>.</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="example">Configuration Example</h2>
  <p>Two templates sharing the same inbound number:</p>

  <CodeBlock lang="json" code={`[
  {
    "name": "sales-agent",
    "ivr_greeting": "Press 1 or say Sales to speak with our sales team.",
    "ivr_goodbye": "We didn't catch your selection. Please try calling again.",
    "ivr_priority": 1
  },
  {
    "name": "support-agent",
    "ivr_greeting": "Press 2 or say Support to reach customer support.",
    "ivr_goodbye": "No selection received. Goodbye.",
    "ivr_priority": 2
  }
]`} />

  <h3 id="resulting-menu">Resulting IVR Menu</h3>
  <p>When a caller dials in, the IVR agent would speak:</p>

  <Callout type="tip" title="Example Greeting">
    <p>"Welcome! Press 1 or say Sales to speak with our sales team. Press 2 or say Support to reach customer support."</p>
  </Callout>

  <h2 id="selection-mechanism">Selection Mechanism</h2>
  <p>
    The IVR agent listens for the caller's response via the same STT pipeline used by regular
    voice agents. The selection is processed over a WebSocket connection — the system matches
    the caller's speech to the available template options and routes accordingly.
  </p>

  <h2 id="no-input-handling">No-Input Handling</h2>
  <p>
    If the caller does not respond within the idle timeout, the IVR agent plays the
    <code>ivr_goodbye</code> message from the highest-priority template and ends the call.
  </p>

  <h2 id="single-template">Single Template (No IVR)</h2>

  <Callout type="info" title="Automatic Bypass">
    <p>When only one template is configured for the inbound number, the IVR menu is skipped entirely and the caller is connected directly to the voice agent.</p>
  </Callout>
</div>
