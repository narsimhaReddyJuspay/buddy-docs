<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ApiEndpoint from '$lib/components/ApiEndpoint.svelte';
</script>

<svelte:head><title>Numbers &amp; Merchants — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Numbers &amp; Merchants</h1>
  <p class="text-muted-foreground text-lg mb-8">Manage outbound phone numbers, merchant records, and phone number blacklists.</p>

  <!-- ───── Outbound Numbers ───── -->

  <h2 id="outbound-numbers">Outbound Numbers</h2>
  <p>Outbound numbers are the caller IDs used when placing calls. Each number is associated with a telephony provider and has a status indicating availability.</p>

  <h3 id="outbound-number-fields">OutboundNumber Fields</h3>

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
        <tr><td><code>phone_number</code></td><td><code>string</code></td><td>E.164 formatted phone number.</td></tr>
        <tr><td><code>provider</code></td><td><code>string</code></td><td>Telephony provider: <code>TWILIO</code>, <code>EXOTEL</code>, or <code>PLIVO</code>.</td></tr>
        <tr><td><code>status</code></td><td><code>string</code></td><td>Current status: <code>AVAILABLE</code>, <code>IN_USE</code>, or <code>DISABLED</code>.</td></tr>
        <tr><td><code>channel</code></td><td><code>string</code></td><td>Channel type (e.g. <code>voice</code>).</td></tr>
      </tbody>
    </table>
  </div>

  <h3 id="create-number">Create Number</h3>
  <ApiEndpoint method="POST" path="/numbers" />

  <CodeBlock lang="json" code={`{
  "phone_number": "+14155551234",
  "provider": "TWILIO",
  "status": "AVAILABLE",
  "channel": "voice"
}`} />

  <h3 id="list-numbers">List Numbers</h3>
  <ApiEndpoint method="GET" path="/numbers" />

  <h3 id="update-number">Update Number</h3>
  <ApiEndpoint method="PUT" path="/numbers/{id}" />

  <h3 id="delete-number">Delete Number</h3>
  <ApiEndpoint method="DELETE" path="/numbers/{id}" />

  <Callout type="warning" title="In-Use Numbers">
    <p>Numbers with status <code>IN_USE</code> are currently assigned to active call sessions. Avoid deleting or disabling them mid-call.</p>
  </Callout>

  <!-- ───── Merchants ───── -->

  <h2 id="merchants">Merchants</h2>
  <p>Merchants represent business entities under a reseller. Templates and leads are scoped to a merchant.</p>

  <h3 id="create-merchant">Create Merchant</h3>
  <ApiEndpoint method="POST" path="/merchants" />

  <CodeBlock lang="json" code={`{
  "name": "Acme Corp",
  "reseller_id": "res_001",
  "contact_email": "ops@acme.com"
}`} />

  <h3 id="list-merchants">List Merchants</h3>
  <ApiEndpoint method="GET" path="/merchants" />

  <h3 id="update-merchant">Update Merchant</h3>
  <ApiEndpoint method="PUT" path="/merchants/{id}" />

  <h3 id="delete-merchant">Delete Merchant</h3>
  <ApiEndpoint method="DELETE" path="/merchants/{id}" />

  <!-- ───── Blacklist ───── -->

  <h2 id="blacklist">Blacklist</h2>
  <p>
    The blacklist prevents outbound calls to specific phone numbers. When
    <code>enforce_blacklist</code> is enabled on a call execution configuration,
    any lead with a blacklisted number is automatically skipped.
  </p>

  <h3 id="add-to-blacklist">Add to Blacklist</h3>
  <ApiEndpoint method="POST" path="/blacklist" />

  <CodeBlock lang="json" code={`{
  "phone_numbers": ["+919876543210", "+14155559999"]
}`} />

  <h3 id="list-blacklist">List Blacklisted Numbers</h3>
  <ApiEndpoint method="GET" path="/blacklist" />

  <h3 id="remove-from-blacklist">Remove from Blacklist</h3>
  <ApiEndpoint method="DELETE" path="/blacklist" />

  <CodeBlock lang="json" code={`{
  "phone_numbers": ["+919876543210"]
}`} />

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
        <tr><td><code>400</code></td><td>Bad Request</td><td>Invalid phone number format or missing required fields.</td></tr>
        <tr><td><code>404</code></td><td>Not Found</td><td>Resource ID does not exist.</td></tr>
        <tr><td><code>409</code></td><td>Conflict</td><td>Phone number already exists.</td></tr>
      </tbody>
    </table>
  </div>
</div>
