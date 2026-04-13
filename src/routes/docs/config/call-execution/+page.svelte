<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
</script>

<svelte:head><title>Call Execution Configuration — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Call Execution Configuration</h1>
  <p class="text-muted-foreground text-lg mb-8">Complete reference for <code>CallExecutionConfig</code> — scheduling, retries, providers, rate limiting, inbound rules, and pre-checks.</p>

  <h2 id="overview">Overview</h2>
  <p>
    The <code>CallExecutionConfig</code> controls how outbound and inbound calls are executed.
    It defines the calling provider, retry logic, scheduling windows, rate limits, blacklist
    enforcement, inbound call behavior, and pre-call checks.
  </p>

  <h2 id="fields-reference">Fields Reference</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>id</code></td><td><code>str</code></td><td>—</td><td>Unique identifier for this call execution config.</td></tr>
        <tr><td><code>reseller_id</code></td><td><code>str</code></td><td>—</td><td>Reseller identifier.</td></tr>
        <tr><td><code>template</code></td><td><code>str</code></td><td>—</td><td>Template ID this config is associated with.</td></tr>
        <tr><td><code>merchant_id</code></td><td><code>str</code></td><td>—</td><td>Merchant identifier.</td></tr>
        <tr><td><code>initial_offset</code></td><td><code>int</code></td><td>—</td><td>Delay in seconds before the first call attempt starts.</td></tr>
        <tr><td><code>retry_offset</code></td><td><code>int</code></td><td>—</td><td>Delay in seconds between retry attempts.</td></tr>
        <tr><td><code>call_start_time</code></td><td><code>time</code></td><td>—</td><td>Earliest time of day calls can be placed (24h format, e.g. <code>09:00</code>).</td></tr>
        <tr><td><code>call_end_time</code></td><td><code>time</code></td><td>—</td><td>Latest time of day calls can be placed (24h format, e.g. <code>21:00</code>).</td></tr>
        <tr><td><code>max_retry</code></td><td><code>int</code></td><td>—</td><td>Maximum number of retry attempts for failed/unanswered calls.</td></tr>
        <tr><td><code>calling_provider</code></td><td><code>CallProvider</code></td><td>—</td><td>Telephony provider: <code>TWILIO</code>, <code>EXOTEL</code>, or <code>PLIVO</code>.</td></tr>
        <tr><td><code>enable_calling</code></td><td><code>bool</code></td><td>—</td><td>Master switch to enable or disable outbound calling.</td></tr>
        <tr><td><code>enable_international_call</code></td><td><code>bool</code></td><td>—</td><td>Allow calls to international numbers.</td></tr>
        <tr><td><code>enable_inbound</code></td><td><code>bool</code></td><td>—</td><td>Accept inbound calls on this configuration.</td></tr>
        <tr><td><code>inbound_call_start_time</code></td><td><code>Optional[time]</code></td><td><code>null</code></td><td>Earliest time to accept inbound calls.</td></tr>
        <tr><td><code>inbound_call_end_time</code></td><td><code>Optional[time]</code></td><td><code>null</code></td><td>Latest time to accept inbound calls.</td></tr>
        <tr><td><code>inbound_call_timezone</code></td><td><code>Optional[str]</code></td><td><code>null</code></td><td>Timezone for inbound calling hours (e.g. <code>Asia/Kolkata</code>).</td></tr>
        <tr><td><code>inbound_block_action</code></td><td><code>InboundBlockAction</code></td><td>—</td><td>Action when inbound call is outside hours: <code>REJECT</code> or <code>REDIRECT</code>.</td></tr>
        <tr><td><code>inbound_redirect_number</code></td><td><code>Optional[str]</code></td><td><code>null</code></td><td>Phone number to redirect blocked inbound calls to (when action is <code>REDIRECT</code>).</td></tr>
        <tr><td><code>inbound_block_message</code></td><td><code>Optional[str]</code></td><td><code>null</code></td><td>Message played before rejecting/redirecting an inbound call.</td></tr>
        <tr><td><code>enforce_blacklist</code></td><td><code>bool</code></td><td>—</td><td>Block calls to numbers in the blacklist.</td></tr>
        <tr><td><code>rate_limit_enabled</code></td><td><code>bool</code></td><td>—</td><td>Enable rate limiting on outbound calls.</td></tr>
        <tr><td><code>rate_limit_max_calls</code></td><td><code>int</code></td><td>—</td><td>Maximum number of calls allowed in the rate limit window.</td></tr>
        <tr><td><code>rate_limit_window_seconds</code></td><td><code>int</code></td><td>—</td><td>Duration of the rate limit window in seconds.</td></tr>
        <tr><td><code>rate_limit_whitelist</code></td><td><code>List[str]</code></td><td>—</td><td>Phone numbers exempt from rate limiting.</td></tr>
        <tr><td><code>pre_checks</code></td><td><code>Optional[List[PreCheckConfig]]</code></td><td><code>null</code></td><td>Pre-call validation checks (e.g. DND check, balance check).</td></tr>
        <tr><td><code>telephony_config</code></td><td><code>Optional[TelephonyConfig]</code></td><td><code>null</code></td><td>Provider-specific telephony settings (SID, auth, numbers).</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="calling-provider">Calling Provider</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Provider</th><th>Value</th><th>Regions</th></tr>
      </thead>
      <tbody>
        <tr><td>Twilio</td><td><code>TWILIO</code></td><td>Global</td></tr>
        <tr><td>Exotel</td><td><code>EXOTEL</code></td><td>India, SEA</td></tr>
        <tr><td>Plivo</td><td><code>PLIVO</code></td><td>Global</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="scheduling">Call Scheduling</h2>
  <p>
    Outbound calls are only placed between <code>call_start_time</code> and
    <code>call_end_time</code>. The <code>initial_offset</code> adds a delay before the
    first attempt, and <code>retry_offset</code> spaces out retries.
  </p>

  <CodeBlock lang="json" code={`{
  "call_start_time": "09:00",
  "call_end_time": "21:00",
  "initial_offset": 0,
  "retry_offset": 300,
  "max_retry": 3
}`} />

  <Callout type="info" title="Timezone">
    <p>Outbound call times are evaluated against the server timezone. Inbound call times use <code>inbound_call_timezone</code> when specified.</p>
  </Callout>

  <h2 id="inbound-configuration">Inbound Call Configuration</h2>
  <p>
    When <code>enable_inbound</code> is <code>true</code>, the system accepts incoming calls.
    You can restrict inbound hours and define what happens when a call arrives outside the window.
  </p>

  <h3 id="inbound-block-actions">InboundBlockAction</h3>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Action</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>REJECT</code></td><td>Reject the call. Optionally play <code>inbound_block_message</code> before hanging up.</td></tr>
        <tr><td><code>REDIRECT</code></td><td>Redirect the call to <code>inbound_redirect_number</code>. Optionally play message first.</td></tr>
      </tbody>
    </table>
  </div>

  <CodeBlock lang="json" code={`{
  "enable_inbound": true,
  "inbound_call_start_time": "08:00",
  "inbound_call_end_time": "22:00",
  "inbound_call_timezone": "Asia/Kolkata",
  "inbound_block_action": "REDIRECT",
  "inbound_redirect_number": "+919876543210",
  "inbound_block_message": "We are currently outside business hours. Redirecting you to our support line."
}`} />

  <h2 id="rate-limiting">Rate Limiting</h2>
  <p>
    Prevent excessive outbound calls by configuring rate limits. Calls exceeding the limit
    within the window are queued or dropped.
  </p>

  <CodeBlock lang="json" code={`{
  "rate_limit_enabled": true,
  "rate_limit_max_calls": 100,
  "rate_limit_window_seconds": 60,
  "rate_limit_whitelist": ["+919999999999"]
}`} />

  <Callout type="warning" title="Whitelist">
    <p>Numbers in <code>rate_limit_whitelist</code> bypass rate limiting entirely. Use this sparingly — typically for internal test numbers or VIP contacts.</p>
  </Callout>

  <h2 id="pre-checks">Pre-Checks</h2>
  <p>
    The <code>pre_checks</code> array defines validations that run before a call is placed.
    If any check fails, the call is not attempted.
  </p>

  <CodeBlock lang="json" code={`{
  "pre_checks": [
    {
      "type": "dnd_check",
      "enabled": true
    },
    {
      "type": "balance_check",
      "enabled": true,
      "min_balance": 10.0
    }
  ]
}`} />

  <h2 id="full-example">Full JSON Example</h2>

  <CodeBlock lang="json" code={`{
  "id": "exec-config-001",
  "reseller_id": "reseller-abc",
  "template": "template-xyz",
  "merchant_id": "merchant-123",
  "initial_offset": 0,
  "retry_offset": 300,
  "call_start_time": "09:00",
  "call_end_time": "21:00",
  "max_retry": 3,
  "calling_provider": "TWILIO",
  "enable_calling": true,
  "enable_international_call": false,
  "enable_inbound": true,
  "inbound_call_start_time": "08:00",
  "inbound_call_end_time": "22:00",
  "inbound_call_timezone": "Asia/Kolkata",
  "inbound_block_action": "REDIRECT",
  "inbound_redirect_number": "+919876543210",
  "inbound_block_message": "We are outside business hours. Redirecting you now.",
  "enforce_blacklist": true,
  "rate_limit_enabled": true,
  "rate_limit_max_calls": 100,
  "rate_limit_window_seconds": 60,
  "rate_limit_whitelist": ["+919999999999"],
  "pre_checks": [
    {
      "type": "dnd_check",
      "enabled": true
    }
  ],
  "telephony_config": {
    "account_sid": "AC...",
    "auth_token": "...",
    "from_number": "+14155551234"
  }
}`} />

  <Callout type="danger" title="enable_calling is a master switch">
    <p>Setting <code>enable_calling</code> to <code>false</code> stops ALL outbound calls for this config, regardless of other settings. Use this to quickly pause campaigns without modifying other fields.</p>
  </Callout>
</div>
