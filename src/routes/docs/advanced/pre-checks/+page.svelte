<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ApiEndpoint from '$lib/components/ApiEndpoint.svelte';
</script>

<svelte:head><title>Pre-Checks — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Pre-Checks</h1>
  <p class="text-muted-foreground text-lg mb-8">Run external API validations before placing a call — DND checks, balance verification, and custom gates.</p>

  <h2 id="overview">Overview</h2>
  <p>
    Pre-checks are validation steps executed <strong>before</strong> a call is placed. They allow
    you to call an external API and conditionally skip the call based on the response. Pre-checks
    are configured on the <code>CallExecutionConfig</code> via the <code>pre_checks</code> array.
  </p>

  <h2 id="pre-check-config">PreCheckConfig</h2>

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
        <tr><td><code>name</code></td><td><code>string</code></td><td>Human-readable name for the pre-check (e.g. <code>"dnd_check"</code>).</td></tr>
        <tr><td><code>type</code></td><td><code>string</code></td><td>Pre-check type. Currently only <code>"external_api"</code> is supported.</td></tr>
        <tr><td><code>enabled</code></td><td><code>bool</code></td><td>Whether this pre-check is active.</td></tr>
        <tr><td><code>credential_id</code></td><td><code>string</code></td><td>Reference to stored credentials for the external API.</td></tr>
        <tr><td><code>http_request</code></td><td><code>PreCheckHttpRequest</code></td><td>The HTTP request to execute.</td></tr>
        <tr><td><code>response_config</code></td><td><code>PreCheckResponseConfig</code></td><td>How to interpret the API response.</td></tr>
        <tr><td><code>default_on_failure</code></td><td><code>string</code></td><td>Behavior when the API call fails: <code>"proceed"</code> or <code>"skip"</code>.</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="http-request">PreCheckHttpRequest</h2>

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
        <tr><td><code>url</code></td><td><code>string</code></td><td>The URL to call. Supports variable substitution.</td></tr>
        <tr><td><code>method</code></td><td><code>string</code></td><td>HTTP method (<code>GET</code>, <code>POST</code>).</td></tr>
        <tr><td><code>headers</code></td><td><code>object</code></td><td>Request headers.</td></tr>
        <tr><td><code>body</code></td><td><code>object</code></td><td>Request body (for POST requests).</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="response-config">PreCheckResponseConfig</h2>
  <p>
    The response config defines how to evaluate the external API's response to decide whether the
    call should proceed or be skipped.
  </p>

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
        <tr><td><code>response_field</code></td><td><code>string</code></td><td>JSON path to the field to evaluate in the response (e.g. <code>"data.is_dnd"</code>).</td></tr>
        <tr><td><code>response_field_value</code></td><td><code>string</code></td><td>Expected value. If the field matches this value, the call is <strong>skipped</strong>.</td></tr>
      </tbody>
    </table>
  </div>

  <Callout type="info" title="Matching Logic">
    <p>If <code>response_field</code> in the API response equals <code>response_field_value</code>, the lead is skipped. Otherwise, the call proceeds.</p>
  </Callout>

  <h2 id="failure-behavior">Failure Behavior</h2>
  <p>
    The <code>default_on_failure</code> field controls what happens when the external API is
    unreachable, times out, or returns an error:
  </p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Value</th>
          <th>Behavior</th>
          <th>Pattern</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>proceed</code></td><td>Continue with the call even if the pre-check fails.</td><td>Fail-open</td></tr>
        <tr><td><code>skip</code></td><td>Skip the call if the pre-check cannot be completed.</td><td>Fail-closed</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="use-case-dnd">Use Case: DND Check</h2>
  <p>
    A common pre-check is verifying that the phone number is not on a Do Not Disturb (DND) registry
    before placing the call. This avoids calling numbers that have opted out.
  </p>

  <h3 id="dnd-example">Full Example</h3>

  <CodeBlock lang="json" code={`{
  "pre_checks": [
    {
      "name": "dnd_check",
      "type": "external_api",
      "enabled": true,
      "credential_id": "cred_dnd_provider",
      "http_request": {
        "url": "https://dnd-api.example.com/check",
        "method": "POST",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer {dnd_api_key}"
        },
        "body": {
          "phone_number": "{phone_number}"
        }
      },
      "response_config": {
        "response_field": "data.is_dnd",
        "response_field_value": "true"
      },
      "default_on_failure": "proceed"
    }
  ]
}`} />

  <Callout type="tip" title="Variable Substitution">
    <p>Pre-check HTTP requests support variable substitution from the lead payload. <code>{`{phone_number}`}</code> is replaced with the lead's actual phone number at runtime.</p>
  </Callout>

  <h2 id="multiple-pre-checks">Multiple Pre-Checks</h2>
  <p>
    You can configure multiple pre-checks in the array. They are executed sequentially — if any
    pre-check results in a skip decision, the call is not placed and subsequent checks are not run.
  </p>
</div>
