<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ApiEndpoint from '$lib/components/ApiEndpoint.svelte';
</script>

<svelte:head><title>Configurations API — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Configurations API</h1>
  <p class="text-muted-foreground text-lg mb-8">Create, list, and update call execution configurations via the API.</p>

  <h2 id="overview">Overview</h2>
  <p>
    Call execution configurations define scheduling windows, retry logic, rate limiting,
    provider selection, inbound call rules, and pre-checks. Each configuration is scoped
    to a reseller and template combination. Use the API to manage these programmatically.
  </p>

  <h2 id="create-config">Create Configuration</h2>

  <ApiEndpoint method="POST" path="/configurations" />

  <h3 id="create-config-request">Request Body</h3>

  <CodeBlock lang="json" code={`{
  "reseller_id": "res_001",
  "template": "tpl_xyz789",
  "merchant_id": "mer_abc",
  "initial_offset": 0,
  "retry_offset": 3600,
  "call_start_time": "09:00",
  "call_end_time": "21:00",
  "max_retry": 3,
  "calling_provider": "TWILIO",
  "enable_calling": true,
  "enable_international_call": false,
  "enable_inbound": false,
  "enforce_blacklist": true,
  "rate_limit_enabled": true,
  "rate_limit_max_calls": 100,
  "rate_limit_window_seconds": 60,
  "rate_limit_whitelist": [],
  "pre_checks": []
}`} />

  <h3 id="create-config-response">Response</h3>

  <CodeBlock lang="json" code={`{
  "id": "cfg_abc123",
  "reseller_id": "res_001",
  "template": "tpl_xyz789",
  "merchant_id": "mer_abc",
  "calling_provider": "TWILIO",
  "enable_calling": true,
  "created_at": "2025-01-15T10:30:00Z"
}`} />

  <h2 id="list-configs">List Configurations</h2>

  <ApiEndpoint method="GET" path="/configurations" />

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Query Param</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>reseller_id</code></td><td><code>string</code></td><td>Filter configurations by reseller.</td></tr>
        <tr><td><code>template</code></td><td><code>string</code></td><td>Filter configurations by template ID.</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="update-config">Update Configuration</h2>

  <ApiEndpoint method="PUT" path="/configurations/{id}" />

  <h3 id="update-config-example">Example: Update Retry and Scheduling</h3>

  <CodeBlock lang="json" code={`{
  "id": "cfg_abc123",
  "reseller_id": "res_001",
  "template": "tpl_xyz789",
  "merchant_id": "mer_abc",
  "initial_offset": 0,
  "retry_offset": 1800,
  "call_start_time": "10:00",
  "call_end_time": "20:00",
  "max_retry": 5,
  "calling_provider": "TWILIO",
  "enable_calling": true,
  "enable_international_call": false,
  "enable_inbound": true,
  "inbound_call_start_time": "09:00",
  "inbound_call_end_time": "22:00",
  "inbound_call_timezone": "Asia/Kolkata",
  "inbound_block_action": "REDIRECT",
  "inbound_redirect_number": "+919999999999",
  "inbound_block_message": "We are currently closed. Redirecting you to support.",
  "enforce_blacklist": true,
  "rate_limit_enabled": true,
  "rate_limit_max_calls": 200,
  "rate_limit_window_seconds": 60,
  "rate_limit_whitelist": ["+911234567890"],
  "pre_checks": [
    {
      "name": "dnd_check",
      "type": "external_api",
      "enabled": true,
      "default_on_failure": "proceed"
    }
  ]
}`} />

  <Callout type="info" title="Full Reference">
    <p>For the complete list of <code>CallExecutionConfig</code> fields, see <a href="/docs/config/call-execution">Call Execution Configuration</a>.</p>
  </Callout>

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
        <tr><td><code>400</code></td><td>Bad Request</td><td>Invalid field values or missing required fields.</td></tr>
        <tr><td><code>404</code></td><td>Not Found</td><td>Configuration ID does not exist.</td></tr>
        <tr><td><code>409</code></td><td>Conflict</td><td>Duplicate reseller + template combination.</td></tr>
      </tbody>
    </table>
  </div>
</div>
