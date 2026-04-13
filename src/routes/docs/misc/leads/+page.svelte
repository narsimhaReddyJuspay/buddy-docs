<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ApiEndpoint from '$lib/components/ApiEndpoint.svelte';
</script>

<svelte:head><title>Leads API — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Leads API</h1>
  <p class="text-muted-foreground text-lg mb-8">Push leads for <a href="/docs/telephony/overview">outbound calling</a>, retrieve call details, cancel pending leads, and download <a href="/docs/daily/recording">recordings</a>.</p>

  <h2 id="push-lead">Push Lead</h2>
  <p>Submit a new lead for the voice agent to call. The lead enters the execution pipeline based on the template's <a href="/docs/config/call-execution">call execution configuration</a>.</p>

  <ApiEndpoint method="POST" path="/push/lead/v2" />

  <h3 id="push-lead-request">Request Body</h3>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Required</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>request_id</code></td><td><code>string</code></td><td>Yes</td><td>Idempotency key — duplicate <code>request_id</code> values are rejected.</td></tr>
        <tr><td><code>payload</code></td><td><code>object</code></td><td>Yes</td><td>Key-value pairs for variable substitution in prompts (e.g. <code>customer_name</code>, <code>phone_number</code>).</td></tr>
        <tr><td><code>template</code></td><td><code>object</code></td><td>No*</td><td>Inline template definition. Mutually exclusive with <code>template_id</code>.</td></tr>
        <tr><td><code>template_id</code></td><td><code>string</code></td><td>No*</td><td>Reference to an existing template. Mutually exclusive with <code>template</code>.</td></tr>
        <tr><td><code>reseller_id</code></td><td><code>string</code></td><td>Yes</td><td>Reseller identifier.</td></tr>
        <tr><td><code>merchant_id</code></td><td><code>string</code></td><td>Yes</td><td>Merchant identifier.</td></tr>
        <tr><td><code>reporting_webhook_url</code></td><td><code>string</code></td><td>No</td><td>URL to receive the call outcome webhook after completion.</td></tr>
        <tr><td><code>execution_mode</code></td><td><code>string</code></td><td>No</td><td>Execution mode: <code>TELEPHONY</code>, <code>DAILY</code>, <code>DAILY_TEST</code>.</td></tr>
        <tr><td><code>is_playground</code></td><td><code>bool</code></td><td>No</td><td>Mark as playground/test lead — excluded from analytics.</td></tr>
        <tr><td><code>configurations_override</code></td><td><code>object</code></td><td>No</td><td>Override specific call execution config fields for this lead.</td></tr>
      </tbody>
    </table>
  </div>

  <Callout type="info" title="Template Resolution">
    <p>Provide either <code>template</code> (inline) or <code>template_id</code> (reference) — not both. If neither is provided, the request will fail.</p>
  </Callout>

  <h3 id="push-lead-example">Example Request</h3>

  <CodeBlock lang="json" code={`{
  "request_id": "req_unique_001",
  "payload": {
    "phone_number": "+919876543210",
    "customer_name": "Rahul Sharma",
    "appointment_date": "2025-02-01",
    "appointment_time": "10:00 AM"
  },
  "template_id": "tpl_xyz789",
  "reseller_id": "res_001",
  "merchant_id": "mer_abc",
  "reporting_webhook_url": "https://your-server.com/webhooks/breeze",
  "execution_mode": "TELEPHONY"
}`} />

  <h3 id="push-lead-response">Response</h3>

  <CodeBlock lang="json" code={`{
  "lead_id": "lead_abc123",
  "request_id": "req_unique_001",
  "status": "BACKLOG",
  "created_at": "2025-01-15T10:30:00Z"
}`} />

  <h2 id="get-lead">Get Lead Details</h2>
  <p>Retrieve full details for a lead including transcription, outcome, timing, and quality scores.</p>

  <ApiEndpoint method="GET" path="/leads/{id}" />

  <h3 id="get-lead-response">Response</h3>

  <CodeBlock lang="json" code={`{
  "id": "lead_abc123",
  "status": "COMPLETED",
  "outcome": "confirmed",
  "phone_number": "+919876543210",
  "transcription": [
    { "role": "assistant", "content": "Hello Rahul! I'm calling about your appointment on February 1st at 10 AM. Can you confirm?" },
    { "role": "user", "content": "Yes, that works for me." },
    { "role": "assistant", "content": "Great, your appointment is confirmed. Have a nice day!" }
  ],
  "timing": {
    "call_start": "2025-01-15T10:35:00Z",
    "call_end": "2025-01-15T10:36:12Z",
    "duration_seconds": 72
  },
  "scores": {
    "sentiment": 0.85,
    "task_completion": 1.0
  },
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:36:15Z"
}`} />

  <h2 id="cancel-leads">Cancel Leads</h2>
  <p>Cancel one or more leads that are still in a pending state. Leads that are already in-progress or completed cannot be cancelled.</p>

  <ApiEndpoint method="POST" path="/leads/cancel" />

  <h3 id="cancel-request">Request Body</h3>

  <CodeBlock lang="json" code={`{
  "lead_ids": [
    "lead_abc123",
    "lead_def456",
    "lead_ghi789"
  ]
}`} />

  <h3 id="cancel-response">Response</h3>

  <CodeBlock lang="json" code={`{
  "cancelled": ["lead_abc123", "lead_def456"],
  "failed": [
    { "lead_id": "lead_ghi789", "reason": "Lead is already in progress" }
  ]
}`} />

  <h2 id="download-recording">Download Recording</h2>
  <p>Download the call recording for a completed lead. Returns the audio file directly.</p>

  <ApiEndpoint method="GET" path="/leads/{id}/recording" />

  <Callout type="info" title="Recording Availability">
    <p>Recordings are available only after the call is completed and the recording has been processed. This may take a few seconds after the call ends.</p>
  </Callout>

  <h2 id="lead-statuses">Lead Statuses</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Status</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>BACKLOG</code></td><td>Lead is queued and waiting to be called.</td></tr>
        <tr><td><code>IN_PROGRESS</code></td><td>Call is currently active.</td></tr>
        <tr><td><code>COMPLETED</code></td><td>Call finished successfully.</td></tr>
        <tr><td><code>FAILED</code></td><td>Call failed (unreachable, provider error, etc.).</td></tr>
        <tr><td><code>CANCELLED</code></td><td>Lead was cancelled before execution.</td></tr>
        <tr><td><code>RETRY</code></td><td>Scheduled for retry after a failed attempt.</td></tr>
      </tbody>
    </table>
  </div>

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
        <tr><td><code>400</code></td><td>Bad Request</td><td>Missing required fields or both <code>template</code> and <code>template_id</code> provided.</td></tr>
        <tr><td><code>404</code></td><td>Not Found</td><td>Lead or template ID does not exist.</td></tr>
        <tr><td><code>409</code></td><td>Conflict</td><td>Duplicate <code>request_id</code>.</td></tr>
      </tbody>
    </table>
  </div>
</div>
