<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ApiEndpoint from '$lib/components/ApiEndpoint.svelte';
</script>

<svelte:head><title>Webhooks — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Webhooks</h1>
  <p class="text-muted-foreground text-lg mb-8">Inbound webhooks from telephony providers, outbound reporting webhooks, and event callbacks.</p>

  <!-- ────────── Inbound Webhooks ────────── -->

  <h2 id="inbound-webhooks">Inbound Webhooks (From Telephony Providers)</h2>
  <p>
    These endpoints are called by telephony providers (Twilio, Plivo, Exotel) during call
    lifecycle events. They are configured automatically when you set up a provider.
  </p>

  <h3 id="answer-webhook">Call Answered</h3>
  <ApiEndpoint method="POST" path="/{provider}/answer" />
  <p>Triggered when the callee picks up the phone. Initiates the voice pipeline for the call.</p>

  <h3 id="status-callback">Call Status Callback</h3>
  <ApiEndpoint method="POST" path="/{provider}/callback/status" />
  <p>Called when the call ends or fails. Updates the lead status and triggers post-call processing.</p>

  <h3 id="details-callback">Call Details Callback</h3>
  <ApiEndpoint method="POST" path="/{provider}/callback/details" />
  <p>Delivers the recording URL after the call has been recorded.</p>

  <h3 id="transfer-callbacks">Warm Transfer Callbacks</h3>
  <ApiEndpoint method="POST" path="/{provider}/callback/transfer/status" />
  <ApiEndpoint method="POST" path="/{provider}/callback/transfer/events" />
  <p>Status and event callbacks for warm transfer calls. Track the transfer progress and final outcome.</p>

  <Callout type="info" title="Provider Placeholder">
    <p>Replace <code>{`{provider}`}</code> with the actual provider name: <code>twilio</code>, <code>plivo</code>, or <code>exotel</code>.</p>
  </Callout>

  <!-- ────────── Outbound Webhooks ────────── -->

  <h2 id="outbound-webhooks">Outbound Webhooks (To External Systems)</h2>
  <p>
    Breeze Buddy sends webhook notifications to your systems at various points in the call lifecycle.
  </p>

  <h3 id="reporting-webhook">Reporting Webhook</h3>
  <p>
    The <code>reporting_webhook_url</code> specified in the lead payload is called after the call
    completes with the final outcome and call details.
  </p>

  <CodeBlock lang="json" code={`{
  "lead_id": "lead_abc123",
  "status": "COMPLETED",
  "outcome": "confirmed",
  "duration_seconds": 72,
  "transcription": [...],
  "scores": {
    "sentiment": 0.85,
    "task_completion": 1.0
  },
  "completed_at": "2025-01-15T10:36:15Z"
}`} />

  <h3 id="webhook-retry">Webhook Retry Logic</h3>
  <p>
    Outbound webhooks use exponential backoff retry on failure:
  </p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Attempt</th>
          <th>Delay</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>1st retry</td><td>2 seconds</td></tr>
        <tr><td>2nd retry</td><td>4 seconds</td></tr>
        <tr><td>3rd retry</td><td>8 seconds</td></tr>
        <tr><td>4th retry</td><td>16 seconds</td></tr>
        <tr><td>5th retry</td><td>32 seconds</td></tr>
      </tbody>
    </table>
  </div>

  <h3 id="service-callback">Service Callback</h3>
  <p>
    The <code>service_callback</code> is an end-of-conversation callback triggered when the voice
    pipeline finishes processing. Delivers the final conversation state to the configured endpoint.
  </p>

  <h3 id="hook-http-requests">Hook HTTP Requests</h3>
  <p>
    Templates can define HTTP request hooks on functions. When a function is triggered during
    conversation, its HTTP hook fires — enabling real-time CRM updates, database writes, or third-party API calls.
  </p>

  <CodeBlock lang="json" code={`{
  "hooks": [
    {
      "name": "update_crm",
      "http_request": {
        "url": "https://your-crm.com/api/update",
        "method": "POST",
        "headers": { "Authorization": "Bearer {crm_token}" },
        "body": {
          "lead_id": "{lead_id}",
          "outcome": "{outcome}"
        }
      }
    }
  ]
}`} />

  <Callout type="tip" title="Variable Substitution">
    <p>Hook HTTP request bodies support variable substitution using <code>{`{variable_name}`}</code> syntax. See <a href="/docs/templates/variables">Variable Substitution</a> for details.</p>
  </Callout>

  <h2 id="devcycle-webhooks">DevCycle Webhooks</h2>
  <p>
    Breeze Buddy integrates with <strong>DevCycle</strong> for feature flag management.
    DevCycle sends webhook notifications when feature flags are updated, allowing the
    system to react to configuration changes in real time.
  </p>

  <h2 id="error-responses">Error Responses</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Status</th>
          <th>Meaning</th>
          <th>Common Cause</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>400</code></td><td>Bad Request</td><td>Malformed webhook payload from provider.</td></tr>
        <tr><td><code>404</code></td><td>Not Found</td><td>Lead or call session not found for the callback.</td></tr>
        <tr><td><code>500</code></td><td>Server Error</td><td>Internal processing error during webhook handling.</td></tr>
      </tbody>
    </table>
  </div>
</div>
